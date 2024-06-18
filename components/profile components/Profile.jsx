import { useHomeContext } from '@contexts/HomeContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Profile() {
    const { userDetails } = useHomeContext()
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
        <div className='px-32 py-10'>
            <p className='text-3xl font-bold'>Profile & Settings</p>
            <div className='flex gap-10 items-center border-b mt-10'>
                <span className={`${activeProfile == 'learner' && 'font-bold border-b-2 border-black'}`} onClick={() => setActiveProfile('learner')}>SkillSphere profile</span>
                <span className={`${activeProfile == 'teacher' && 'font-bold border-b-2 border-black'}`} onClick={() => setActiveProfile('teacher')}>Instructor Dashboard</span>
            </div>
            {activeProfile == 'learner' ?
                <>
                    <form className='flex flex-wrap justify-between px-20 mt-10 gap-10'>
                        <div>
                            <label htmlFor="firstname">First name</label><br />
                            <input type="text" name="" id="firstname"
                                placeholder='Enter First name'
                                value={userDetails?.userDetails?.username} className='w-[500px] py-2 px-3 border border-black' />
                        </div>
                        <div>
                            <label htmlFor="lastname">Last name</label><br />
                            <input type="text" name="" id="lastname"
                                placeholder='Enter last name'
                                value={userDetails?.userDetails?.lastname} className='w-[500px] py-2 px-3 border border-black' />
                        </div>
                        <div >
                            <label htmlFor="about">About</label><br />
                            <textarea name="" id="about" className='w-[500px] h-[80px] py-2 px-3 resize-none border border-black' value={userDetails?.userDetails?.lastname} placeholder='Write about yourself'></textarea>

                        </div>
                        <div>
                            <label htmlFor="email">Email</label><br />
                            <input type="text" name="" id="email"
                                placeholder='Enter last name'
                                value={userDetails?.userDetails?.email} disabled className='w-[500px] py-2 px-3 border border-black' />
                        </div>

                    </form>
                    <button className='p-3 bg-slate-800 text-white font-semibold ms-20 mt-20'>save</button>
                </>
                :
                <section id='teacherDashboard' className=' flex flex-wrap gap-10 px-10  py-10'>
                    <div className='w-full text-2xl font-bold'>Courses Published</div>
                    {teacherCourses.map((item, i) => {
                        return (
                            <div key={i} className='flex flex-col gap-1 border items-center text-justify pb-2 w-[350px]'>
                                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} className='w-[350px]' alt="" />
                                
                                <p className='font-bold px-2'>{item.landingPageDetails.title}</p>
                                <p className='text-xs px-2 text-gray-600 font-semibold'>{item.landingPageDetails.subtitle}</p>
                                
                            </div>
                        )
                    })}
                </section>
            }

        </div>
    )
}

export default Profile
