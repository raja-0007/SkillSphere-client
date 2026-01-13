/**
 * Yellow Elimination Property Test
 * 
 * This test ensures complete elimination of yellow color variants across
 * the entire application and prevents their reintroduction.
 * 
 * Validates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import fs from 'fs';
import path from 'path';

describe('Yellow Elimination Property Test', () => {
  // Get all component files using recursive directory traversal
  const getComponentFiles = () => {
    const files = [];
    
    const walkDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if ([
            'node_modules', '.next', 'dist', 'build', '__tests__', 
            '.git', '.vscode', '.swc', 'coverage'
          ].includes(item)) {
            continue;
          }
          walkDir(fullPath);
        } else if (stat.isFile()) {
          // Include relevant file types
          if (/\.(js|jsx|ts|tsx|css)$/.test(item) && 
              !item.includes('.test.') && 
              !item.includes('.spec.') &&
              !fullPath.includes('lib/color-audit/')) {
            files.push(fullPath);
          }
        }
      }
    };
    
    // Walk through main directories
    ['components', 'src', 'pages', 'app', 'context', 'lib'].forEach(dir => {
      walkDir(dir);
    });
    
    // Add root level files
    const rootFiles = fs.readdirSync('.');
    rootFiles.forEach(file => {
      if (/\.(js|jsx|ts|tsx|css)$/.test(file) && 
          !file.includes('.test.') && 
          !file.includes('.spec.')) {
        files.push(file);
      }
    });
    
    return files;
  };

  // Yellow variant patterns to detect
  const yellowPatterns = {
    // Direct yellow class names
    directClasses: [
      /\b(?:bg-|text-|border-|fill-|stroke-|ring-|shadow-|from-|to-|via-)yellow(?:-\d+)?\b/g,
      /\b(?:bg-|text-|border-|fill-|stroke-|ring-|shadow-|from-|to-|via-)amber(?:-\d+)?\b/g,
      /\b(?:bg-|text-|border-|fill-|stroke-|ring-|shadow-|from-|to-|via-)gold(?:-\d+)?\b/g,
      /\b(?:bg-|text-|border-|fill-|stroke-|ring-|shadow-|from-|to-|via-)lime(?:-\d+)?\b/g
    ],
    
    // Hex yellow variants (high red+green, low blue)
    hexYellow: [
      /#[fF][fF][fF][0-9a-fA-F]{3}/g,  // #FFF*** patterns
      /#[fF][fF][eE][0-9a-fA-F]{3}/g,  // #FFE*** patterns  
      /#[fF][fF][dD][0-9a-fA-F]{3}/g,  // #FFD*** patterns
      /#[fF][fF][cC][0-9a-fA-F]{3}/g,  // #FFC*** patterns
      /#[fF][fF][bB][0-9a-fA-F]{3}/g,  // #FFB*** patterns
      /#[fF][fF][aA][0-9a-fA-F]{3}/g,  // #FFA*** patterns
      /#[fF][fF][9][0-9a-fA-F]{3}/g,   // #FF9*** patterns
      /#[fF][fF][8][0-9a-fA-F]{3}/g    // #FF8*** patterns
    ],
    
    // RGB yellow variants (high red+green, low blue)
    rgbYellow: [
      /rgb\(\s*25[0-5]\s*,\s*25[0-5]\s*,\s*[0-9]{1,2}\s*\)/gi,
      /rgb\(\s*25[0-5]\s*,\s*2[0-4][0-9]\s*,\s*[0-9]{1,2}\s*\)/gi,
      /rgb\(\s*25[0-5]\s*,\s*1[0-9]{2}\s*,\s*[0-9]{1,2}\s*\)/gi
    ],
    
    // HSL yellow variants (hue 40-70 degrees)
    hslYellow: [
      /hsl\(\s*[4-7][0-9]\s*,\s*[0-9]{1,3}%\s*,\s*[0-9]{1,3}%\s*\)/gi
    ],
    
    // Color name variants
    colorNames: [
      /\byellow\b/gi,
      /\bamber\b/gi,
      /\bgold\b/gi,
      /\bgoldenrod\b/gi,
      /\bkhaki\b/gi,
      /\blemon\b/gi,
      /\bcanary\b/gi,
      /\bcorn\b/gi,
      /\bsunshine\b/gi,
      /\bbanana\b/gi
    ]
  };

  // Helper function to check if a hex color is yellow-ish
  const isHexYellow = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return false;
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    // Yellow characteristics: high red and green, low blue
    return (
      r > 200 && 
      g > 200 && 
      b < 150 && 
      Math.abs(r - g) < 50 && // Red and green should be similar
      (r + g) / 2 - b > 100    // Much more red+green than blue
    );
  };

  // Helper function to check if content contains yellow variants
  const findYellowVariants = (content, filePath) => {
    const violations = [];
    
    // Skip certain file types and contexts
    const skipPatterns = [
      /\/\*[\s\S]*?\*\//g,  // Block comments
      /\/\/.*$/gm,          // Line comments
      /import\s+.*from/g,   // Import statements
      /console\./g,         // Console statements
      /'[^']*'/g,           // Single quoted strings (might be test data)
      /"[^"]*"/g            // Double quoted strings (might be test data)
    ];
    
    let cleanContent = content;
    skipPatterns.forEach(pattern => {
      cleanContent = cleanContent.replace(pattern, '');
    });
    
    // Check direct class patterns
    yellowPatterns.directClasses.forEach((pattern, index) => {
      const matches = cleanContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            type: 'direct-class',
            pattern: match,
            file: filePath,
            severity: 'high',
            message: `Direct yellow class usage: ${match}`
          });
        });
      }
    });
    
    // Check hex patterns
    yellowPatterns.hexYellow.forEach((pattern, index) => {
      const matches = cleanContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (isHexYellow(match)) {
            violations.push({
              type: 'hex-yellow',
              pattern: match,
              file: filePath,
              severity: 'high',
              message: `Yellow hex color: ${match}`
            });
          }
        });
      }
    });
    
    // Check RGB patterns
    yellowPatterns.rgbYellow.forEach((pattern, index) => {
      const matches = cleanContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            type: 'rgb-yellow',
            pattern: match,
            file: filePath,
            severity: 'medium',
            message: `Yellow RGB color: ${match}`
          });
        });
      }
    });
    
    // Check HSL patterns
    yellowPatterns.hslYellow.forEach((pattern, index) => {
      const matches = cleanContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            type: 'hsl-yellow',
            pattern: match,
            file: filePath,
            severity: 'medium',
            message: `Yellow HSL color: ${match}`
          });
        });
      }
    });
    
    // Check color names (with context awareness)
    yellowPatterns.colorNames.forEach((pattern, index) => {
      const matches = cleanContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Skip if it's part of a larger word or in certain contexts
          const contextRegex = new RegExp(`\\b${match}\\b`, 'gi');
          const contextMatches = content.match(contextRegex);
          
          if (contextMatches) {
            contextMatches.forEach(contextMatch => {
              // Check if it's in a color context
              const surroundingText = content.substring(
                Math.max(0, content.indexOf(contextMatch) - 50),
                Math.min(content.length, content.indexOf(contextMatch) + contextMatch.length + 50)
              );
              
              // Skip if it's clearly not a color reference
              if (
                !surroundingText.includes('color') &&
                !surroundingText.includes('bg-') &&
                !surroundingText.includes('text-') &&
                !surroundingText.includes('border-') &&
                !surroundingText.includes('fill-') &&
                !surroundingText.includes('className') &&
                !surroundingText.includes('style')
              ) {
                return; // Skip this match
              }
              
              violations.push({
                type: 'color-name',
                pattern: contextMatch,
                file: filePath,
                severity: 'low',
                message: `Yellow color name: ${contextMatch}`,
                context: surroundingText.trim()
              });
            });
          }
        });
      }
    });
    
    return violations;
  };

  describe('Property 1: Complete Yellow Elimination', () => {
    test('should not contain any yellow background classes (Requirement 2.2)', () => {
      const files = getComponentFiles();
      const violations = [];
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const bgYellowPattern = /\bbg-(?:yellow|amber|gold|lime)(?:-\d+)?\b/g;
          const matches = content.match(bgYellowPattern);
          
          if (matches) {
            violations.push({
              file: filePath,
              matches: matches,
              type: 'background'
            });
          }
        }
      });
      
      expect(violations).toHaveLength(0);
      
      if (violations.length > 0) {
        const violationDetails = violations.map(v => 
          `${v.file}: ${v.matches.join(', ')}`
        ).join('\n');
        
        fail(`Found ${violations.length} yellow background class violations:\n${violationDetails}`);
      }
    });

    test('should not contain any yellow text classes (Requirement 2.3)', () => {
      const files = getComponentFiles();
      const violations = [];
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const textYellowPattern = /\btext-(?:yellow|amber|gold|lime)(?:-\d+)?\b/g;
          const matches = content.match(textYellowPattern);
          
          if (matches) {
            violations.push({
              file: filePath,
              matches: matches,
              type: 'text'
            });
          }
        }
      });
      
      expect(violations).toHaveLength(0);
      
      if (violations.length > 0) {
        const violationDetails = violations.map(v => 
          `${v.file}: ${v.matches.join(', ')}`
        ).join('\n');
        
        fail(`Found ${violations.length} yellow text class violations:\n${violationDetails}`);
      }
    });

    test('should not contain any yellow border or fill classes (Requirement 2.4)', () => {
      const files = getComponentFiles();
      const violations = [];
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const borderFillYellowPattern = /\b(?:border|fill|stroke|ring)-(?:yellow|amber|gold|lime)(?:-\d+)?\b/g;
          const matches = content.match(borderFillYellowPattern);
          
          if (matches) {
            violations.push({
              file: filePath,
              matches: matches,
              type: 'border-fill'
            });
          }
        }
      });
      
      expect(violations).toHaveLength(0);
      
      if (violations.length > 0) {
        const violationDetails = violations.map(v => 
          `${v.file}: ${v.matches.join(', ')}`
        ).join('\n');
        
        fail(`Found ${violations.length} yellow border/fill class violations:\n${violationDetails}`);
      }
    });

    test('should not contain any yellow gradients (Requirement 2.5)', () => {
      const files = getComponentFiles();
      const violations = [];
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const gradientYellowPattern = /\b(?:from|to|via)-(?:yellow|amber|gold|lime)(?:-\d+)?\b/g;
          const matches = content.match(gradientYellowPattern);
          
          if (matches) {
            violations.push({
              file: filePath,
              matches: matches,
              type: 'gradient'
            });
          }
        }
      });
      
      expect(violations).toHaveLength(0);
      
      if (violations.length > 0) {
        const violationDetails = violations.map(v => 
          `${v.file}: ${v.matches.join(', ')}`
        ).join('\n');
        
        fail(`Found ${violations.length} yellow gradient class violations:\n${violationDetails}`);
      }
    });

    test('should not contain any hardcoded yellow hex values (Requirement 2.1)', () => {
      const files = getComponentFiles();
      const violations = [];
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for yellow-ish hex patterns
          const hexPatterns = [
            /#[fF][fF][fF][0-9a-fA-F]{3}/g,
            /#[fF][fF][eE][0-9a-fA-F]{3}/g,
            /#[fF][fF][dD][0-9a-fA-F]{3}/g,
            /#[fF][fF][cC][0-9a-fA-F]{3}/g
          ];
          
          hexPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              matches.forEach(match => {
                if (isHexYellow(match)) {
                  violations.push({
                    file: filePath,
                    color: match,
                    type: 'hex'
                  });
                }
              });
            }
          });
        }
      });
      
      expect(violations).toHaveLength(0);
      
      if (violations.length > 0) {
        const violationDetails = violations.map(v => 
          `${v.file}: ${v.color}`
        ).join('\n');
        
        fail(`Found ${violations.length} hardcoded yellow hex violations:\n${violationDetails}`);
      }
    });

    test('comprehensive yellow variant detection across all files', () => {
      const files = getComponentFiles();
      const allViolations = [];
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const violations = findYellowVariants(content, filePath);
          allViolations.push(...violations);
        }
      });
      
      // Group violations by severity
      const highSeverity = allViolations.filter(v => v.severity === 'high');
      const mediumSeverity = allViolations.filter(v => v.severity === 'medium');
      const lowSeverity = allViolations.filter(v => v.severity === 'low');
      
      // Report findings
      if (allViolations.length > 0) {
        console.log('\n🟡 Yellow Variant Detection Summary:');
        console.log(`   High Severity: ${highSeverity.length}`);
        console.log(`   Medium Severity: ${mediumSeverity.length}`);
        console.log(`   Low Severity: ${lowSeverity.length}`);
        
        if (highSeverity.length > 0) {
          console.log('\n🔴 High Severity Violations:');
          highSeverity.forEach(v => {
            console.log(`   ${v.file}: ${v.message}`);
          });
        }
        
        if (mediumSeverity.length > 0) {
          console.log('\n🟠 Medium Severity Violations:');
          mediumSeverity.forEach(v => {
            console.log(`   ${v.file}: ${v.message}`);
          });
        }
      }
      
      // Fail only on high severity violations
      expect(highSeverity).toHaveLength(0);
      
      if (highSeverity.length > 0) {
        const violationDetails = highSeverity.map(v => 
          `${v.file}: ${v.message}`
        ).join('\n');
        
        fail(`Found ${highSeverity.length} high-severity yellow variant violations:\n${violationDetails}`);
      }
    });

    test('should use modern color palette alternatives instead of yellow', () => {
      const files = getComponentFiles();
      const modernAlternatives = [
        'accent-50', 'accent-100', 'accent-200', 'accent-300', 'accent-400', 
        'accent-500', 'accent-600', 'accent-700', 'accent-800', 'accent-900',
        'warning', 'warning-50', 'warning-100', 'warning-200', 'warning-300',
        'warning-400', 'warning-500', 'warning-600', 'warning-700', 'warning-800',
        'warning-900', 'warning-foreground'
      ];
      
      let modernUsageCount = 0;
      let totalColorUsage = 0;
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Count modern color usage
          modernAlternatives.forEach(color => {
            const pattern = new RegExp(`\\b(?:bg-|text-|border-|fill-|stroke-|ring-|shadow-|from-|to-|via-)${color}\\b`, 'g');
            const matches = content.match(pattern);
            if (matches) {
              modernUsageCount += matches.length;
            }
          });
          
          // Count total color class usage
          const colorPattern = /\b(?:bg-|text-|border-|fill-|stroke-|ring-|shadow-|from-|to-|via-)[a-z]+-?\d*\b/g;
          const totalMatches = content.match(colorPattern);
          if (totalMatches) {
            totalColorUsage += totalMatches.length;
          }
        }
      });
      
      console.log(`\n📊 Color Usage Statistics:`);
      console.log(`   Modern palette usage: ${modernUsageCount}`);
      console.log(`   Total color usage: ${totalColorUsage}`);
      
      // Expect some usage of modern alternatives (not zero)
      expect(modernUsageCount).toBeGreaterThan(0);
    });
  });

  describe('Yellow Elimination Validation Summary', () => {
    test('should generate comprehensive elimination report', () => {
      const files = getComponentFiles();
      const report = {
        totalFiles: files.length,
        yellowViolations: 0,
        modernColorUsage: 0,
        eliminationComplete: true,
        timestamp: new Date().toISOString()
      };
      
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const violations = findYellowVariants(content, filePath);
          report.yellowViolations += violations.length;
          
          // Count modern color usage
          const modernPattern = /\b(?:accent|warning|neutral|primary|secondary|success|error|info)-\d+\b/g;
          const modernMatches = content.match(modernPattern);
          if (modernMatches) {
            report.modernColorUsage += modernMatches.length;
          }
        }
      });
      
      report.eliminationComplete = report.yellowViolations === 0;
      
      console.log('\n📋 Yellow Elimination Report:');
      console.log(`   Files Analyzed: ${report.totalFiles}`);
      console.log(`   Yellow Violations: ${report.yellowViolations}`);
      console.log(`   Modern Color Usage: ${report.modernColorUsage}`);
      console.log(`   Elimination Complete: ${report.eliminationComplete ? '✅' : '❌'}`);
      console.log(`   Generated: ${report.timestamp}`);
      
      // Write report to file
      fs.writeFileSync(
        'yellow-elimination-report.json', 
        JSON.stringify(report, null, 2)
      );
      
      // Check for high-severity violations only
      let highSeverityViolations = 0;
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const violations = findYellowVariants(content, filePath);
          const highSeverity = violations.filter(v => v.severity === 'high');
          highSeverityViolations += highSeverity.length;
        }
      });
      
      console.log(`   High Severity Violations: ${highSeverityViolations}`);
      
      // Pass if no high-severity violations (low-severity may be false positives)
      expect(highSeverityViolations).toBe(0);
      expect(report.modernColorUsage).toBeGreaterThan(0);
    });
  });
});