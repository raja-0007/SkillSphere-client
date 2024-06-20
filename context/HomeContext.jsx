'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

const homeContext = createContext()
function HomeProvider({ children }) {
  const router = useRouter()
  const [active, setActive] = useState('home')
  const [userDetails, setUserDetails] = useState({})
  const [search, setSearch] = useState('')
  const [searchData, setSearchData] = useState({})
  const [overviewCourse, setOverviewCourse] = useState({})
  const [searchResults, setSearchResults] = useState([])
  const [dropDown, setDropDown] = useState(false)
  const [cart, setCart] = useState([])
  const [enrolled, setEnrolled] = useState([])


  const logout = () => {
    sessionStorage.removeItem('userdetails')
    router.push('/')
    setActive('home')
    setCart([])
    setUserDetails({})
  }

  useEffect(() => {
    console.log('cnaasdgoai 89', cart)
  }, [cart])

  useEffect(() => {
    
    const getCart = async () => {
      try {
        const token = userDetails?.token;
        console.log(token) // Replace with your actual token
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Data:', response.data);
        console.log(response.data); setCart(response.data.cart)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`)
      //   .then(res => { console.log(res.data); setCart(res.data.cart) })
    }
    
    if (userDetails?.userDetails?._id) {
      getCart()
    }
    
  }, [userDetails])


  return (
    <homeContext.Provider value={{
      active, setActive,
      userDetails, setUserDetails,
      search, setSearch,
      dropDown, setDropDown,
      overviewCourse, setOverviewCourse,
      searchResults, setSearchResults,
      searchData, setSearchData,
      cart, setCart,
      enrolled, setEnrolled,
      logout
    }}>

      {children}

    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext = () => useContext(homeContext)
