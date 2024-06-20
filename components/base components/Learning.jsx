import { useHomeContext } from '@contexts/HomeContext'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoChevronBackOutline } from 'react-icons/io5'

function Learning({ from, setFrom }) {
    const [learningCourses, setLearningCourses] = useState([])
    const { userDetails, setActive } = useHomeContext()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const getEnrolled = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getEnrolled/${userDetails?.userDetails?._id}`)
                .then(res => { console.log('enroled>>>', res.data); setLearningCourses(res.data.enrolled); setLoading(false)})

        }

        if (userDetails?.userDetails?._id) getEnrolled()
    }, [])

    return (
        <div className='px-32 py-10 relative min-h-[70vh]'>
            {(from !== '') &&
                <div className=" absolute top-3 left-2 flex  w-[max-content]  cursor-pointer items-center text-sm font-medium  text-gray-400" onClick={() => { setActive(from); setFrom('') }}>
                    <IoChevronBackOutline className='font-bold' />back to {from}
                </div>
            }
            <p className='text-3xl font-bold'>My Learning</p>
            <section className=' flex flex-wrap gap-10 px-10  py-10'>
                {!loading ? learningCourses?.map((item, i) => {
                    return (
                        <Link key={i} href={`/coursesDetails/${item._id}`} target='_blank'
                            onClick={() => { setOverviewCourse(item); setActive('course overview'); }}
                            className='flex flex-col gap-1  border   pb-2 w-[300px] hover:scale-[1.03] hover:shadow-md hover:shadow-violet-400 transition-all duration-200 cursor-pointer'>
                            <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} className='w-[300px]' alt="" />

                            <p className='font-bold px-2'>{item.landingPageDetails.title}</p>
                            <p className='text-xs px-2 text-gray-500 font-medium'>{item.author.username} sikandhar</p>

                        </Link>
                    )
                }) :
                    <>
                        <div
                            className='flex flex-col gap-2  border   pb-2 w-[300px] hover:scale-[1.03] hover:shadow-md hover:shadow-violet-400 transition-all duration-200 cursor-pointer'>
                            <div className='w-[300px] bg-gray-400 h-[150px]  animate-pulse' alt="" ></div>

                            <p className='font-bold px-2 mx-3 rounded-full  w-[200px] py-1 bg-gray-300 animate-pulse '></p>
                            <p className='font-bold px-2 mx-3 rounded-full  w-[250px] py-1 bg-gray-300 animate-pulse'></p>

                        </div>
                        <div
                            className='flex flex-col gap-2  border   pb-2 w-[300px] hover:scale-[1.03] hover:shadow-md hover:shadow-violet-400 transition-all duration-200 cursor-pointer'>
                            <div className='w-[300px] bg-gray-400 h-[150px] animate-pulse' alt="" ></div>

                            <p className='font-bold px-2 mx-3 rounded-full  w-[200px] py-1 bg-gray-300 animate-pulse'></p>
                            <p className='font-bold px-2 mx-3 rounded-full  w-[250px] py-1 bg-gray-300 animate-pulse'></p>

                        </div>
                        <div
                            className='flex flex-col gap-2  border   pb-2 w-[300px] hover:scale-[1.03] hover:shadow-md hover:shadow-violet-400 transition-all duration-200 cursor-pointer'>
                            <div className='w-[300px] bg-gray-400 h-[150px] animate-pulse' alt="" ></div>

                            <p className='font-bold px-2 mx-3 rounded-full  w-[200px] py-1 bg-gray-300 animate-pulse'></p>
                            <p className='font-bold px-2 mx-3 rounded-full  w-[250px] py-1 bg-gray-300 animate-pulse'></p>

                        </div>
                    </>
                }
            </section>
        </div>
    )
}

export default Learning

