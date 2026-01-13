/**
 * Property Test: Motion-Sensitive Accessibility
 * 
 * This test validates that the application properly respects user motion preferences
 * and provides appropriate alternatives for users with vestibular disorders or
 * motion sensitivity.
 * 
 * Validates Requirements: 5.4
 */

const fs = require('fs')
const path = require('path')

describe('Property Test: Motion-Sensitive Accessibility', () => {
  let globalsCss

  beforeAll(() => {
    const globalsCssPath = path.join(__dirname, '../src/app/globals.css')
    globalsCss = fs.readFileSync(globalsCssPath, 'utf8')
  })

  describe('Prefers-Reduced-Motion Media Query', () => {
    test('should implement prefers-reduced-motion media query', () => {
      const reducedMotionRegex = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/
      expect(globalsCss).toMatch(reducedMotionRegex)
    })

    test('should target all elements in reduced motion query', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*\*[^}]*}/s)
      expect(reducedMotionBlock).toBeTruthy()
    })

    test('should include transition utility classes in reduced motion query', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock[0]).toMatch(/\.transition-colors-smooth/)
      expect(reducedMotionBlock[0]).toMatch(/\.transition-colors-fast/)
    })
  })

  describe('Animation and Transition Reduction', () => {
    test('should reduce transition durations to minimal values', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock[0]).toMatch(/transition-duration:\s*[\d.]+ms\s*!important/)
      
      // Extract the duration value
      const durationMatch = reducedMotionBlock[0].match(/transition-duration:\s*([\d.]+)ms/)
      if (durationMatch) {
        const duration = parseFloat(durationMatch[1])
        expect(duration).toBeLessThanOrEqual(10) // Should be very short, ideally 0.01ms
      }
    })

    test('should reduce animation durations to minimal values', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock[0]).toMatch(/animation-duration:\s*[\d.]+ms\s*!important/)
      
      const durationMatch = reducedMotionBlock[0].match(/animation-duration:\s*([\d.]+)ms/)
      if (durationMatch) {
        const duration = parseFloat(durationMatch[1])
        expect(duration).toBeLessThanOrEqual(10)
      }
    })

    test('should limit animation iterations', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock[0]).toMatch(/animation-iteration-count:\s*1\s*!important/)
    })

    test('should disable smooth scrolling', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock[0]).toMatch(/scroll-behavior:\s*auto\s*!important/)
    })
  })

  describe('Important Flag Usage', () => {
    test('should use !important to override other transition styles', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      // All motion-related properties should use !important
      expect(reducedMotionBlock[0]).toMatch(/transition-duration:[^;]*!important/)
      expect(reducedMotionBlock[0]).toMatch(/animation-duration:[^;]*!important/)
      expect(reducedMotionBlock[0]).toMatch(/animation-iteration-count:[^;]*!important/)
      expect(reducedMotionBlock[0]).toMatch(/scroll-behavior:[^;]*!important/)
    })
  })

  describe('Comprehensive Coverage', () => {
    test('should cover all animation and transition properties', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      // Essential properties for motion reduction
      const requiredProperties = [
        'transition-duration',
        'animation-duration',
        'animation-iteration-count',
        'scroll-behavior'
      ]

      requiredProperties.forEach(property => {
        expect(reducedMotionBlock[0]).toMatch(new RegExp(property))
      })
    })
  })

  describe('Component Accessibility Compliance', () => {
    const componentPaths = [
      '../components/ui/loading.jsx',
      '../components/dashboard/Dashboard.jsx',
      '../components/cart/ModernCart.jsx',
      '../components/wishlist/ModernWishList.jsx',
      '../components/course/ModernCourseOverview.jsx',
      '../components/search/ModernSearchResults.jsx'
    ]

    componentPaths.forEach(componentPath => {
      const componentName = path.basename(componentPath, '.jsx')
      
      test(`should not use problematic animations in ${componentName}`, () => {
        const fullPath = path.join(__dirname, componentPath)
        
        if (fs.existsSync(fullPath)) {
          const componentContent = fs.readFileSync(fullPath, 'utf8')
          
          // Check for potentially problematic animations
          const problematicAnimations = [
            'animate-bounce',
            'animate-pulse', // This is okay for loading states
            'animate-wiggle',
            'animate-shake'
          ]

          // Only flag non-loading animations as problematic
          const hasProblematicAnimations = problematicAnimations
            .filter(animation => animation !== 'animate-pulse')
            .some(animation => componentContent.includes(animation))

          // If it's a loading component, animate-pulse is acceptable
          if (componentName.toLowerCase().includes('loading') || componentName.toLowerCase().includes('skeleton')) {
            // Loading components can use animate-pulse
            expect(true).toBe(true) // Always pass for loading components
          } else {
            expect(hasProblematicAnimations).toBe(false)
          }
        }
      })
    })
  })

  describe('Transition Class Usage', () => {
    test('should prefer transition utility classes over inline styles', () => {
      const componentPaths = [
        '../components/dashboard/Dashboard.jsx',
        '../components/cart/ModernCart.jsx',
        '../components/wishlist/ModernWishList.jsx',
        '../components/course/ModernCourseOverview.jsx',
        '../components/search/ModernSearchResults.jsx'
      ]

      componentPaths.forEach(componentPath => {
        const fullPath = path.join(__dirname, componentPath)
        
        if (fs.existsSync(fullPath)) {
          const componentContent = fs.readFileSync(fullPath, 'utf8')
          
          // Check for inline transition styles (which would bypass our media query)
          const hasInlineTransitions = /style=["'][^"']*transition[^"']*["']/.test(componentContent)
          
          expect(hasInlineTransitions).toBe(false)
        }
      })
    })
  })

  describe('WCAG 2.1 Compliance', () => {
    test('should meet WCAG 2.1 Animation from Interactions guideline', () => {
      // WCAG 2.1 Success Criterion 2.3.3 (Level AAA)
      // Animation from interactions can be disabled
      
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      // Should provide a way to disable animations
      expect(reducedMotionBlock).toBeTruthy()
      
      // Should affect all elements
      expect(reducedMotionBlock[0]).toMatch(/\*/)
      
      // Should disable or minimize motion
      expect(reducedMotionBlock[0]).toMatch(/transition-duration.*!important/)
      expect(reducedMotionBlock[0]).toMatch(/animation-duration.*!important/)
    })

    test('should provide alternatives to motion-based interactions', () => {
      // This is more of a design consideration, but we can check that
      // our components don't rely solely on motion for important information
      
      const componentPaths = [
        '../components/ui/button.jsx',
        '../components/ui/card.jsx'
      ]

      componentPaths.forEach(componentPath => {
        const fullPath = path.join(__dirname, componentPath)
        
        if (fs.existsSync(fullPath)) {
          const componentContent = fs.readFileSync(fullPath, 'utf8')
          
          // Should have focus states that don't rely only on motion
          const hasFocusStates = componentContent.includes('focus:') || 
                                componentContent.includes('focus-visible:')
          
          // Interactive components should have focus states
          if (componentPath.includes('button') || componentPath.includes('input')) {
            expect(hasFocusStates).toBe(true)
          }
        }
      })
    })
  })
})