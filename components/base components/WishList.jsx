import { useHomeContext } from '@contexts/HomeContext';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoChevronBackOutline } from 'react-icons/io5';
import { MdDeleteOutline } from "react-icons/md";


function WishList({from, setFrom}) {
    const [wishList, setWishList] = useState([])
    const { userDetails,active, setActive, setOverviewCourse, logout } = useHomeContext()
    const [loading, setLoading] = useState(false)
    const [itemLoading, setItemLoading] = useState('')
    useEffect(() => {
        setLoading(true)
        const getWishList = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getWishlist/${userDetails?.userDetails?._id}`)
                .then(res => { 
                    // console.log('wishlist>>>', res.data);
                     setWishList(res.data.wishList); setLoading(false)})

        }

        if (userDetails?.userDetails?._id) getWishList()
    }, [])

    const removeFromWishlist=async(id)=>{
        setItemLoading(id)
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/removeFromWishlist/${id}/${userDetails?.userDetails?._id}`,{
            headers:{
                'Authorization':`Bearer ${userDetails?.token}`
            }
        })
        .then((res)=>{
            setItemLoading('')
            if(res.status == 403){
                alert('session expired, please log in to continue')
                logout()
            }
            else if(res.data.status == 'success'){
                setWishList(res.data.wishList)
            }
        })
    }
  return (
    <div className='px-32 py-10 relative min-h-[70vh]'>
            {(from !== '') &&
                <div className=" absolute top-3 left-2 flex  w-[max-content]  cursor-pointer items-center text-sm font-medium  text-gray-400" onClick={() => { setActive(from); setFrom('') }}>
                    <IoChevronBackOutline className='font-bold' />back to {from}
                </div>
            }
            <p className='text-3xl font-bold'>My WishList</p>
            <section className=' flex flex-wrap gap-10 px-10  py-10'>
                {!loading ? wishList?.map((item, i) => {
                    return (
                        <div key={i} 
                        onClick={()=>{setOverviewCourse(item); setActive('course overview'); setFrom(active)}}
                        // href={`/coursesDetails/${item._id}`} target='_blank'
                            className={`flex flex-col gap-1  border   pb-2 w-[300px] relative hover:scale-[1.03] hover:shadow-md ${itemLoading == item._id && 'animate-pulse'} hover:shadow-violet-400 transition-all duration-200 cursor-pointer`}>
                            <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} className='w-[300px]' alt="" />

                            <p className='font-bold px-2'>{item.landingPageDetails.title}</p>
                            <p className='text-xs px-2 text-gray-500 font-medium'>{item.author.username} sikandhar</p>
                            <span className='absolute top-1 right-1 border border-black p-1 bg-white ' onClick={(e)=>{e.stopPropagation(); removeFromWishlist(item._id)}}><MdDeleteOutline size={'1.2em'}/></span>
                        </div>
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

export default WishList
