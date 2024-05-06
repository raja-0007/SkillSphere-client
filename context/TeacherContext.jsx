'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHomeContext } from './HomeContext'
import axios from 'axios'

const teacherContext = createContext()
function TeacherProvider({ children }) {
    const { userDetails } = useHomeContext()
    const requiredStatus = ['intended learners', 'course structure', 'film & edit', 'curriculum', 'course landing page', 'pricing', 'course messsages']
    const [outcomes, setOutcomes] = useState(['', '', '', ''])
    const [requirements, setRequirements] = useState([''])

    const [intended, setIntended] = useState([''])
    const [title, setTitle] = useState('hello')
    const [sections, setSections] = useState([
        {
            id: 'section_1',
            title: 'Introduction',
            objective: 'learn something you fool!',

            curriculum: [
                {
                    title: 'Introduction',
                    type: 'lecture',
                    content: '',
                    content_type: '',
                    resources: '',
                    description: '',
                    currId: 'sect1cur1'
                }]
        }])
    const [landingDetails, setLandingDetails] = useState({
        title: '',
        subtitle: '',
        description: '',
        language: '',
        level: '',
        category: '',
        primary: '',
        image: null
    })
    const [price, setPrice] = useState('')
    const [messages, setMessages] = useState({
        welcome: '',
        congratulations: ''
    })
    const [filledStatus, setFilledStatus] = useState([])
    const submitHandler = async () => {
        // console.log(filledStatus)
        // console.log(landingDetails)
        const formdata = new FormData()
        formdata.append('author', JSON.stringify(userDetails))
        formdata.append('outcomes', JSON.stringify(outcomes))
        formdata.append('requirements', JSON.stringify(requirements))
        formdata.append('intended', JSON.stringify(intended))
        formdata.append('sections', JSON.stringify(sections))
        formdata.append('landingDetails', JSON.stringify(landingDetails))
        formdata.append('image', landingDetails.image)
        formdata.append('price', JSON.stringify(price))
        formdata.append('messages', JSON.stringify(messages))
        // formdata.append('title', title)

        for (const entry of formdata.entries()) {
            console.log(entry);
        } 
        const difference = requiredStatus.filter(stat => !filledStatus.includes(stat))
        // await axios.post('http://localhost:3000/api/test', formdata)
        await axios.post('http://localhost:7777/api/createcourse', formdata)
        .then(res => console.log(res.data))
        // alert(`please complete ${difference.join(', ')} stages`,)


    }

    // useEffect(() => {
    //     console.log('>>>>>>>>>>>>>>>>>>.', filledStatus)
    // }, [filledStatus])

    return (
        <teacherContext.Provider value={{
            outcomes, setOutcomes,
            requirements, setRequirements,
            intended, setIntended,
            sections, setSections,
            landingDetails, setLandingDetails,
            price, setPrice,
            messages, setMessages,
            filledStatus, setFilledStatus,
            submitHandler
        }}>
            {children}
        </teacherContext.Provider>
    )
}

export default TeacherProvider
export const useTeacherContext = () => useContext(teacherContext)

