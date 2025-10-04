"use client"
import { useHomeContext } from '@contexts/HomeContext'
import { useRouter } from 'next/navigation'
import React from 'react'

function BecomeInstructor() {
    const router = useRouter()
      const {userDetails} = useHomeContext()
    
    return (
        <div className='w-[80%] mx-auto flex justify-center gap-24 items-center py-20'>
            <img src="/images/instructor-1x-v3.jpg" className='w-[400px]' alt="" />
            <div className='flex w-[400px] items-start flex-col gap-4'>
                <span className='text-4xl font-semibold'>Become an Instructor</span>
                <span>Instructors from around the world teach millions of learners on Udemy. We provide the tools and skills to teach what you love.</span>
                <button
                 className='bg-slate-950 border-[1px] text-white font-bold hover:bg-white transition-all hover:text-black px-5 py-3 border-slate-950'
                 onClick={()=>{
                    if (Object.keys(userDetails || {}).length === 0) {
          // alert('Please login to access Teacher mode.');
          router.push('/authentication/login');
        } else {
          router.push('/teacher');
        }
                 }}
                 >
                    start teaching today
                </button>
            </div>

        </div>
    )
}

export default BecomeInstructor
