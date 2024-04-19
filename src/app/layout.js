

import { Inter } from 'next/font/google'
import './globals.css'
import HomeProvider from '@/context/HomeContext'




const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Skill Sphere',
  description: 'learn and run',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <HomeProvider>
          {children}
        </HomeProvider>


      </body>
    </html>
  )
}
