'use client'
import Navbar from '@/components/base components/Navbar'
import React, { useEffect, useState } from 'react'

function page() {
    const [items, setItems] = useState([])

    useEffect(()=>{
        console.log('call')
    },[])
  return (
    <div>
      <Navbar/>
      heloooo
    </div>
  )
}

export default page
