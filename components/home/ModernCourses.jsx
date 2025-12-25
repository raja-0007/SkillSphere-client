"use client"
import axios from 'axios'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Star, StarHalf, Filter, Clock, Users, BookOpen, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { useHomeContext } from '@contexts/HomeContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Optimized rating component with memoization
export const printRating = React.memo(({ rating }) => {
  const stars = useMemo(() => {
    const result = []
    const numRating = parseFloat(rating) || 0
    
    for (let i = 0; i < Math.floor(numRating); i++) {
      result.push(<Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />)
    }
    
    if (numRating % 1 !== 0) {
      result.push(<StarHalf key="half" className='w-4 h-4 fill-yellow-400 text-yellow-400' />)
    }
    
    const remaining = 5 - Math.ceil(numRating)
    for (let i = 0; i < remaining; i++) {
      result.push(<Star key={`empty-${i}`} className='w-4 h-4 text-gray-300' />)
    }
    
    return result
  }, [rating])
  
  return <div className="flex items-center gap-0.5">{stars}</div>
})

printRating.displayName = 'PrintRating'

// Course card component with performance optimizations
const CourseCard = React.memo(({ course, onCourseClick }) => {
  const handleClick = useCallback(() => {
    onCourseClick(course)
  }, [course, onCourseClick])

  const totalLectures = useMemo(() => {
    return course.sections?.reduce((total, section) => 
      total + (section.curriculum?.length || 0), 0
    ) || 0
  }, [course.sections])

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${course.image}`}
            alt={course.landingPageDetails?.title || 'Course'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {course.landingPageDetails?.level || 'Beginner'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3" onClick={handleClick}>
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.landingPageDetails?.title || 'Untitled Course'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {course.author?.username || 'Unknown Instructor'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <printRating rating={course.rating?.rating || 0} />
          <span className="text-sm font-medium">
            {course.rating?.rating || 'New'}
          </span>
          <span className="text-xs text-muted-foreground">
            ({course.rating?.TotalRatings || 0} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{totalLectures} lectures</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrolled?.length || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-primary">
            {course.price === 'free' ? 'Free' : `₹${course.price}`}
          </div>
          <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            View Course
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

CourseCard.displayName = 'CourseCard'

// Loading skeleton for courses
const CourseSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-full" />
        ))}
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
)

function ModernCourses() {
  const [coursesList, setCoursesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('python')
  const swiperRef = useRef(null)
  const { setOverviewCourse, setActive } = useHomeContext()
  const router = useRouter()

  const categories = useMemo(() => [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '⚡' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢' },
    { id: 'machine-learning', name: 'ML', icon: '🤖' },
    { id: 'data-science', name: 'Data Science', icon: '📊' },
    { id: 'web-development', name: 'Web Dev', icon: '🌐' },
    { id: 'mobile', name: 'Mobile', icon: '📱' }
  ], [])

  const fetchCourses = useCallback(async (topic) => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/searchResults?search=${topic}`)
      setCoursesList(response.data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCoursesList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses(selected)
  }, [selected, fetchCourses])

  const handleCategorySelect = useCallback((topic) => {
    setSelected(topic)
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(0)
    }
  }, [])

  const handleCourseClick = useCallback((course) => {
    setOverviewCourse(course)
    setActive('course overview')
    router.push(`/course-overview/${course._id}`)
  }, [setOverviewCourse, setActive, router])

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Featured Courses</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular courses and start your learning journey today
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Browse by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selected === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Carousel */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : coursesList.length > 0 ? (
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {coursesList.map((course) => (
                <SwiperSlide key={course._id}>
                  <CourseCard course={course} onCourseClick={handleCourseClick} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}

          {/* Custom Navigation Buttons */}
          {!loading && coursesList.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg"
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-lg"
              >
                →
              </Button>
            </>
          )}
        </div>

        {/* View All Courses Button */}
        <div className="text-center mt-12">
          <Button size="lg" onClick={() => router.push('/search-results')}>
            <BookOpen className="w-5 h-5 mr-2" />
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ModernCourses