import React from 'react'
import { Card } from '../ui/card'

function SectionLayout({ children }) {
  return (
    <Card className='w-full'>
      {children}
    </Card>
  )
}

export default SectionLayout
