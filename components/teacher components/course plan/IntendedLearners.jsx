import React, { useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import SectionHeader from '../SectionHeader';
import SectionLayout from '../SectionLayout';

function IntendedLearners({activeSection}) {
    const [outcomes, setOutcomes] = useState(['', '', '', ''])
    const [requirements, setRequirements] = useState([''])
    const [intended, setIntended] = useState([''])
    const addField = (type) => {
        if (type == 'outcome') {
            setOutcomes([...outcomes, ''])

        }
        else if (type == 'requirement') {
            setRequirements([...requirements, ''])

        }
        else if (type == 'intended') {
            setIntended([...intended, ''])

        }
    }


    const changeHandler = (e, index, type) => {
        if (type == 'outcome') {
            const newOutcomes = [...outcomes]; 
            newOutcomes[index] = e.target.value; 
            setOutcomes(newOutcomes);
        }
        else if (type == 'requirement') {
            const newRequirements = [...requirements]; 
            newRequirements[index] = e.target.value; 
            setRequirements(newRequirements);
        }
        else if (type == 'intended') {
            const newintended = [...intended]; 
            newintended[index] = e.target.value; 
            setIntended(newintended);
        }

    }
    return (
        <SectionLayout>
            <SectionHeader activeSection={activeSection}/>
            <div className='flex flex-col px-10 pe-20 gap-5'>
                <span className='text-sm'>
                    The following descriptions will be publicly visible on your Course Landing Page and will have a direct impact on your course performance.
                    These descriptions will help learners decide if your course is right for them.
                </span>
                <div >
                    <p className='font-semibold mt-5'>What will students learn in your course?</p>
                    <p >You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course.</p>
                </div>
                <form className='flex flex-col gap-5'>
                    {outcomes.map((outcome, i) => {
                        return (
                            <span key={i}>
                                <input type="text" className='border-[1px] border-black w-[90%] px-2 py-3' value={outcome} placeholder='enter the course outcome' name="" id="" onChange={(e) => changeHandler(e, i, 'outcome')} />
                            </span>
                        )
                    })}
                    {/* <span onClick={() => console.log(outcomes)}>print</span> */}
                    <span onClick={() => addField('outcome')} className='flex gap-1 items-center font-bold text-violet-800'><IoMdAdd size={'1.5em'} />add more to your response </span>
                </form>

                <div >
                    <p className='font-semibold mt-5'>What are the requirements or prerequisites for taking your course?</p>
                    <p >List the required skills, experience, tools or equipment learners should have prior to taking your course.
                        If there are no requirements, use this space as an opportunity to lower the barrier for beginners.</p>
                </div>
                <form className='flex flex-col gap-5'>
                    {requirements.map((requirement, i) => {
                        return (
                            <span key={i}>
                                <input type="text" className='border-[1px] border-black w-[90%] px-2 py-3' value={requirement} placeholder='enter the course requirement' name="" id="" onChange={(e) => changeHandler(e, i, 'requirement')} />
                            </span>
                        )
                    })}
                    
                    <span onClick={() => addField('requirement')} className='flex gap-1 items-center font-bold text-violet-800'><IoMdAdd size={'1.5em'} />add more to your response </span>
                </form>


                <div >
                    <p className='font-semibold mt-5'>Who is this course for?</p>
                    <p >
                        Write a clear description of the intended learners for your course who will find your course content valuable.
                        This will help you attract the right learners to your course.</p>
                </div>
                <form className='flex flex-col gap-5 mb-14'>
                    {intended.map((intended, i) => {
                        return (
                            <span key={i}>
                                <input type="text" className='border-[1px] border-black w-[90%] px-2 py-3' value={intended} placeholder='enter the course intended' name="" id="" onChange={(e) => changeHandler(e, i, 'intended')} />
                            </span>
                        )
                    })}
                    {/* <span onClick={() => console.log(outcomes,requirements, intended)}>print</span> */}
                    <span onClick={() => addField('intended')} className='flex gap-1 items-center font-bold text-violet-800'><IoMdAdd size={'1.5em'} />add more to your response </span>
                </form>

            </div>
        </SectionLayout>
    )
}

export default IntendedLearners
