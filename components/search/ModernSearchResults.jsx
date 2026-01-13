"use client"
import { useHomeContext } from '@contexts/HomeContext'
import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { Filter, Search, SlidersHorizontal, Star, Clock, BookOpen, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { printRating } from '../home/ModernCourses'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Optimized skeleton components
const SkeletonCard = memo(() => (
  <Card className="animate-pulse transition-colors-smooth">
    <div className="flex gap-4 p-4">
      <Skeleton className="w-64 h-36 rounded-lg" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  </Card>
))

SkeletonCard.displayName = 'SkeletonCard'

// Optimized result card component
const ResultCard = memo(({ item, onCourseClick }) => {
  const router = useRouter()
  
  const totalLectures = useMemo(() => {
    return item.sections?.reduce((total, sect) => 
      total + (sect.curriculum?.length || 0), 0
    ) || 0
  }, [item.sections])

  const handleClick = useCallback(() => {
    onCourseClick(item)
    router.push(`/course-overview/${item._id}`)
  }, [item, onCourseClick, router])

  // Enhanced description rendering function (same as ModernCourseOverview)
  const renderDescription = useCallback(() => {
    if (!item.landingPageDetails?.description) {
      return 'No description available'
    }

    if (typeof item.landingPageDetails.description === 'string') {
      return item.landingPageDetails.description.slice(0, 200) + (item.landingPageDetails.description.length > 200 ? '...' : '')
    }
    
    // Handle structured description (blocks format)
    const blocks = item.landingPageDetails.description.blocks || []
    let textContent = ''
    
    for (const block of blocks) {
      switch (block.type) {
        case 'paragraph':
          textContent += block.data.text.replace(/<[^>]*>/g, '') + ' ' // Strip HTML tags
          break
        case 'header':
          textContent += block.data.text.replace(/<[^>]*>/g, '') + ' ' // Strip HTML tags
          break
        case 'nestedList':
          if (block.data.items) {
            block.data.items.forEach(item => {
              textContent += item.content.replace(/<[^>]*>/g, '') + ' ' // Strip HTML tags
            })
          }
          break
        default:
          break
      }
      
      // Stop if we have enough content
      if (textContent.length > 200) break
    }
    
    if (textContent.length === 0) {
      return 'No description available'
    }
    
    return textContent.slice(0, 200) + (textContent.length > 200 ? '...' : '')
  }, [item.landingPageDetails?.description])

  const description = useMemo(() => renderDescription(), [renderDescription])

  return (
    <Card className="group hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 cursor-pointer border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4" onClick={handleClick}>
          <div className="relative w-64 h-36 flex-shrink-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`}
              alt={item.landingPageDetails?.title || 'Course'}
              fill
              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
              sizes="256px"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-neutral-900 dark:text-neutral-100">
                {item.landingPageDetails?.title || 'Untitled Course'}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                {description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span>By {item.author?.username || 'Unknown'}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{item.author?.email || ''}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {item.rating?.rating ? (
                <>
                  <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    {item.rating.rating}
                  </span>
                  <printRating rating={item.rating.rating} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    ({item.rating.TotalRatings || 0} ratings)
                  </span>
                </>
              ) : (
                <Badge variant="outline" className="text-xs transition-colors-fast">
                  New Course
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{totalLectures} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs transition-colors-fast">
                  {item.landingPageDetails?.level || 'Beginner'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between items-end">
            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {item.price === 'free' ? 'Free' : `₹${item.price}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ResultCard.displayName = 'ResultCard'

// Filter component
const FilterSection = memo(({ filters, setFilters, isOpen, setIsOpen }) => {
  const priceOptions = [
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' }
  ]

  const levelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  const ratingOptions = [
    { value: '4.5', label: '4.5 & up' },
    { value: '4.0', label: '4.0 & up' },
    { value: '3.5', label: '3.5 & up' },
    { value: '3.0', label: '3.0 & up' }
  ]

  const handleFilterChange = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        value: prev[type].value.includes(value)
          ? prev[type].value.filter(v => v !== value)
          : [...prev[type].value, value]
      }
    }))
  }, [setFilters])

  if (!isOpen) return null

  return (
    <Card className="w-80 h-fit sticky top-6 transition-colors-smooth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Filter */}
        <div>
          <h4 className="font-medium mb-3 text-neutral-900 dark:text-neutral-100">Price</h4>
          <div className="space-y-2">
            {priceOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.price.value.includes(option.value)}
                  onChange={() => handleFilterChange('price', option.value)}
                  className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Level Filter */}
        <div>
          <h4 className="font-medium mb-3 text-neutral-900 dark:text-neutral-100">Level</h4>
          <div className="space-y-2">
            {levelOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.levels.value.includes(option.value)}
                  onChange={() => handleFilterChange('levels', option.value)}
                  className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium mb-3 text-neutral-900 dark:text-neutral-100">Rating</h4>
          <div className="space-y-2">
            {ratingOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.ratings.value === option.value}
                  onChange={() => setFilters(prev => ({
                    ...prev,
                    ratings: { ...prev.ratings, value: option.value }
                  }))}
                  className="rounded-full border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

FilterSection.displayName = 'FilterSection'

const ModernSearchResults = () => {
  const { searchData, setOverviewCourse, setActive, searchLoading } = useHomeContext()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    ratings: { value: '', open: false },
    levels: { value: [], open: false },
    price: { value: [], open: false }
  })

  const handleCourseClick = useCallback((course) => {
    setOverviewCourse(course)
    setActive('course overview')
  }, [setOverviewCourse, setActive])

  const filteredResults = useMemo(() => {
    if (!searchData?.searchResults) return []
    
    return searchData.searchResults.filter(course => {
      // Price filter
      if (filters.price.value.length > 0) {
        const isPaid = course.price !== 'free'
        const matchesPrice = filters.price.value.some(price => 
          (price === 'free' && !isPaid) || (price === 'paid' && isPaid)
        )
        if (!matchesPrice) return false
      }

      // Level filter
      if (filters.levels.value.length > 0) {
        const courseLevel = course.landingPageDetails?.level?.toLowerCase() || 'beginner'
        if (!filters.levels.value.includes(courseLevel)) return false
      }

      // Rating filter
      if (filters.ratings.value) {
        const courseRating = parseFloat(course.rating?.rating || 0)
        const minRating = parseFloat(filters.ratings.value)
        if (courseRating < minRating) return false
      }

      return true
    })
  }, [searchData?.searchResults, filters])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors-smooth">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {searchData?.search ? (
                  <>
                    {filteredResults.length} results for "{searchData.search}"
                  </>
                ) : (
                  'Start typing to search for courses'
                )}
              </h1>
              {searchData?.search && (
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Discover courses that match your interests
                </p>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          {searchData?.searchResults?.length > 0 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 transition-colors-fast"
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(filters).some(f => 
                  Array.isArray(f.value) ? f.value.length > 0 : f.value
                ) && (
                  <Badge variant="secondary" className="ml-1 transition-colors-fast">
                    Active
                  </Badge>
                )}
              </Button>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {filteredResults.length} of {searchData.searchResults.length} courses
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
          />

          {/* Results */}
          <div className="flex-1">
            {searchLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.map((item, i) => (
                  <ResultCard
                    key={item._id || i}
                    item={item}
                    onCourseClick={handleCourseClick}
                  />
                ))}
              </div>
            ) : searchData?.search ? (
              <Card className="text-center py-16 transition-colors-smooth">
                <CardContent>
                  <Search className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">No courses found</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <Button onClick={() => setFilters({
                    ratings: { value: '', open: false },
                    levels: { value: [], open: false },
                    price: { value: [], open: false }
                  })} className="transition-colors-fast">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-16 transition-colors-smooth">
                <CardContent>
                  <Search className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Search for courses</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Use the search bar above to find courses that interest you.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ModernSearchResults)