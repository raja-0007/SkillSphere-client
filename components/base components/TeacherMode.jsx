import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import Sidebar from '../teacher components/Sidebar';
import IntendedLearners from '../teacher components/course plan/IntendedLearners';
import { useHomeContext } from '@/context/HomeContext';


function TeacherMode() {
  const [activeSection, setActiveSection] = useState('intended learners')
  const {setActive} = useHomeContext()
  return (
    <div className='flex flex-col items-center'>
      <div className='w-full bg-slate-800 text-gray-400 py-2 px-4 h-[8vh] shadow-md  shadow-gray-300 flex items-center ' >
        <span className='flex items-center gap-2 cursor-pointer' onClick={()=>setActive('home')}><FaArrowLeftLong/><span className='text-sm'>back to courses</span></span>
      </div>
      <div className='flex w-full px-40 py-20'>
        <Sidebar setActiveSection={setActiveSection}/>
        {activeSection == 'intended learners' && <IntendedLearners/>}
      </div>
    </div>
  )
}

export default TeacherMode
