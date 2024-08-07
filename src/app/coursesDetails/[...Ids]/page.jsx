"use client"

import Footer from '@components/base components/Footer'
import CourseNavbar from '@components/courseDetails components/CourseNavbar'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { FaArrowLeftLong, FaCirclePlay } from "react-icons/fa6";
import CourseSidebar from '@components/courseDetails components/CourseSidebar'
import { FaStar } from "react-icons/fa";
import { BsFileEarmark } from 'react-icons/bs'
import { IoMdCheckmark } from 'react-icons/io'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";


function page({ params }) {
  const [opened, setOpened] = useState([])

  const iframeRef = useRef(null)
  const [scrollPos, setScrollPos] = useState(0)
  const [isSidebar, setIsSidebar] = useState(true)
  const [courseContent, SetCourseContent] = useState({})
  const containerRef = useRef(null)
  const [selected, setSelected] = useState({})


  const [completed, setCompleted] = useState([])
  useEffect(() => {
    const getCourseContent = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCourseDetails/${params.Ids[0]}`)
        .then(res => {
          console.log(res.data);
          SetCourseContent(res.data)
        })
    }


    const getCompletionDetails = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCompletionDetails/${params.Ids[0]}/${params.Ids[1]}`)
        .then(res => {
          if (res.data.status == 'success') {
            setCompleted(res.data.completedLectures)
          }
          else {
            alert('an unexpected error had occured. please try again')
          }
        })
    }


    getCourseContent()
    getCompletionDetails()
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }



  }, [])


  useEffect(() => {
    var found = false
    if (Object.keys(courseContent).length !== 0) {

      for (let sect = 0; sect < courseContent.sections.length; sect++) {
        if (found) break
        for (let curr = 0; curr < courseContent.sections[sect].curriculum.length; curr++) {
          if (!completed.includes(courseContent.sections[sect].curriculum[curr].currId)) {
            setSelected(courseContent.sections[sect].curriculum[curr])
            handleOpen('open', courseContent.sections[sect].id)
            found = true
            break
          }
          else {
            continue
          }
        }
      }

    }

  }, [courseContent, completed])



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

  const updateCompletion = async (lectId) => {
    await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/updateCompletion/${params.Ids[0]}/${params.Ids[1]}/${lectId}`)
      .then(res => {
        if (res.status == 200) {
          setCompleted(res.data.completedLectures)
        }
        else {
          alert('an unexpected error had occured. please try again')
        }
      })
  }

  const handleOpen = (action, id) => {
    if (action == 'open') {
      setOpened([...opened, id])
    }
    else if (action == 'close') {
      const list = [...opened]
      // console.log('lcosee', list,id, list.filter(sect !== id))

      setOpened(list.filter(sect => sect !== id))
    }
  }


  return (
    <div className='flex flex-col ' ref={containerRef} >
      <CourseNavbar title={courseContent?.landingPageDetails?.title} />
      <div className='flex w-full relative' >

        <div className={`flex flex-col ${isSidebar ? 'w-[75%]' : 'w-full'}`}>
          <div className=' w-full'>
            {(Object.keys(selected).length !== 0 && selected.content_type == 'article') ?
              <div className='px-20 py-10  flex flex-col text-justify h-[500px] overflow-y-auto relative'>
                {selected.content.blocks.map((block, block_i) => {
                  const getHeaderText = () => {
                    const headers = {
                      h1: <h1 className='font-bold text-lg mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h1>,
                      h2: <h2 className='font-bold text-xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h2>,
                      h3: <h3 className='font-bold text-2xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h3>,
                      h4: <h4 className='font-bold text-3xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h4>,
                      h5: <h5 className='font-bold text-4xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h5>,
                      h6: <h6 className='font-bold text-5xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h6>,

                    }
                    return headers[`h${block.data.level}`]
                  }
                  const getNestedList = (style, items, key) => {

                    if (style === 'unordered') {
                      return <ul className='list-disc ps-5 mb-3'>
                        {items.map((listItem, list_i) => {
                          return <>
                            <li key={list_i + key} dangerouslySetInnerHTML={{ __html: listItem.content }}></li>
                            {listItem.items.length > 0 && getNestedList('unordered', listItem.items, list_i + key)}
                          </>
                        })}
                      </ul>
                    }
                    else {
                      return <ol className='list-decimal ps-5 mb-5'>
                        {items.map((listItem, list_i) => {
                          return <>
                            <li key={list_i + key} dangerouslySetInnerHTML={{ __html: listItem.content }}></li>
                            {listItem.items.length > 0 && getNestedList('ordered', listItem.items, list_i + key)}
                          </>
                        })}
                      </ol>
                    }
                  }
                  return (
                    <>
                      {block.type == 'paragraph' ? <p dangerouslySetInnerHTML={{ __html: block.data.text }} className='mb-2'></p>
                        : block.type == 'header' ? getHeaderText()
                          : block.type == 'nestedList' && getNestedList(block.data.style, block.data.items, 0)}
                      {/* <span className='absolute w-full text-end   py-1 rounded-b-md  right-0 bottom-0 text-gray-200 px-5 font-bold text-2xl'>...</span>                                                                   */}
                       </>

                  )
                })}
              </div>
              : (Object.keys(selected).length !== 0 && selected.content_type == 'video') ?
                <div className='h-[500px] bg-black'>

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
          <span className='w-full flex justify-between items-center text-xl py-5 px-10 bg-slate-100 border-b'>
            <span className='w-[70%] font-bold'>{courseContent?.landingPageDetails?.subtitle}</span>
            {!completed?.includes(selected.currId) ?
              <div className='bg-green-500 cursor-pointer text-white font-semibold text-sm p-2 w-[20%] text-center flex justify-center items-center gap-2' onClick={() => updateCompletion(selected.currId)}><IoIosCheckmarkCircleOutline className='text-white text-2xl font-bold'/>mark as completed</div>
              : <div className='bg-green-300 text-white font-semibold text-sm p-2 w-[15%] text-center'>completed</div>
            }
          </span>
          <span className='px-10 mt-8 flex items-center gap-10'>
            <span >
              <p className='flex items-center font-bold text-yellow-600'>{courseContent?.rating?.rating} <FaStar className='text-yellow-400' /></p>
              <p className='text-xs text-gray-400'>{courseContent?.rating?.TotalRatings} ratings</p>
            </span>
            <span><p className='font-bold'>12334</p> <p className='text-xs text-gray-400'>students</p></span>
            <div className='text-sm text-gray-800'>
              <p className='flex items-center gap-2 '><BsFileEarmark size={'.8em'} />{totalArticleLectures(courseContent?.sections)} articles</p>
              <p className='flex items-center gap-2 '><FaCirclePlay size={'.8em'} />{totalVideoLectures(courseContent?.sections)} video lectures</p>
            </div>
          </span>

          <div className='px-10 flex mt-8 flex-col gap-10 '>
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
          <CourseSidebar courseContent={courseContent} opened={opened} handleOpen={handleOpen} scrollPos={scrollPos} selected={selected} completed={completed} setSelected={setSelected} setIsSidebar={setIsSidebar} />
          :
          <div onClick={() => setIsSidebar(true)} className='w-8 h-10 cursor-pointer text-white z-10 px-2 py-2 gap-2 justify-start bg-slate-700  overflow-hidden  hover:w-[max-content]  absolute right-0 top-20 flex items-center'>
            <span ><FaArrowLeftLong /></span><span className='font-bold inline-block'>course content</span>
          </div>

        }

      </div>


    </div>
  )
}

export default page
