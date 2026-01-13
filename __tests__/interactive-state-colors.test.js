/**
 * Interactive State Colors Tests
 * Feature: modern-color-palette, Property 8: Interactive State Color Definitions
 * Validates: Requirements 1.4, 3.3, 3.4
 */

import fs from 'fs'
import path from 'path'

describe('Interactive State Colors', () => {
  const interactiveComponentPaths = [
    'components/ui/button.jsx',
    'components/ui/input.jsx',
    'components/ui/badge.jsx'
  ]

  let componentContents = {}

  beforeAll(() => {
    interactiveComponentPaths.forEach(componentPath => {
      const fullPath = path.join(process.cwd(), componentPath)
      if (fs.existsSync(fullPath)) {
        componentContents[componentPath] = fs.readFileSync(fullPath, 'utf8')
      }
    })
  })

  test('Property 8: Interactive State Color Definitions - should define hover states for interactive elements', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      // Interactive components should have hover states
      expect(content).toMatch(/hover:/)
      
      // Hover states should use theme colors
      const hoverMatches = content.match(/hover:(bg|text|border)-[\w-]+/g)
      expect(hoverMatches).toBeTruthy()
      
      if (hoverMatches) {
        hoverMatches.forEach(hoverClass => {
          // Should use semantic color names or theme tokens
          expect(hoverClass).toMatch(/hover:(bg|text|border)-(primary|secondary|accent|success|warning|error|info|muted|background|foreground|ring)/)
        })
      }
    })
  })

  test('should define active states for buttons', () => {
    const buttonContent = componentContents['components/ui/button.jsx']
    
    if (buttonContent) {
      // Button should have active states
      expect(buttonContent).toMatch(/active:/)
      
      // Active states should use theme colors
      const activeMatches = buttonContent.match(/active:(bg|text|border)-[\w-]+/g)
      expect(activeMatches).toBeTruthy()
      
      if (activeMatches) {
        activeMatches.forEach(activeClass => {
          expect(activeClass).toMatch(/active:(bg|text|border)-(primary|secondary|accent|success|warning|error|info)/)
        })
      }
    }
  })

  test('should define focus-visible states for accessibility', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      // Interactive components should have focus states (focus-visible or focus)
      const hasFocusVisible = content.includes('focus-visible:')
      const hasFocus = content.includes('focus:')
      
      expect(hasFocusVisible || hasFocus).toBe(true)
      
      // Focus states should use ring colors
      if (content.includes('focus-visible:ring') || content.includes('focus:ring')) {
        expect(content).toMatch(/focus(-visible)?:ring-(ring|primary|secondary|accent|success|warning|error|info)/)
      }
    })
  })

  test('should use consistent state progression for buttons', () => {
    const buttonContent = componentContents['components/ui/button.jsx']
    
    if (buttonContent) {
      // Check that button variants have consistent state progression
      const variants = ['default', 'secondary', 'accent', 'success', 'warning', 'error']
      
      variants.forEach(variant => {
        if (buttonContent.includes(`${variant}:`)) {
          // Should have hover state
          const variantSection = buttonContent.match(new RegExp(`${variant}:\\s*"[^"]*"`))?.[0]
          if (variantSection) {
            expect(variantSection).toMatch(/hover:/)
          }
        }
      })
    }
  })

  test('should define validation states for form inputs', () => {
    const inputContent = componentContents['components/ui/input.jsx']
    
    if (inputContent) {
      // Input should have validation variants
      const validationStates = ['success', 'warning', 'error']
      
      validationStates.forEach(state => {
        expect(inputContent).toMatch(new RegExp(`${state}:`))
      })
      
      // Validation states should affect border and ring colors
      expect(inputContent).toMatch(/border-(success|warning|error)/)
      expect(inputContent).toMatch(/ring-(success|warning|error)/)
    }
  })

  test('should use proper disabled states', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      if (content.includes('disabled:')) {
        // Disabled states should use opacity or cursor changes
        expect(content).toMatch(/disabled:(opacity-50|cursor-not-allowed)/)
      }
    })
  })

  test('should have consistent transition timing', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      if (content.includes('transition')) {
        // Should use our custom transition classes for consistency
        const hasCustomTransition = content.includes('transition-colors-fast') || 
                                   content.includes('transition-colors-smooth') ||
                                   content.includes('transition-colors')
        
        expect(hasCustomTransition).toBe(true)
      }
    })
  })

  test('should provide visual feedback for all interactive states', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      // Count different types of interactive states
      const hoverCount = (content.match(/hover:/g) || []).length
      const focusVisibleCount = (content.match(/focus-visible:/g) || []).length
      const focusCount = (content.match(/focus:/g) || []).length
      const activeCount = (content.match(/active:/g) || []).length
      
      // Interactive components should have multiple state definitions
      const totalStates = hoverCount + focusVisibleCount + focusCount + activeCount
      expect(totalStates).toBeGreaterThan(0)
      
      // Should have at least hover and focus states
      expect(hoverCount).toBeGreaterThan(0)
      expect(focusVisibleCount + focusCount).toBeGreaterThan(0)
    })
  })
})