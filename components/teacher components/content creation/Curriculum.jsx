import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { BsFileEarmark } from "react-icons/bs";
import { FaCirclePlay } from "react-icons/fa6";
import LectureForm from './LectureForm';
import { FaAngleDown } from "react-icons/fa6";




function Curriculum({ activeSection }) {
    const [dismiss, setDismiss] = useState(false)
    const [selectedType, setSelectedType] = useState('')
    const [isSectForm, setIsSectForm] = useState(false)
    const [isCurrForm, setIsCurrForm] = useState('')

    const contentIcons = {
        article: <BsFileEarmark />,
        video: <FaCirclePlay />
    }
    const [currDetails, setCurrDetails] = useState({
        title: '',
        type: '',
        content: '',
        content_type: '',
        resources: '',
        description: ''
    })
    const [sections, setSections] = useState([
        {
            id: 'section_1',
            title: 'Introduction',
            objective: 'learn something you fool!',
            
            curriculum: [
                {
                    title: 'Introduction',
                    type: 'lecture',
                    content: '',
                    content_type: 'video',
                    resources: '',
                    description: '',
                    currId:'sect1cur1'
                }]
        }])
    const [sectionDetails, setSectionDetails] = useState({
        title: '',
        objective: ''
    })



    const addSection = () => {
        if (!Object.values(sectionDetails).includes('')) {
            setSections([...sections,
            {
                id: 'section_' + sections.length + 1,
                title: sectionDetails.title,
                objective: sectionDetails.objective,
                curriculum: []
            }])
            setSectionDetails({
                title: '',
                objective: ''
            })
            setIsSectForm(false)
        }
        else {
            alert('enter all fields')
        }

    }
    
    const addCurrItem = (title, id) => {
        if (title !== '') {
            
            const curriculum = {
                title: title,
                type: selectedType,
                content: '',
                content_type: 'article',
                resources: '',
                description: '',
                currId:'sect'+id.split('_')[1]+'cur'+(sections.filter(section => section.id == id)[0].curriculum.length+1)
            }
            setSections(sections.map(section => section.id == id ? { ...section, curriculum: [...section.curriculum,curriculum] } : section))
            setIsCurrForm('')
            setSelectedType('')
        }
        else alert('enter title to add curriculum item')
    }

    const HandleCurr=()=>{
        if(isCurrForm !==''){
            setIsCurrForm('')
        }
        else(
            setIsCurrForm(id)
        )
        
    }


    return (
        <SectionLayout>
            <SectionHeader activeSection={activeSection} />
            <div className='px-10 flex flex-col gap-10'>
                {!dismiss && <div className='border-2 border-dashed  p-5 py-3'>
                    <div className='flex  items-start'>
                        <BsFillInfoCircleFill size={'2em'} className='text-slate-800 me-4' />
                        <p className='font-bold '>Here’s where you add course content—like lectures, course sections, assignments, and more. Click a + icon on the left to get started.</p>

                    </div>
                    <div className='p-2 mt-2 ms-10 px-4 bg-slate-800 text-white w-[max-content] cursor-pointer' onClick={() => setDismiss(true)}>Dismiss</div>
                </div>}
                <div>
                    <p className='mb-2'>Start putting together your course by creating sections, lectures and practice (quizzes, coding exercises and assignments).</p>

                    Start putting together your course by creating sections, lectures and practice activities (quizzes, coding exercises and assignments). Use your course outline to structure your content and label your sections and lectures clearly. If you’re intending to offer your course for free, the total length of video content must be less than 2 hours.
                </div>

                <div className='flex flex-col gap-6 '>
                    {sections.map((section, i) => {
                        return (
                            <div className='bg-slate-100 border border-black w-full p-5 flex flex-col gap-3' key={i}>
                                <span>section {i + 1}: {section.title}</span>
                                <div className='w-[95%] self-end flex flex-col gap-4'>
                                    {section?.curriculum?.length > 0 && section?.curriculum.map((item, item_i) => {
                                        return (
                                            <div className='w-full flex p-2 bg-white border border-black' key={item_i}>
                                                <span className='flex w-full items-center justify-between gap-2 pe-10'>
                                                    <div className='flex gap-2'>
                                                        Lecture {item_i + 1}:<span className=' flex items-center gap-1'>{contentIcons[item.content_type]} {item.title}</span>
                                                    </div>
                                                    <div className='flex items-center gap-5'>
                                                        {item.content == '' && <span className='p-1 px-2 border flex items-center w-[max-content] border-black'><IoMdAdd className='text-[1.2em]' />content</span>}
                                                        <FaAngleDown className='text-[1.2em]' onClick={()=>console.log('loggedddd',sections)}/>
                                                    </div>
                                                </span>
                                            </div>
                                        )
                                    })}
                                    <span
                                        className={`font-semibold  flex  items-center  ${isCurrForm !== section.id && 'border bg-white border-black  w-[max-content] p-1 px-2 '}`}>
                                        <IoMdAdd size={'1.5em'} onClick={() => { HandleCurr(section.id); setSelectedType('') }} className={`${isCurrForm == section.id && 'transform -rotate-45 -translate-x-8'} cursor-pointer transition-all duration-300`} />
                                        {isCurrForm !== section.id ? <span className='ps-2 cursor-pointer' onClick={() => { setIsCurrForm(section.id);}}>
                                            curriculum</span>
                                            :
                                            <div className={`w-full h-[max-content] mt-5 p-2 px-3  bg-white border-black ${selectedType !== '' ? 'border ' : 'border border-dashed'}`}>
                                                {selectedType == '' ? <div className='flex items-center  justify-center gap-10'>
                                                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => setSelectedType('lecture')}>
                                                        <IoMdAdd className='text-[1.3em]' />
                                                        <span>Lecture</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 cursor-pointer'>
                                                        <IoMdAdd className='text-[1.3em]' />
                                                        <span>Quiz</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 cursor-pointer'>
                                                        <IoMdAdd className='text-[1.3em]' />
                                                        <span>Assignment</span>
                                                    </div>
                                                </div>
                                                    : selectedType == 'lecture' && <LectureForm addCurrItem={addCurrItem} sectId={section.id} setIsCurrForm={setIsCurrForm} setSelectedType={setSelectedType} />
                                                }
                                            </div>}
                                    </span>


                                </div>

                            </div>
                        )
                    })}
                    <span onClick={() => {
                        setIsSectForm(!isSectForm);
                        setSectionDetails({ title: '', objective: '' })
                    }}
                        className={`p-1 font-semibold px-2 w-[max-content] flex  items-center ${!isSectForm && 'bg-slate-100 border border-black'}`}><IoMdAdd size={'1.5em'} className={`${isSectForm && 'transform -rotate-45 -translate-x-3'} transition-all duration-300`} />{!isSectForm && 'section'}</span>
                    {isSectForm && <form className='flex flex-col gap-3 border-[1px] p-5 border-black '>
                        <span className='font-semibold'>new section:</span>
                        <input type="text"
                            className='border-[1px] border-black p-1 px-2 w-full'
                            placeholder='Enter a Title' value={sectionDetails.title} onChange={(e) => setSectionDetails({ ...sectionDetails, title: e.target.value })} name="" id="" />
                        <span className='w-full'>
                            <label htmlFor="whatfor" className='font-semibold'>What will students be able to do at the end of this section?</label><br />
                            <input type="text"
                                className='border-[1px] border-black p-1 px-2 w-full'
                                name="" placeholder='Enter a Learning Objective' value={sectionDetails.objective} onChange={(e) => setSectionDetails({ ...sectionDetails, objective: e.target.value })} id="whatfor" />
                        </span>

                        <div className='flex justify-start gap-3 font-semibold'>
                            <span onClick={() => {
                                setIsSectForm(!isSectForm);
                                setSectionDetails({ title: '', objective: '' })
                            }}>cancel</span>
                            <span className='py-1 px-2 bg-slate-800 text-white' onClick={addSection}>add</span>
                        </div>
                    </form>}

                </div>

            </div>
        </SectionLayout>
    )
}

export default Curriculum
