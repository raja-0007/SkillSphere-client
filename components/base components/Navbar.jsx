"use client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { IoSearch } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import axios from "axios";
import { IoMdArrowDropright } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";


import { useHomeContext } from "@contexts/HomeContext";
function Navbar({ setAuthType, onFocusNavigate }) {
  const [isCategories, setIsCategories] = useState(false)
  const { setActive, active, userDetails, setUserDetails, logout, search, cart, setCart, setSearch, dropDown, setDropDown, searchResults, setSearchResults, setSearchData, searchData, setOverviewCourse } = useHomeContext()
  const [isTopics, setIsTopics] = useState(false)
  const [topics, setTopics] = useState([])
  const [clickedCategory, setClickedCategory] = useState('')
  const catref = useRef()

  const [categorieslist, setCategorieslist] = useState([])
  const searchDropRef = useRef(null)
  const [isProfile, setIsProfile] = useState(false)
  const pathname = usePathname()
  const router = useRouter();

  const profileItems = [
    { tag: 'My learning', action: 'learning' },
    { tag: 'My cart', action: 'cart' },
    {tag:'Wishlist',action:'wishlist'}, {tag:'Log out',action:'logout'}]


  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (catref.current && !catref.current.contains(e.target)) {
        setIsCategories(false)
        setIsTopics(false)
        setClickedCategory('')
      }


    })
    getCategories()
    // setUserDetails(JSON.parse(sessionStorage.getItem('userdetails')) || '')


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
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/searchResults?search=${search}`)
        .then(res => { setSearchResults(res.data);
          setSearchData({
      search: search,
      searchResults: res.data
    })

         })
    }
    getSearchResults()
    // if (search !== '') 
    // else{
  // setSearchData({
  //   ...searchData,
  //     search: search,
  //   })
  //  setSearchResults([])
  // }
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
    console.log('clickec')
    setSearchData({
      search: search,
      searchResults: searchResults
    })
    // router.push('/search-results');
    // setActive('search results')
  }
  // console.log(cart)

  const gotoCart = async () => {
    if (Object.keys(userDetails || {}).length === 0) {
      alert('Please login to access your cart.');
      router.push('/authentication/login');
    } else {
      try {
        const token = userDetails?.accessToken;
        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.data.status == 'success') {
              router.push('/cart');
            }
          })
      } catch (error) {
        if (error.response?.status === 403) {
          alert('Session expired. Please login again to continue.');
          logout();
          router.push('/authentication/login');
        }
      }
    }
  }

  const profileItemHandler = (item) => {
    if (item.tag === 'Log out') {
      logout();
      router.push('/');
    } else {
      if (Object.keys(userDetails || {}).length === 0) {
        alert('Please login to access this section.');
        router.push('/authentication/login');
        return;
      }
      router.push(`/${item.action}`);
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
          Categories
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
        className="w-[45%] hidden lg:flex gap-2 bg-white border-[1px]  border-black px-3 rounded-3xl h-11 overflow-x-hidden" onSubmit={(e) => submitHandler(e)}>
        <button type="submit"><IoSearch className="text-gray-400 text-xl" /></button>
        <input type="text" onClick={()=>{
          if(onFocusNavigate){
            router.push('/search-results')
          }
        }}
        autoFocus={pathname.includes('search-results')}
         placeholder="search for anything..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none " name="" id="" />

      </form>
      {/* {dropDown && searchResults.length > 0 && <div ref={searchDropRef} className="w-[45%] ms-[18%] bg-white rounded-md overflow-hidden absolute top-[10vh] h-[max-content] flex flex-col">
        {searchResults.map((res, i) => {
          return (
            <span onClick={() => {
              setOverviewCourse(res);
              setActive('course overview'); setSearchResults([]); setSearch('')
              //  setFrom(active)
              router.push('/search-results')
            }} key={i} className="w-full p-2 py-2 hover:shadow-md hover:bg-slate-100">{res.landingPageDetails.title}</span>
          )
        })}
        <div className="flex justify-end">
          <button type="submit" className="p-1" onClick={submitHandler}>view all</button>
        </div>
      </div>} */}

      <span className="font-light hidden lg:block cursor-pointer" onClick={() => {
        if (Object.keys(userDetails || {}).length === 0) {
          // alert('Please login to access Teacher mode.');
          router.push('/authentication/login');
        } else {
          router.push('/teacher');
        }
      }}>Teacher mode</span>
      <span className="font-light cursor-pointer" onClick={() => {
        if (Object.keys(userDetails || {}).length === 0) {
          // alert('Please login to access My learning.');
          router.push('/authentication/login');
        } else {
          router.push('/learning');
        }
      }}>My learning</span>
      <span className="relative cursor-pointer" onClick={() => {
        if (Object.keys(userDetails || {}).length === 0) {
          // alert('Please login to access Wishlist.');
          router.push('/authentication/login');
        } else {
          router.push('/wishlist');
        }
      }}>
        <FaRegHeart className="text-xl text-black" />
        {/* {cart.length > 0 && <div className="absolute top-[-5px] right-[-5px] bg-violet-500 text-center text-white text-xs rounded-full w-4 h-4">
            {cart.length}
          </div>} */}
      </span>
      <span className="flex gap-4">
        {/* <IoSearch className="lg:hidden text-2xl text-black" /> */}

        {/* href={Object.keys(userDetails || {}).length !== 0 ? '/cart' : ''} */}
        <div className="relative cursor-pointer" onClick={gotoCart}>
          <MdOutlineShoppingCart className="text-2xl text-black" />
          {cart.length > 0 && <div className="absolute top-[-5px] right-[-5px] bg-violet-500 text-center text-white text-xs rounded-full w-4 h-4">
            {cart.length}
          </div>}
        </div>
      </span>
      <div className="relative cursor-pointer" >
        <MdNotificationsNone className="text-2xl text-black" />
        {/* {cart.length > 0 && <div className="absolute top-[-5px] right-[-5px] bg-violet-500 text-center text-white text-xs rounded-full w-4 h-4">
            {cart.length}
          </div>} */}
      </div>


      {Object.keys(userDetails || {}).length === 0 ?
        <div className="hidden lg:flex gap-3">
          <span className="px-3 py-1 border-2 border-slate-800 hover:bg-slate-200 cursor-pointer" onClick={() => { 
            // setAuthType('login'); setActive('authentication')
            router.push('/authentication/login')
             }}>login</span>
          <span className="px-3 py-1 bg-slate-800 text-white border-2 border-slate-950 cursor-pointer hover:bg-slate-700" onClick={() => { 
            // setAuthType('register'); setActive('authentication')
            router.push('/authentication/register')
             }}>signup</span>
        </div>
        :
        <div className="flex flex-col  relative" onClick={() => setIsProfile(!isProfile)} >
          <div className="flex font-semibold cursor-pointer bg-slate-800 rounded-full text-white  text-md uppercase items-center justify-center h-8 w-8 ">

            <span  >
              {/* <FaUserCircle size={'1.5em'} /> */}
              {userDetails?.userDetails?.username?.split(' ')[0]?.slice(0, 1)}
            </span>
            <span  >
              {/* <FaUserCircle size={'1.5em'} /> */}
              {userDetails?.userDetails?.username?.split(' ')[1]?.slice(0, 1)}
            </span>
          </div>


          {isProfile && <div className=" absolute top-[7vh] right-[-10px] flex flex-col z-50 gap-3 bg-white border">
            <div className="flex gap-2 p-4 items-center border-b" onClick={() => setActive('profile')}>
              <div className="flex font-semibold bg-slate-800 rounded-full text-white  text-lg uppercase items-center justify-center h-10 w-10 ">

                <span  >
                  {/* <FaUserCircle size={'1.5em'} /> */}
                  {userDetails?.userDetails?.username?.split(' ')[0]?.slice(0, 1)}
                </span>
                <span  >
                  {/* <FaUserCircle size={'1.5em'} /> */}
                  {userDetails?.userDetails?.username?.split(' ')[1]?.slice(0, 1)}
                </span>
              </div>
              <div>
                <p className="font-bold">{userDetails?.userDetails?.username}</p>
                <p className="text-sm text-gray-500">{userDetails?.userDetails?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3  pb-3">
              {profileItems.map((item, i) => {
                return (
                  <span key={i} className="px-3 cursor-pointer" onClick={() => profileItemHandler(item)}>{item.tag}</span>
                )
              })}


            </div>

          </div>}

        </div>
      }


    </div>





  )
}

export default Navbar
