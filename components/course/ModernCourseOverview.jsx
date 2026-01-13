"use client"
import React, { useState, useCallback, useMemo } from 'react'
import { printRating } from '../home/ModernCourses'
import { 
  Check, 
  Heart, 
  ShoppingCart, 
  Play, 
  FileText, 
  Clock, 
  Users, 
  Globe,
  Award,
  Smartphone,
  Download,
  Infinity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import axios from 'axios'
import Link from 'next/link'
import { useHomeContext } from '@contexts/HomeContext'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const CourseSections = dynamic(() => import('../course overview/CourseSections'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-700 h-64 rounded-lg transition-colors-smooth" />
})

function ModernCourseOverview({ courseData }) {
  const course = courseData
  const { 
    userDetails, 
    setCart, 
    cart, 
    wishList, 
    wishlistLoading, 
    addToWishlist, 
    removeFromWishlist 
  } = useHomeContext()
  
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Memoized calculations
  const courseStats = useMemo(() => {
    if (!course?.sections) return { articles: 0, videos: 0, totalLectures: 0 }
    
    let articles = 0
    let videos = 0
    let totalLectures = 0
    
    course.sections.forEach(section => {
      section.curriculum?.forEach(item => {
        totalLectures++
        if (item.content_type === 'article') articles++
        if (item.content_type === 'video') videos++
      })
    })
    
    return { articles, videos, totalLectures }
  }, [course?.sections])

  const addToCart = useCallback(async () => {
    if (!userDetails?.userDetails?._id) {
      alert('Please login to enroll')
      window.location.href = '/authentication/login'
      return
    }
    
    setIsAddingToCart(true)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addToCart`, {
        course: JSON.stringify(course),
        userId: userDetails.userDetails._id,
      })
      if (res.data.status === 'success') setCart(res.data.cart)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }, [course, userDetails, setCart])

  const enrollFree = useCallback(async (courseId, userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/enroll`, { 
        userId: userId, 
        courseIds: JSON.stringify([courseId]) 
      })
        .then(res => {
          if (res.data.status === 'success') {
            window.open(`/coursesDetails/${courseId}/${userId}`, '_blank')
          }
        })
    } catch (error) {
      console.error('Error enrolling in free course:', error)
      alert('Failed to enroll. Please try again.')
    }
  }, [])

  const handleWishlistToggle = useCallback(() => {
    if (wishList.includes(course?._id)) {
      removeFromWishlist(course._id)
    } else {
      addToWishlist(course._id)
    }
  }, [wishList, course?._id, addToWishlist, removeFromWishlist])

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">Loading course details...</p>
        </div>
      </div>
    )
  }

  const renderDescription = () => {
    if (typeof course.landingPageDetails.description === 'string') {
      return <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{course.landingPageDetails.description}</p>
    }
    
    return course.landingPageDetails.description.blocks.map((block, blockI) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p 
              key={blockI} 
              dangerouslySetInnerHTML={{ __html: block.data.text }} 
              className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4"
            />
          )
        case 'header':
          const HeaderTag = `h${block.data.level}`
          return (
            <HeaderTag 
              key={blockI}
              dangerouslySetInnerHTML={{ __html: block.data.text }}
              className={`font-bold mb-4 ${
                block.data.level === 1 ? 'text-3xl' :
                block.data.level === 2 ? 'text-2xl' :
                block.data.level === 3 ? 'text-xl' : 'text-lg'
              }`}
            />
          )
        case 'nestedList':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
          return (
            <ListTag key={blockI} className={`mb-4 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} pl-6`}>
              {block.data.items.map((item, itemI) => (
                <li key={itemI} dangerouslySetInnerHTML={{ __html: item.content }} className="mb-1 text-neutral-700 dark:text-neutral-300" />
              ))}
            </ListTag>
          )
        default:
          return null
      }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors-smooth">
      {/* Hero Section */}
      <div className="bg-primary-900 dark:bg-primary-950 text-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {course.landingPageDetails.level}
                </Badge>
                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  {course.landingPageDetails.title}
                </h1>
                <p className="text-xl text-primary-200 dark:text-primary-300 leading-relaxed">
                  {course.landingPageDetails.subtitle}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                {course.rating.rating !== '' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-accent-400">
                      {course.rating.rating}
                    </span>
                    <printRating rating={course.rating.rating} />
                    <span className="text-primary-300 dark:text-primary-400">
                      ({course.rating.TotalRatings || 0} ratings)
                    </span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-accent-400 border-accent-400">
                    New Course - No ratings yet
                  </Badge>
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {course.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    Created by {course.author.username}
                    {course.author.authorId === userDetails?.userDetails?._id && (
                      <Badge variant="secondary" className="ml-2">You</Badge>
                    )}
                  </p>
                  <p className="text-sm text-primary-400 dark:text-primary-500">{course.author.email}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolled?.length || 0} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>{courseStats.videos} video lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{courseStats.articles} articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Card - Fixed Position */}
      <div className="fixed top-24 right-6 w-80 z-40 hidden lg:block">
        <Card className="shadow-2xl border-0 bg-white dark:bg-neutral-900 transition-colors-smooth">
          <div className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${course.image}`}
              alt={course.landingPageDetails.title}
              width={320}
              height={180}
              className="w-full h-45 object-cover rounded-t-lg"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 transition-colors-fast"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>
          
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {course.price !== 'free' ? `₹${course.price}` : 'FREE'}
              </div>
              {course.price !== 'free' && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                  ₹{Math.round(course.price * 1.5)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {!course?.enrolled?.includes(userDetails?.userDetails?._id) && (
                <div className="flex gap-2">
                  {cart?.filter(item => item._id === course._id).length === 0 && 
                   course.price !== 'free' && 
                   course.author.authorId !== userDetails?.userDetails?._id ? (
                    <Button 
                      className="flex-1" 
                      onClick={addToCart}
                      disabled={isAddingToCart}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  ) : cart?.filter(item => item._id === course._id).length !== 0 ? (
                    <Link href="/cart" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Go to Cart
                      </Button>
                    </Link>
                  ) : course.price === 'free' && !course?.enrolled?.includes(userDetails?.userDetails?._id) ? (
                    <Button 
                      className="flex-1"
                      onClick={() => enrollFree(course._id, userDetails?.userDetails?._id)}
                    >
                      Enroll for Free
                    </Button>
                  ) : null}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        wishList.includes(course?._id) 
                          ? 'fill-red-500 text-red-500' 
                          : ''
                      }`} 
                    />
                  </Button>
                </div>
              )}

              {(course?.enrolled?.includes(userDetails?.userDetails?._id) || 
                course.author.authorId === userDetails?.userDetails?._id) && (
                <Link 
                  href={`/coursesDetails/${course._id}/${userDetails?.userDetails?._id}`} 
                  target="_blank"
                >
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Go to Course
                  </Button>
                </Link>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-success-600 dark:text-success-400" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Infinity className="w-4 h-4 text-info-600 dark:text-info-400" />
                <span>Full lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                <span>Access on mobile and TV</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                <span>Downloadable resources</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:pr-96">
        <div className="space-y-12">
          {/* What You'll Learn */}
          <Card className="transition-colors-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-6 h-6 text-success-600 dark:text-success-400" />
                What you'll learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {course.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success-600 dark:text-success-400 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">{outcome}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Includes */}
          <Card className="transition-colors-smooth">
            <CardHeader>
              <CardTitle>This course includes:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-info-600 dark:text-info-400" />
                  <span>{courseStats.videos} video lectures</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-success-600 dark:text-success-400" />
                  <span>{courseStats.articles} articles</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  <span>Downloadable resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <Infinity className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card className="transition-colors-smooth">
            <CardHeader>
              <CardTitle>Course content</CardTitle>
              <p className="text-neutral-600 dark:text-neutral-400">
                {course.sections?.length || 0} sections • {courseStats.totalLectures} lectures
              </p>
            </CardHeader>
            <CardContent>
              <CourseSections overviewCourse={course} />
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="transition-colors-smooth">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="transition-colors-smooth">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              {renderDescription()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ModernCourseOverview