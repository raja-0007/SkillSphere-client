'use client'
import { useHomeContext } from '@/context/HomeContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
    // const {saveTransaction, active} = useHomeContext()
    const router = useRouter()
    useEffect(()=>{
        // saveTransaction('transactions','failed')
        // console.log('asdfpoadsf8yap', active)
        router.push('/')
    },[])
  return (
    <div className='flex min-h-screen w-full justify-center items-center'>
      <div>
        <p>payment cancelled</p>
        <p>redirecting to transactions page</p>
        </div> 
    </div>
  )
}

export default page
