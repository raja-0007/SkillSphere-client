import React from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import { FaStar } from "react-icons/fa";
import Link from 'next/link';


function CourseNavbar({ title }) {
    return (
        <div className='w-full bg-slate-800 py-2 px-10 h-[7vh] flex items-center justify-between text-white'>
            <div className='flex items-center gap-8'>

                <Link href={'/'} className="text-2xl font-bold self-center " >SkillSphere</Link>
                <span className='font-medium'>{title}</span>
            </div>
            <div className='flex items-center justify-end gap-20'>
                <span className='flex items-center'><FaStar className='text-white opacity-40 me-1' />leave a rating</span>
                <div className='p-2 border border-white text-white h-[max-content] hover:bg-slate-700 cursor-pointer'><span ><SlOptionsVertical /></span></div>
            </div>

            

        </div>
    )
}

export default CourseNavbar
