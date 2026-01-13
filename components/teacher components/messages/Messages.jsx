import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { useTeacherContext } from '@contexts/TeacherContext'
import { CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Save, MessageSquare, PartyPopper, Info } from 'lucide-react'

function Messages({ activeSection }) {
  const { messages, setMessages, filledStatus, setFilledStatus } = useTeacherContext()
  const [saved, setSaved] = useState(false)

  const saveIntoFilled = () => {
    if (!filledStatus.includes('course messsages') && !Object.values(messages).includes('')) {
      setFilledStatus([...filledStatus, 'course messsages'])
      setSaved(true)
    } else if (Object.values(messages).includes('')) {
      alert('Please fill all the fields')
    }
  }

  useEffect(() => {
    if (filledStatus.includes('course messsages')) {
      setSaved(true)
    } else setSaved(false)
  }, [])

  const messageConfig = {
    welcome: {
      icon: MessageSquare,
      title: 'Welcome Message',
      description: 'This message will be sent to students when they enroll in your course.',
      placeholder: 'Welcome to the course! I\'m excited to have you here. In this course, you\'ll learn...'
    },
    congratulations: {
      icon: PartyPopper,
      title: 'Congratulations Message',
      description: 'This message will be sent to students when they complete your course.',
      placeholder: 'Congratulations on completing the course! You\'ve done an amazing job...'
    }
  }

  return (
    <SectionLayout>
      <SectionHeader activeSection={activeSection} />
      <CardContent className='p-8'>
        <div className='flex items-start gap-3 p-4 rounded-lg bg-info/10 border border-info/20 mb-8'>
          <Info className='w-5 h-5 text-info flex-shrink-0 mt-0.5' />
          <p className='text-sm text-muted-foreground'>
            Write messages to your students that will be sent automatically when they join or complete your course 
            to encourage students to engage with course content. If you do not wish to send a message, leave the text box blank.
          </p>
        </div>

        <div className='space-y-8'>
          {Object.keys(messages).map((item, i) => {
            const config = messageConfig[item]
            const Icon = config.icon
            
            return (
              <div key={i} className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                    <Icon className='w-5 h-5' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-foreground'>{config.title}</h3>
                    <p className='text-sm text-muted-foreground'>{config.description}</p>
                  </div>
                </div>
                <textarea
                  className='w-full h-32 p-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring'
                  placeholder={config.placeholder}
                  value={messages[item]}
                  onChange={(e) => { setMessages({ ...messages, [item]: e.target.value }); setSaved(false) }}
                />
              </div>
            )
          })}
        </div>

        {/* Save Button */}
        {!saved && (
          <div className='mt-8'>
            <Button onClick={saveIntoFilled}>
              <Save className='w-4 h-4 mr-2' />
              Save Messages
            </Button>
          </div>
        )}
      </CardContent>
    </SectionLayout>
  )
}

export default Messages
