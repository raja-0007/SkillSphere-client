"use client"

import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow, Pagination, EffectCards } from 'swiper/modules';

import 'swiper/css'
import 'swiper/css/bundle';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
export const printRating=(rating)=>{
  let result = []
  
  for(let i=0;i<parseInt(rating);i++){
    result.push(<IoIosStar key={i} className='text-yellow-400'/>)
    
  }
  if(parseInt(rating)!== parseFloat(rating)){
    result.push(<IoIosStarHalf key={999} className='text-yellow-400'/>)
  }
  if(result.length !== 5){
    for(let i=result.length; i<5;i++){
        result.push(<IoIosStarOutline key={999+i} className='text-yellow-400' />)

    }
}
  return  result
  
}
function Courses() {
  const [coursesList,setCoursesList] = useState([])
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState('python')

  let selectHandler = (e, topic) => {
    setSelected(topic)
    goFirstSlide()
  }
  
  const swiperRef = useRef(null);

  const goFirstSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(0); // Go to the first slide
    }
  };
  
  const getCourses = async()=>{
    const courseslist2 = await axios.get(process.env.NEXT_PUBLIC_BASE_URL)
    
    
    setCoursesList(courseslist2.data)
  }

  useEffect(()=>{
    getCourses()
    
  },[])
  useEffect(()=>{
    //console.log(coursesList.filter(course=>course.topic == selected)[0]?.description)
    setDescription(coursesList.filter(course=>course.topic == selected)[0]?.description)
    setSelected('python')
  },[coursesList])
  useEffect(()=>{
    //console.log(coursesList.filter(course=>course.topic == selected)[0]?.description)
    setDescription(coursesList.filter(course=>course.topic == selected)[0]?.description)
  },[selected])
  
  return (
    <div className='w-full px-[10%] mx-auto mt-10 flex flex-col'>
      <div className='w-full flex flex-col gap-4'>
        <span className='text-4xl font-bold '>A broad selection of courses</span>
        <span className='text-lg'>Choose from over 210,000 online video courses with new additions published every month</span>
      </div>


      <div className='w-full flex justify-start items-center gap-5 flex-wrap mt-5'>
        <span className={`${selected == 'python' ? 'font-bold ' : ''}  cursor-pointer`} onClick={(e) => selectHandler(e, 'python')}>python</span>
        <span className={`${selected == 'javascript' ? 'font-bold ' : ''} cursor-pointer`} onClick={(e) => selectHandler(e, 'javascript')}>javascript</span>
        <span className='cursor-pointer' onClick={(e) => selectHandler(e, 'python')}>android development</span>
        <span className='cursor-pointer' onClick={(e) => selectHandler(e, 'javascript')}>java</span>
      </div>

      <div className='w-full mx-auto flex flex-col flex-wrap justify-start gap-5 mt-2 border-2 border-gray-300 px-5 py-8'>
        <div className='flex flex-col flex-wrap gap-3'>
          <span className='text-2xl font-bold'>Expand your career opportunities with {selected}</span>
          <span className='w-[70%]'>{description}</span>
          <button className='w-[max-content] border-[1px] hover:bg-slate-200  border-black px-2 py-2'>Explore {selected}</button>
        </div>
        <div className='w-full'>
          <Swiper
            modules={[Pagination, EffectCoverflow, EffectCards, Navigation]}
            slidesPerView={5}
            slidesPerGroup={5}
            spaceBetween={4}
            
            cardsEffect={{perSlideOffset:8, perSlideRotate:2, rotate:true, slideShadows:true}}
            coverflowEffect={{depth:100, modifier:1, rotate:50, scale:1, slideShadows:true, stretch:0 }}
            pagination={{ clickable: true }}
            speed={1000}
            ref={swiperRef}
            
          >
            {coursesList.filter(course => course.topic == selected).map((course, index) =>
              <SwiperSlide key={index}>
                <div className='flex flex-col gap-1 w-60 p-3' >
                  <img src="/images/webdev.jpeg" className='mx-auto w-full' alt="" />
                  <h2 className='font-bold'>{course.title}</h2>
                  <small className='font-light text-gray-500'>{course.author}</small>
                  <span className='flex gap-2 items-center font-semibold text-amber-900'>
                    {course.rating}
                    <span className=' flex'>{printRating(course.rating)}</span>
                    </span>
                  
                  <span className='font-bold'>&#8377;{course.cost}</span>
                </div>
              </SwiperSlide>
            )}

          </Swiper>

          {/* {coursesList.filter(course => course.topic == selected).map((course, index) =>
              <div >
                <div className='flex flex-col gap-1 w-60 p-3' key={index}>
                  <img src="/images/webdev.jpeg" className='mx-auto w-full' alt="" />
                  <h2 className='font-bold'>{course.title}</h2>
                  <small className='font-light text-gray-500'>{course.author}</small>
                  <span className='flex gap-2 items-center font-semibold text-amber-900'>
                    {course.rating}
                    <span className=' flex'>{printRating(course.rating)}</span>
                    </span>
                  
                  <span className='font-bold'>&#8377;{course.cost}</span>
                </div>
              </div>
            )} */}

        </div>

      </div>
    </div>

  )
}

export default Courses
