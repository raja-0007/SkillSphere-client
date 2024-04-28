import React from 'react'

function SectionLayout({children}) {
  return (
    <div className='w-full flex flex-col gap-5 shadow-md border-t-2 border-gray-200 rounded-md shadow-gray-400'>
        {children}
    </div>
  )
}

export default SectionLayout
