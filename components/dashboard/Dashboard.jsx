"use client"
import React, { useEffect, useState } from 'react'
import { useHomeContext } from '@contexts/HomeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { BookOpen, Trophy, TrendingUp, Play, Star, Target } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { printRating } from '../home components/courses'
import RatingModel from '../base components/RatingModel'

function Dashboard() {
    const [learningCourses, setLearningCourses] = useState([])
    const { userDetails, userLoading, isRatingModelOpen, setIsRatingModelOpen, ratings, setRatings, getCart } = useHomeContext()
    const [loading, setLoading] = useState(true)
    const [completed, setCompleted] = useState([])
    const [percentages, setPercentages] = useState([])
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalHours: 0,
        averageProgress: 0
    })

    useEffect(() => {
        // Wait for user loading to complete before making API calls
        if (userLoading) return
        
        console.log("Dashboard useEffect - userDetails:", userDetails, userLoading)
        
        const getEnrolled = async () => {
            try {
                setLoading(true)
                await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getEnrolled/${userDetails?.userDetails?._id}`)
                    .then(res => { 
                        setLearningCourses(res.data.enrolled)
                        setLoading(false)
                    })
            } catch (error) {
                console.error('Error fetching enrolled courses:', error)
                setLoading(false)
            }
        }

        if (userDetails?.userDetails?._id) {
            getEnrolled()
        } else {
            // User is not logged in, stop loading
            setLoading(false)
        }
    }, [userDetails, userLoading])

    useEffect(() => {
        const getCompletionDetails = async (courseId) => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCompletionDetails/${courseId}/${userDetails?.userDetails?._id}`)
                if (res.data.status === 'success') {
                    return res.data.completedLectures.length
                }
            } catch (error) {
                console.error('Error fetching completion details:', error)
                return 0
            }
        }

        const fetchCompletionDetailsForCourses = async () => {
            if (learningCourses.length > 0 && userDetails?.userDetails?._id) {
                try {
                    const promises = learningCourses.map((course) => getCompletionDetails(course._id))
                    const response = await Promise.all(promises)
                    setCompleted(response)
                } catch (error) {
                    console.error('Error in fetching completion details for courses:', error)
                }
            }
        }

        const getRatings = async () => {
            if (learningCourses.length === 0 || !userDetails?.userDetails?._id) return
            const courseIds = learningCourses.map(course => course._id)
            const userId = userDetails?.userDetails?._id
            try {
                await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getRating/${courseIds}/${userId}`)
                    .then(res => setRatings(res.data.ratings))
            } catch (err) {
                console.log(err)
            }
        }

        if (userDetails?.userDetails?._id) {
            getRatings()
            getCart()
            fetchCompletionDetailsForCourses()
        }
    }, [learningCourses, userDetails])

    useEffect(() => {
        const calculatePercentages = () => {
            const newPercentages = learningCourses?.map((item, i) => {
                let totalLectures = 0
                item.sections.forEach(sect => {
                    totalLectures += sect.curriculum.length
                })
                const percentage = Math.floor((completed[i] / totalLectures) * 100)
                return percentage
            })
            setPercentages(newPercentages)
        }

        if (completed.length > 0 && completed.length === learningCourses.length) {
            calculatePercentages()
        }
    }, [completed])

    useEffect(() => {
        if (percentages.length > 0) {
            const totalCourses = learningCourses.length
            const completedCourses = percentages.filter(p => p === 100).length
            const inProgressCourses = percentages.filter(p => p > 0 && p < 100).length
            const averageProgress = percentages.reduce((acc, curr) => acc + curr, 0) / totalCourses

            setStats({
                totalCourses,
                completedCourses,
                inProgressCourses,
                totalHours: totalCourses * 8, // Estimated 8 hours per course
                averageProgress: Math.round(averageProgress)
            })
        }
    }, [percentages, learningCourses])

    const getStatusBadge = (percentage) => {
        if (percentage === 100) return <Badge className="bg-success-500 hover:bg-success-600 text-success-50 transition-colors-fast">Completed</Badge>
        if (percentage > 0) return <Badge variant="secondary" className="transition-colors-fast">In Progress</Badge>
        return <Badge variant="outline" className="transition-colors-fast">Not Started</Badge>
    }

    const getContinueLearningCourses = () => {
        return learningCourses
            .map((course, index) => ({ ...course, percentage: percentages[index] || 0 }))
            .filter(course => course.percentage > 0 && course.percentage < 100)
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3)
    }

    const getRecentCourses = () => {
        return learningCourses
            .map((course, index) => ({ ...course, percentage: percentages[index] || 0 }))
            .slice(0, 4)
    }

    // Show loading while user data is being loaded from cookies or while fetching courses
    if (userLoading || loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse transition-colors-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                                <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mb-2"></div>
                                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    // User not logged in after loading completed
    if (!userDetails?.userDetails?._id) {
        return (
            <div className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors-smooth">
                <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Please log in</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        You need to be logged in to view your dashboard
                    </p>
                    <Link href="/authentication/login">
                        <Button className="transition-colors-fast">Log In</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors-smooth">
            {isRatingModelOpen && <RatingModel isRatingModelOpen={isRatingModelOpen} setIsRatingModelOpen={setIsRatingModelOpen} />}
            
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Learning Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Welcome back, {userDetails?.userDetails?.username}! Continue your learning journey.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="transition-colors-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalCourses}</div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Enrolled courses
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="transition-colors-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <Trophy className="h-4 w-4 text-success-600 dark:text-success-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.completedCourses}</div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Courses finished
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="transition-colors-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-info-600 dark:text-info-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.inProgressCourses}</div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Currently learning
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="transition-colors-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                        <Target className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.averageProgress}%</div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Overall completion
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Continue Learning Section */}
            {getContinueLearningCourses().length > 0 && (
                <Card className="transition-colors-smooth">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            Continue Learning
                        </CardTitle>
                        <CardDescription>
                            Pick up where you left off
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {getContinueLearningCourses().map((course, i) => (
                                <Card key={course._id} className="hover:shadow-md transition-all duration-200 hover:shadow-primary-500/10">
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-4">
                                            <img 
                                                src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${course.image}`}
                                                alt={course.landingPageDetails.title}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <h4 className="font-semibold text-sm line-clamp-2 text-neutral-900 dark:text-neutral-100">
                                                    {course.landingPageDetails.title}
                                                </h4>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    {course.author.username}
                                                </p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-neutral-700 dark:text-neutral-300">{course.percentage}% complete</span>
                                                    </div>
                                                    <Progress value={course.percentage} className="h-2" />
                                                </div>
                                                <Link href={`/coursesDetails/${course._id}/${userDetails?.userDetails?._id}`} target="_blank">
                                                    <Button size="sm" className="w-full transition-colors-fast">
                                                        Continue
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Courses */}
            <Card className="transition-colors-smooth">
                <CardHeader>
                    <CardTitle>All Courses</CardTitle>
                    <CardDescription>
                        Your complete learning library
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {learningCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">No courses yet</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Start your learning journey by enrolling in courses
                            </p>
                            <Link href="/">
                                <Button className="transition-colors-fast">Browse Courses</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {learningCourses.map((course, i) => (
                                <Card key={course._id} className="hover:shadow-md transition-all duration-200 hover:shadow-primary-500/10">
                                    <CardContent className="p-0">
                                        <div className="relative">
                                            <img 
                                                src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${course.image}`}
                                                alt={course.landingPageDetails.title}
                                                className="w-full h-40 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 right-2">
                                                {getStatusBadge(percentages[i] || 0)}
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <h4 className="font-semibold line-clamp-2 mb-1 text-neutral-900 dark:text-neutral-100">
                                                    {course.landingPageDetails.title}
                                                </h4>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {course.author.username}
                                                </p>
                                            </div>
                                            
                                            {percentages[i] > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-neutral-700 dark:text-neutral-300">{percentages[i]}% complete</span>
                                                        <div className="flex items-center gap-1">
                                                            {ratings.filter(r => r.courseId === course._id)[0]?.rating > 0 && (
                                                                <div className="flex items-center">
                                                                    {printRating(ratings.filter(r => r.courseId === course._id)[0]?.rating)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Progress value={percentages[i]} className="h-2" />
                                                </div>
                                            )}
                                            
                                            <div className="flex gap-2">
                                                <Link href={`/coursesDetails/${course._id}/${userDetails?.userDetails?._id}`} target="_blank" className="flex-1">
                                                    <Button className="w-full transition-colors-fast" size="sm">
                                                        {percentages[i] > 0 ? 'Continue' : 'Start Learning'}
                                                    </Button>
                                                </Link>
                                                {percentages[i] > 0 && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="transition-colors-fast"
                                                        onClick={() => setIsRatingModelOpen({ 
                                                            id: course._id, 
                                                            rating: ratings.filter(r => r.courseId === course._id)[0]?.rating || 0 
                                                        })}
                                                    >
                                                        <Star className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard