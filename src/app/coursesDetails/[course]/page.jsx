"use client"

import Footer from '@/components/base components/Footer'
import Navbar from '@/components/base components/Navbar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { printRating } from '@/components/home components/courses'
function page({params}) {
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState('All')
  useEffect(()=>{
    const getCourses=async()=>{
      console.log('asdfsa')
      await axios.get(process.env.NEXT_PUBLIC_BASE_URL+`/getcourse?course=${params.course}`)
      .then(res=>setCourses(res.data))
      .catch(err=>console.log('failed to fetch data', err))
    }
    getCourses()
  },[])

  useEffect(()=>{
    console.log(courses)
  },[courses])
  
  return (
    <div >
      <Navbar/>

        <div className='w-full px-[100px] py-10 flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
            <span className='font-bold text-2xl'>{params.course} courses</span>
            <span className='w-[60%] text-sm text-gray-500'>{courses[0]?.description} </span>
            </div>
            
            <div className='w-full flex gap-10  border-b-2 border-slate-200'>
                <span className={`${selected === 'All' && 'border-b-2 border-black'} p-2`} onClick={()=>setSelected('All')}>All</span>
                <span className={`${selected === 'Most Popular' && 'border-b-2 border-black'} p-2`} onClick={()=>setSelected('Most Popular')}>Most Popular</span>
                <span className={`${selected === 'New' && 'border-b-2 border-black'} p-2`} onClick={()=>setSelected('New')}>New</span>
              </div>
            <div className=' flex flex-wrap gap-5 '>
              
              {courses.map((course,course_i)=>{
                return (
                  <div className='flex flex-col gap-1 w-60 p-3' key={course_i}>
                  <img src="/images/webdev.jpeg" className='mx-auto w-full' alt="" />
                  <h2 className='font-bold'>{course.title}</h2>
                  <small className='font-light text-gray-500'>{course.author}</small>
                  <span className='flex gap-2 items-center font-semibold text-amber-900'>
                    {course.rating}
                    <span className=' flex'>{printRating(course.rating)}</span>
                    </span>
                  
                  <span className='font-bold'>&#8377;{course.cost}</span>
                </div>
                )
              }
              
              )}
            </div>

        </div>

      <Footer/>
    </div>
  )
}

export default page
