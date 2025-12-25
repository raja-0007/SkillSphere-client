"use client"
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Skeleton } from './skeleton'

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder-course.jpg',
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      <Image
        src={hasError ? fallback : src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
    </div>
  )
}

export function CourseImage({ course, className, ...props }) {
  const imageUrl = course?.image 
    ? `${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${course.image}`
    : '/placeholder-course.jpg'
    
  return (
    <OptimizedImage
      src={imageUrl}
      alt={course?.landingPageDetails?.title || 'Course image'}
      className={className}
      {...props}
    />
  )
}