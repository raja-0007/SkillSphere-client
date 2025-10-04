"use client"
import React, { useContext } from 'react'
import Carousel from '../home components/carousel'
import TrustedCompanies from '../home components/TrustedCompanies'
import Courses from '../home components/courses'
import LearnersReview from '../home components/LearnersReview'
import BecomeInstructor from '../home components/BecomeInstructor'
import { useHomeContext } from '@contexts/HomeContext' 
import LiveWebinars from '@components/home components/LiveWebinars'
import LearningStatistics from '@components/home components/LearningStatistics'

function Home() {
    const {active} = useHomeContext()
    // console.log(active)
  return (
    <>
      <Carousel />
      <TrustedCompanies/>
      <Courses />
      <LiveWebinars/>
      <LearningStatistics/>
      <LearnersReview/>
      <BecomeInstructor/>
    </>
  )
}

export default Home
