import React, { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

function LectureForm({ addCurrItem, setIsCurrForm, setSelectedType, sectId }) {
  const [title, setTitle] = useState('')
  
  return (
    <div className='flex w-full justify-between gap-5 items-center'>
      <form className='flex gap-3 items-center flex-1' onSubmit={(e) => { e.preventDefault(); addCurrItem(title, sectId); setTitle(''); }}>
        <label htmlFor="title" className='text-sm font-medium text-foreground whitespace-nowrap'>New Lecture:</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter a title'
          className='flex-1'
          id="title"
        />
      </form>
      <div className='flex items-center gap-2'>
        <Button
          type="button"
          variant="ghost"
          onClick={() => { setIsCurrForm(''); setSelectedType(''); setTitle(''); }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={() => { addCurrItem(title, sectId); setTitle(''); }}
        >
          Add Lecture
        </Button>
      </div>
    </div>
  )
}

export default LectureForm
