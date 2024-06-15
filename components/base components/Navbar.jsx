"use client"
import { usePathname, useRouter } from "next/navigation"
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
  const { setActive, active, userDetails, setUserDetails,logout, search, cart, setCart, setSearch, dropDown, setDropDown, searchResults, setSearchResults, setSearchData } = useHomeContext()
  const [isTopics, setIsTopics] = useState(false)
  const [topics, setTopics] = useState([])
  const [clickedCategory, setClickedCategory] = useState('')
  const catref = useRef()
  
  const [categorieslist, setCategorieslist] = useState([])
  const searchDropRef = useRef(null)
  const pathname = usePathname()


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
  useEffect(() => {
    document.addEventListener('click', (e) => {
      // console.log(active)
      if (active !== 'teacher' && !pathname.split('/').includes('coursesDetails')) {
        if (searchDropRef && searchDropRef.current && !searchDropRef.current.contains(e.target) && e.target !== document.getElementById('searchForm') && !Array.from(document.getElementById('searchForm').children).includes(e.target)) {
          setDropDown(false)
          // console.log(e.target, document.getElementById('searchForm').children)
        }
        else if ((e.target == document.getElementById('searchForm') || Array.from(document.getElementById('searchForm').children).includes(e.target))) {
          setDropDown(true)
          // console.log(e.target, document.getElementById('searchForm').children)
        }
      }

    })
  }, [active])

  const getCategories = async () => {
    await axios.get(process.env.NEXT_PUBLIC_BASE_URL + '/categorieslist')
      .then(res => setCategorieslist(res.data))

  }

  const openTopics = (list) => {
    setIsTopics(true)
    setTopics(list)
  }

  




  useEffect(() => {
    // console.log('rinnnn')
    const getSearchResults = async () => {
      // console.log(search)
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/searchResults/${search}`)
        .then(res => setSearchResults(res.data))
    }
    if (search !== '') getSearchResults()
    else setSearchResults([])
  }, [search])

  useEffect(() => {
    if (searchResults.length > 0) {
      setDropDown(true)
    }
    else {
      setDropDown(false)
    }
  }, [searchResults])

  const submitHandler = (e) => {
    e.preventDefault();
    setSearchData({
      search: search,
      searchResults: searchResults
    })
    setActive('search results')
  }
  console.log(cart)

  const gotoCart = async () => {
    if (Object.keys(userDetails || {}).length === 0) {
      alert('please login')
    }
    else {

      try {
        const token = userDetails?.token;
        console.log(token) // Replace with your actual token
        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response=>{

          console.log('Data:', response.data);
          if (response.data.status == 'success') {
            setActive('cart')
          }
          
        })

      } catch (error) {
        if (error.response.status === 403) {
          alert('session expired please login again to continue')
          logout()
        }
        
        console.error('Error fetching data:', error);
      }
      // setActive('cart')
    }
  }





  return (



    <div className='w-full h-[10vh] flex flex-row justify-between items-center relative lg:px-10 px-5 z-10 shadow-md shadow-gray-300' >

      <span className="lg:hidden "><IoMenuSharp className="text-2xl text-black cursor-pointer" /></span>
      <Link href={'/'} className="text-2xl font-bold self-center" onClick={() => setActive('home')}>SkillSphere</Link>
      <div ref={catref} className="font-light hidden lg:block relative ">
        <span
          id="categories"
          onClick={() => { setIsCategories(!isCategories); setIsTopics(false); setClickedCategory('') }}
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
            <span className="flex w-full justify-between items-center cursor-pointer" key={i} onClick={() => { openTopics(course.topics); setClickedCategory(course.category) }}>
              <span>{course.category}</span>
              <span><IoMdArrowDropright className={`${clickedCategory == course.category ? 'text-slate-600 text-[1.4em] mr-0' : 'text-gray-400 text-[1.2em] mr-1'} `} /></span>
            </span>)}
          <div className={isTopics ? "w-60 h-[max-content] overflow-hidden flex  pt-3 flex-col rounded-r-lg rounded justify-start  absolute z-10 top-0 left-[289px] bg-white shadow-md shadow-gray-500"
            : 'hidden'
          }>
            <span className="font-bold text-gray-500 mb-1 px-5">Popular Topics</span>
            {topics.map((topic, topic_i) => <Link href={`/`} className="text-sm px-5 cursor-pointer py-2 hover:bg-slate-200 hover:font-medium transition-all duration-100 hover:text-slate-700" key={topic_i}>{topic}</Link>)}
          </div>

        </div>

      </div>
      <form
        id="searchForm"
        className="w-[40%] hidden lg:flex gap-2 bg-white border-[1px]  border-black px-3 rounded-3xl h-11 overflow-x-hidden" onSubmit={(e) => submitHandler(e)}>
        <button type="submit"><IoSearch className="text-gray-400 text-xl" /></button>
        <input type="text" placeholder="search for anything..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none " name="" id="" />

      </form>
      {dropDown && <div ref={searchDropRef} className="w-[40%] ms-[22%] bg-white rounded-md overflow-hidden absolute top-[10vh] h-[max-content] flex flex-col">
        {searchResults.map((res, i) => {
          return (
            <Link href={`/coursesDetails/${res._id}`} target='_blank' key={i} className="w-full p-2 py-2 hover:shadow-md hover:bg-slate-100">{res.landingPageDetails.title}</Link>
          )
        })}
      </div>}

      <Link href={''} onClick={() => setActive('teacher')} className="font-light hidden lg:block">teacher mode</Link>
      <span className="flex gap-4">
        <IoSearch className="lg:hidden text-2xl text-black" />
        <div onClick={gotoCart}>
          {/* href={Object.keys(userDetails || {}).length !== 0 ? '/cart' : ''} */}
          <div className="relative">
            <MdOutlineShoppingCart className="text-2xl text-black" />
            {cart.length > 0 && <div className="absolute top-[-5px] right-[-5px] bg-violet-500 text-center text-white text-xs rounded-full w-4 h-4">
              {cart.length}
            </div>}
          </div>
        </div>
      </span>
      {Object.keys(userDetails || {}).length === 0 ?
        <div className="hidden lg:flex gap-3">
          <span className="px-3 py-1 border-2 border-slate-800 hover:bg-slate-200 cursor-pointer" onClick={() => { setAuthType('login'); setActive('authentication') }}>login</span>
          <span className="px-3 py-1 bg-slate-800 text-white border-2 border-slate-950 cursor-pointer hover:bg-slate-700" onClick={() => { setAuthType('register'); setActive('authentication') }}>signup</span>
        </div>
        :
        <div>
          <span className="flex gap-1 items-center text-md" onClick={logout}><FaUserCircle size={'1.5em'} />{userDetails?.userDetails?.username}</span>
        </div>
      }


    </div>





  )
}

export default Navbar
