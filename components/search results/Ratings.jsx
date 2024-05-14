import React from 'react'
import { printRating } from '../home components/courses'

function Ratings({filters,setFilters}) {
    
    
  return (
    <form className={`flex flex-col gap-2 text-md font-normal transition-all duration-300 ${!filters.ratings.open ? 'h-0 overflow-hidden':'h-[max-content]' }`}>
            <span  className='flex items-center gap-1 mt-2'>
                
                <input type="radio" name="rating" checked={filters.ratings.value == '4.5'} value={'4.5'}  onChange={(e)=>setFilters({...filters, ratings:{...filters.ratings, value:e.target.value}})} id="4.5 and above" />
                <label htmlFor="4.5 and above" className='flex items-center'>{printRating('4.5')} <span className='ms-2'>4.5 and up</span></label>
            </span>
            <span className='flex items-center gap-1'>
                <input type="radio" name="rating" checked={filters.ratings.value == '4'}  value={'4'} onChange={(e)=>setFilters({...filters, ratings:{...filters.ratings, value:e.target.value}})} id="4 and above" />
                <label htmlFor="4 and above"className='flex items-center'>{printRating('4')} <span className='ms-2'>4 and up</span></label>
            </span>
            <span className='flex items-center gap-1'>
                <input type="radio" name="rating" checked={filters.ratings.value == '3.5'} value={'3.5'} onChange={(e)=>setFilters({...filters, ratings:{...filters.ratings, value:e.target.value}})} id="3.5 and above" />
                <label htmlFor="3.5 and above"className='flex items-center'>{printRating('3.5')} <span className='ms-2'>3.5 and up</span></label>
            </span>
            <span className='flex items-center gap-1'>
                <input type="radio" name="rating" checked={filters.ratings.value == '3'} value={'3'} onChange={(e)=>setFilters({...filters, ratings:{...filters.ratings, value:e.target.value}})} id="3 and above" />
                <label htmlFor="3 and above"className='flex items-center'>{printRating('3')} <span className='ms-2'>3 and up</span></label>
            </span>

        </form>
  )
}

export default Ratings
