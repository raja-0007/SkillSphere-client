import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { IoIosInformationCircle } from "react-icons/io";
import { useTeacherContext } from '@/context/TeacherContext';


function LandingPage({ activeSection }) {
    const { landingDetails, setLandingDetails, filledStatus, setFilledStatus } = useTeacherContext()
    const [saved, setSaved] = useState(false)
    // const [landingDetails, setLandingDetails] = useState({
    //     title: '',
    //     subtitle: '',
    //     description: '',
    //     language: '',
    //     level: '',
    //     category: '',
    //     image: ''
    // })
    const languages = ['english', 'hindi', 'telugu']
    const levels = ['beginner level', 'intermediate level', 'expert level', 'all levels']
    const categories = ['web development', 'machine learning']
    const saveIntoFilled = () => {
        // console.log(landingDetails)
        if (!filledStatus.includes('course landing page')) {
            setFilledStatus([...filledStatus, 'course landing page'])
            setSaved(true)
        }
    }
    useEffect(() => {
        setSaved(false)
        if (filledStatus.includes('course landing page')) {
            setFilledStatus(filledStatus.filter(stat => stat !== 'course landing page'))
        }
    }, [landingDetails])
    return (
        <SectionLayout>
            <SectionHeader activeSection={activeSection} />
            <div className='flex flex-col px-10 gap-10 pb-10'>
                <p className='w-full pe-10 text-sm '>Your course landing page is crucial to your success on Udemy. If it’s done right, it can also help you gain visibility in search engines like Google. As you complete this section, think about creating a compelling Course Landing Page that demonstrates why someone would want to enroll in your course. Learn more about creating your course landing page and course title standards.</p>
                <form className='w-full flex flex-col gap-10'>
                    {Object.keys(landingDetails).slice(0, 3).map((item, i) => {
                        return (
                            <div key={i} className='flex flex-col gap-1 w-full'>
                                <label htmlFor={item} className='font-semibold'>course {item} :</label>
                                {item !== 'description' ? <input id={item} type='text' placeholder={`Insert your course ${item}`} value={landingDetails[item]} className='border outline-none border-black py-2 px-2 ' onChange={(e) => setLandingDetails({ ...landingDetails, [item]: e.target.value })} /> : <textarea name="" id={item} value={landingDetails[item]} placeholder='Insert your course description' className='w-full h-[70px] outline-none px-3 py-1 resize-none border border-black' onChange={(e) => setLandingDetails({ ...landingDetails, [item]: e.target.value })}></textarea>}
                            </div>
                        )
                    })}
                    <div className='w-full'>
                        <p className='font-bold mb-3'>basic info:</p>
                        <div className='w-full flex flex-wrap justify-center items-center gap-10'>
                            {Object.keys(landingDetails).slice(3, 6).map((item, i) => {
                                return (
                                    <div key={i} className='flex flex-col gap-1 '>
                                        <select name="" id="" className='border w-72 border-black outline-none py-2 px-4' onChange={(e) => setLandingDetails({ ...landingDetails, [item]: e.target.value })}>
                                            <option value="placeholder" className='text-gray-500'>-- select {item} --</option>
                                            {item == 'language' ? languages.map((lang, lang_i) => {
                                                return (
                                                    <option key={lang_i} value={lang}>{lang}</option>
                                                )
                                            })
                                                : item == 'level' ? levels.map((level, level_i) => {
                                                    return (
                                                        <option key={level_i} value={level}>{level}</option>
                                                    )
                                                })
                                                    : item == 'category' && categories.map((category, category_i) => {
                                                        return (
                                                            <option key={category_i} value={category}>{category}</option>
                                                        )
                                                    })
                                            }
                                        </select>

                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-6'>
                        <div className='w-full'>
                            <p className='flex items-center font-bold gap-2'>What is primarily taught in your course? <IoIosInformationCircle className='text-[1.3em] text-black' /></p>
                            <input type="text" name="" id="" value={landingDetails.primary} placeholder='ex., web development' onChange={(e) => setLandingDetails({ ...landingDetails, primary: e.target.value })} className='w-[60%] border border-black py-2 px-2' />
                        </div>
                        <div className='flex w-full justify-between items-start'>
                            <div className='w-[49%]'>
                                <p className='font-bold mb-3'>course image:</p>
                                <img src={`${landingDetails.image ? URL.createObjectURL(landingDetails.image) : '/images/placeholder.jpg'}`} alt="" className='w-full border border-gray-200' />
                            </div>
                            <div className='w-[50%] mt-7'>
                                <p className='text-sm'>Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.</p>
                                <div className='bg-slate-100 border mt-1 flex justify-between border-black w-full'>
                                    <label htmlFor="course_image" className='w-full flex justify-between'>
                                        <span className='w-[75%] p-2'>{landingDetails.image?.name || 'no file selected'}</span>
                                        <span className='py-2 w-[25%] bg-white text-center font-bold border-l border-black'>{landingDetails.image ? 'replace ':'upload '}file</span>
                                    </label>

                                    <input type="file" name="" id="course_image" className='hidden'  onChange={(e)=>setLandingDetails({...landingDetails,image:e.target.files[0]})} />

                                </div>
                            </div>
                        </div>
                    </div>

                </form>
                {!saved && <button type='button'
                    className='self-end w-[max-content] p-2 px-3 bg-slate-800 text-white font-semibold'
                    onClick={saveIntoFilled}
                >save</button>
                }            </div>
        </SectionLayout>
    )
}

export default LandingPage
