import React, { useEffect } from 'react'
import { Plus, Target, Users, BookOpen } from 'lucide-react'
import SectionHeader from '../SectionHeader';
import SectionLayout from '../SectionLayout';
import { useTeacherContext } from '@contexts/TeacherContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { CardContent } from '../../ui/card';

function IntendedLearners({ activeSection }) {
  const { outcomes, setOutcomes, requirements, setRequirements, intended, setIntended, filledStatus, setFilledStatus } = useTeacherContext()

  const addField = (type) => {
    if (type === 'outcome') {
      setOutcomes([...outcomes, ''])
    } else if (type === 'requirement') {
      setRequirements([...requirements, ''])
    } else if (type === 'intended') {
      setIntended([...intended, ''])
    }
  }

  const changeHandler = (e, index, type) => {
    if (type === 'outcome') {
      const newOutcomes = [...outcomes];
      newOutcomes[index] = e.target.value;
      setOutcomes(newOutcomes);
    } else if (type === 'requirement') {
      const newRequirements = [...requirements];
      newRequirements[index] = e.target.value;
      setRequirements(newRequirements);
    } else if (type === 'intended') {
      const newintended = [...intended];
      newintended[index] = e.target.value;
      setIntended(newintended);
    }
  }

  useEffect(() => {
    if (!outcomes.includes('') && !requirements.includes('') && !intended.includes('')) {
      if (!filledStatus.includes('intended learners')) setFilledStatus([...filledStatus, 'intended learners'])
    } else {
      if (filledStatus.includes('intended learners')) {
        setFilledStatus(filledStatus.filter(stat => stat !== 'intended learners'))
      }
    }
  }, [outcomes, requirements, intended])

  const sections = [
    {
      icon: Target,
      title: 'What will students learn in your course?',
      description: 'You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course.',
      type: 'outcome',
      items: outcomes,
      placeholder: 'Example: Build responsive websites using HTML, CSS, and JavaScript'
    },
    {
      icon: BookOpen,
      title: 'What are the requirements or prerequisites?',
      description: 'List the required skills, experience, tools or equipment learners should have prior to taking your course.',
      type: 'requirement',
      items: requirements,
      placeholder: 'Example: Basic understanding of HTML and CSS'
    },
    {
      icon: Users,
      title: 'Who is this course for?',
      description: 'Write a clear description of the intended learners for your course who will find your course content valuable.',
      type: 'intended',
      items: intended,
      placeholder: 'Example: Beginner web developers looking to advance their skills'
    }
  ]

  return (
    <SectionLayout>
      <SectionHeader activeSection={activeSection} />
      <CardContent className='p-8'>
        <p className='text-muted-foreground mb-8'>
          The following descriptions will be publicly visible on your Course Landing Page and will have a direct impact on your course performance.
          These descriptions will help learners decide if your course is right for them.
        </p>

        <div className='flex flex-col gap-10'>
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <div key={sectionIndex} className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className='font-semibold text-foreground'>{section.title}</h3>
                    <p className='text-sm text-muted-foreground mt-1'>{section.description}</p>
                  </div>
                </div>

                <div className='space-y-3 pl-12'>
                  {section.items.map((item, i) => (
                    <Input
                      key={i}
                      type="text"
                      value={item}
                      placeholder={section.placeholder}
                      onChange={(e) => changeHandler(e, i, section.type)}
                      className='w-full'
                    />
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addField(section.type)}
                    className='text-primary hover:text-primary hover:bg-primary/10'
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add more to your response
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </SectionLayout>
  )
}

export default IntendedLearners
