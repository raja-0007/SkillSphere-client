'use client'
import React, {createContext, useContext, useState } from 'react'

const homeContext = createContext()
function HomeProvider({children}) {
    const [active, setActive] = useState('home')
  return (
    <homeContext.Provider value={{active, setActive}}>
        {children}
    </homeContext.Provider>
  )
}

export default HomeProvider
export const useHomeContext =()=> useContext(homeContext)
