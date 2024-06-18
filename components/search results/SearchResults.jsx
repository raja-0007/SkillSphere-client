import { useHomeContext } from '@contexts/HomeContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { HiCurrencyRupee } from "react-icons/hi2";
import { IoFilterSharp } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Ratings from './Ratings';
import { printRating } from '../home components/courses';
import Levels from './Levels';




function SearchResults() {
    const { setSearch, searchData, setDropDown,setOverviewCourse, setActive } = useHomeContext()
    const [isfilter, setIsfilter] = useState(false)


    const [filters, setFilters] = useState({
        ratings: { value: '', open: false },
        levels: { value: [], open: false },
        price: { value: [], open: false }
    })
    useEffect(() => {
        setSearch('')
        setDropDown(false)

    }, [])



    // useEffect(() => {
    //     console.log(filters)
    // }, [filters])

    const priceChangeHandler = (e) => {
        // e.preventDefault()
        var price= [...filters.price.value]
        
        if(price.includes(e.target.value)){
            price = price.filter(lev=>lev !== e.target.value)
            // console.log('deleted',e.target.value, price)
            setFilters({...filters, price:{...filters.price, value:price}})
        }
        else{
            price= [...price, e.target.value]
            setFilters({...filters, price:{...filters.price, value:price}})

            // console.log('added',e.target.value, levels)
        }
        // console.log(levels)
    }




    return (
        <div className='flex flex-col gap-10 px-28 py-10'>
            <div className=' flex flex-col gap-5 font-bold'>
                <span className='text-3xl'>
                    {searchData?.searchResults.length} results for "{searchData?.search}"
                </span>
                <div className='flex justify-between items-end'>
                    <span className='flex items-center gap-3'>
                        <span className='px-3 py-3 border border-black flex items-center gap-2' onClick={() => setIsfilter(!isfilter)}><IoFilterSharp />Filter</span>
                        <span className='px-3 py-3 border border-black '>Sort by</span>
                    </span>
                    <span className='font-bold text-lg text-gray-400'>{searchData?.searchResults.length} results</span>
                </div>
            </div>

            <div className='flex w-full'>
                <div className={`border-t-2 h-[400px] ${isfilter ? 'w-[400px] me-5' : 'w-0 overflow-hidden'} transition-all duration-300`}>
                    {Object.keys(filters).map((ft, i) => {
                        return (
                            <div className='p-3 border-b border-gray-300 ' key={i}>
                                <div className=" flex flex-col font-bold capitalize text-lg cursor-pointer" onClick={() => setFilters({ ...filters, [ft]: { ...filters[ft], open: !filters[ft].open } })}>
                                    <span className='flex items-center justify-between'>{ft} <span className='text-gray-700'>{filters[ft].open ? <FaAngleUp /> : <FaAngleDown />}</span></span>

                                </div>
                                <div>
                                    {ft == 'ratings' ? <Ratings filters={filters} setFilters={setFilters} />
                                        : ft == 'levels' ? <Levels filters={filters} setFilters={setFilters} />
                                            : ft == 'price' && <form className={`flex flex-col gap-2 text-md font-normal transition-all duration-300 ${!filters.price.open ? 'h-0 overflow-hidden' : 'h-[max-content]'}`} onSubmit={(e) => e.preventDefault()}>
                                                <span className='mt-2 flex items-center '>
                                                    <input type="checkbox" name="price" checked={filters.price.value.includes('paid')} value={'paid'} onChange={priceChangeHandler} id="paid" />
                                                    <label htmlFor="paid">Paid</label>
                                                </span>
                                                <span className='flex items-center '>
                                                    <input type="checkbox" name="price" checked={filters.price.value.includes('free')} value={'free'} onChange={priceChangeHandler} id="free" />
                                                    <label htmlFor="free">Free</label>
                                                </span>
                                               
                                            </form>}
                                </div>
                            </div>

                        )
                    })}
                </div>
                <div className='flex flex-col w-full'>
                    {searchData?.searchResults.map((item, i) => {

                        const totalLectures = () => {
                            let total = 0
                            item.sections.forEach(sect => {
                                total += sect.curriculum.length
                            });

                            return total
                        }
                        return (
                            <div key={i} className='flex justify-between gap-2 items-start pb-5 mb-5 border-b ' onClick={()=>{setActive('course overview'); setOverviewCourse(item)}}>

                                <div className='flex gap-3'>
                                    <img src={`http://localhost:7777/images/${item.image}`} className='w-[250px] h-[150px]' alt="" />
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-lg font-bold'>{item.landingPageDetails.title}</span>
                                        <span className=' text-sm w-[600px]'>{item.landingPageDetails.description.slice(0, 200)}...</span>
                                        <span className="text-gray-500 text-xs">{item.author.username}, {item.author.email}</span>
                                        <span className='text-md flex items-center gap-1'><span className={`font-bold ${item.rating == 'newly added' && 'border-2 border-yellow-500 rounded-md p-1 text-sm '}`}>{item.rating}</span> <span className='flex'>{item.rating !== 'newly added' && printRating(item.rating)}</span></span>
                                        <span className='text-xs text-gray-500 '>{totalLectures()} lectures . {item.landingPageDetails.level}</span>
                                    </div>
                                </div>
                                <span className='flex items-center'><HiCurrencyRupee size={'1.2em'} />{item.price}</span>
                            </div>
                        )
                    })}

                </div>

            </div>

        </div>
    )
}

export default SearchResults
