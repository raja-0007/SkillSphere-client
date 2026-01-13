import { useTeacherContext } from '@contexts/TeacherContext';
import React from 'react'
import { Check, Send } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

function Sidebar({ setActiveSection, activeSection, setIsCreationDone, goToHome }) {
  const { submitHandler, filledStatus } = useTeacherContext()
  
  const sections = [
    {
      name: 'Plan Your Course',
      subsections: ['intended learners', 'course structure']
    },
    {
      name: 'Create Your Content',
      subsections: ['film & edit', 'curriculum']
    },
    {
      name: 'Publish Your Course',
      subsections: ['course landing page', 'pricing', 'course messsages']
    }
  ]

  const creationFunction = async () => {
    const result = await submitHandler()
    console.log(result)
    if (result === 'success') {
      setIsCreationDone(true)
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        goToHome()
        document.body.style.overflow = ''
        setIsCreationDone(true)
      }, 5000);
    }
    else if (result === 'failed') {
      alert('Something went wrong in course creation. Please try again.')
    }
  }

  const completedCount = filledStatus.length
  const totalCount = sections.reduce((acc, s) => acc + s.subsections.length, 0)

  return (
    <aside className='w-72 flex-shrink-0'>
      <Card className='sticky top-24'>
        <CardContent className='p-6'>
          {/* Progress indicator */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-muted-foreground'>Progress</span>
              <Badge variant={completedCount === totalCount ? 'default' : 'secondary'}>
                {completedCount}/{totalCount}
              </Badge>
            </div>
            <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
              <div 
                className='h-full bg-primary transition-all duration-500 ease-out rounded-full'
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Sections */}
          <nav className='flex flex-col gap-6'>
            {sections.map((section, i) => (
              <div className='flex flex-col gap-1' key={i}>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                  {section.name}
                </span>
                {section.subsections.map((subsec, sub_i) => {
                  const isActive = activeSection === subsec
                  const isCompleted = filledStatus.includes(subsec)
                  
                  return (
                    <button
                      key={sub_i}
                      className={`
                        flex items-center gap-3 py-2 px-3 rounded-lg text-left text-sm
                        transition-all duration-200 capitalize
                        ${isActive 
                          ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                      onClick={() => setActiveSection(subsec)}
                    >
                      <span className={`
                        flex items-center justify-center w-5 h-5 rounded-full text-xs
                        ${isCompleted 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {isCompleted ? <Check className="w-3 h-3" /> : (sub_i + 1)}
                      </span>
                      <span className='flex-1'>{subsec}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>

          {/* Submit Button */}
          <Button 
            className='w-full mt-8'
            size="lg"
            onClick={creationFunction}
            disabled={completedCount < totalCount}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit for Review
          </Button>
          
          {completedCount < totalCount && (
            <p className='text-xs text-muted-foreground text-center mt-2'>
              Complete all sections to submit
            </p>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}

export default Sidebar
