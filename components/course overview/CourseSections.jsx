import { useHomeContext } from '@contexts/HomeContext'
import React, { useEffect, useState } from 'react'
import { LuDot } from "react-icons/lu";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaRegFile } from "react-icons/fa6";
import { PiMonitorPlay } from "react-icons/pi";


function CourseSections() {
    const { overviewCourse } = useHomeContext()
    const [openSections, setOpenSections] = useState([])
    const [isExpandAll, setIsExpandAll] = useState(false)
    const totalLectures = (sections) => {
        let total = 0
        sections.forEach(sect => {
            total += sect.curriculum.length
        });

        return total
    }
    const openHandler = (id) => {
        if (!openSections.includes(id)) {
            setOpenSections([...openSections, id])
        }
        else {
            // console.log('removing')
            // console.log(openSections.includes(id))
            // const sectsss = [...openSections]
            // const sects = sectsss.filter(sec=>sec.id !== id)
            // console.log('sects>>>', sects)
            setOpenSections(openSections.filter(sec => sec !== id))
        }
    }
    const GetIcon = (type) => {
        if (type == 'article') {
            return <FaRegFile />
        }
        else if (type == 'video') {
            return <PiMonitorPlay />
        }
    }
    const allOpenClose=()=>{
        if(!isExpandAll){
            var sects = [...openSections]
            overviewCourse.sections.forEach(sect => {
                if(!sects.includes(sect.id)) sects.push(sect.id)
            });
            setOpenSections([...sects])
            setIsExpandAll(true)
        }
        else{
            setOpenSections([])
            setIsExpandAll(false)

        }
    }
    // useEffect(() => {
    //     console.log(openSections)
    // }, [openSections])
    return (
        <div className='w-full'>
            <span className='text-2xl font-bold'>Course Content</span>
            <p className='text-sm text-gray-500 justify-between flex items-center mt-5 w-full mb-2'>
                <span className='flex items-center'>
                    <span>{overviewCourse.sections.length} sections</span><LuDot /><span>{totalLectures(overviewCourse.sections)} lectures</span>
                </span>
                <span className='self-end font-bold text-violet-500' onClick={allOpenClose}>Expand all sections</span>
            </p>
            <div className="flex flex-col">

                {overviewCourse.sections.map((sect, i) => {
                    return (
                        <div key={i}>
                            <div className='w-full px-3 py-2 bg-slate-100 border flex items-center justify-between' onClick={() => openHandler(sect.id)}>
                                <span className='font-bold flex items-center'>{openSections.includes(sect.id) ? <FaAngleUp className='me-2' /> : <FaAngleDown className='me-2' />}{sect.title}</span>
                                <span className='text-sm text-gray-500'>{sect.curriculum.length} lectures</span>
                            </div>
                            {openSections.includes(sect.id) && <div className='flex flex-col '>
                                {sect.curriculum.map((curr, cur_i) => {
                                    return (
                                        <span key={cur_i} className='flex items-center px-3 py-2 gap-2'>{GetIcon(curr.content_type)}{curr.title}</span>
                                    )
                                })}
                            </div>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CourseSections
