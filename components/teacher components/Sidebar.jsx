import React from 'react'
import { IoMdCheckmark } from "react-icons/io";


function Sidebar({setActiveSection, activeSection}) {
    const sections = [
        {
            name:'plan your course',
            subsections:['intended learners', 'course structure']
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
    <div className='w-[25%] flex flex-col gap-12'>
      {sections.map((section,i)=>{
        return (
            <div className='flex flex-col gap-3' key={i}>
                <span className='font-semibold'>{section.name}</span>
                {section.subsections.map((subsec, sub_i)=>{
                    return (
                        <span key={sub_i} className={`flex cursor-pointer items-center py-1 px-3 ${activeSection == subsec ? 'border-l-4 border-slate-600' : 'border-l-4 border-white'}`} onClick={()=>setActiveSection(subsec)}>
                            <span className={`p-1 rounded-full ${sub_i%2 !=0 ? 'bg-slate-700':'bg-gray-300'} me-2  text-white`}>
                            <IoMdCheckmark/>
                            </span>
                             {subsec}</span>
                    )
                })}

            </div>
        )
      })}
      <button type='button' className='py-4 px-6 w-[max-content] bg-violet-500 text-white font-semibold'>Submit for review</button>
    </div>
  )
}

export default Sidebar
