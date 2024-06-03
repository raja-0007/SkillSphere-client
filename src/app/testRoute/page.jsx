'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'

function page() {
    const [data, setData] = useState({
        name:'',
        video:''
    })
    const subHandler=async(e)=>{
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('video',data.video)
        formdata.append('name',data.name)
        // console.log(data.video.filepath, data.video.name)
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/createcourse/videoUpload`,formdata)
        .then(res=>console.log(res.data))
    }
    const getVideo=async()=>{
        await axios.get('https://api.vimeo.com/videos/952857056')
        .then(res=>console.log(res.data))
    }
  return (
    <div className='flex w-full min-h-screen items-center justify-center'>
      <form onSubmit={subHandler} className='flex flex-col p-5 gap-5 border-2 rounded-lg'>
        <input type="text" className='border' value={data.name} name="" id="" onChange={(e)=>setData({...data, name:e.target.value})}/>
        <input type="file" name="" id=""  onChange={(e)=>{setData({...data, video:e.target.files[0]}); console.log(e.target.files[0], e.target.value)}} />
        <button type='submit' className='border'>submit</button>
      </form>

<span className='p-4 bg-black text-white' onClick={getVideo}>get video</span>
      <video src="https://player.vimeo.com/video/952857056" className='w-[400px]' controls></video>
      <iframe src="https://player.vimeo.com/video/953102917" width="400" height="225"  allow="autoplay; fullscreen; picture-in-picture" ></iframe>

      <Link href='https://vimeo.com/953102917'>go</Link>
    </div>
  )
}

export default page
