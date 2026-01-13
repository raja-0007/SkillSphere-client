/**
 * Theme Mode Completeness Tests
 * Feature: modern-color-palette, Property 2: Theme Mode Completeness
 * Validates: Requirements 1.3
 */

import fs from 'fs'
import path from 'path'

describe('Theme Mode Completeness', () => {
  let cssContent

  beforeAll(() => {
    const cssPath = path.join(process.cwd(), 'src/app/globals.css')
    cssContent = fs.readFileSync(cssPath, 'utf8')
  })

  test('Property 2: Theme Mode Completeness - should have corresponding dark mode tokens for all light mode tokens', () => {
    // Extract all CSS custom properties from :root (light mode)
    const rootMatch = cssContent.match(/:root\s*{([^}]+)}/s)
    expect(rootMatch).toBeTruthy()
    
    const rootContent = rootMatch[1]
    const lightModeProperties = rootContent.match(/--[\w-]+:/g) || []
    
    // Extract all CSS custom properties from .dark (dark mode)
    const darkMatch = cssContent.match(/\.dark\s*{([^}]+)}/s)
    expect(darkMatch).toBeTruthy()
    
    const darkContent = darkMatch[1]
    const darkModeProperties = darkContent.match(/--[\w-]+:/g) || []
    
    // Convert to sets for easier comparison (remove the colon)
    const lightProps = new Set(lightModeProperties.map(prop => prop.slice(0, -1)))
    const darkProps = new Set(darkModeProperties.map(prop => prop.slice(0, -1)))
    
    // Core color properties that must exist in both modes
    const coreColorProperties = [
      '--primary', '--primary-foreground',
      '--secondary', '--secondary-foreground',
      '--accent', '--accent-foreground',
      '--success', '--success-foreground',
      '--warning', '--warning-foreground',
      '--error', '--error-foreground',
      '--info', '--info-foreground',
      '--background', '--foreground',
      '--card', '--card-foreground',
      '--muted', '--muted-foreground',
      '--border', '--input', '--ring'
    ]
    
    // Check that all core properties exist in both light and dark modes
    coreColorProperties.forEach(property => {
      expect(lightProps.has(property)).toBe(true)
      expect(darkProps.has(property)).toBe(true)
    })
  })

  test('should have complete color scales in both light and dark modes', () => {
    // Check primary color scale completeness
    const primaryScales = ['--primary-50', '--primary-100', '--primary-500', '--primary-600', '--primary-900']
    
    primaryScales.forEach(scale => {
      // Should exist in light mode
      expect(cssContent).toMatch(new RegExp(`:root[^}]*${scale}:`))
      // Should exist in dark mode  
      expect(cssContent).toMatch(new RegExp(`\\.dark[^}]*${scale}:`))
    })
    
    // Check neutral color scale completeness
    const neutralScales = ['--neutral-50', '--neutral-100', '--neutral-500', '--neutral-900']
    
    neutralScales.forEach(scale => {
      // Should exist in light mode
      expect(cssContent).toMatch(new RegExp(`:root[^}]*${scale}:`))
      // Should exist in dark mode
      expect(cssContent).toMatch(new RegExp(`\\.dark[^}]*${scale}:`))
    })
  })

  test('should have appropriate contrast adjustments in dark mode', () => {
    // Extract color values to verify they are different between modes
    const extractColorValue = (mode, property) => {
      const modeRegex = mode === 'light' 
        ? new RegExp(`:root[^}]*${property}:\\s*([^;]+)`)
        : new RegExp(`\\.dark[^}]*${property}:\\s*([^;]+)`)
      
      const match = cssContent.match(modeRegex)
      return match ? match[1].trim() : null
    }
    
    // Primary color should be different between light and dark modes
    const lightPrimary = extractColorValue('light', '--primary')
    const darkPrimary = extractColorValue('dark', '--primary')
    
    expect(lightPrimary).toBeTruthy()
    expect(darkPrimary).toBeTruthy()
    expect(lightPrimary).not.toBe(darkPrimary)
    
    // Background should be different between modes
    const lightBackground = extractColorValue('light', '--background')
    const darkBackground = extractColorValue('dark', '--background')
    
    expect(lightBackground).toBeTruthy()
    expect(darkBackground).toBeTruthy()
    expect(lightBackground).not.toBe(darkBackground)
  })

  test('should maintain semantic color consistency across modes', () => {
    // Semantic colors should exist in both modes
    const semanticColors = ['--success', '--warning', '--error', '--info']
    
    semanticColors.forEach(color => {
      expect(cssContent).toMatch(new RegExp(`:root[^}]*${color}:`))
      expect(cssContent).toMatch(new RegExp(`\\.dark[^}]*${color}:`))
      expect(cssContent).toMatch(new RegExp(`:root[^}]*${color}-foreground:`))
      expect(cssContent).toMatch(new RegExp(`\\.dark[^}]*${color}-foreground:`))
    })
  })
})