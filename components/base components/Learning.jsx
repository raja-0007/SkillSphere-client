import { useHomeContext } from '@contexts/HomeContext'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoChevronBackOutline } from 'react-icons/io5'
import { IoPlaySharp } from "react-icons/io5";



function Learning({ from, setFrom }) {
    const [learningCourses, setLearningCourses] = useState([])
    const { userDetails, setActive } = useHomeContext()
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState([])
    const [percentages, setPercentages] = useState([])
    const [hover, setHover] = useState(null)
    useEffect(() => {
        setLoading(true)
        const getEnrolled = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getEnrolled/${userDetails?.userDetails?._id}`)
                .then(res => { console.log('enroled>>>', res.data); setLearningCourses(res.data.enrolled); setLoading(false) })

        }


        if (userDetails?.userDetails?._id) getEnrolled()
    }, [])

    useEffect(() => {

        const getCompletionDetails = async (courseId) => {
            try {
                console.log(courseId);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCompletionDetails/${courseId}/${userDetails?.userDetails?._id}`);
                if (res.data.status == 'success') {
                    console.log('responses', res.data.completedLectures.length);
                    return res.data.completedLectures.length;
                } else {
                    alert('An unexpected error occurred. Please try again');
                    // return 0; // Return a consistent type (e.g., 0) for errors
                }
            } catch (error) {
                console.error('Error fetching completion details:', error);
                // return 0; // Return a consistent type (e.g., 0) for errors
            }
        }

        // if (learningCourses.length > 0) {
        //     var response = []

        //     learningCourses.forEach((course) => {

        //         getCompletionDetails(course._id, response)
        //         console.log('rrrrrrrrrrrrrrrrrrrrrrrrrr2',response)
        //         // setCompleted([...completed, res.data.completedLectures.length])
        //     });
        //     console.log('>>>>>>>>>>>>>>>>>.3',response)
        //     setCompleted(response)

        // }
        const fetchCompletionDetailsForCourses=async()=>{

            if (learningCourses.length > 0) {
                try {
                    const promises = learningCourses.map((course) => getCompletionDetails(course._id));
                    const response = await Promise.all(promises);
                    console.log('All responses:', response);
                    setCompleted(response)
                } catch (error) {
                    console.error('Error in fetching completion details for courses:', error);
                }
            }
        }
        fetchCompletionDetailsForCourses();

    }, [learningCourses])

    useEffect(() => {

        const calculatePercentages = () => {

            const newPercentages = learningCourses?.map((item, i) => {

                var totalLectures = 0
                item.sections.forEach(sect => {
                    totalLectures += sect.curriculum.length

                });

                const percentage = Math.floor((completed[i] / totalLectures) * 100)
                // console.log(completed[i], totalLectures, percentage)
                return percentage
            })
            setPercentages(newPercentages)

        }

        if (completed.length > 0 && completed.length == learningCourses.length) {

            calculatePercentages()
        }
        console.log('completed list', completed)

    }, [completed])

    console.log(percentages)



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
                        <Link key={i} href={`/coursesDetails/${item._id}/${userDetails?.userDetails?._id}`} target='_blank'
                            className='flex flex-col gap-1  w-[300px] cursor-pointer' onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                            <div className='w-[300px] h-[max-content] relative'>

                                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} className='w-[300px]' alt="" />
                                {hover == i && (<div className='w-full flex items-center justify-center h-full bg-black bg-opacity-40 absolute top-0 left-0'>
                                    <div className='w-14 h-14 flex justify-center items-center rounded-full bg-white'><IoPlaySharp className='text-[1.8em] ms-1' /></div>
                                </div>)}
                            </div>

                            <p className='font-bold px-2'>{item.landingPageDetails.title}</p>
                            <p className='text-xs px-2 text-gray-500 font-medium'>{item.author.username} sikandhar</p>
                            <div className='w-full h-1 mt-1 bg-violet-200 '>
                                <div style={{ width: `${percentages[i]}%` }} className={` h-full bg-violet-500 rounded-e-full `}></div>

                            </div>
                            <p className='text-xs'>{percentages[i]}% completed</p>
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

