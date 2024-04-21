import React from 'react'
import { IoMdCheckmark } from "react-icons/io";


function Sidebar({setActiveSection}) {
    const sections = [
        {
            name:'plan your course',
            subsections:['intended learners', 'course structure', 'setup & test video']
        },
        {
            name:'create your content',
            subsections:['film & edit', 'curriculum']
        },
        {
            name:'publish your course',
            subsections:['course landing page', 'pricing','course messsages']
        }
    ]
  return (
    <div className='w-[25%] flex flex-col gap-14'>
      {sections.map((section,i)=>{
        return (
            <div className='flex flex-col gap-3' key={i}>
                <span className='font-semibold'>{section.name}</span>
                {section.subsections.map((subsec, sub_i)=>{
                    return (
                        <span key={sub_i} className='flex items-center gap-2' onClick={()=>setActiveSection(subsec)}>
                            <span className={`p-1 rounded-full ${sub_i%2 !=0 ? 'bg-slate-700':'bg-gray-300'} text-white`}>
                            <IoMdCheckmark/>
                            </span>
                             {subsec}</span>
                    )
                })}
            </div>
        )
      })}
    </div>
  )
}

export default Sidebar
