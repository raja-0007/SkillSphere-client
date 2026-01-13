"use client"

import React, { useState, useEffect } from 'react'
import { FaGraduationCap, FaBook, FaUsers, FaGlobe, FaTrophy, FaCertificate } from 'react-icons/fa'
import { MdTrendingUp } from 'react-icons/md'

function LearningStatistics() {
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    countries: 0,
    certificates: 0,
    hours: 0
  })

  const finalStats = {
    students: 62000000,
    courses: 210000,
    instructors: 75000,
    countries: 180,
    certificates: 15000000,
    hours: 850000000
  }

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounters({
        students: Math.floor(finalStats.students * progress),
        courses: Math.floor(finalStats.courses * progress),
        instructors: Math.floor(finalStats.instructors * progress),
        countries: Math.floor(finalStats.countries * progress),
        certificates: Math.floor(finalStats.certificates * progress),
        hours: Math.floor(finalStats.hours * progress)
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounters(finalStats)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B'
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  const stats = [
    {
      icon: <FaUsers className='text-5xl text-blue-600' />,
      value: counters.students,
      label: 'Active Learners',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <FaBook className='text-5xl text-purple-600' />,
      value: counters.courses,
      label: 'Courses Available',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <FaGraduationCap className='text-5xl text-green-600' />,
      value: counters.instructors,
      label: 'Expert Instructors',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <FaGlobe className='text-5xl text-orange-600' />,
      value: counters.countries,
      label: 'Countries Reached',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: <FaCertificate className='text-5xl text-pink-600' />,
      value: counters.certificates,
      label: 'Certificates Issued',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: <FaTrophy className='text-5xl text-primary' />,
      value: counters.hours,
      label: 'Learning Hours',
      color: 'from-primary to-primary',
      bgColor: 'bg-primary/10'
    }
  ]

  const achievements = [
    { year: '2010', milestone: 'Platform Launched', count: '1K users' },
    { year: '2015', milestone: 'Global Expansion', count: '10M users' },
    { year: '2020', milestone: 'Mobile First', count: '40M users' },
    { year: '2025', milestone: 'AI-Powered Learning', count: '62M users' }
  ]

  return (
    <div className='w-full bg-gradient-to-br from-gray-50 to-blue-50 py-20 mt-16'>
      <div className='w-[85%] mx-auto flex flex-col gap-12'>
        <div className='text-center flex flex-col gap-4'>
          <div className='flex items-center justify-center gap-3'>
            <MdTrendingUp className='text-5xl text-blue-600' />
            <h2 className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Our Impact in Numbers
            </h2>
          </div>
          <p className='text-xl text-gray-600'>Empowering millions of learners worldwide to achieve their goals</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`${stat.bgColor} rounded-2xl p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl`}
            >
              <div className='bg-white p-4 rounded-full shadow-md'>
                {stat.icon}
              </div>
              <div className='text-center'>
                <h3 className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {formatNumber(stat.value)}+
                </h3>
                <p className='text-gray-700 font-semibold mt-2 text-lg'>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='bg-white rounded-2xl shadow-xl p-10 mt-8'>
          <h3 className='text-3xl font-bold text-center mb-10 text-gray-800'>Our Journey</h3>
          <div className='flex justify-between items-center relative'>
            <div className='absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 -translate-y-1/2 z-0'></div>
            
            {achievements.map((achievement, index) => (
              <div key={index} className='flex flex-col items-center gap-3 z-10 bg-white px-4'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg'>
                  {achievement.year}
                </div>
                <div className='text-center'>
                  <p className='font-bold text-gray-800'>{achievement.milestone}</p>
                  <p className='text-blue-600 font-semibold'>{achievement.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
          <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white flex flex-col gap-3 hover:scale-105 transition-transform'>
            <h4 className='text-3xl font-bold'>95%</h4>
            <p className='text-blue-100'>Student Satisfaction Rate</p>
            <div className='w-full bg-blue-400 rounded-full h-2 mt-2'>
              <div className='bg-white rounded-full h-2 w-[95%]'></div>
            </div>
          </div>

          <div className='bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 text-white flex flex-col gap-3 hover:scale-105 transition-transform'>
            <h4 className='text-3xl font-bold'>87%</h4>
            <p className='text-purple-100'>Career Advancement Rate</p>
            <div className='w-full bg-purple-400 rounded-full h-2 mt-2'>
              <div className='bg-white rounded-full h-2 w-[87%]'></div>
            </div>
          </div>

          <div className='bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-8 text-white flex flex-col gap-3 hover:scale-105 transition-transform'>
            <h4 className='text-3xl font-bold'>4.7/5</h4>
            <p className='text-pink-100'>Average Course Rating</p>
            <div className='flex gap-1 mt-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className='text-primary text-2xl'>★</span>
              ))}
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-10 text-white text-center mt-8 shadow-2xl'>
          <h3 className='text-4xl font-bold mb-4'>Join Our Growing Community</h3>
          <p className='text-xl mb-6 text-purple-100'>Be part of the world's largest online learning platform</p>
          <div className='flex gap-4 justify-center'>
            <button className='bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all text-lg shadow-lg'>
              Start Learning Today
            </button>
            <button className='border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-all text-lg'>
              Become an Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningStatistics