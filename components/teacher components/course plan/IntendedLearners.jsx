import React, { useState } from 'react'

function IntendedLearners() {
    const [outcomes, setOutcomes] = useState(['', '', '', ''])
    const addOutcome = () => {
        setOutcomes([...outcomes, ''])
    }
    const changeHandler = (e, index) => {
        const newOutcomes = [...outcomes]; // Create a copy of the outcomes array
        newOutcomes[index] = e.target.value; // Update the value at the specified index
        setOutcomes(newOutcomes);
    }
    return (
        <div className='w-full flex flex-col gap-5 shadow-lg rounded-md shadow-gray-400'>
            <div className='w-full h-[10vh] flex items-center px-10 border-b-2 border-gray-200'>
                <span className='text-lg font-bold'>Intended Learners</span>
            </div>
            <div className='flex flex-col px-10 pe-20 gap-5'>
                <span className='text-sm'>
                    The following descriptions will be publicly visible on your Course Landing Page and will have a direct impact on your course performance.
                    These descriptions will help learners decide if your course is right for them.
                </span>
                <div >
                    <p className='font-semibold'>What will students learn in your course?</p>
                    <p >You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course.</p>
                </div>
                <form className='flex flex-col gap-5'>
                    {outcomes.map((outcome, i) => {
                        return (
                            <span key={i}>
                                <input type="text" className='border-[1px] border-black w-[90%] px-2 py-2' value={outcome} placeholder='enter the course outcome' name="" id="" onChange={(e) => changeHandler(e, i)} />
                            </span>
                        )
                    })}
                    <span onClick={() => console.log(outcomes)}>print</span>
                    <span onClick={addOutcome}>+ add new </span>
                </form>
            </div>
        </div>
    )
}

export default IntendedLearners
