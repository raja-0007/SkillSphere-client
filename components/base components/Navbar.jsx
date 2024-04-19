"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IoSearch } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";

import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import axios from "axios";
import { useHomeContext } from "@/context/HomeContext";
function Navbar({ handleopen }) {
  const [isCategories, setIsCategories] = useState(false)
  const {setActive} = useHomeContext()
  const [isTopics, setIsTopics] = useState(false)
  const [topics, setTopics] = useState([])
  const catref = useRef()
  const [userDetails, setUserDetails] = useState({})
  const router = useRouter()
  const [categorieslist, setCategorieslist] = useState([])
  
  // let teacherMode = () => {
  //   router.push('/teacher-mode')
  // }
  let openhandler = (e) => {
    handleopen()


  }
  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (catref.current && !catref.current.contains(e.target)) {
        setIsCategories(false)
        setIsTopics(false)
      }


    })
    getCategories()
    setUserDetails(JSON.parse(sessionStorage.getItem('userdetails'))?.userDetails || '')
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







  return (



    <div className='w-full h-[10vh] flex flex-row justify-between items-center lg:px-10 px-5 z-10 shadow-md shadow-gray-300' >

      <span className="lg:hidden "><IoMenuSharp className="text-2xl text-black cursor-pointer" onClick={openhandler} /></span>
      <Link href={'/'} className="text-2xl font-bold self-center" onClick={()=>setActive('home')}>SkillSphere</Link>
      <div ref={catref} className="font-light hidden lg:block relative ">
        <span
          id="categories"
          onClick={() => setIsCategories(!isCategories)}
          className="cursor-pointer"
        >
          Categories
        </span>
        <div
          className={isCategories ? "w-72 h-[max-content] flex px-5 py-5 flex-col justify-start gap-5 absolute z-10 bottom-[-265px] left-[-10px] bg-white shadow-md shadow-gray-500"
            : 'hidden'
          }
        >
          {categorieslist.map((course, i) =>
            <span className="flex w-full justify-between cursor-pointer" key={i} onClick={() => openTopics(course.topics)}>
              <span>{course.category}</span>
              <span>&gt;</span>
            </span>)}
          <div className={isTopics ? "w-72 h-[max-content] flex px-5 py-5 flex-col justify-start gap-5 absolute z-10 top-0 left-[289px] bg-white shadow-md shadow-gray-500"
            : 'hidden'
          }>
            <span className="font-bold text-gray-500">Popular Topics</span>
            {topics.map((topic,topic_i) => <Link href={`/coursesDetails/${topic}`} className="text-sm cursor-pointer" key={topic_i}>{topic}</Link>)}
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
        <Link href={'/authentication/login'} className="px-3 py-1 border-2 border-slate-950 hover:bg-slate-200">login</Link>
        <Link href={'/authentication/register'} className="px-3 py-1 bg-slate-950 text-white border-2 border-slate-950 hover:bg-slate-700">signup</Link>
      </div>
      :
      <div>
        <span className="flex gap-1 items-center text-md" onClick={logout}><FaUserCircle size={'1.5em'}/>{userDetails?.username}</span>
      </div> 
      }
      

    </div>





  )
}

export default Navbar
