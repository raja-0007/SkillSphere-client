'use client'

import React, {createContext, useContext, useState } from 'react'

const homeContext = createContext()
function HomeProvider({children}) {
    const [active, setActive] = useState('home')
    const [userDetails, setUserDetails] = useState({})
  return (
    <homeContext.Provider value={{active, setActive, userDetails, setUserDetails}}>
      
        {children}
        
    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext =()=> useContext(homeContext)
