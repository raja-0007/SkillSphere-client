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
  const [ratings, setRatings] = useState([])
  const [isRatingModelOpen, setIsRatingModelOpen] = useState({})


  const addRating = async (data, rating, setLoading) => {
    try {
      const token = userDetails?.token;
      console.log(token)
      const userId = userDetails?.userDetails?._id
      if (data.rating == 0) {

        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addRating`, { courseId: data.id, userId: userId, rating: rating }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            console.log(res.data); setRatings(res.data.ratings);
            setTimeout(() => {

              setIsRatingModelOpen({})
            }, 2000);
          })
      }
      else {
        console.log('editingeditingeditingediting', data.id, data.rating)
        await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/editRating`, { courseId: data.id, userId: userId, rating: rating }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            console.log(res.data); setRatings(res.data.ratings);
            setTimeout(() => {

              setIsRatingModelOpen({})
            }, 2000);
          })

      }
    }
    catch (err) {
      console.log(err)

      alert('An unexpected error occurred. Please try again')
      setIsRatingModelOpen({})
    }
  }

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails?.userDetails?._id}`, {
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
      ratings, setRatings, addRating, isRatingModelOpen, setIsRatingModelOpen,
      logout
    }}>

      {children}

    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext = () => useContext(homeContext)
