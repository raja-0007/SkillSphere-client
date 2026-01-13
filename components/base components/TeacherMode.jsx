"use client"
import React, { useState } from 'react'
import { ArrowLeft, CheckCircle2, GraduationCap } from 'lucide-react'
import Sidebar from '../teacher components/Sidebar';
import IntendedLearners from '../teacher components/course plan/IntendedLearners';
import { useHomeContext } from '@contexts/HomeContext';
import CourseStructure from '../teacher components/course plan/CourseStructure';
import Curriculum from '../teacher components/content creation/Curriculum';
import LandingPage from '../teacher components/landing page/LandingPage';
import Pricing from '../teacher components/pricing/Pricing';
import Messages from '../teacher components/messages/Messages';
import TeacherProvider from '@contexts/TeacherContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

function TeacherMode() {
  const [activeSection, setActiveSection] = useState('intended learners')
  const { setActive } = useHomeContext()
  const [isCreationDone, setIsCreationDone] = useState(false)
  
  return (
    <TeacherProvider>
      <div className='flex flex-col min-h-screen bg-background'>
        {/* Header */}
        <header className='w-full bg-primary text-primary-foreground py-3 px-6 shadow-md flex items-center justify-between sticky top-0 z-40'>
          <div className='flex items-center gap-4'>
            <Button 
              variant="ghost" 
              size="sm"
              className='flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-700'
              onClick={() => setActive('home')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className='text-sm'>Back to courses</span>
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <GraduationCap className="w-6 h-6" />
            <span className='font-semibold'>Course Creator</span>
          </div>
          <div className='w-32' /> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <div className='flex flex-1 w-full max-w-7xl mx-auto px-6 py-8 gap-8'>
          <Sidebar 
            setActiveSection={setActiveSection} 
            activeSection={activeSection} 
            goToHome={() => setActive('home')} 
            setIsCreationDone={setIsCreationDone} 
          />
          
          <main className='flex-1'>
            {activeSection === 'intended learners' ? <IntendedLearners activeSection={activeSection} />
              : (activeSection === 'course structure' || activeSection === 'film & edit') ? <CourseStructure activeSection={activeSection} />
              : (activeSection === 'curriculum') ? <Curriculum activeSection={activeSection} />
              : (activeSection === 'course landing page') ? <LandingPage activeSection={activeSection} />
              : (activeSection === 'pricing') ? <Pricing activeSection={activeSection} />
              : (activeSection === 'course messsages') && <Messages activeSection={activeSection} />
            }
          </main>
        </div>

        {/* Success Modal */}
        {isCreationDone && (
          <div 
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center'
            onClick={(e) => {
              // Close modal when clicking outside
              if (e.target === e.currentTarget) {
                setIsCreationDone(false)
              }
            }}
          >
            <Card className='w-full max-w-md mx-4 shadow-2xl'>
              <CardContent className='p-8 flex flex-col items-center text-center'>
                <div className='w-20 h-20 flex items-center justify-center rounded-full bg-success/10 text-success mb-6'>
                  <CheckCircle2 className='w-12 h-12 animate-pulse' />
                </div>
                <h2 className='text-2xl font-bold text-foreground mb-2'>Course Created!</h2>
                <p className='text-muted-foreground mb-6'>
                  Your course has been submitted successfully. You can view it in your dashboard.
                </p>
                <div className='flex gap-3 w-full'>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreationDone(false)}
                    className='flex-1'
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsCreationDone(false)
                      setActive('home')
                    }}
                    className='flex-1'
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TeacherProvider>
  )
}

export default TeacherMode
