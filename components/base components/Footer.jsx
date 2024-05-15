import React from 'react'
import { BsGlobe } from "react-icons/bs";

function Footer() {
    return (
        <div className='w-full bg-slate-950 text-white z-10 flex flex-col gap-20 items-center py-5 px-10'>
            <div className='flex w-full justify-between'>
                <div className='flex gap-32'>
                    <div className='flex flex-col'>
                        <span>Udemy Business</span>
                        <span>Teach on Udemy</span>
                        <span>Get the app</span>
                        <span>About us</span>
                        <span>Contact us</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>Careers</span>
                        <span>Blog</span>
                        <span>Help and Support</span>
                        <span>Affiliate</span>
                        <span>Investors</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>Terms</span>
                        <span>Privacy policy</span>
                        <span>Cookie settings</span>
                        <span>Sitemap</span>
                        <span>Accessibility statement</span>
                    </div>
                </div>
                <button className='border-[1px] border-white px-5 h-[max-content] py-3 flex items-center' ><BsGlobe/>English</button>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='text-2xl font-semibold'>SkillSphere</span>
                <small>@2024 skillsphere,Inc.</small>
            </div>

        </div>
    )
}

export default Footer
