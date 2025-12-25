import React from 'react'
import { Globe, GraduationCap, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

function ModernFooter() {
    const footerLinks = {
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
            { name: 'Blog', href: '/blog' },
            { name: 'Contact Us', href: '/contact' }
        ],
        community: [
            { name: 'Learners', href: '/learners' },
            { name: 'Partners', href: '/partners' },
            { name: 'Developers', href: '/developers' },
            { name: 'Beta Testers', href: '/beta' },
            { name: 'Translators', href: '/translators' }
        ],
        teaching: [
            { name: 'Become Instructor', href: '/teacher' },
            { name: 'Teaching Center', href: '/teaching-center' },
            { name: 'Instructor Rules', href: '/instructor-rules' },
            { name: 'Instructor Help', href: '/instructor-help' }
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Trust & Safety', href: '/trust-safety' },
            { name: 'Terms', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Accessibility', href: '/accessibility' }
        ]
    }

    return (
        <footer className='bg-slate-900 text-white'>
            {/* Main Footer Content */}
            <div className='max-w-7xl mx-auto px-6 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
                    {/* Brand Section */}
                    <div className='lg:col-span-1 space-y-4'>
                        <div className='flex items-center gap-2'>
                            <GraduationCap className='h-8 w-8 text-primary' />
                            <span className='text-2xl font-bold'>SkillSphere</span>
                        </div>
                        <p className='text-gray-300 text-sm leading-relaxed'>
                            Empowering learners worldwide with quality education and skill development opportunities.
                        </p>
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2 text-sm text-gray-300'>
                                <Mail className='h-4 w-4' />
                                <span>support@skillsphere.com</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-300'>
                                <Phone className='h-4 w-4' />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-300'>
                                <MapPin className='h-4 w-4' />
                                <span>San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Company</h3>
                        <ul className='space-y-2'>
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-gray-300 hover:text-white transition-colors text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Community</h3>
                        <ul className='space-y-2'>
                            {footerLinks.community.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-gray-300 hover:text-white transition-colors text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Teaching Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Teaching</h3>
                        <ul className='space-y-2'>
                            {footerLinks.teaching.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-gray-300 hover:text-white transition-colors text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Support</h3>
                        <ul className='space-y-2'>
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-gray-300 hover:text-white transition-colors text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-gray-700'>
                <div className='max-w-7xl mx-auto px-6 py-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className='flex items-center gap-4'>
                            <p className='text-gray-300 text-sm'>
                                © 2024 SkillSphere, Inc. All rights reserved.
                            </p>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className='border-gray-600 text-gray-300 hover:text-white hover:border-gray-400'
                            >
                                <Globe className='h-4 w-4 mr-2' />
                                English
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default ModernFooter