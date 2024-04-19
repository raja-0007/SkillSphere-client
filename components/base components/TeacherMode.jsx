import React from 'react'

function TeacherMode() {
  return (
    <div className='p-5 flex flex-col items-center gap-5'>
      <span className='text-red-500 font-semibold text-lg'> create course</span>
      <form className='flex flex-col gap-3 flex-wrap'>
        <div className='flex flex-col'>
            <span>title:</span>
            <input type="text" className='p-2 bg-slate-100' placeholder='enter title'/>
        </div>
        <div className='flex flex-col'>
            <span>catagory:</span>
            <input type="text" className='p-2 bg-slate-100' placeholder='enter title'/>
        </div>
        <div className='flex flex-col'>
            <span>number of chapters:</span>
            <input type="text" className='p-2 bg-slate-100' placeholder='enter title'/>
        </div>
        <button type='submit' className='p-3 bg-yellow-400 border-2 border-yellow-400 text-white hover:bg-white hover:text-yellow-400 mt-5'>done</button>
      </form>
    </div>
  )
}

export default TeacherMode
