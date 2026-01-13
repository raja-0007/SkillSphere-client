import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { useTeacherContext } from '@contexts/TeacherContext'
import { CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { DollarSign, Gift, Save, Info } from 'lucide-react'

function Pricing({ activeSection }) {
  const { price, setPrice, filledStatus, setFilledStatus } = useTeacherContext()
  const [saved, setSaved] = useState(false)
  const [isFree, setIsFree] = useState(price === 'free')

  const saveIntoFilled = () => {
    if (!filledStatus.includes('pricing') && price !== '') {
      setFilledStatus([...filledStatus, 'pricing'])
      setSaved(true)
    } else if (price === '') {
      alert('Please enter a price')
    }
  }

  const changeHandler = (e) => {
    setSaved(false)
    if (filledStatus.includes('pricing')) {
      setFilledStatus(filledStatus.filter(stat => stat !== 'pricing'))
    }
    const value = e.target.value.replace(/\D/g, '')
    if (value < 50000) setPrice(value)
  }

  const handleFreeToggle = () => {
    setSaved(false)
    setIsFree(!isFree)
    if (!isFree) {
      setPrice('free')
    } else {
      setPrice('')
    }
    if (filledStatus.includes('pricing')) {
      setFilledStatus(filledStatus.filter(stat => stat !== 'pricing'))
    }
  }

  useEffect(() => {
    if (filledStatus.includes('pricing')) {
      setSaved(true)
    } else setSaved(false)
    setIsFree(price === 'free')
  }, [])

  return (
    <SectionLayout>
      <SectionHeader activeSection={activeSection} />
      <CardContent className='p-8'>
        <div className='max-w-xl'>
          <h2 className='text-lg font-semibold text-foreground mb-2'>Set a price for your course</h2>
          <p className='text-muted-foreground mb-6'>
            Please select the currency and the price tier for your course. If you'd like to offer your course for free, 
            it must have a total video length of less than 2 hours. Also, courses with practice tests cannot be free.
          </p>

          {/* Pricing Options */}
          <div className='space-y-4'>
            {/* Free Option */}
            <button
              type="button"
              onClick={handleFreeToggle}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${isFree 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground/50'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isFree ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  <Gift className='w-5 h-5' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-foreground'>Free Course</span>
                    {isFree && <Badge variant="default" className='text-xs'>Selected</Badge>}
                  </div>
                  <p className='text-sm text-muted-foreground'>Offer your course for free to reach more students</p>
                </div>
              </div>
            </button>

            {/* Paid Option */}
            <button
              type="button"
              onClick={() => { if (isFree) handleFreeToggle() }}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${!isFree 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground/50'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${!isFree ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  <DollarSign className='w-5 h-5' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-foreground'>Paid Course</span>
                    {!isFree && <Badge variant="default" className='text-xs'>Selected</Badge>}
                  </div>
                  <p className='text-sm text-muted-foreground'>Set a price tier for your course</p>
                </div>
              </div>
            </button>
          </div>

          {/* Price Input */}
          {!isFree && (
            <div className='mt-6 p-4 rounded-lg bg-muted/50'>
              <label className='text-sm font-medium text-foreground mb-2 block'>Price (in your currency)</label>
              <div className='relative max-w-xs'>
                <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <Input
                  type="text"
                  value={price !== 'free' ? price : ''}
                  onChange={changeHandler}
                  placeholder='Enter price'
                  className='pl-9'
                />
              </div>
              <div className='flex items-start gap-2 mt-3'>
                <Info className='w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5' />
                <p className='text-xs text-muted-foreground'>
                  Maximum price is 49,999. Prices are in your local currency.
                </p>
              </div>
            </div>
          )}

          {/* Save Button */}
          {!saved && (
            <div className='mt-8'>
              <Button onClick={saveIntoFilled}>
                <Save className='w-4 h-4 mr-2' />
                Save Pricing
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </SectionLayout>
  )
}

export default Pricing
