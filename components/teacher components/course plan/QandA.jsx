import React from 'react'

function QandA({q,a}) {
  return (
    <div className='flex flex-col gap-3'>
      <p className=' font-bold'>{q}</p>
      <p>{a}</p>
    </div>
  )
}

export default QandA
