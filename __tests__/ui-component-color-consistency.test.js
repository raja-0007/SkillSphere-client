/**
 * UI Component Color Consistency Tests
 * 
 * Feature: Color Audit Plan, Property 5: Component Color Consistency
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 * 
 * Tests that all UI components use consistent color variants and follow
 * the modern color palette system without any yellow variants.
 */

const fs = require('fs')
const path = require('path')

describe('UI Component Color Consistency', () => {
  const uiComponentsDir = path.join(__dirname, '../components/ui')
  
  // Get all UI component files
  const getUIComponents = () => {
    if (!fs.existsSync(uiComponentsDir)) return []
    return fs.readdirSync(uiComponentsDir)
      .filter(file => file.endsWith('.jsx') || file.endsWith('.js'))
      .map(file => path.join(uiComponentsDir, file))
  }

  // Read component content
  const readComponent = (filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      return ''
    }
  }

  // Extract color classes from component content
  const extractColorClasses = (content) => {
    const colorClassRegex = /(?:bg-|text-|border-|fill-|stroke-)[\w-]+/g
    return content.match(colorClassRegex) || []
  }

  // Modern color palette tokens
  const modernColorTokens = [
    // Primary colors
    'primary', 'primary-50', 'primary-100', 'primary-200', 'primary-300', 'primary-400',
    'primary-500', 'primary-600', 'primary-700', 'primary-800', 'primary-900',
    'primary-foreground',
    
    // Secondary colors
    'secondary', 'secondary-50', 'secondary-100', 'secondary-200', 'secondary-300',
    'secondary-400', 'secondary-500', 'secondary-600', 'secondary-700', 'secondary-800',
    'secondary-900', 'secondary-foreground',
    
    // Accent colors
    'accent', 'accent-50', 'accent-100', 'accent-200', 'accent-300', 'accent-400',
    'accent-500', 'accent-600', 'accent-700', 'accent-800', 'accent-900',
    'accent-foreground',
    
    // Neutral colors
    'neutral-50', 'neutral-100', 'neutral-200', 'neutral-300', 'neutral-400',
    'neutral-500', 'neutral-600', 'neutral-700', 'neutral-800', 'neutral-900',
    'neutral-950',
    
    // Semantic colors
    'success', 'success-foreground', 'warning', 'warning-foreground',
    'error', 'error-foreground', 'info', 'info-foreground',
    
    // Surface colors
    'background', 'foreground', 'card', 'card-foreground',
    'popover', 'popover-foreground', 'muted', 'muted-foreground',
    'border', 'input', 'ring',
    
    // Legacy compatibility
    'destructive', 'destructive-foreground',
    
    // Standard colors (allowed for specific use cases)
    'white', 'black', 'transparent', 'current',
    'slate-50', 'slate-100', 'slate-200', 'slate-300', 'slate-400',
    'slate-500', 'slate-600', 'slate-700', 'slate-800', 'slate-900'
  ]

  // Yellow color variants (should not exist)
  const yellowVariants = [
    'yellow', 'amber-yellow', 'lime-yellow'
  ]

  test('should use only modern color palette tokens', () => {
    const components = getUIComponents()
    expect(components.length).toBeGreaterThan(0)

    components.forEach(componentPath => {
      const content = readComponent(componentPath)
      const colorClasses = extractColorClasses(content)
      
      colorClasses.forEach(colorClass => {
        const colorToken = colorClass.replace(/^(bg-|text-|border-|fill-|stroke-)/, '')
        
        // Check if it's a modern color token or standard allowed color
        const isModernToken = modernColorTokens.some(token => 
          colorToken === token || colorToken.startsWith(token + '/') || colorToken.startsWith(token + '-')
        )
        
        expect(isModernToken).toBe(true, 
          `Component ${path.basename(componentPath)} uses non-modern color token: ${colorClass}`
        )
      })
    })
  })

  test('should not contain any yellow color variants', () => {
    const components = getUIComponents()
    
    components.forEach(componentPath => {
      const content = readComponent(componentPath)
      
      // Check for yellow in class names
      yellowVariants.forEach(yellowVariant => {
        const yellowRegex = new RegExp(`\\b(?:bg-|text-|border-|fill-|stroke-)${yellowVariant}(?:-\\d+)?\\b`, 'g')
        const matches = content.match(yellowRegex)
        
        expect(matches).toBeNull(
          `Component ${path.basename(componentPath)} contains yellow variant: ${matches?.join(', ')}`
        )
      })
      
      // Check for yellow in hex values or color names
      const yellowHexRegex = /#[fF][fF][eE][0-9a-fA-F]{3}|#[fF][fF][fF][0-9a-fA-F]{3}|yellow/gi
      const yellowMatches = content.match(yellowHexRegex)
      
      expect(yellowMatches).toBeNull(
        `Component ${path.basename(componentPath)} contains yellow color values: ${yellowMatches?.join(', ')}`
      )
    })
  })

  test('should use consistent semantic color patterns', () => {
    const components = getUIComponents()
    const semanticPatterns = {
      success: ['bg-success', 'text-success', 'border-success'],
      warning: ['bg-warning', 'text-warning', 'border-warning'],
      error: ['bg-error', 'text-error', 'border-error'],
      info: ['bg-info', 'text-info', 'border-info']
    }

    components.forEach(componentPath => {
      const content = readComponent(componentPath)
      
      // If component uses semantic colors, ensure consistent usage
      Object.entries(semanticPatterns).forEach(([semantic, patterns]) => {
        const usesSemanticColor = patterns.some(pattern => content.includes(pattern))
        
        if (usesSemanticColor) {
          // Should use foreground color when using background
          if (content.includes(`bg-${semantic}`)) {
            const hasForeground = content.includes(`text-${semantic}-foreground`) || 
                                content.includes('text-white') ||
                                content.includes('text-black')
            
            expect(hasForeground).toBe(true,
              `Component ${path.basename(componentPath)} uses bg-${semantic} but lacks proper foreground color`
            )
          }
        }
      })
    })
  })

  test('should have proper hover and focus states', () => {
    const components = getUIComponents()
    
    components.forEach(componentPath => {
      const content = readComponent(componentPath)
      
      // Interactive components should have hover states
      const isInteractive = content.includes('hover:') || 
                           content.includes('focus:') ||
                           content.includes('active:') ||
                           content.includes('button') ||
                           content.includes('input')
      
      if (isInteractive) {
        // Should have transition classes for smooth color changes
        const hasTransition = content.includes('transition-colors') ||
                            content.includes('transition-all')
        
        expect(hasTransition).toBe(true,
          `Interactive component ${path.basename(componentPath)} should have color transitions`
        )
      }
    })
  })

  test('should use consistent button color variants', () => {
    const buttonComponent = path.join(uiComponentsDir, 'button.jsx')
    
    if (fs.existsSync(buttonComponent)) {
      const content = readComponent(buttonComponent)
      
      // Expected button variants
      const expectedVariants = [
        'default', 'secondary', 'accent', 'success', 'warning', 'error', 
        'info', 'destructive', 'outline', 'ghost', 'link'
      ]
      
      expectedVariants.forEach(variant => {
        expect(content).toMatch(new RegExp(`${variant}:`),
          `Button component should have ${variant} variant`
        )
      })
      
      // Should not use yellow variants
      expect(content).not.toMatch(/yellow/gi,
        'Button component should not contain yellow variants'
      )
    }
  })

  test('should use consistent form input states', () => {
    const inputComponent = path.join(uiComponentsDir, 'input.jsx')
    
    if (fs.existsSync(inputComponent)) {
      const content = readComponent(inputComponent)
      
      // Expected input states
      const expectedStates = ['default', 'success', 'warning', 'error']
      
      expectedStates.forEach(state => {
        if (state !== 'default') {
          expect(content).toMatch(new RegExp(`${state}:`),
            `Input component should have ${state} state`
          )
        }
      })
      
      // Should have proper focus states
      expect(content).toMatch(/focus-visible:ring/,
        'Input component should have focus ring states'
      )
    }
  })
})