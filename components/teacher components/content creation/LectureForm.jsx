import React, { useState } from 'react'

function LectureForm({addCurrItem, setIsCurrForm, setSelectedType, sectId}) {
    const [title, setTitle] = useState('')
    return (
        <div className='flex w-full justify-between gap-5'>
            <form className='flex gap-2 items-center' onSubmit={(e)=>{e.preventDefault(); addCurrItem(title, sectId); setTitle('');}}>
                <label htmlFor="title" className='w-[max-content]'>New Lecture:</label>
                <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} name="" placeholder='Enter a title' className='border w-[30rem] border-black py-1 px-2 outline-none' id="title" />
            </form>
            <div className='flex justify-start items-center gap-3 font-semibold'>
                <span className='cursor-pointer' onClick={()=>{setIsCurrForm(''); setSelectedType(''); setTitle('');}}>cancel</span>
                <button type='submit' className='py-1 px-2 bg-slate-800 text-white cursor-pointer' >add</button>
            </div>
        </div>
    )
}

export default LectureForm
