import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import Sidebar from '../teacher components/Sidebar';
import IntendedLearners from '../teacher components/course plan/IntendedLearners';
import { useHomeContext } from '@/context/HomeContext';
import CourseStructure from '../teacher components/course plan/CourseStructure';
import Curriculum from '../teacher components/content creation/Curriculum';
import LandingPage from '../teacher components/landing page/LandingPage';
import Pricing from '../teacher components/pricing/Pricing';
import Messages from '../teacher components/messages/Messages';
import TeacherProvider from '@/context/TeacherContext';



function TeacherMode() {
  const [activeSection, setActiveSection] = useState('intended learners')
  const {setActive} = useHomeContext()
  return (
    <TeacherProvider>
      <div className='flex flex-col items-center'>
      <div className='w-full bg-slate-800 text-gray-400 py-2 px-4 h-[8vh] shadow-md  shadow-gray-300 flex items-center ' >
        <span className='flex items-center gap-2 cursor-pointer' onClick={()=>setActive('home')}><FaArrowLeftLong/><span className='text-sm'>back to courses</span></span>
      </div>
      <div className='flex w-full px-28 py-10'>
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
        {activeSection == 'intended learners' ? <IntendedLearners activeSection={activeSection}/>
        :(activeSection == 'course structure' || activeSection == 'film & edit') ? <CourseStructure activeSection={activeSection}/>
        :(activeSection == 'curriculum') ? <Curriculum activeSection={activeSection}/>
        :(activeSection == 'course landing page') ? <LandingPage activeSection={activeSection}/>
        :(activeSection == 'pricing') ? <Pricing activeSection={activeSection}/>
        :(activeSection == 'course messsages') && <Messages activeSection={activeSection}/>

      }
      </div>
    </div>
    </TeacherProvider>
    
  )
}

export default TeacherMode
