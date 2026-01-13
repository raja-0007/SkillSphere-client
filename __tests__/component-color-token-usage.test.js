/**
 * Component Color Token Usage Tests
 * Feature: modern-color-palette, Property 7: Component Color Token Usage
 * Validates: Requirements 3.1, 3.2, 3.5
 */

import fs from 'fs'
import path from 'path'

describe('Component Color Token Usage', () => {
  const componentPaths = [
    'components/ui/button.jsx',
    'components/ui/card.jsx',
    'components/ui/input.jsx',
    'components/ui/badge.jsx',
    'components/ui/progress.jsx'
  ]

  let componentContents = {}

  beforeAll(() => {
    componentPaths.forEach(componentPath => {
      const fullPath = path.join(process.cwd(), componentPath)
      if (fs.existsSync(fullPath)) {
        componentContents[componentPath] = fs.readFileSync(fullPath, 'utf8')
      }
    })
  })

  test('Property 7: Component Color Token Usage - should use theme tokens exclusively', () => {
    // Define hardcoded color patterns that should NOT exist
    const hardcodedColorPatterns = [
      /#[0-9a-fA-F]{3,6}/g,           // Hex colors like #fff, #000000
      /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,  // RGB colors
      /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g, // RGBA colors
      /hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)/g, // HSL colors (not CSS custom properties)
    ]

    // Define allowed theme tokens
    const allowedTokenPatterns = [
      /bg-primary/g, /text-primary/g, /border-primary/g,
      /bg-secondary/g, /text-secondary/g, /border-secondary/g,
      /bg-accent/g, /text-accent/g, /border-accent/g,
      /bg-success/g, /text-success/g, /border-success/g,
      /bg-warning/g, /text-warning/g, /border-warning/g,
      /bg-error/g, /text-error/g, /border-error/g,
      /bg-info/g, /text-info/g, /border-info/g,
      /bg-background/g, /text-foreground/g, /bg-card/g,
      /bg-muted/g, /text-muted-foreground/g, /border-border/g,
      /ring-ring/g, /border-input/g
    ]

    Object.entries(componentContents).forEach(([componentPath, content]) => {
      // Check for hardcoded colors
      hardcodedColorPatterns.forEach(pattern => {
        const matches = content.match(pattern)
        if (matches) {
          // Filter out comments and imports that might contain color examples
          const filteredMatches = matches.filter(match => {
            const lines = content.split('\n')
            const matchingLines = lines.filter(line => line.includes(match))
            return !matchingLines.some(line => 
              line.trim().startsWith('//') || 
              line.trim().startsWith('*') ||
              line.includes('import') ||
              line.includes('from')
            )
          })
          
          expect(filteredMatches).toHaveLength(0)
        }
      })

      // Verify that components use theme tokens
      const hasThemeTokens = allowedTokenPatterns.some(pattern => 
        pattern.test(content)
      )
      
      expect(hasThemeTokens).toBe(true)
    })
  })

  test('should use semantic color naming in component variants', () => {
    // Check that components define semantic variants
    const semanticVariants = ['success', 'warning', 'error', 'info']
    
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      if (componentPath.includes('button.jsx') || componentPath.includes('badge.jsx')) {
        // Button and Badge should have semantic variants
        semanticVariants.forEach(variant => {
          expect(content).toMatch(new RegExp(`${variant}:`))
        })
      }
    })
  })

  test('should use consistent hover and focus states', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      // If component has hover states, they should use theme tokens
      if (content.includes('hover:')) {
        // Should not use hardcoded hover colors
        expect(content).not.toMatch(/hover:bg-#[0-9a-fA-F]{3,6}/)
        expect(content).not.toMatch(/hover:text-#[0-9a-fA-F]{3,6}/)
        
        // Should use theme-based hover states
        const hasThemeHover = /hover:(bg|text|border)-(primary|secondary|accent|success|warning|error|info|muted)/.test(content)
        if (content.includes('hover:bg-') || content.includes('hover:text-')) {
          expect(hasThemeHover).toBe(true)
        }
      }

      // If component has focus states, they should use ring colors
      if (content.includes('focus-visible:ring')) {
        expect(content).toMatch(/ring-(ring|primary|secondary|accent|success|warning|error|info)/)
      }
    })
  })

  test('should use transition utilities from theme', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      if (content.includes('transition')) {
        // Should use our custom transition classes
        const hasCustomTransitions = content.includes('transition-colors-fast') || 
                                    content.includes('transition-colors-smooth') ||
                                    content.includes('transition-colors')
        
        if (content.includes('transition-')) {
          expect(hasCustomTransitions).toBe(true)
        }
      }
    })
  })

  test('should define proper foreground colors for backgrounds', () => {
    Object.entries(componentContents).forEach(([componentPath, content]) => {
      // When using colored backgrounds for text containers, should use corresponding foreground
      const backgroundMatches = content.match(/bg-(primary|secondary|accent|success|warning|error|info)(?!\w)/g)
      
      if (backgroundMatches && !componentPath.includes('progress.jsx')) {
        // Progress component doesn't need foreground colors as it's just a colored bar
        backgroundMatches.forEach(bgClass => {
          const colorName = bgClass.replace('bg-', '')
          const expectedForeground = `text-${colorName}-foreground`
          
          // Should have corresponding foreground color nearby for text containers
          if (content.includes('text-') || componentPath.includes('button.jsx') || componentPath.includes('badge.jsx')) {
            expect(content).toMatch(new RegExp(expectedForeground))
          }
        })
      }
    })
  })
})