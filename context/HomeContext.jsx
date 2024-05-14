'use client'

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
  useEffect(() => {
    console.log('cnaasdgoai 89', active, searchResults)

  }, [searchResults])
  return (
    <homeContext.Provider value={{
      active, setActive,
      userDetails, setUserDetails,
      search, setSearch,
      dropDown, setDropDown,
      overviewCourse, setOverviewCourse,
      searchResults, setSearchResults,
      searchData, setSearchData
    }}>

      {children}

    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext = () => useContext(homeContext)
