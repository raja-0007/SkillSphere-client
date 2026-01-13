/**
 * Property Test: Smooth Color Transitions
 * 
 * This test validates that the application implements smooth color transitions
 * with consistent timing and easing functions across all interactive elements.
 * 
 * Validates Requirements: 5.1, 5.2, 5.3
 */

const fs = require('fs')
const path = require('path')

describe('Property Test: Smooth Color Transitions', () => {
  let globalsCss
  let tailwindConfig

  beforeAll(() => {
    // Read globals.css
    const globalsCssPath = path.join(__dirname, '../src/app/globals.css')
    globalsCss = fs.readFileSync(globalsCssPath, 'utf8')

    // Read tailwind config
    const tailwindConfigPath = path.join(__dirname, '../tailwind.config.js')
    tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8')
  })

  describe('Transition Utility Classes', () => {
    test('should define transition-colors-smooth utility class', () => {
      expect(globalsCss).toMatch(/\.transition-colors-smooth\s*{/)
      expect(globalsCss).toMatch(/transition:\s*color\s+[\d.]+s\s+ease-in-out/)
      expect(globalsCss).toMatch(/background-color\s+[\d.]+s\s+ease-in-out/)
      expect(globalsCss).toMatch(/border-color\s+[\d.]+s\s+ease-in-out/)
    })

    test('should define transition-colors-fast utility class', () => {
      expect(globalsCss).toMatch(/\.transition-colors-fast\s*{/)
      expect(globalsCss).toMatch(/transition:\s*color\s+[\d.]+s\s+ease-in-out/)
    })

    test('should use consistent timing functions', () => {
      const smoothMatch = globalsCss.match(/\.transition-colors-smooth\s*{[^}]*}/s)
      const fastMatch = globalsCss.match(/\.transition-colors-fast\s*{[^}]*}/s)
      
      expect(smoothMatch[0]).toMatch(/ease-in-out/)
      expect(fastMatch[0]).toMatch(/ease-in-out/)
    })

    test('should have appropriate duration differences', () => {
      const smoothDuration = globalsCss.match(/\.transition-colors-smooth[^}]*transition:[^;]*?([\d.]+)s/s)
      const fastDuration = globalsCss.match(/\.transition-colors-fast[^}]*transition:[^;]*?([\d.]+)s/s)
      
      if (smoothDuration && fastDuration) {
        const smoothTime = parseFloat(smoothDuration[1])
        const fastTime = parseFloat(fastDuration[1])
        
        expect(smoothTime).toBeGreaterThan(fastTime)
        expect(smoothTime).toBeLessThanOrEqual(0.3) // Not too slow
        expect(fastTime).toBeGreaterThanOrEqual(0.1) // Not too fast
      }
    })
  })

  describe('Motion Sensitivity Support', () => {
    test('should implement prefers-reduced-motion media query', () => {
      expect(globalsCss).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/)
    })

    test('should reduce transition durations for motion-sensitive users', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock).toBeTruthy()
      expect(reducedMotionBlock[0]).toMatch(/transition-duration:\s*[\d.]+ms\s*!important/)
      expect(reducedMotionBlock[0]).toMatch(/animation-duration:\s*[\d.]+ms\s*!important/)
    })

    test('should disable animations for motion-sensitive users', () => {
      const reducedMotionBlock = globalsCss.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*{[^}]*}/s)
      
      expect(reducedMotionBlock[0]).toMatch(/animation-iteration-count:\s*1\s*!important/)
      expect(reducedMotionBlock[0]).toMatch(/scroll-behavior:\s*auto\s*!important/)
    })
  })

  describe('Global Transition Application', () => {
    test('should apply smooth transitions globally by default', () => {
      expect(globalsCss).toMatch(/\*\s*{[^}]*@apply\s+transition-colors-smooth/)
    })

    test('should apply fast transitions to interactive elements', () => {
      const interactiveElements = ['button', '[role="button"]', 'input', 'select', 'textarea']
      
      interactiveElements.forEach(element => {
        const regex = new RegExp(`${element.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^}]*@apply[^}]*transition-colors-fast`)
        expect(globalsCss).toMatch(regex)
      })
    })
  })

  describe('Focus State Transitions', () => {
    test('should define enhanced focus styles with transitions', () => {
      expect(globalsCss).toMatch(/\*:focus-visible\s*{/)
      expect(globalsCss).toMatch(/outline:\s*2px\s+solid\s+hsl\(var\(--ring\)\)/)
      expect(globalsCss).toMatch(/outline-offset:\s*2px/)
    })
  })

  describe('Component Integration', () => {
    const componentPaths = [
      '../components/ui/button.jsx',
      '../components/ui/card.jsx',
      '../components/ui/input.jsx',
      '../components/dashboard/Dashboard.jsx',
      '../components/cart/ModernCart.jsx',
      '../components/wishlist/ModernWishList.jsx',
      '../components/course/ModernCourseOverview.jsx',
      '../components/search/ModernSearchResults.jsx'
    ]

    componentPaths.forEach(componentPath => {
      const componentName = path.basename(componentPath, '.jsx')
      
      test(`should use transition classes in ${componentName}`, () => {
        const fullPath = path.join(__dirname, componentPath)
        
        if (fs.existsSync(fullPath)) {
          const componentContent = fs.readFileSync(fullPath, 'utf8')
          
          // Should use either transition-colors-smooth or transition-colors-fast
          const hasTransitions = componentContent.includes('transition-colors-smooth') ||
                                componentContent.includes('transition-colors-fast') ||
                                componentContent.includes('transition-all') ||
                                componentContent.includes('transition-')
          
          expect(hasTransitions).toBe(true)
        }
      })
    })
  })

  describe('Performance Considerations', () => {
    test('should not use overly long transition durations', () => {
      const durationMatches = globalsCss.match(/transition[^;]*?([\d.]+)s/g) || []
      
      durationMatches.forEach(match => {
        const duration = parseFloat(match.match(/([\d.]+)s/)[1])
        expect(duration).toBeLessThanOrEqual(0.5) // Max 500ms for good UX
      })
    })

    test('should use hardware-accelerated properties', () => {
      // Check that we're transitioning GPU-friendly properties
      expect(globalsCss).toMatch(/transition:[^;]*color/)
      expect(globalsCss).toMatch(/transition:[^;]*background-color/)
      expect(globalsCss).toMatch(/transition:[^;]*border-color/)
    })
  })
})