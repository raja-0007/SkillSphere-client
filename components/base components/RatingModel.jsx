import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { Rate } from 'antd';
import { Spin } from 'antd';
import { useHomeContext } from '@contexts/HomeContext';


function RatingModel({ isRatingModelOpen, setIsRatingModelOpen }) {
    const [rating, setRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const {ratings, setRatings, addRating} = useHomeContext()
    const [hoverRating, setHoverRating] = useState(0)
    const ratingCatagories = {
        0: 'select rating',
        0.5: 'awful, not what i exprected at all',
        1: 'awful, not what i exprected at all',
        1.5: 'awful/poor',
        2: 'poor, pretty disappointed',
        2.5: 'poor/average',
        3: 'average, could be better',
        3.5: 'average/good',
        4: 'good, what i expected',
        4.5: 'good/excellent',
        5: 'excellent, above expectations!'
    }
    
    useEffect(() => {
        console.log('ratingratingrating', rating)
    }, [rating])
    return (
        <section className='flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50 absolute top-0 left-0 min-h-screen w-full z-10'>
            <div className='flex flex-col  p-5  items-center bg-white '>
                <span className='self-end' onClick={() => setIsRatingModelOpen('')}><IoMdClose className='text-[1.3em]' /></span>
                <p className='font-bold px-20 text-xl'>How would you rate this course?</p>
                <p className='font-bold mt-5 capitalize'>{ratingCatagories[hoverRating] || ratingCatagories[rating]}</p>
                <span><Rate allowHalf className='text-5xl mt-5' onHoverChange={(val) => setHoverRating(val)} onChange={(val) => setRating(val)} defaultValue={isRatingModelOpen.rating} /></span>
                {(rating > 0 && !loading) ?
                    <span className='self-end mt-5 bg-slate-800 w-20 text-center py-2 cursor-pointer text-white font-semibold' onClick={()=>{
                        if(isRatingModelOpen.rating != rating){
                            setLoading(true) 
                            addRating(isRatingModelOpen, rating, setLoading)
                        }
                        else{
                            setIsRatingModelOpen({})
                        }
                    }}>submit</span>
                    :
                    loading && <Spin className='mt-5 self-end me-5' size="large" />
                }  
            </div>
        </section>
    )
}

export default RatingModel