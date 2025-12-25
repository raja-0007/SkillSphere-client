

import { Inter } from 'next/font/google'
import './globals.css'
import HomeProvider from '@contexts/HomeContext'
import PerformanceMonitor from '@components/performance/PerformanceMonitor'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata = {
  title: 'SkillSphere - Learn and Grow',
  description: 'Empowering learners worldwide with quality education and skill development opportunities',
  keywords: 'online learning, courses, education, skills, programming, development',
  authors: [{ name: 'SkillSphere Team' }],
  creator: 'SkillSphere',
  publisher: 'SkillSphere',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://skillsphere.com'),
  openGraph: {
    title: 'SkillSphere - Learn and Grow',
    description: 'Empowering learners worldwide with quality education and skill development opportunities',
    url: 'https://skillsphere.com',
    siteName: 'SkillSphere',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillSphere - Learn and Grow',
    description: 'Empowering learners worldwide with quality education and skill development opportunities',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BASE_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_IMAGES_URL} />
      </head>
      <body className="antialiased">
        <HomeProvider>
          <PerformanceMonitor />
          {children}
        </HomeProvider>
      </body>
    </html>
  )
}
