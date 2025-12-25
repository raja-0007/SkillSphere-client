"use client"
import React, { Suspense, lazy } from 'react'
import { useHomeContext } from '@contexts/HomeContext'
import { Skeleton } from '../ui/skeleton'

// Lazy load components for better performance
const Carousel = lazy(() => import('../home components/carousel'))
const TrustedCompanies = lazy(() => import('../home components/TrustedCompanies'))
const Courses = lazy(() => import('../home components/courses'))
const LearnersReview = lazy(() => import('../home components/LearnersReview'))
const BecomeInstructor = lazy(() => import('../home components/BecomeInstructor'))
const LiveWebinars = lazy(() => import('../home components/LiveWebinars'))
const LearningStatistics = lazy(() => import('../home components/LearningStatistics'))

// Loading components for better UX
const CarouselSkeleton = () => (
  <div className="w-full h-96 bg-gradient-to-r from-blue-50 to-indigo-100">
    <Skeleton className="w-full h-full" />
  </div>
)

const SectionSkeleton = () => (
  <div className="py-16 px-6">
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-8 w-64 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  </div>
)

function ModernHome() {
  const { active } = useHomeContext()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Suspense fallback={<CarouselSkeleton />}>
        <Carousel />
      </Suspense>

      {/* Trusted Companies */}
      <Suspense fallback={<SectionSkeleton />}>
        <TrustedCompanies />
      </Suspense>

      {/* Featured Courses */}
      <Suspense fallback={<SectionSkeleton />}>
        <Courses />
      </Suspense>

      {/* Live Webinars */}
      <Suspense fallback={<SectionSkeleton />}>
        <LiveWebinars />
      </Suspense>

      {/* Learning Statistics */}
      <Suspense fallback={<SectionSkeleton />}>
        <LearningStatistics />
      </Suspense>

      {/* Learners Review */}
      <Suspense fallback={<SectionSkeleton />}>
        <LearnersReview />
      </Suspense>

      {/* Become Instructor */}
      <Suspense fallback={<SectionSkeleton />}>
        <BecomeInstructor />
      </Suspense>
    </main>
  )
}

export default ModernHome