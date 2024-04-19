import React from 'react'

function TrustedCompanies() {
  return (
    <div className='w-full bg-slate-50'>
      <div className='flex flex-col mx-auto w-[85%] py-20 gap-10 justify-center'>
        <span className='w-[max-content]  mx-auto text-lg text-gray-500'>Trusted by over 15,000 companies and millions of learners around the world</span>
        <div className='flex w-full justify-around items-center'>
            <img src="/images/volkswagen.svg" alt="" />
            <img src="/images/samsung.svg" alt="" />
            <img src="https://s.udemycdn.com/partner-logos/ou-v1/cisco.svg" alt="" />
            <img src="https://s.udemycdn.com/partner-logos/ou-v1/att.svg" alt="" />
            <img src="https://s.udemycdn.com/partner-logos/ou-v1/procter_gamble.svg" alt="" />
            <img src="https://s.udemycdn.com/partner-logos/ou-v1/hewlett_packard_enterprise.svg" alt="" />
            <img src="https://s.udemycdn.com/partner-logos/ou-v1/citi.svg" alt="" />
            <img src="https://s.udemycdn.com/partner-logos/ou-v1/ericsson.svg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default TrustedCompanies
