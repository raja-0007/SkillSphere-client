import React from 'react'

function SectionHeader({activeSection}) {
  return (
    <div className='w-full h-[12vh] flex items-center px-10 border-b-2 border-gray-200'>
                <span className='text-2xl font-bold capitalize'>{activeSection}</span>
            </div>
  )
}

export default SectionHeader
