import React from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'

function Pricing({activeSection}) {
  return (
    <SectionLayout>
        <SectionHeader activeSection={activeSection}/>
        <div className='p-10 pt-5 flex flex-col gap-5'>
            <div className='w-[500px]'>
                <p className='font-bold'>Set a price for your course</p>
                <p>Please select the currency and the price tier for your course. If you’d like to offer your course for free, it must have a total video length of less than 2 hours. Also, courses with practice tests can not be free.</p>
            </div>
            <div className='flex gap-6 items-start '>
                <div>
                    <label htmlFor="price" className='me-3 font-semibold capitalize'>price tier</label><br />
                    <input type="text" name="" id="price" className='p-2 border border-black outline-none' placeholder='enter price' /> <br />
                    {/* <button type='button' className='self-start mt-4 w-[max-content] p-2 px-3 bg-slate-800 text-white font-semibold'>save</button> */}

                </div>
            </div>
        </div>
    </SectionLayout>
  )
}

export default Pricing
