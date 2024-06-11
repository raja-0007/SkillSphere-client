'use client'

import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

const homeContext = createContext()
function HomeProvider({ children }) {
  const [active, setActive] = useState('home')
  const [userDetails, setUserDetails] = useState({})
  const [search, setSearch] = useState('')
  const [searchData, setSearchData] = useState({})
  const [overviewCourse, setOverviewCourse] = useState({})
  const [searchResults, setSearchResults] = useState([])
  const [dropDown, setDropDown] = useState(false)
  const [cart, setCart] = useState([])
  const [enrolled, setEnrolled] = useState([])
  useEffect(() => {
    console.log('cnaasdgoai 89', cart)
  }, [cart])

  useEffect(() => {
    const getCart = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`)
        .then(res => { console.log(res.data); setCart(res.data.cart) })
    }
    const getEnrolled = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getEnrolled/${userDetails?.userDetails?._id}`)
        .then(res => { console.log(res.data); setCart(res.data.enrolled) })

    }
    if (userDetails?.userDetails?._id) {
      getEnrolled()
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
      cart, setCart
    }}>

      {children}

    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext = () => useContext(homeContext)
