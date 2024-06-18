import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { useTeacherContext } from '@contexts/TeacherContext'

function Pricing({ activeSection }) {
    const { price, setPrice, filledStatus, setFilledStatus } = useTeacherContext()
    const [saved, setSaved] = useState(false)
    const saveIntoFilled = () => {
        // console.log('price....', price)
        if (!filledStatus.includes('pricing') && price !== '') {
            setFilledStatus([...filledStatus, 'pricing'])
            setSaved(true)
        }
        else if(price == ''){
            alert('please enter price')
        }
       
    }
    // useEffect(() => {
    //     setSaved(false)
    //     if (filledStatus.includes('pricing')) {
    //         setFilledStatus(filledStatus.filter(stat => stat !== 'pricing'))
    //     }
    // }, [price])
    const changeHandler = (e) => {
        setSaved(false)
        if (filledStatus.includes('pricing')) {
            setFilledStatus(filledStatus.filter(stat => stat !== 'pricing'))
        }
        const value = e.target.value.replace(/\D/g, '')
        if (value < 50000) setPrice(value)
    }

    // useEffect(() => {
    //     document.addEventListener('click', () => {
    //         if (document.getElementById('free').checked) {
    //             setPrice('free')
    //         }
    //         else {
    //             setPrice('')
    //         }
    //     })
    // }, [])
    const handlePrice = () => {
        setSaved(false)
        if (document.getElementById('free').checked) {
            setPrice('free')

        }
        else {
            setPrice('')

        }
        if (filledStatus.includes('pricing')) {
            setFilledStatus(filledStatus.filter(stat => stat !== 'pricing'))
        }
        
    }

    useEffect(() => {
        if (filledStatus.includes('pricing')) {
            setSaved(true)
        }
        else setSaved(false)
    }, [])
    return (
        <SectionLayout>
            <SectionHeader activeSection={activeSection} />
            <div className='p-10 pt-5 flex flex-col gap-5'>
                <div className='w-[500px]'>
                    <p className='font-bold'>Set a price for your course</p>
                    <p>Please select the currency and the price tier for your course. If you’d like to offer your course for free, it must have a total video length of less than 2 hours. Also, courses with practice tests can not be free.</p>
                </div>
                <div className='flex items-center gap-1'>

                    <input type="checkbox" name="" checked={price == 'free' ? true : false} onChange={handlePrice} id="free" />
                    <label htmlFor="free">free</label>
                </div>
                {price !== 'free' && <div className='flex gap-6 items-start'>
                    <div>
                        <label htmlFor="price" className='me-3 font-semibold capitalize'>price tier</label><br />
                        <input type="text" name="" id="price" value={price !== 'free' ? price : ''} onChange={(e) => changeHandler(e)} className='p-2 border border-black outline-none' placeholder='Enter Price' /> <br />

                    </div>

                </div>}
                {!saved && <button type='button' onClick={saveIntoFilled} className='self-start mt-4 w-[max-content] p-2 px-3 bg-slate-800 text-white font-semibold'>save</button>
                }
            </div>
        </SectionLayout>
    )
}

export default Pricing
