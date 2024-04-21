import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow, Parallax, EffectCards, EffectCube } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/bundle';
function Carousel() {
  return (
    <div className=' pb-10'>
      <div className='lg:w-[90%] w-full mx-auto mb-4 '>
      <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectCoverflow, Parallax, EffectCards, EffectCube]}
       spaceBetween={0}
       slidesPerView={1}
       navigation={{clickable:true}}
       effect='cube'
       cubeEffect={{shadow:false, shadowOffset:1, shadowScale:0.6, slideShadows:true}}
       parallax={{enabled:true}}
       cardsEffect={{perSlideOffset:8, perSlideRotate:2, rotate:true, slideShadows:true}}
       coverflowEffect={{depth:100, modifier:1, rotate:50, scale:1, slideShadows:true, stretch:0 }}
       autoplay={{delay:3000, pauseOnMouseEnter:true}}
      //  pagination={{ clickable: false }}
       speed={1000}
       className='w-full h-full '>
        <SwiperSlide className='w-full h-full relative'>
            <img src="/images/cbanner1.jpg" className='sm:h-auto sm:w-auto h-[300px]   mx-auto' alt="" />
            <div className='lg:w-[30%] sm:w-[40%] gap-2 sm:absolute top-[20%] left-[10%]  flex flex-col justify-start flex-wrap bg-white lg:p-6 p-4 rounded-sm shadow-lg shadow-gray-300'>
              <span className=' font-semibold lg:text-3xl text-2xl'>Learning that gets you</span>
              <span className='  lg:text-md text-sm lg:pb-2'>Skills for your present (and your future). Get started with us.</span>
            </div>
            
        </SwiperSlide>
        <SwiperSlide className='w-[max-content] h-full relative'>
            <img src="/images/cbanner2.jpg" className='sm:h-auto sm:w-auto h-[230px] mx-auto' alt="" />
            <div className='lg:w-[30%] sm:w-[40%] gap-2 sm:absolute top-[20%] left-[10%]  flex flex-col justify-start flex-wrap bg-white lg:p-6 p-4 rounded-sm shadow-lg shadow-gray-300'>
              <span className=' font-semibold lg:text-3xl text-2xl'>Skills that drive you forward</span>
              <span className='  lg:text-md text-sm lg:pb-2'>Technology and the world of work change fast — with us, you're faster. Get the skills to achieve goals and stay competitive.</span>
              <span className='flex gap-4'>
                <button className='w-[max-content] border-2 px-2 py-2 border-slate-950 bg-slate-950 text-white font-semibold'>
                  Plan for individuals
                </button>
                <button className='w-[max-content] border-2 px-2 py-2 border-slate-950 bg-white text-black font-semibold'>
                  Plan for organisations
                </button>
              </span>
            </div>
        </SwiperSlide>
        
      </Swiper>
    </div>
    </div>
    
  )
}

export default Carousel
