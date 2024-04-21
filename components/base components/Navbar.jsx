"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IoSearch } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";

import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import axios from "axios";
import { IoMdArrowDropright } from "react-icons/io";

import { useHomeContext } from "@/context/HomeContext";
function Navbar({ setAuthType }) {
  const [isCategories, setIsCategories] = useState(false)
  const {setActive, userDetails, setUserDetails} = useHomeContext()
  const [isTopics, setIsTopics] = useState(false)
  const [topics, setTopics] = useState([])
  const [clickedCategory, setClickedCategory] = useState('')
  const catref = useRef()
  // const [userDetails, setUserDetails] = useState({})
  const router = useRouter()
  const [categorieslist, setCategorieslist] = useState([])
  
  // let teacherMode = () => {
  //   router.push('/teacher-mode')
  // }
  // let openhandler = (e) => {
  //   handleopen()


  // }
  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (catref.current && !catref.current.contains(e.target)) {
        setIsCategories(false)
        setIsTopics(false)
        setClickedCategory('')
      }


    })
    getCategories()
    setUserDetails(JSON.parse(sessionStorage.getItem('userdetails')) || '')
  }, [])

  const getCategories = async () => {
    await axios.get(process.env.NEXT_PUBLIC_BASE_URL + '/categorieslist')
      .then(res => setCategorieslist(res.data))

  }

  const openTopics = (list) => {
    setIsTopics(true)
    setTopics(list)
  }

  const logout =()=>{
    sessionStorage.removeItem('userdetails')
    router.push('/')
    setActive('home')
    setUserDetails({})
  }

  useEffect(()=>{
    console.log('>>>>>>>>>>>>>>>>>>>.',userDetails)
  },[userDetails])







  return (



    <div className='w-full h-[10vh] flex flex-row justify-between items-center lg:px-10 px-5 z-10 shadow-md shadow-gray-300' >

      <span className="lg:hidden "><IoMenuSharp className="text-2xl text-black cursor-pointer"  /></span>
      <span className="text-2xl font-bold self-center" onClick={()=>setActive('home')}>SkillSphere</span>
      <div ref={catref} className="font-light hidden lg:block relative ">
        <span
          id="categories"
          onClick={() => {setIsCategories(!isCategories); setIsTopics(false); setClickedCategory('')}}
          className="cursor-pointer"
        >
          categories
        </span>
        <div
          className={isCategories ? "w-72 h-[max-content] flex px-5 py-5 flex-col justify-start gap-4 absolute z-10 bottom-[-250px] rounded-sm left-[-10px] bg-white shadow-md shadow-gray-500"
            : 'hidden'
          }
        >
          {categorieslist.map((course, i) =>
            <span className="flex w-full justify-between items-center cursor-pointer" key={i} onClick={() => {openTopics(course.topics); setClickedCategory(course.category)}}>
              <span>{course.category}</span>
              <span><IoMdArrowDropright className={`${clickedCategory == course.category ?'text-slate-600 text-[1.4em] mr-0':'text-gray-400 text-[1.2em] mr-1'} `} /></span>
            </span>)}
          <div className={isTopics ? "w-60 h-[max-content] overflow-hidden flex  pt-3 flex-col rounded-r-lg rounded justify-start  absolute z-10 top-0 left-[289px] bg-white shadow-md shadow-gray-500"
            : 'hidden'
          }>
            <span className="font-bold text-gray-500 mb-1 px-5">Popular Topics</span>
            {topics.map((topic,topic_i) => <Link href={`/coursesDetails/${topic}`} className="text-sm px-5 cursor-pointer py-2 hover:bg-slate-200 hover:font-medium transition-all duration-100 hover:text-slate-700" key={topic_i}>{topic}</Link>)}
          </div>

        </div>

      </div>
      <form className="w-[40%] hidden lg:flex gap-2 bg-white border-[1px] border-black px-3 rounded-3xl h-11 overflow-hidden">
        <button type="submit"><IoSearch className="text-gray-400 text-xl" /></button>
        <input type="text" placeholder="search for anything..." className="w-full outline-none " name="" id="" />
      </form>

      <Link href={''} onClick={()=>setActive('teacher')} className="font-light hidden lg:block">teacher mode</Link>
      <span className="flex gap-4">
        <IoSearch className="lg:hidden text-2xl text-black" />
        <MdOutlineShoppingCart className="text-2xl text-black" />
      </span>
      {Object.keys(userDetails || {}).length === 0 ? 
      <div className="hidden lg:flex gap-3">
        <span  className="px-3 py-1 border-2 border-slate-800 hover:bg-slate-200" onClick={()=>{setAuthType('login');setActive('authentication')}}>login</span>
        <span  className="px-3 py-1 bg-slate-800 text-white border-2 border-slate-950 hover:bg-slate-700" onClick={()=>{setAuthType('register');setActive('authentication')}}>signup</span>
      </div>
      :
      <div>
        <span className="flex gap-1 items-center text-md" onClick={logout}><FaUserCircle size={'1.5em'}/>{userDetails?.userDetails?.username}</span>
      </div> 
      }
      

    </div>





  )
}

export default Navbar
