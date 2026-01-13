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
        <footer className='bg-neutral-900 text-neutral-100 transition-colors-smooth'>
            {/* Main Footer Content */}
            <div className='max-w-7xl mx-auto px-6 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
                    {/* Brand Section */}
                    <div className='lg:col-span-1 space-y-4'>
                        <div className='flex items-center gap-2'>
                            <GraduationCap className='h-8 w-8 text-primary-400' />
                            <span className='text-2xl font-bold text-neutral-50'>SkillSphere</span>
                        </div>
                        <p className='text-neutral-300 text-sm leading-relaxed'>
                            Empowering learners worldwide with quality education and skill development opportunities.
                        </p>
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2 text-sm text-neutral-300'>
                                <Mail className='h-4 w-4 text-info' />
                                <span>support@skillsphere.com</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-neutral-300'>
                                <Phone className='h-4 w-4 text-success' />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-neutral-300'>
                                <MapPin className='h-4 w-4 text-accent' />
                                <span>San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-neutral-50'>Company</h3>
                        <ul className='space-y-2'>
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-neutral-300 hover:text-primary-400 transition-colors-fast text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-neutral-50'>Community</h3>
                        <ul className='space-y-2'>
                            {footerLinks.community.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-neutral-300 hover:text-secondary-400 transition-colors-fast text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Teaching Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-neutral-50'>Teaching</h3>
                        <ul className='space-y-2'>
                            {footerLinks.teaching.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-neutral-300 hover:text-accent transition-colors-fast text-sm'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-neutral-50'>Support</h3>
                        <ul className='space-y-2'>
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className='text-neutral-300 hover:text-info transition-colors-fast text-sm'
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
            <div className='border-t border-neutral-500'>
                <div className='max-w-7xl mx-auto px-6 py-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className='flex items-center gap-4'>
                            <p className='text-neutral-400 text-sm'>
                                © 2024 SkillSphere, Inc. All rights reserved.
                            </p>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className='border-neutral-400 text-neutral-300 hover:text-neutral-50 hover:border-primary-400 hover:bg-primary-400/10 transition-colors-fast'
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