import React from 'react'
import { Skeleton } from './skeleton'
import { Card, CardContent, CardHeader } from './card'

export const PageLoader = () => (
  <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center transition-colors-smooth">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
      <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">Loading...</p>
    </div>
  </div>
)

export const CourseCardSkeleton = () => (
  <Card className="overflow-hidden transition-colors-smooth">
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

export const DashboardSkeleton = () => (
  <div className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 transition-colors-smooth">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="transition-colors-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  </div>
)

export const SearchResultsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="animate-pulse transition-colors-smooth">
        <div className="flex gap-4 p-4">
          <Skeleton className="w-64 h-36 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="w-4 h-4 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </Card>
    ))}
  </div>
)