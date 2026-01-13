"use client"
import { useHomeContext } from '@contexts/HomeContext'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Heart, Trash2, BookOpen, Star, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

function ModernWishList({ from, setFrom }) {
    const [wishList, setWishList] = useState([])
    const { userDetails, active, setActive, setOverviewCourse, logout } = useHomeContext()
    const [loading, setLoading] = useState(false)
    const [itemLoading, setItemLoading] = useState('')

    useEffect(() => {
        setLoading(true)
        const getWishList = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getWishlist/${userDetails?.userDetails?._id}`)
                .then(res => { 
                    setWishList(res.data.wishList)
                    setLoading(false)
                })
        }

        if (userDetails?.userDetails?._id) getWishList()
    }, [userDetails])

    const removeFromWishlist = async (id) => {
        setItemLoading(id)
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/removeFromWishlist/${id}/${userDetails?.userDetails?._id}`, {
            headers: {
                'Authorization': `Bearer ${userDetails?.accessToken}`
            }
        })
            .then((res) => {
                setItemLoading('')
                if (res.status == 403) {
                    alert('Session expired, please log in to continue')
                    logout()
                }
                else if (res.data.status == 'success') {
                    setWishList(res.data.wishList)
                }
            })
    }

    const handleCourseClick = (item) => {
        setOverviewCourse(item)
        setActive('course overview')
        setFrom(active)
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 transition-colors-smooth'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex items-center gap-3 mb-8'>
                        <Heart className='h-8 w-8 text-primary-600 dark:text-primary-400' />
                        <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100'>My Wishlist</h1>
                    </div>
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {[...Array(8)].map((_, i) => (
                            <Card key={i} className="animate-pulse transition-colors-smooth">
                                <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-700 rounded-t-lg" />
                                <CardContent className="p-4 space-y-3">
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 transition-colors-smooth'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <Heart className='h-8 w-8 text-primary-600 dark:text-primary-400' />
                    <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100'>My Wishlist</h1>
                    <Badge variant="secondary" className="ml-2 transition-colors-fast">
                        {wishList.length} {wishList.length === 1 ? 'course' : 'courses'}
                    </Badge>
                </div>

                {wishList.length === 0 ? (
                    <Card className="text-center py-16 transition-colors-smooth">
                        <CardContent>
                            <Heart className='h-16 w-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4' />
                            <h3 className='text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100'>Your wishlist is empty</h3>
                            <p className='text-neutral-600 dark:text-neutral-400 mb-6'>
                                Save courses you're interested in to your wishlist and come back to them later.
                            </p>
                            <Link href="/">
                                <Button className="transition-colors-fast">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Browse Courses
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {wishList.map((item, i) => (
                            <Card 
                                key={i} 
                                className={`group hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 cursor-pointer relative ${
                                    itemLoading === item._id ? 'animate-pulse opacity-50' : ''
                                }`}
                            >
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} 
                                        className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200' 
                                        alt={item.landingPageDetails.title}
                                        onClick={() => handleCourseClick(item)}
                                    />
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFromWishlist(item._id)
                                        }}
                                        disabled={itemLoading === item._id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                <CardContent className="p-4 space-y-3" onClick={() => handleCourseClick(item)}>
                                    <div>
                                        <h3 className='font-semibold line-clamp-2 mb-1 text-neutral-900 dark:text-neutral-100'>
                                            {item.landingPageDetails.title}
                                        </h3>
                                        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                                            {item.author.username}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm">
                                        {item.rating.rating && (
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                                                <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.rating.rating}</span>
                                                <span className="text-neutral-600 dark:text-neutral-400">
                                                    ({item.rating.TotalRatings || 0})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs transition-colors-fast">
                                            {item.landingPageDetails.level}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                                            {item.price === 'free' ? (
                                                <span>Free</span>
                                            ) : (
                                                <>₹{item.price}</>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        className="w-full transition-colors-fast" 
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleCourseClick(item)
                                        }}
                                    >
                                        View Course
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModernWishList