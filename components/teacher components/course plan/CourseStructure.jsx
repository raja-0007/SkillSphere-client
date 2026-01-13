import React, { useEffect } from 'react'
import QandA from './QandA'
import SectionHeader from '../SectionHeader'
import SectionLayout from '../SectionLayout'
import { useTeacherContext } from '@contexts/TeacherContext'
import { CardContent } from '../../ui/card'
import { Card } from '../../ui/card'
import { Lightbulb, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react'
import { Badge } from '../../ui/badge'

function CourseStructure({ activeSection }) {
  const { filledStatus, setFilledStatus } = useTeacherContext()
  
  useEffect(() => {
    if (!filledStatus.includes(activeSection)) setFilledStatus([...filledStatus, activeSection])
  }, [activeSection])

  const tips = [
    {
      title: 'Start with your goals',
      description: 'Setting goals for what learners will accomplish in your course (also known as learning objectives) at the beginning will help you determine what content to include in your course and how you will teach the content to help your learners achieve the goals.'
    },
    {
      title: 'Mix and match your lecture types',
      description: 'Decide what skills you\'ll teach and how you\'ll teach them. Group related lectures into sections. Each section should have at least 3 lectures, and include at least one assignment or practical activity.'
    },
    {
      title: 'Introduce yourself and create momentum',
      description: 'People online want to start learning quickly. Make an introduction section that gives learners something to be excited about in the first 10 minutes.'
    },
    {
      title: 'Sections have a clear learning objective',
      description: 'Introduce each section by describing the section\'s goal and why it\'s important. Give lectures and sections titles that reflect their content and have a logical flow.'
    },
    {
      title: 'Lectures cover one concept',
      description: 'A good lecture length is 2-7 minutes to keep students interested and help them study in short bursts. Cover a single topic in each lecture so learners can easily find and re-watch them later.'
    },
    {
      title: 'Practice activities create hands-on learning',
      description: 'Help learners apply your lessons to their real world with projects, assignments, coding exercises, or worksheets.'
    }
  ]

  const requirements = [
    'See the complete list of course quality requirements',
    'Your course must have at least five lectures',
    'All lectures must add up to at least 30+ minutes of total video',
    'Your course is composed of valuable educational content and free of promotional or distracting materials'
  ]

  return (
    <SectionLayout>
      <SectionHeader activeSection={activeSection} />
      <CardContent className='p-0'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-primary/5 to-secondary/5 p-8'>
          <div className='flex gap-8 items-start'>
            <div className='flex-1'>
              <h2 className='text-xl font-bold text-foreground mb-3'>
                There's a course in you. Plan it out.
              </h2>
              <p className='text-muted-foreground leading-relaxed'>
                Planning your course carefully will create a clear learning path for students and help you once you film. 
                Think down to the details of each lecture including the skill you'll teach, estimated video length, 
                practical activities to include, and how you'll create introductions and summaries.
              </p>
            </div>
            <Card className='w-72 flex-shrink-0 overflow-hidden'>
              <img 
                src={activeSection === 'course structure' ? '/images/library.jpg' : '/images/video-help.jpg'} 
                alt="Resource" 
                className='w-full h-32 object-cover'
              />
              <CardContent className='p-4 text-center'>
                <h3 className='font-semibold text-foreground mb-1'>Our library of resources</h3>
                <p className='text-sm text-muted-foreground'>Tips and guides to structuring a course students love</p>
                <button className='text-primary text-sm font-medium mt-2 flex items-center gap-1 mx-auto hover:underline'>
                  Learn more <ExternalLink className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <div className='p-8 border-b border-border'>
          <div className='flex items-center gap-2 mb-6'>
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className='text-xl font-bold text-foreground'>Tips</h2>
          </div>
          <div className='grid gap-4'>
            {tips.map((tip, i) => (
              <QandA key={i} q={tip.title} a={tip.description} />
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div className='p-8'>
          <div className='flex items-center gap-2 mb-6'>
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className='text-xl font-bold text-foreground'>Requirements</h2>
          </div>
          <ul className='space-y-3'>
            {requirements.map((req, i) => (
              <li key={i} className='flex items-start gap-3'>
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className='text-muted-foreground'>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </SectionLayout>
  )
}

export default CourseStructure
