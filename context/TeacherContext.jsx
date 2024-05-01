'use client'

import React, {createContext, useContext, useEffect, useState } from 'react'

const teacherContext = createContext()
function TeacherProvider({children}){
    const [outcomes, setOutcomes] = useState(['', '', '', ''])
    const [requirements, setRequirements] = useState([''])
    const [intended, setIntended] = useState([''])
    const [filledStatus, setFilledStatus] = useState([])
    const submitHandler=()=>{
        console.log(outcomes, requirements, intended, )
    }
    useEffect(()=>{
        if(!outcomes.includes('') && !requirements.includes('') && !intended.includes('')){
                if(!filledStatus.includes('intended learners')) setFilledStatus([...filledStatus,'intended learners'])
            
            
        }
        else{
            if(filledStatus.includes('intended learners')){
                setFilledStatus(filledStatus.filter(stat=>stat!=='intended learners'))
            }
        }
    },[outcomes, requirements, intended])
    useEffect(()=>{
        console.log('>>>>>>>>>>>>>>>>>>.',filledStatus)
    },[filledStatus])

return (
    <teacherContext.Provider value={{outcomes, setOutcomes, requirements, setRequirements, intended, setIntended, filledStatus, submitHandler}}>
        {children}
    </teacherContext.Provider>
)
}

export default TeacherProvider
export const useTeacherContext=()=>useContext(teacherContext)

