import { useHomeContext } from '@contexts/HomeContext'
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
import { IoChevronBackOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";





function CourseOverview({ from, setFrom }) {
    const [wishList, setWishList] = useState([])
    const [loading, setLoading] = useState(false)
    const { overviewCourse, userDetails, setUserDetails, cart, setCart, enrolled, setActive, searchResults } = useHomeContext()

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




    const addToCart = async () => {
        if (Object.keys(userDetails).length !== 0) {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addToCart`, { course: JSON.stringify(overviewCourse), userId: userDetails.userDetails._id })
                .then((res) => {
                    console.log('added to cart', overviewCourse._id, res.data);
                    if (res.data.status == 'success') {
                        setCart(res.data.cart)

                    }

                }
                )

        }


        else alert('please login to enroll')
    }
    const addToWishlist = async () => {

        if (Object.keys(userDetails).length !== 0) {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addToWishlist`, { courseId: overviewCourse._id, userId: userDetails.userDetails._id }, {
                headers: {
                    'Authorization': `Bearer ${userDetails?.token}`
                }
            })
                .then((res) => {
                    if (res.status == 403) {
                        alert('session expired please login again to continue')
                        logout()
                    }
                    else if(res.data.status == 'success'){
                        setWishList([...wishList,overviewCourse._id])
                    }

                    // console.log('added to Wishlist', res.data);


                }
                )

        }


        else alert('please login to access wishlist')
    }
    // console.log(overviewCourse?.enrolled)
    // console.log(cart?.filter(item=>item._id == overviewCourse._id).length == 0,'yesornoe', !overviewCourse?.enrolled?.includes(userDetails?.userDetails?._id),'cart',cart,'price',overviewCourse.price !== 'free')
    useEffect(() => {
        setLoading(true)
        const getWishList = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getWishlist/${userDetails?.userDetails?._id}`)
                .then(res => { 
                    // console.log('wishlist>>>', res.data);
                     setWishList(res.data.RawList); setLoading(false)
                })

        }

        if (userDetails?.userDetails?._id) getWishList()
    }, [])





    return (
        <div className='flex flex-col overflow-hidden'>

            <div className='px-40 py-10  pt-20 text-white bg-slate-900 relative'>
                {(from !== '') &&
                    <div className=" absolute top-3 left-2 flex w-[max-content] cursor-pointer items-center text-sm font-medium  text-gray-300" onClick={() => { setActive(from); setFrom('') }}>
                        <IoChevronBackOutline className='font-bold' />back to {from}
                    </div>
                }
                <span className='text-3xl font-bold w-[70%]'>{overviewCourse.landingPageDetails.title}</span>
                <p className='w-[70%] mt-3'>{overviewCourse.landingPageDetails.subtitle}</p>
                <p className='w-[70%] mt-3 flex items-center text-yellow-500'><span className='me-1 text-xl'>{overviewCourse.rating}</span> {printRating(overviewCourse.rating)}</p>
                <p className='w-[70%] mt-3'>created by {overviewCourse.author.username}</p>
            </div>
            <div className='w-[25%] self-end fixed flex flex-col top-32   right-16 bg-white shadow-md'>
                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${overviewCourse.image}`} className='w-full' alt="" />
                <div className='flex flex-col items-center gap-3 px-5 pb-10'>

                    <div className='flex items-center w-full gap-2 pt-5'>

                        {(cart?.filter(item => item._id == overviewCourse._id).length == 0 && !overviewCourse?.enrolled?.includes(userDetails?.userDetails?._id) && overviewCourse.price !== 'free' && overviewCourse.author.authorId !== userDetails?.userDetails?._id) ?
                            <>
                                <span className='flex items-center  text-xl font-bold'><FaRupeeSign size={'1em'} />{overviewCourse.price}</span>
                                <span className='px-3 py-2 bg-violet-500 text-center text-white w-full' onClick={addToCart}>Add to cart</span>

                            </>
                            : cart?.filter(item => item._id == overviewCourse._id).length !== 0 ?
                                <span className='px-3 py-2 bg-slate-700 text-center text-white w-full' onClick={() => setActive('cart')}>Go to cart</span>
                                : (overviewCourse?.enrolled?.includes(userDetails?.userDetails?._id) || overviewCourse.price == 'free' || overviewCourse.author.authorId == userDetails?.userDetails?._id) &&
                                <Link href={`/coursesDetails/${overviewCourse._id}`} target='_blank' className='px-3 py-2 bg-slate-700 text-center text-white w-full' >Go to course</Link>
                        }
                        <span className={`px-2 py-2 border border-black ${loading && ' animate-pulse'}`} onClick={addToWishlist}>
                            {wishList.includes(overviewCourse?._id) ? <FaHeart className='text-red-400' size={'1.2em'}/>
                            :<FaRegHeart size={'1.2em'} />
                            }
                        </span>
                    </div>
                    <span className='text-xs'> 30-day money-back guarantee</span>
                    <span className='text-xs'>Full life time access</span>
                </div>
            </div>
            <div className='ps-40 pe-10 py-10 flex flex-col gap-10 w-[70%]'>
                <div className='border border-gray-300 p-3 w-full'>

                    <span className='text-2xl font-bold'>what you'll learn</span>
                    <div className='w-full mt-2 flex flex-wrap'>
                        {overviewCourse.outcomes.map((outcome, i) => {
                            return <span key={i} className='flex items-center h-[max-content] gap-2 w-[50%] mb-3'><IoMdCheckmark size={'1.2em'} />{outcome}</span>
                        })}
                        {/* {overviewCourse.outcomes.map((outcome, i) => {
                            return <span key={i} className='flex items-center gap-2 w-[50%] mb-3'><IoMdCheckmark size={'1.2em'} />{outcome}</span>
                        })} */}
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
