import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { Info, Upload, Image as ImageIcon, Save } from 'lucide-react'
import { useTeacherContext } from '@contexts/TeacherContext';
import Editor from '../content creation/Editor';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

function LandingPage({ activeSection }) {
  const { landingDetails, setLandingDetails, filledStatus, setFilledStatus } = useTeacherContext()
  const [saved, setSaved] = useState(false)

  const languages = ['english', 'hindi', 'telugu']
  const levels = ['beginner level', 'intermediate level', 'expert level', 'all levels']
  const categories = ['web development', 'machine learning']

  const saveIntoFilled = () => {
    if (!filledStatus.includes('course landing page') && !Object.values(landingDetails).includes('')) {
      setFilledStatus([...filledStatus, 'course landing page'])
      setSaved(true)
    } else if (Object.values(landingDetails).includes('')) {
      alert('Please enter all fields')
    }
  }

  useEffect(() => {
    if (filledStatus.includes('course landing page')) {
      setSaved(true)
    } else setSaved(false)
  }, [])

  const onSave = (currId, sectId, data) => {
    setLandingDetails({ ...landingDetails, description: data });
    setSaved(false)
  }

  const fieldLabels = {
    title: 'Course Title',
    subtitle: 'Course Subtitle',
    description: 'Course Description'
  }

  return (
    <SectionLayout>
      <SectionHeader activeSection={activeSection} />
      <CardContent className='p-8'>
        <div className='flex items-start gap-3 p-4 rounded-lg bg-info/10 border border-info/20 mb-8'>
          <Info className='w-5 h-5 text-info flex-shrink-0 mt-0.5' />
          <p className='text-sm text-muted-foreground'>
            Your course landing page is crucial to your success. If it's done right, it can also help you gain visibility in search engines like Google. 
            As you complete this section, think about creating a compelling Course Landing Page that demonstrates why someone would want to enroll in your course.
          </p>
        </div>

        <form className='space-y-8'>
          {/* Title and Subtitle */}
          {Object.keys(landingDetails).slice(0, 3).map((item, i) => (
            <div key={i} className='space-y-2'>
              <label htmlFor={item} className='text-sm font-medium text-foreground'>
                {fieldLabels[item]}
              </label>
              {item !== 'description' ? (
                <Input
                  id={item}
                  type='text'
                  placeholder={`Enter your ${fieldLabels[item].toLowerCase()}`}
                  value={landingDetails[item]}
                  onChange={(e) => { setLandingDetails({ ...landingDetails, [item]: e.target.value }); setSaved(false) }}
                />
              ) : (
                <Editor id={item} data={landingDetails[item]} onSave={onSave} />
              )}
            </div>
          ))}

          {/* Basic Info */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-foreground'>Basic Information</h3>
            <div className='grid grid-cols-3 gap-4'>
              {Object.keys(landingDetails).slice(3, 6).map((item, i) => (
                <div key={i} className='space-y-2'>
                  <label className='text-sm font-medium text-foreground capitalize'>{item}</label>
                  <select
                    className='w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                    value={landingDetails[item]}
                    onChange={(e) => { setLandingDetails({ ...landingDetails, [item]: e.target.value }); setSaved(false) }}
                  >
                    <option value="placeholder" className='text-muted-foreground'>Select {item}</option>
                    {item === 'language' ? languages.map((lang, lang_i) => (
                      <option key={lang_i} value={lang} className='capitalize'>{lang}</option>
                    ))
                      : item === 'level' ? levels.map((level, level_i) => (
                        <option key={level_i} value={level} className='capitalize'>{level}</option>
                      ))
                        : item === 'category' && categories.map((category, category_i) => (
                          <option key={category_i} value={category} className='capitalize'>{category}</option>
                        ))
                    }
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Topic */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-foreground'>What is primarily taught in your course?</label>
              <Info className='w-4 h-4 text-muted-foreground' />
            </div>
            <Input
              type="text"
              value={landingDetails.primary}
              placeholder='e.g., Web Development, Machine Learning'
              onChange={(e) => { setLandingDetails({ ...landingDetails, primary: e.target.value }); setSaved(false) }}
              className='max-w-md'
            />
          </div>

          {/* Course Image */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-foreground'>Course Image</h3>
            <div className='grid grid-cols-2 gap-6'>
              <div className='aspect-video rounded-lg border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center'>
                {landingDetails.image ? (
                  <img
                    src={URL.createObjectURL(landingDetails.image)}
                    alt="Course preview"
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='text-center p-6'>
                    <ImageIcon className='w-12 h-12 text-muted-foreground mx-auto mb-2' />
                    <p className='text-sm text-muted-foreground'>No image selected</p>
                  </div>
                )}
              </div>
              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Upload your course image here. It must meet our course image quality standards to be accepted.
                </p>
                <div className='space-y-2'>
                  <p className='text-xs text-muted-foreground'>
                    <strong>Guidelines:</strong> 750x422 pixels; .jpg, .jpeg, .gif, or .png; no text on the image.
                  </p>
                </div>
                <label className='block'>
                  <input
                    type="file"
                    className='hidden'
                    accept='image/*'
                    onChange={(e) => { setLandingDetails({ ...landingDetails, image: e.target.files[0] }); setSaved(false) }}
                  />
                  <Button type="button" variant="outline" className='w-full' asChild>
                    <span className='cursor-pointer'>
                      <Upload className='w-4 h-4 mr-2' />
                      {landingDetails.image ? 'Replace Image' : 'Upload Image'}
                    </span>
                  </Button>
                </label>
                {landingDetails.image && (
                  <Badge variant="secondary" className='text-xs'>
                    {landingDetails.image.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {!saved && (
            <div className='flex justify-end pt-4 border-t border-border'>
              <Button onClick={saveIntoFilled} type="button">
                <Save className='w-4 h-4 mr-2' />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </SectionLayout>
  )
}

export default LandingPage
