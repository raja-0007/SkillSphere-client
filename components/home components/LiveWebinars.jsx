"use client"

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/bundle'
import { FaCalendarAlt, FaClock, FaUsers, FaVideo } from 'react-icons/fa'
import { MdLiveTv } from 'react-icons/md'

function LiveWebinars() {
  const [timeLeft, setTimeLeft] = useState({})

  const webinars = [
    {
      id: 1,
      title: "Mastering React Hooks: Advanced Patterns",
      instructor: "Sarah Johnson",
      date: "2025-10-08",
      time: "18:00",
      duration: "2 hours",
      attendees: 1245,
      category: "Web Development",
      image: "/images/webdev.jpeg",
      isLive: false,
      description: "Deep dive into advanced React Hooks patterns and custom hooks creation"
    },
    {
      id: 2,
      title: "Python for Data Science: Live Workshop",
      instructor: "Dr. Michael Chen",
      date: "2025-10-06",
      time: "15:00",
      duration: "3 hours",
      attendees: 2103,
      category: "Data Science",
      image: "/images/webdev.jpeg",
      isLive: true,
      description: "Learn data analysis and visualization with Python libraries"
    },
    {
      id: 3,
      title: "AI & Machine Learning Fundamentals",
      instructor: "Emma Williams",
      date: "2025-10-10",
      time: "20:00",
      duration: "1.5 hours",
      attendees: 3521,
      category: "Artificial Intelligence",
      image: "/images/webdev.jpeg",
      isLive: false,
      description: "Introduction to AI concepts and practical ML implementations"
    },
    {
      id: 4,
      title: "Full Stack Development Masterclass",
      instructor: "James Anderson",
      date: "2025-10-07",
      time: "16:30",
      duration: "2.5 hours",
      attendees: 1876,
      category: "Web Development",
      image: "/images/webdev.jpeg",
      isLive: false,
      description: "Build complete web applications from frontend to backend"
    },
    {
      id: 5,
      title: "Cloud Computing with AWS",
      instructor: "Lisa Martinez",
      date: "2025-10-12",
      time: "19:00",
      duration: "2 hours",
      attendees: 987,
      category: "Cloud Computing",
      image: "/images/webdev.jpeg",
      isLive: false,
      description: "Deploy and manage applications on Amazon Web Services"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const updated = {}
      
      webinars.forEach(webinar => {
        const webinarDate = new Date(`${webinar.date}T${webinar.time}:00`)
        const diff = webinarDate - now
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          
          updated[webinar.id] = { days, hours, minutes }
        }
      })
      
      setTimeLeft(updated)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className='w-full px-[10%] mx-auto mt-16 flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <MdLiveTv className='text-5xl text-red-600' />
          <div className='flex flex-col'>
            <span className='text-4xl font-bold'>Live Classes & Upcoming Webinars</span>
            <span className='text-lg text-gray-600'>Join expert-led sessions and interact in real-time</span>
          </div>
        </div>
      </div>

      <div className='w-full'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={3}
          slidesPerGroup={1}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
          speed={800}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {webinars.map((webinar) => (
            <SwiperSlide key={webinar.id}>
              <div className='flex flex-col gap-4 border-2 mb-10 border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white h-full'>
                <div className='relative'>
                  <img src={webinar.image} className='w-full h-48 object-cover' alt={webinar.title} />
                  {webinar.isLive && (
                    <div className='absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse'>
                      <span className='w-2 h-2 bg-white rounded-full'></span>
                      LIVE NOW
                    </div>
                  )}
                  <div className='absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    {webinar.category}
                  </div>
                </div>

                <div className='flex flex-col gap-3 px-5 pb-5'>
                  <h3 className='font-bold text-xl line-clamp-2'>{webinar.title}</h3>
                  <p className='text-gray-600 text-sm line-clamp-2'>{webinar.description}</p>
                  
                  <div className='flex flex-col gap-2 text-sm text-gray-700'>
                    <div className='flex items-center gap-2'>
                      <FaVideo className='text-purple-600' />
                      <span className='font-semibold'>{webinar.instructor}</span>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                      <FaCalendarAlt className='text-green-600' />
                      <span>{new Date(webinar.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                      <FaClock className='text-orange-600' />
                      <span>{webinar.time} • {webinar.duration}</span>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                      <FaUsers className='text-blue-600' />
                      <span>{webinar.attendees.toLocaleString()} registered</span>
                    </div>
                  </div>

                  {timeLeft[webinar.id] && (
                    <div className='bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg mt-2'>
                      <p className='text-xs text-gray-600 mb-1'>Starts in:</p>
                      <div className='flex gap-3 justify-center'>
                        <div className='flex flex-col items-center'>
                          <span className='text-2xl font-bold text-purple-600'>{timeLeft[webinar.id].days}</span>
                          <span className='text-xs text-gray-600'>Days</span>
                        </div>
                        <div className='flex flex-col items-center'>
                          <span className='text-2xl font-bold text-purple-600'>{timeLeft[webinar.id].hours}</span>
                          <span className='text-xs text-gray-600'>Hours</span>
                        </div>
                        <div className='flex flex-col items-center'>
                          <span className='text-2xl font-bold text-purple-600'>{timeLeft[webinar.id].minutes}</span>
                          <span className='text-xs text-gray-600'>Mins</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button className={`w-full py-3 rounded-lg font-bold transition-all mt-2 ${
                    webinar.isLive 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}>
                    {webinar.isLive ? 'Join Now' : 'Reserve Your Spot'}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white mt-6'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl font-bold'>Never Miss a Live Session!</h3>
            <p className='text-purple-100'>Get notified about upcoming webinars and exclusive live classes</p>
          </div>
          <button className='bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all'>
            Enable Notifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default LiveWebinars