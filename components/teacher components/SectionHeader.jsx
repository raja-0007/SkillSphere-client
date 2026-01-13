import React from 'react'

function SectionHeader({ activeSection }) {
  return (
    <div className='w-full py-6 px-8 border-b border-border bg-muted/30'>
      <h1 className='text-2xl font-bold text-foreground capitalize'>{activeSection}</h1>
    </div>
  )
}

export default SectionHeader
