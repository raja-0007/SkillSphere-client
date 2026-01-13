import { useHomeContext } from '@contexts/HomeContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Profile({setFrom}) {
    const { userDetails, setOverviewCourse, setActive } = useHomeContext()
    const [activeProfile, setActiveProfile] = useState('learner')
    const [teacherCourses, setTeacherCourses] = useState([])
    useEffect(() => {
        const getTeacherCourses = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getTeacherCourses/${userDetails.userDetails._id}`)
                .then(res => { console.log(res.data); setTeacherCourses(res.data.courses) })
        }
        getTeacherCourses()
    }, [])
    return (
        <div className='px-32 py-10 min-h-[70vh] bg-neutral-50 dark:bg-neutral-950 transition-colors-smooth'>
            <p className='text-3xl font-bold text-neutral-900 dark:text-neutral-100'>Profile & Settings</p>
            <div className='flex gap-10 items-center border-b border-neutral-200 dark:border-neutral-700 mt-10'>
                <span className={`${activeProfile == 'learner' && 'font-bold border-b-2 border-primary-600 dark:border-primary-400'} cursor-pointer py-2 text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors-fast`} onClick={() => setActiveProfile('learner')}>SkillSphere profile</span>
                <span className={`${activeProfile == 'teacher' && 'font-bold border-b-2 border-primary-600 dark:border-primary-400'} cursor-pointer py-2 text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors-fast`} onClick={() => setActiveProfile('teacher')}>Instructor Dashboard</span>
            </div>
            {activeProfile == 'learner' ?
                <>
                    <form className='flex flex-wrap justify-between px-20 mt-10 gap-10'>
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">First name</label>
                            <input type="text" name="" id="firstname"
                                placeholder='Enter First name'
                                value={userDetails?.userDetails?.username} 
                                className='w-[500px] py-2 px-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors-fast' />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Last name</label>
                            <input type="text" name="" id="lastname"
                                placeholder='Enter last name'
                                value={userDetails?.userDetails?.lastname} 
                                className='w-[500px] py-2 px-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors-fast' />
                        </div>
                        <div >
                            <label htmlFor="about" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">About</label>
                            <textarea name="" id="about" 
                                className='w-[500px] h-[80px] py-2 px-3 resize-none border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors-fast' 
                                value={userDetails?.userDetails?.lastname} 
                                placeholder='Write about yourself'></textarea>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                            <input type="text" name="" id="email"
                                placeholder='Enter email'
                                value={userDetails?.userDetails?.email} 
                                disabled 
                                className='w-[500px] py-2 px-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md cursor-not-allowed' />
                        </div>
                    </form>
                    <button className='p-3 bg-primary-600 hover:bg-primary-700 text-primary-50 font-semibold ms-20 mt-20 rounded-md transition-colors-fast'>save</button>
                </>
                :
                <section id='teacherDashboard' className=' flex flex-wrap gap-10 px-10  py-10'>
                    <div className='w-full text-2xl font-bold text-neutral-900 dark:text-neutral-100'>Courses Published</div>
                    {teacherCourses.map((item, i) => {
                        return (
                            <div key={i} 
                            onClick={()=>{setOverviewCourse(item); setActive('course overview'); setFrom('profile')}}
                            className='flex flex-col gap-1 border border-neutral-200 dark:border-neutral-700 items-center pb-2 w-[350px] hover:scale-105 transition-all duration-200 cursor-pointer rounded-lg overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-lg hover:shadow-primary-500/10'>
                                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} className='w-[350px] h-48 object-cover' alt="" />
                                
                                <p className='font-bold px-2 text-neutral-900 dark:text-neutral-100'>{item.landingPageDetails.title}</p>
                                <p className='text-xs px-2 text-neutral-600 dark:text-neutral-400 font-semibold'>{item.landingPageDetails.subtitle}</p>
                                
                            </div>
                        )
                    })}
                </section>
            }

        </div>
    )
}

export default Profile
