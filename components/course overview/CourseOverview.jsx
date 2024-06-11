import { useHomeContext } from '@/context/HomeContext'
import React, { useEffect, useState } from 'react'
import { printRating } from '../home components/courses'
import { IoMdCheckmark } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BsFileEarmark } from 'react-icons/bs';
import { FaCirclePlay } from "react-icons/fa6";
import CourseSections from './CourseSections';
import axios from 'axios';
import Link from 'next/link';



function CourseOverview() {
    const { overviewCourse, userDetails, setUserDetails, cart, setCart, enrolled, setActive } = useHomeContext()
    // const [enrolled, setEnrolled] = useState(false)
    useEffect(() => {
        const getCart=async()=>{
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`)
            .then(res=>{console.log(res.data); setCart(res.data.cart)})
        }
        
        getCart()
    }, [])
    const totalArticleLectures = (sections) => {
        let total = 0
        sections.forEach(sect => {
            const curr = sect.curriculum.filter(curri => curri.content_type == 'article')
            total += curr.length
        });

        return total
    }
    const totalVideoLectures = (sections) => {
        let total = 0
        sections.forEach(sect => {
            const curr = sect.curriculum.filter(curri => curri.content_type == 'video')
            total += curr.length
        });

        return total
    }
    // currently not using
    // const enroll = async () => {
        

    //         if (Object.keys(userDetails).length !== 0) {
    //             await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/enroll`, { courseId: overviewCourse._id, email: userDetails.userDetails.email })
    //                 .then((res) => {
    //                     // console.log('enrolled', overviewCourse._id, res.data);
    //                      res.data == 'success' && setEnrolled(true)}
    //                 )

    //         }
    //         else alert('please login to enroll')
        
    // }

    // const getUserDetails=async()=>{

    //     await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getUserDetails/${userDetails.userDetails._id}`)
    //     .then(resp=>console.log(resp.data))
    //     // setUserDetails({...userDetails, userDetails:{...userDetails.userDetails, cart:res.data.cart}})
    // }

    const addToCart = async()=>{
        if (Object.keys(userDetails).length !== 0) {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addToCart`, { course: JSON.stringify(overviewCourse), userId: userDetails.userDetails._id })
                .then((res) => {
                    console.log('added to cart', overviewCourse._id, res.data);
                     if(res.data.status == 'success') {
                        setCart(res.data.cart)
                        
                    }

                     }
                )

        }

        
        else alert('please login to enroll')
    }


   

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='px-40 py-10  pt-20 text-white bg-slate-900'>
                <span className='text-3xl font-bold w-[70%]'>{overviewCourse.landingPageDetails.title}</span>
                <p className='w-[70%] mt-3'>{overviewCourse.landingPageDetails.subtitle}</p>
                <p className='w-[70%] mt-3 flex items-center text-yellow-500'><span className='me-1 text-xl'>{overviewCourse.rating}</span> {printRating(overviewCourse.rating)}</p>
                <p className='w-[70%] mt-3'>created by {overviewCourse.author.username}</p>
            </div>
            <div className='w-[25%] self-end fixed flex flex-col top-32 z-0  right-16 bg-white shadow-md'>
                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${overviewCourse.image}`} className='w-full' alt="" />
                <div className='flex flex-col items-center gap-3 px-5 pb-10'>

                    <div className='flex items-center w-full gap-2 pt-5'>
                        
                        {(cart?.filter(item=>item._id == overviewCourse._id).length == 0 && enrolled?.filter(item=>item._id == overviewCourse._id).length == 0 && overviewCourse.price !== 'free') ?
                        <>
                        <span className='flex items-center  text-xl font-bold'><FaRupeeSign size={'1em'} />{overviewCourse.price}</span>
                        <span className='px-3 py-2 bg-violet-500 text-center text-white w-full' onClick={addToCart}>Add to cart</span>

                        </>
                            : cart?.filter(item=>item._id == overviewCourse._id).length !== 0 ?
                            <span  className='px-3 py-2 bg-slate-700 text-center text-white w-full' onClick={()=>setActive('cart')}>Go to cart</span>
                            : (enrolled?.filter(item=>item._id == overviewCourse._id).length !== 0 || overviewCourse.price == 'free') && 
                            <Link href={`/coursesDetails/${overviewCourse._id}`}  className='px-3 py-2 bg-slate-700 text-center text-white w-full' >Go to course</Link>
                        }
                        <span className='px-2 py-2 border border-black'><FaRegHeart size={'1.2em'} /></span>
                    </div>
                    <span className='text-xs'> 30-day money-back guarantee</span>
                    <span className='text-xs'>Full life time access</span>
                </div>
            </div>
            <div className='ps-40 pe-10 py-10 flex flex-col gap-10 w-[70%]'>
                <div className='border border-gray-300 p-3 '>

                    <span className='text-2xl font-bold'>what you'll learn</span>
                    <div className='w-full mt-2 flex flex-wrap'>
                        {overviewCourse.outcomes.map((outcome, i) => {
                            return <span key={i} className='flex items-center gap-2 w-[50%] mb-3'><IoMdCheckmark size={'1.2em'} />{outcome}</span>
                        })}
                        {overviewCourse.outcomes.map((outcome, i) => {
                            return <span key={i} className='flex items-center gap-2 w-[50%] mb-3'><IoMdCheckmark size={'1.2em'} />{outcome}</span>
                        })}
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-[50%]'>
                    <span className='text-2xl font-bold'>this course includes:</span>
                    <div className='flex flex-wrap '>

                        <span className='flex items-center gap-2 w-[50%] mb-2'><BsFileEarmark size={'1.2em'} />{totalArticleLectures(overviewCourse.sections)} articles</span>
                        <span className='flex items-center gap-2 w-[50%] mb-2'><FaCirclePlay size={'1.2em'} />{totalVideoLectures(overviewCourse.sections)} articles</span>
                        <span className='flex items-center gap-2 w-[50%] mb-2'><BsFileEarmark size={'1.2em'} />{totalArticleLectures(overviewCourse.sections)} articles</span>
                        <span className='flex items-center gap-2 w-[50%] mb-2'><FaCirclePlay size={'1.2em'} />{totalVideoLectures(overviewCourse.sections)} articles</span>
                    </div>
                </div>
                <CourseSections />
                <div >
                    <p className='text-2xl font-bold'>Requirements</p>
                    {overviewCourse.requirements.map((req, i) => {
                        return (
                            <li className='py-1 px-2' key={i}>{req}</li>
                        )
                    })}
                </div>
                <div>
                    <p className='text-2xl font-bold mb-2'>Description</p>
                    <p>{overviewCourse.landingPageDetails.description}</p>
                </div>
            </div>
        </div >
    )
}

export default CourseOverview
