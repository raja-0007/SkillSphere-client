import React from 'react'
import { ChevronRight } from 'lucide-react'

function QandA({ q, a }) {
  return (
    <div className='p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
      <div className='flex items-start gap-3'>
        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 className='font-semibold text-foreground mb-1'>{q}</h4>
          <p className='text-sm text-muted-foreground leading-relaxed'>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default QandA
