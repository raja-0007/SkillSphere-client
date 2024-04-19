import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation , EffectCards, Autoplay} from 'swiper/modules'
import 'swiper/css/bundle'
import { BiSolidQuoteRight } from "react-icons/bi";
import { FaPlayCircle, FaUserCircle } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";



function LearnersReview() {
    const reviews = [
        {
            matter: 'asodnqw;oewih av[aewy va siye0vysa[0vyveyaw08 v[a0yv [sa08yev p89av iudszgupist7vp9 s viuzs tvo7ts paosdy pao 9atp9vtawp7tp a',
            user: 'Lorem, ipsum.',
            course: 'asdasidh asigs go'
        },
        {
            matter: 'asodnqw;oewih av[aewy va siye0vysa[0vyveyaw08 v[a0yv [sa08yev p89av iudszgupist7vp9 s viuzs tvo7ts paosdy pao 9atp9vtawp7tp a',
            user: 'ipsum Lorem, .',
            course: 'asiofa; ai;osfhoash ;asiho'
        },
        {
            matter: 'asodnqw;oewih av[aewy va siye0vysa[0vyveyaw08 v[a0yv [sa08yev p89av iudszgupist7vp9 s viuzs tvo7ts paosdy pao 9atp9vtawp7tp a',
            user: 'hari hari',
            course: 'asdasidh asigs go'
        },
        {
            matter: 'asodnqw;oewih av[aewy va siye0vysa[0vyveyaw08 v[a0yv [sa08yev p89av iudszgupist7vp9 s viuzs tvo7ts paosdy pao 9atp9vtawp7tp a',
            user: 'ipsum Lorem, .',
            course: 'asiofa; ai;osfhoash ;asiho'
        },
        {
            matter: 'asodnqw;oewih av[aewy va siye0vysa[0vyveyaw08 v[a0yv [sa08yev p89av iudszgupist7vp9 s viuzs tvo7ts paosdy pao 9atp9vtawp7tp a',
            user: 'Lorem, ipsum.',
            course: 'asdasidh asigs go'
        },
        {
            matter: 'asodnqw;oewih av[aewy va siye0vysa[0vyveyaw08 v[a0yv [sa08yev p89av iudszgupist7vp9 s viuzs tvo7ts paosdy pao 9atp9vtawp7tp a',
            user: 'ipsum Lorem, .',
            course: 'asiofa; ai;osfhoash ;asiho'
        }
    ]
    return (
        <div className='bg-slate-50 w-full h-[max-content] mt-10 '>
            <div className='w-[80%] mx-auto  py-20'>
                <span className='font-bold text-2xl'>How learners like you are achieving their goals</span>
                <Swiper
                modules={[Navigation, EffectCards, Autoplay]}
                slidesPerGroup={1}
                slidesPerView={1}
                spaceBetween={30}
                
                watchOverflow={true}
                navigation
                autoplay={{delay:2000, pauseOnMouseEnter:true}}
                speed={2000}
                cardsEffect={{perSlideOffset:5, perSlideRotate:3, rotate:true, slideShadows:false}}
                className='mt-5 w-full'
                >
                    {reviews.map((review,index)=>
                    <SwiperSlide className='py-5' key={index}>
                        <div className='w-[600px] mx-auto flex flex-col py-5 px-10 bg-white border-[1px] border-gray-300 rounded-lg shadow-lg shadow-gray-400 gap-5 ' >
                            <span className='flex flex-col gap-1 justify-center'>
                                <span className='font-bold text-3xl '><BiSolidQuoteRight /></span>
                                <span>{review.matter}</span>
                            </span>
                            <span className='flex items-center gap-2 font-semibold'><FaUserCircle className='text-2xl '/>{review.user}</span>
                            <hr className='border-gray-500'/>
                            <span className='flex items-center gap-2 font-bold text-blue-500'><FaPlayCircle className='text-2xl'/>{review.course}</span>
                        </div>
                    </SwiperSlide>
                    )}
                </Swiper>
            </div>

        </div>
    )
}

export default LearnersReview
