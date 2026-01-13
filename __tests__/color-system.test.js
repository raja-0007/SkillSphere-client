/**
 * Color System Structure Tests
 * Feature: modern-color-palette, Property 1: Complete Color System Structure
 * Validates: Requirements 1.1
 */

import fs from 'fs'
import path from 'path'

describe('Color System Structure', () => {
  let cssContent
  let tailwindConfig

  beforeAll(() => {
    // Read CSS file
    const cssPath = path.join(process.cwd(), 'src/app/globals.css')
    cssContent = fs.readFileSync(cssPath, 'utf8')
    
    // Read Tailwind config
    const configPath = path.join(process.cwd(), 'tailwind.config.js')
    delete require.cache[require.resolve('../tailwind.config.js')]
    tailwindConfig = require('../tailwind.config.js')
  })

  test('Property 1: Complete Color System Structure - should define all required color categories with variants', () => {
    // Test that all required color categories are defined in Tailwind config
    const colors = tailwindConfig.theme.extend.colors
    
    // Required color categories
    const requiredCategories = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info']
    
    requiredCategories.forEach(category => {
      expect(colors).toHaveProperty(category)
      
      if (category === 'neutral') {
        // Neutral should have scale 50-900
        const expectedScales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
        expectedScales.forEach(scale => {
          expect(colors.neutral).toHaveProperty(scale)
        })
      } else if (['primary', 'secondary', 'accent'].includes(category)) {
        // Brand colors should have full scale and foreground
        const expectedScales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'DEFAULT', 'foreground']
        expectedScales.forEach(scale => {
          expect(colors[category]).toHaveProperty(scale)
        })
      } else {
        // Semantic colors should have DEFAULT and foreground
        expect(colors[category]).toHaveProperty('DEFAULT')
        expect(colors[category]).toHaveProperty('foreground')
      }
    })
  })

  test('should define CSS custom properties for all color categories in light mode', () => {
    // Check that CSS custom properties are defined for all required colors
    const requiredProperties = [
      '--primary', '--primary-foreground',
      '--secondary', '--secondary-foreground', 
      '--accent', '--accent-foreground',
      '--success', '--success-foreground',
      '--warning', '--warning-foreground',
      '--error', '--error-foreground',
      '--info', '--info-foreground'
    ]
    
    requiredProperties.forEach(property => {
      expect(cssContent).toMatch(new RegExp(`${property}:`))
    })
    
    // Check primary color scale
    const primaryScales = ['--primary-50', '--primary-100', '--primary-500', '--primary-600', '--primary-900']
    primaryScales.forEach(scale => {
      expect(cssContent).toMatch(new RegExp(`${scale}:`))
    })
    
    // Check neutral color scale
    const neutralScales = ['--neutral-50', '--neutral-100', '--neutral-500', '--neutral-900']
    neutralScales.forEach(scale => {
      expect(cssContent).toMatch(new RegExp(`${scale}:`))
    })
  })

  test('should define surface and interactive colors', () => {
    const surfaceColors = ['--background', '--foreground', '--card', '--card-foreground', '--muted', '--muted-foreground']
    const interactiveColors = ['--border', '--input', '--ring']
    
    const allColors = surfaceColors.concat(interactiveColors)
    allColors.forEach(property => {
      expect(cssContent).toMatch(new RegExp(`${property}:`))
    })
  })

  test('should maintain backward compatibility with legacy colors', () => {
    // Check that destructive is mapped to error for compatibility
    expect(tailwindConfig.theme.extend.colors).toHaveProperty('destructive')
    expect(cssContent).toMatch(/--destructive: var\(--error\)/)
  })
})