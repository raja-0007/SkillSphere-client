"use client"

import Footer from '@/components/base components/Footer'
import CourseNavbar from '@/components/courseDetails components/CourseNavbar'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { FaArrowLeftLong, FaCirclePlay } from "react-icons/fa6";
import CourseSidebar from '@/components/courseDetails components/CourseSidebar'
import { FaStar } from "react-icons/fa";
import { BsFileEarmark } from 'react-icons/bs'
import { IoMdCheckmark } from 'react-icons/io'


function page({ params }) {
  const iframeRef = useRef(null)
  const [scrollPos, setScrollPos] = useState(0)
  const [isSidebar, setIsSidebar] = useState(true)
  const [courseContent, SetCourseContent] = useState({})
  const containerRef = useRef(null)
  const [selected, setSelected] = useState({})
  useEffect(() => {
    const getCourseContent = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCourseDetails/${params.courseId}`)
        .then(res => {
          // console.log(res.data);
          SetCourseContent(res.data)
        })
    }
    getCourseContent()



    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }


  }, [])
  const handleScroll = () => {
    // console.log('triggered')
    if (containerRef && containerRef.current) {

      const divElement = containerRef.current;
      // console.log(divElement.scrollY, window.scrollY);
      setScrollPos(window.scrollY)
    }
  };


  const totalArticleLectures = (sections) => {
    let total = 0
    sections?.forEach(sect => {
      const curr = sect.curriculum.filter(curri => curri.content_type == 'article')
      total += curr.length
    });

    return total
  }
  const totalVideoLectures = (sections) => {
    let total = 0
    sections?.forEach(sect => {
      const curr = sect.curriculum.filter(curri => curri.content_type == 'video')
      total += curr.length
    });

    return total
  }


  return (
    <div className='flex flex-col ' ref={containerRef} >
      <CourseNavbar title={courseContent?.landingPageDetails?.title} />
      <div className='flex w-full relative' >

        <div className={`flex flex-col ${isSidebar ? 'w-[75%]' : 'w-full'} gap-8`}>
          <div className=' bg-gray-100 '>
            {(Object.keys(selected).length !== 0 && selected.content_type == 'article') ?
              <div className='px-20 pe-32 pt-20 text-justify h-[400px] overflow-y-auto'>
                {selected.content}
              </div>
              : (Object.keys(selected).length !== 0 && selected.content_type == 'video') ?
                <div className='h-[500px]'>

                  <iframe
                    ref={iframeRef}
                    src={`${process.env.NEXT_PUBLIC_VIMEO_PLAYER}/${selected?.videoUrl}`}
                    width={'100%'} height={'100%'}
                    allowFullScreen
                  ></iframe>
                  
                </div>
                : <div className='h-[500px]'></div>
            }
          </div>
          <span className='w-[70%] text-xl px-10'>
            {courseContent?.landingPageDetails?.subtitle}
          </span>
          <span className='px-10 flex items-center gap-10'>
            <span >
              <p className='flex items-center font-bold text-yellow-600'>{courseContent?.rating} <FaStar className='text-yellow-400' /></p>
              <p className='text-xs text-gray-400'>12,234 ratings</p>
            </span>
            <span><p className='font-bold'>12334</p> <p className='text-xs text-gray-400'>students</p></span>
            <div className='text-sm text-gray-800'>
              <p className='flex items-center gap-2 '><BsFileEarmark size={'.8em'} />{totalArticleLectures(courseContent?.sections)} articles</p>
              <p className='flex items-center gap-2 '><FaCirclePlay size={'.8em'} />{totalVideoLectures(courseContent?.sections)} video lectures</p>
            </div>
          </span>

          <div className='px-10 flex flex-col gap-10 '>
            <div className='border border-gray-300 p-3 '>

              <span className='text-2xl font-bold'>what you'll learn</span>
              <div className='w-full mt-2 flex flex-wrap'>
                {courseContent?.outcomes?.map((outcome, i) => {
                  return <span key={i} className='flex items-center gap-2 w-[50%] mb-3'><IoMdCheckmark size={'1.2em'} />{outcome}</span>
                })}
                {courseContent?.outcomes?.map((outcome, i) => {
                  return <span key={i} className='flex items-center gap-2 w-[50%] mb-3'><IoMdCheckmark size={'1.2em'} />{outcome}</span>
                })}
              </div>
            </div>

            <div >
              <p className='text-2xl font-bold'>Requirements</p>
              {courseContent?.requirements?.map((req, i) => {
                return (
                  <li className='py-1 px-2' key={i}>{req}</li>
                )
              })}
            </div>
            <div>
              <p className='text-2xl font-bold mb-2'>Description</p>
              <p>{courseContent?.landingPageDetails?.description}</p>
            </div>
          </div>


          <Footer />
        </div>

        {isSidebar ?
          <CourseSidebar courseContent={courseContent} scrollPos={scrollPos} selected={selected} setSelected={setSelected} setIsSidebar={setIsSidebar} />
          :
          <div onClick={() => setIsSidebar(true)} className='w-8 h-10 text-white z-10 px-2 py-2 gap-2 justify-start bg-slate-700  overflow-hidden  hover:w-[max-content]  absolute right-0 top-20 flex items-center'>
            <span ><FaArrowLeftLong /></span><span className='font-bold inline-block'>course content</span>
          </div>

        }

      </div>


    </div>
  )
}

export default page
