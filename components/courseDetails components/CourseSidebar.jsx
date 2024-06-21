'use client'
import React, { useEffect, useState } from 'react'
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { PiMonitorPlay } from "react-icons/pi";
import { FaRegFile } from "react-icons/fa6";



function CourseSidebar({ courseContent, selected, setSelected, completed, scrollPos, setIsSidebar }) {
    const [opened, setOpened] = useState([])
    
    // console.log(selected)

{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/kUMe1FH4CHE?si=JwnajJuXCzngmC8b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
    
    // useEffect(()=>{
    //     if (Array.isArray(courseContent?.sections)) {
    //         // console.log('>>>>>>>>>>>>>>>>>>>>>>', courseContent?.sections[0])
    //         setSelected(courseContent?.sections[0]?.curriculum[0])
    //       }
    //     // console.log(selected)

    // },[courseContent])

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
        <div className={`w-[25%] ${scrollPos >= 40 ? 'h-[100vh] bottom-0' : 'h-[93vh] top-[7vh] '}  border-2  fixed  z-10 right-0 flex flex-col overflow-auto`}>
            <div className='border-b border-black py-3 flex justify-between items-center px-4'>

                <span className='font-bold'>Course Content</span> <span onClick={() => setIsSidebar(false)}><IoMdClose size={'1.5em'} /></span>
            </div>
            {courseContent?.sections?.map((sect, sect_i) => {

                return (
                    <div key={sect_i} className='border-b'>
                        <div className='p-3 flex justify-between items-start bg-slate-50  cursor-pointer' onClick={() => handleOpen(opened.includes(sect.id) ? 'close' : 'open', sect.id)}>
                            <span>

                                <p className='font-bold '>section {sect_i + 1}: {sect.title}</p>
                                <p className='text-xs text-gray-600'>0/{sect.curriculum.length} lectures</p>
                            </span>
                            <span >{opened.includes(sect.id) ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </div>
                        {opened.includes(sect.id) && <div className='flex flex-col '>
                            {sect.curriculum.map((curr, curr_i) => {
                                return (
                                    <div className={`py-3 px-3 flex items-center cursor-pointer ${selected.currId == curr.currId ? 'bg-gray-100 border-2 border-slate-700': 'border-2 border-white'} justify-between`} onClick={()=>setSelected(curr)} key={curr_i}>
                                        <div className='flex items-center'>
                                            <div className={`p-1 inline-block rounded-full ${completed.includes(curr.currId) ? 'bg-slate-700' : 'bg-gray-300'} me-2  text-white`}>
                                                <IoMdCheckmark />
                                            </div>
                                            {curr_i+1}. {curr.title}

                                        </div>
                                        <span>{curr.content_type == 'article' ? <FaRegFile size={'1.2em'}/> : <PiMonitorPlay size={'1.2em'}/>}</span>
                                    </div>
                                )
                            })}
                        </div>
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default CourseSidebar
