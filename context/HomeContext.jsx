'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';

const homeContext = createContext()
function HomeProvider({ children }) {
  const router = useRouter()
  const [active, setActive] = useState('home')
  const [userDetails, setUserDetails] = useState({})
  const [userLoading, setUserLoading] = useState(true) // Track if user data is being loaded from cookies
  const [search, setSearch] = useState('')
  const [searchData, setSearchData] = useState({})
  const [overviewCourse, setOverviewCourse] = useState({})
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const [cart, setCart] = useState([])
  const [enrolled, setEnrolled] = useState([])
  const [ratings, setRatings] = useState([])
  const [isRatingModelOpen, setIsRatingModelOpen] = useState(null)

 const [wishList, setWishList] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // 🔹 Fetch wishlist whenever userDetails changes
  const getWishList = async () => {
    if (!userDetails?.userDetails?._id) return
    try {
      setWishlistLoading(true)
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/getWishlist/${userDetails.userDetails._id}`
      )
      setWishList(res.data.RawList)
      setWishlistLoading(false)
    } catch (err) {
      console.error('Error fetching wishlist:', err)
      setWishlistLoading(false)
    }
  }


  // 🔹 Add to wishlist
  const addToWishlist = async (courseId) => {
    if (!userDetails?.userDetails?._id) {
      alert('Please login to access wishlist')
      return
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/addToWishlist`,
        { courseId, userId: userDetails.userDetails._id },
        { headers: { Authorization: `Bearer ${userDetails?.accessToken}` } }
      )
      if (res.data.status === 'success') setWishList([...wishList, courseId])
    } catch (err) {
      console.error('Error adding to wishlist:', err)
    }
  }

  const removeFromWishlist = async (courseId) => {
    if (!userDetails?.userDetails?._id) return
    try {
      setWishlistLoading(true)
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/removeFromWishlist/${courseId}/${userDetails.userDetails._id}`,
        { headers: { Authorization: `Bearer ${userDetails?.accessToken}` } }
      )
      if (res.data.status === 'success') setWishList(res.data.wishList)
      setWishlistLoading(false)
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      setWishlistLoading(false)
    }
  }


  const addRating = async (data, rating, setLoading) => {
    try {
      const token = userDetails?.accessToken;
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

              setIsRatingModelOpen(null)
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

              setIsRatingModelOpen(null)
            }, 2000);
          })

      }
    }
    catch (err) {
      console.log(err)

      alert('An unexpected error occurred. Please try again')
      setIsRatingModelOpen(null)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('userdetails')
    router.push('/')
    setActive('home')
    setCart([])
    Cookies.remove('user')
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    setUserDetails({})
  }


  const getCart = async () => {
    // Guard: Don't make API call if user ID is not available
    if (!userDetails?.userDetails?._id || !userDetails?.accessToken) {
      console.log('getCart: User not authenticated, skipping API call')
      return
    }
    
    try {
      const token = userDetails.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userDetails.userDetails._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Cart Data:', response.data);
      setCart(response.data.cart)
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Handle 403 errors (expired token)
      if (error.response?.status === 403) {
        console.log('Token expired, user needs to re-login')
      }
    }
  }
  useEffect(() => {


    if (userDetails?.userDetails?._id) {
      getCart()
      getWishList()
    }

  }, [userDetails])

  useEffect(()=>{
    const user = Cookies.get('user');
    const access_token = Cookies.get('accessToken');
    const refresh_token = Cookies.get('refreshToken');
    console.log('Loading user from cookies:', user, access_token, refresh_token)
    if(user && access_token && refresh_token){
      let userObject = {userDetails:JSON.parse(user), accessToken: access_token, refreshToken: refresh_token}
      setUserDetails(userObject)
    }else{
      console.log('access_token', access_token)
      // Don't redirect here - let middleware handle authentication redirects
      // This prevents conflicts between client-side and server-side routing
      console.log('No valid authentication found in cookies')
    }
    // Mark user loading as complete regardless of whether user was found
    setUserLoading(false)
  },[])

  return (
    <homeContext.Provider value={{
      active, setActive,
      userDetails, setUserDetails,
      userLoading, // Expose loading state for components to check
      search, setSearch,
      searchLoading, setSearchLoading,
      dropDown, setDropDown,
      overviewCourse, setOverviewCourse,
      searchResults, setSearchResults,
      searchData, setSearchData,
      cart, setCart, getCart,
      enrolled, setEnrolled,
      ratings, setRatings, addRating, isRatingModelOpen, setIsRatingModelOpen,
      logout, 
      wishList,
        wishlistLoading,
        addToWishlist,
        removeFromWishlist,
    }}>

      {children}

    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext = () => useContext(homeContext)
