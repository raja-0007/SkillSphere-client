"use client"

import Footer from '@components/base components/Footer'
import CourseNavbar from '@components/courseDetails components/CourseNavbar'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeftLong, FaCirclePlay } from "react-icons/fa6";
import CourseSidebar from '@components/courseDetails components/CourseSidebar'
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaStar, FaTrophy } from "react-icons/fa";
import { BsFileEarmark } from 'react-icons/bs'
import { IoMdCheckmark } from 'react-icons/io'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from 'react-icons/io5'
import { MdCelebration } from 'react-icons/md'


function page({ params }) {
  const [opened, setOpened] = useState([])
const [loading, setLoading] = useState(true)
  const [showCongrats, setShowCongrats] = useState(false)
  const [error, setError] = useState(null)  
  const iframeRef = useRef(null)
  const [scrollPos, setScrollPos] = useState(0)
  const [isSidebar, setIsSidebar] = useState(true)
  const [courseContent, SetCourseContent] = useState({})
  const containerRef = useRef(null)
  const [selected, setSelected] = useState({})


  const [completed, setCompleted] = useState([])
  useEffect(() => {
    if (!params?.Ids || !Array.isArray(params.Ids) || params.Ids.length < 2) {
      setError("Invalid or missing course parameters in URL.")
      setLoading(false)
      return
    }

    const [courseId, userId] = params.Ids

    const getCourseContent = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCourseDetails/${courseId}`)
        SetCourseContent(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching course:', error)
        setError("Failed to fetch course details. Please try again later.")
        setLoading(false)
      }
    }

    const getCompletionDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCompletionDetails/${courseId}/${userId}`)
        if (response.data.status === 'success') {
          setCompleted(response.data.completedLectures || [])
        }
      } catch (error) {
        console.error('Error fetching completion:', error)
      }
    }

    getCourseContent()
    getCompletionDetails()

    const handleScroll = () => {
      setScrollPos(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [params.Ids])


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

  const renderDescription = () => {
    const description = courseContent?.landingPageDetails?.description
    
    if (!description) return null
    
    if (typeof description === 'string') {
      return (
        <section className='mb-8'>
          <h3 className='text-2xl font-bold mb-4'>Description</h3>
          <p className='text-gray-700 whitespace-pre-line'>{description}</p>
        </section>
      )
    }
    
    if (description.blocks && Array.isArray(description.blocks)) {
      return (
        <section className='mb-8'>
          <h3 className='text-2xl font-bold mb-4'>Description</h3>
          <div className='prose max-w-none text-gray-700'>
            {description.blocks.map((block, i) => {
              if (block.type === 'paragraph') {
                return <p key={i} className='mb-3' dangerouslySetInnerHTML={{ __html: block.data.text }} />
              }
              if (block.type === 'nestedList') {
                const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
                return (
                  <ListTag key={i} className={`${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} pl-6 mb-4 space-y-1`}>
                    {block.data.items?.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.content }} />
                    ))}
                  </ListTag>
                )
              }
              return null
            })}
          </div>
        </section>
      )
    }
    
    return null
  }

  useEffect(() => {
    const totalLectures = courseContent?.sections?.reduce((acc, sect) => 
      acc + (sect.curriculum?.length || 0), 0) || 0
    
    if (totalLectures > 0 && completed.length === totalLectures && !showCongrats) {
      setShowCongrats(true)
    }
  }, [completed, courseContent])

  
  const completionPercentage = () => {
    const totalLectures = courseContent?.sections?.reduce((acc, sect) => 
      acc + (sect.curriculum?.length || 0), 0) || 0
    return totalLectures > 0 ? Math.round((completed.length / totalLectures) * 100) : 0
  }

