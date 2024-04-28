import React from 'react'
import QandA from './QandA'
import SectionHeader from '../SectionHeader'
import SectionLayout from '../SectionLayout'

function CourseStructure({activeSection}) {
    const QandAs = [
        {
            q: 'Start with your goals.',
            a: 'Setting goals for what learners will accomplish in your course (also known as learning objectives) at the beginning will help you determine what content to include in your course and how you will teach the content to help your learners achieve the goals.'
        },
        {
            q: 'Mix and match your lecture types.',
            a: 'Decide what skills you’ll teach and how you’ll teach them. Group related lectures into sections. Each section should have at least 3 lectures, and include at least one assignment or practical activity. Learn more.'

        },
        {
            q: 'Introduce yourself and create momentum.',
            a: 'People online want to start learning quickly. Make an introduction section that gives learners something to be excited about in the first 10 minutes.'

        }
        ,
        {
            q: 'Sections have a clear learning objective.',
            a: "Introduce each section by describing the section's goal and why it’s important. Give lectures and sections titles that reflect their content and have a logical flow."

        }
        ,
        {
            q: 'Lectures cover one concept.',
            a: "A good lecture length is 2-7 minutes to keep students interested and help them study in short bursts. Cover a single topic in each lecture so learners can easily find and re-watch them later."
        },
        {
            q: 'Mix and match your lecture types.',
            a: "Alternate between filming yourself, your screen, and slides or other visuals. Showing yourself can help learners feel connected."
        },
        {
            q: 'Practice activities create hands-on learning.',
            a: "Help learners apply your lessons to their real world with projects, assignments, coding exercises, or worksheets."
        }
    ]
    return (

        <SectionLayout>
            <SectionHeader activeSection={activeSection}/>
            <div className='w-full px-10 flex items-center bg-slate-50 '>
                <div className='w-[65%] pe-14'>
                    <p className='text-xl font-semibold  mb-5 '>There's a course in you. Plan it out.</p>
                    <p>Planning your course carefully will create a clear learning path for students and help you once you film. Think down to the details of each lecture including the skill you’ll teach, estimated video length, practical activities to include, and how you’ll create introductions and summaries.
                    </p>
                </div>
                <div className='w-[35%] shadow-md shadow-gray-300 mt-7 mb-7 gap-7 flex flex-col items-center bg-white pt-7'>
                    <img src={`${activeSection == 'course structure' ? '/images/library.jpg':'/images/video-help.jpg'}`} alt="" />
                    <div className='text-center pb-7 px-5'>
                        <p className='text-xl font-semibold mb-6'>Our library of resources</p>
                        <p>
                            Tips and guides to structuring a course students love
                        </p>
                    </div>
                </div>
            </div>
            <div className='pt-14 px-10 pe-20 flex flex-col gap-6'>
                <p className='text-2xl font-bold'>Tips</p>
                {QandAs.map((qA, i) => {
                    return (<QandA q={qA.q} a={qA.a} />)
                })}
            </div>
            <div className='py-14 px-10 pe-20 flex flex-col gap-6'>
                <p className='font-bold text-2xl'>Requirements</p>
                <ul className='list-disc px-5'>
                    <li className='list-item'>See the complete list of course quality requirements
                    </li>
                    <li className='list-item'>Your course must have at least five lectures
                    </li>
                    <li className='list-item'>All lectures must add up to at least 30+ minutes of total video
                    </li>
                    <li className='list-item'>Your course is composed of valuable educational content and free of promotional or distracting materials
                    </li>


                </ul>
            </div>
        </SectionLayout>
    )
}

export default CourseStructure
