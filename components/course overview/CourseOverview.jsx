import { useHomeContext } from '@/context/HomeContext'
import React, { useEffect } from 'react'
import { printRating } from '../home components/courses'

function CourseOverview() {
    const { overviewCourse } = useHomeContext()
    useEffect(() => {
        console.log(overviewCourse)
    }, [])
    return (
        <div className='flex flex-col '>
            <div className='px-40 py-10  pt-20 text-white bg-slate-900'>
                <span className='text-3xl font-bold w-[70%]'>{overviewCourse.landingPageDetails.title}</span>
                <p className='w-[70%] mt-3'>{overviewCourse.landingPageDetails.subtitle}</p>
                <p className='w-[70%] mt-3 flex items-center text-yellow-500'><span className='me-1 text-xl'>{overviewCourse.rating}</span> {printRating(overviewCourse.rating)}</p>
                <p className='w-[70%] mt-3'>created by {overviewCourse.author.username}</p>
            </div>
            <div className='px-40 py-10'>
                <span>what you'll learn</span>
                <div className='w-full border border-gray-300'>
                    {overviewCourse.outcomes.map((outcome,i)=>{
                        return <p key={i}>{outcome}</p>
                    })}
                </div>
            </div>
        </div>
    )
}

export default CourseOverview