if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md'>
          <h2 className='text-2xl font-bold text-red-600 mb-3'>Error</h2>
          <p className='text-gray-700 mb-6'>{error}</p>
          <button
            onClick={() => window.location.href = '/learning'}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          >
            Go to My Courses
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='flex flex-col ' ref={containerRef} >
      {showCongrats && (
        <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in'>
          <div className='bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center relative animate-scale-up'>
            <button 
              onClick={() => setShowCongrats(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl'
            >
              <IoClose />
            </button>
            
            <div className='mb-6'>
              <div className='w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center animate-bounce-slow'>
                <FaTrophy className='text-white text-6xl' />
              </div>
              <div className='flex justify-center gap-2 mt-4'>
                <MdCelebration className='text-4xl text-yellow-500 animate-wiggle' />
                <MdCelebration className='text-4xl text-purple-500 animate-wiggle' style={{ animationDelay: '0.2s' }} />
                <MdCelebration className='text-4xl text-pink-500 animate-wiggle' style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            <h2 className='text-4xl font-bold text-gray-800 mb-4'>Congratulations!</h2>
            <p className='text-xl text-gray-600 mb-2'>
              {courseContent?.messages?.congratulations || 'You have completed the course!'}
            </p>
            <p className='text-lg text-gray-500 mb-8'>
              You've finished all {completed.length} lectures in "{courseContent?.landingPageDetails?.title}"
            </p>

            <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6'>
              <p className='text-sm text-gray-700 mb-3'>Course created by</p>
              <p className='font-bold text-2xl text-gray-800'>{courseContent?.author?.username}</p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowCongrats(false)}
                className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'
              >
                Continue Learning
              </button>
              <button
                onClick={() => window.location.href = '/learning'}
                className='flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all'
              >
                My Courses
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <CourseNavbar title={courseContent?.landingPageDetails?.title} /> */}
      <header className='bg-gray-900 text-white sticky top-0 z-20 shadow-lg'>
        <div className='px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            {/* <button onClick={() => window.history.back()} className='hover:bg-gray-800 p-2 rounded-lg transition-colors'>
              <FaArrowLeft className='text-xl' />
            </button> */}
            <div>
              <h1 className='font-bold text-lg line-clamp-1'>{courseContent?.landingPageDetails?.title}</h1>
              <div className='flex items-center gap-4 text-sm text-gray-300 mt-1'>
                <span className='flex items-center gap-1'>
                  <FaStar className='text-yellow-400' />
                  {courseContent?.rating?.rating || 'N/A'}
                </span>
                <span>{completed.length} / {courseContent?.sections?.reduce((acc, s) => acc + (s.curriculum?.length || 0), 0)} completed</span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='hidden md:flex flex-col items-end'>
              <div className='bg-gray-800 rounded-full h-2 w-32'>
                <div className='bg-green-500 h-2 rounded-full transition-all' style={{ width: `${completionPercentage()}%` }}></div>
              </div>
              <span className='text-xs text-gray-400 mt-1'>{completionPercentage()}% Complete</span>
            </div>
          </div>
        </div>
      </header>
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
                : <div className='h-[500px] flex items-center justify-center text-gray-500'><p>Select a lecture to begin</p></div>
            }
          </div>
          <span className='w-full flex justify-between items-center text-xl py-5 px-10 bg-slate-100 border-b'>
            <span className='w-[70%] font-bold'>{courseContent?.landingPageDetails?.subtitle}</span>
            {selected && (
              <button
                onClick={() => updateCompletion(selected.currId)}
                disabled={completed.includes(selected.currId)}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  completed.includes(selected.currId)
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <FaCheckCircle />
                {completed.includes(selected.currId) ? 'Completed' : 'Mark Complete'}
              </button>
            )}
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
            {renderDescription()}
          </div>


          <Footer />
        </div>

        {isSidebar ? (
          <aside className='fixed right-0 top-[73px] bottom-0 w-96 bg-white border-l shadow-lg overflow-y-auto z-10'>
            <div className='sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10'>
              <h3 className='font-bold text-lg'>Course Content</h3>
              <button onClick={() => setIsSidebar(false)} className='p-2 hover:bg-gray-100 rounded-lg'>
                <IoClose className='text-xl' />
              </button>
            </div>

            <div className='p-4'>
              {courseContent?.sections?.map((section, i) => (
                <div key={section.id} className='mb-2'>
                  <button
                    onClick={() => handleOpen(opened.includes(section.id) ? 'close' : 'open', section.id)}
                    className='w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg flex items-center justify-between font-semibold text-left transition-colors'
                  >
                    <span>Section {i + 1}: {section.title}</span>
                    {opened.includes(section.id) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {opened.includes(section.id) && (
                    <div className='mt-2 space-y-1'>
                      {section.curriculum?.map((curr) => (
                        <button
                          key={curr.currId}
                          onClick={() => setSelected(curr)}
                          className={`w-full px-4 py-3 text-left rounded-lg transition-all flex items-center gap-3 ${
                            selected?.currId === curr.currId
                              ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          {completed.includes(curr.currId) ? (
                            <FaCheckCircle className='text-green-600 flex-shrink-0' />
                          ) : curr.content_type === 'video' ? (
                            <FaCirclePlay className='text-gray-400 flex-shrink-0' />
                          ) : (
                            <BsFileEarmark className='text-gray-400 flex-shrink-0' />
                          )}
                          <span className='flex-1 text-sm'>{curr.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        ) : (
          <button
            onClick={() => setIsSidebar(true)}
            className='fixed right-0 top-24 bg-gray-900 text-white px-4 py-3 rounded-l-lg hover:bg-gray-800 transition-colors z-10 shadow-lg'
          >
            <span className='text-sm font-semibold'>Course Content</span>
          </button>
        )}

      </div>


    </div>
  )
}

export default page
