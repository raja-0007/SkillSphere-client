import React from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'

function Messages({activeSection}) {
  return (
    <SectionLayout>
        <SectionHeader activeSection={activeSection}/>
        <div className='flex flex-col gap-8 p-10 pt-5'>
            <div className='w-[600px]'>
                <p>Write messages to your students (optional) that will be sent automatically when they join or complete your course to encourage students to engage with course content. If you do not wish to send a welcome or congratulations message, leave the text box blank.</p>
            </div>
            <div>
                <label htmlFor="welcome" className='font-bold capitalize'>welcome message</label><br />
                <textarea name="" id="welcome" className='h-[100px] p-2  w-full resize-none border border-black' placeholder='enter a welcome message to your students'></textarea>
            </div>
            <div>
                <label htmlFor="congratulations" className='font-bold capitalize'>congratulations message</label><br />
                <textarea name="" id="congratulations" className='h-[100px] p-2 w-full resize-none border border-black' placeholder='enter a congratulations message to your students'></textarea>
            </div>
            {/* <button type='button' className='w-[max-content] p-2 px-3 bg-slate-800 text-white font-semibold'>save</button> */}

        </div>
    </SectionLayout>
  )
}

export default Messages
