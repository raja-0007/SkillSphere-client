import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { useTeacherContext } from '@contexts/TeacherContext'

function Messages({ activeSection }) {
    const { messages, setMessages, filledStatus, setFilledStatus } = useTeacherContext()
    const [saved, setSaved] = useState(false)
    const saveIntoFilled = () => {
        // console.log('messages....', messages)
        if (!filledStatus.includes('course messsages') && !Object.values(messages).includes('')) {
            setFilledStatus([...filledStatus, 'course messsages'])
            setSaved(true)
        }
        else if(Object.values(messages).includes('')){
            alert('please fill all the fields')
        }
    }
    

    useEffect(() => {
        
        if (filledStatus.includes('course messsages')) {
            setSaved(true)
        }
        else setSaved(false)
    }, [])
    return (
        <SectionLayout>
            <SectionHeader activeSection={activeSection} />
            <div className='flex flex-col gap-8 p-10 pb-20 pt-5'>
                <div className='w-[80%]'>
                    <p>Write messages to your students (optional) that will be sent automatically when they join or complete your course to encourage students to engage with course content. If you do not wish to send a welcome or congratulations message, leave the text box blank.</p>
                </div>
                {Object.keys(messages).map((item, i) => {
                    return (
                        <div key={i}>
                            <label htmlFor={item} className='font-bold capitalize'>{item} message</label><br />
                            <textarea name="" id={item} className='h-[100px] p-2  w-[90%] resize-none border border-black' placeholder={`enter a ${item} message to your students`} value={messages[item]} onChange={(e) => {setMessages({ ...messages, [item]: e.target.value }); setSaved(false)}}></textarea>
                        </div>
                    )
                })}
                {/* <div>
                    <label htmlFor="welcome" className='font-bold capitalize'>welcome message</label><br />
                    <textarea name="" id="welcome" className='h-[100px] p-2  w-full resize-none border border-black' placeholder='enter a welcome message to your students'></textarea>
                </div>
                <div>
                    <label htmlFor="congratulations" className='font-bold capitalize'>congratulations message</label><br />
                    <textarea name="" id="congratulations" className='h-[100px] p-2 w-full resize-none border border-black' placeholder='enter a congratulations message to your students'></textarea>
                </div> */}
                {!saved && <span onClick={saveIntoFilled} className='w-[max-content] p-2 px-3 bg-slate-800 text-white font-semibold'>save</span>
                }
            </div>
        </SectionLayout>
    )
}

export default Messages
