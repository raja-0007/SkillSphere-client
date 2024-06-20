"use client"

import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import { useEffect, useRef, useState } from 'react'

import { AiOutlineClose } from "react-icons/ai";
import Home from "@components/base components/Home";
import { useHomeContext } from "@contexts/HomeContext";
import TeacherMode from "@components/base components/TeacherMode";
import Authentication from "@components/base components/Authentication";
import SearchResults from "@components/search results/SearchResults";
import CourseOverview from "@components/course overview/CourseOverview";
import axios from "axios";
import Cart from "@components/cart components/Cart";
import Profile from "@components/profile components/Profile";
import Learning from "@components/base components/Learning";
import WishList from "@components/base components/WishList";


export default function Page() {
  const [scrollpos, setScrollpos] = useState(0)
  const [isopen, setIsopen] = useState(false)
  const {active, setCart, userDetails} = useHomeContext()
  const [authType, setAuthType] = useState('')
  const [from, setFrom] = useState('')
  const sideref = useRef()
  let handleopen = () => {
    // console.log(window.scrollY)
    setScrollpos(window.scrollY)
    document.body.style.overflow = 'hidden'
    setIsopen(true)



  }

  let handleclose = () => {
    // console.log('closed')
    window.scrollY = scrollpos

    setIsopen(false)
    document.body.style.overflow = 'visible'
    // console.log(scrollpos)

  }
  let closehandler = () => {
    // console.log('closing')
    handleclose()
    setIsopen(false)
  }
  // useEffect(() => {
  //   document.getElementById('sidebar-wrapper').addEventListener('click', (e) => {
  //     if (sideref.current && !sideref.current.contains(e.target)) {

  //       closehandler()


  //     }
  //   })
  // }, [])

  


  // const [coursesList,setCoursesList] = useState([])


  // const getCourses = async()=>{
  //   const courseslist2 = await axios.get(process.env.NEXT_PUBLIC_BASE_URL)


  //   setCoursesList(courseslist2.data)
  // }



  // useEffect(()=>{
  //   console.log(coursesList)
  // },[coursesList])




  return (
    <div className={"w-full flex flex-col "}>
      {/* <div id="sidebar-wrapper" className={isopen ? ` h-[100vh] bg-black bg-opacity-[0.3] absolute z-20 w-full ` : " min-h-screen bg-black bg-opacity-[0.3] top-0 absolute z-10 opacity-[0] overflow-hidden transition-all ease-in duration-500"} style={
          {
            transition: 'all .5s'
          }
        }>
          <div className={isopen ? " min-h-screen bg-white z-10 w-32 relative" : " min-h-screen bg-white z-10 w-0"} style={
            {
              transition: 'all .5s'
            }
          }>
            <div ref={sideref} className="w-14 h-14 flex items-center justify-center text-[22px] cursor-pointer bg-white text-gray-600  rounded-full absolute right-[-55%] top-4" onClick={closehandler}><AiOutlineClose /></div>
          </div>

        </div> */}
        {/* {active !== 'teacher' && <Navbar setAuthType={setAuthType}/>} */}
        <Navbar setAuthType={setAuthType} setFrom={setFrom} />
        {active == 'home' ?
        
        <Home /> 
       
        :active == 'authentication' ? 
       
        <Authentication type={authType} setAuthType={setAuthType}/>
        
        : active == 'teacher' ? <TeacherMode/>
        : active == 'search results' ? <SearchResults setFrom={setFrom}/>
        : active == 'course overview' ? <CourseOverview from={from} setFrom={setFrom}/>
        : active == 'cart' ? <Cart from={from} setFrom={setFrom}/>
        : active == 'profile' ? <Profile setFrom={setFrom}/>
        : active == 'learning' ? <Learning setFrom={setFrom} from={from}/>
        : active == 'wishlist' && <WishList setFrom={setFrom} from={from}/>
        }
      
      <Footer />


    </div>
  )
}
