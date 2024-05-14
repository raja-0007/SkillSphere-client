import React from 'react'

function Levels({ filters, setFilters }) {
    const levelChangeHandler = (e) => {
        // e.preventDefault()
        var levels= [...filters.levels.value]
        
        if(levels.includes(e.target.value)){
            levels = levels.filter(lev=>lev !== e.target.value)
            // console.log('deleted',e.target.value, levels)
            setFilters({...filters, levels:{...filters.levels, value:levels}})
        }
        else{
            levels= [...levels, e.target.value]
            setFilters({...filters, levels:{...filters.levels, value:levels}})

            // console.log('added',e.target.value, levels)
        }
        // console.log(levels)
    }
    return (
        <form className={`flex flex-col gap-2 text-md font-normal transition-all duration-300 ${!filters.levels.open ? 'h-0 overflow-hidden':'h-[max-content]' }`} onSubmit={(e)=>e.preventDefault()}>
            <span className='mt-2'>
                <input type="checkbox" name="levels" checked={filters.levels.value.includes('allLevels')} value={'allLevels'}  onChange={levelChangeHandler} id="allLevels" />
                <label htmlFor="allLevels">All levels</label>
            </span>
            <span>
                <input type="checkbox" name="levels" checked={filters.levels.value.includes('Beginner')} value={'Beginner'} onChange={levelChangeHandler} id="Beginner" />
                <label htmlFor="Beginner">Beginner</label>
            </span>
            <span>
                <input type="checkbox" name="levels" checked={filters.levels.value.includes('Intermediate')} value={'Intermediate'} onChange={levelChangeHandler} id="Intermediate" />
                <label htmlFor="Intermediate">Intermediate</label>
            </span>
            <span>
                <input type="checkbox" name="levels" checked={filters.levels.value.includes('Expert')} value={'Expert'} onChange={levelChangeHandler} id="Expert" />
                <label htmlFor="Expert">Expert</label>
            </span>
        </form>
    )
}

export default Levels
