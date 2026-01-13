/**
 * Color Extraction Utility
 * 
 * Scans React components for color classes and extracts:
 * - Background colors (bg-*, background-*)
 * - Text colors (text-*, color-*)
 * - Border colors (border-*, border-*-*)
 * - Fill colors (fill-*)
 * 
 * Maps colors to their usage contexts and components for comprehensive analysis.
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export class ColorExtractor {
  constructor() {
    this.colorPatterns = {
      // Background color patterns
      background: [
        /\bbg-(\w+(?:-\d+)?)\b/g,
        /\bbackground-color:\s*([^;]+)/g,
        /\bbackground:\s*([^;]+)/g,
      ],
      
      // Text color patterns
      text: [
        /\btext-(\w+(?:-\d+)?)\b/g,
        /\bcolor:\s*([^;]+)/g,
      ],
      
      // Border color patterns
      border: [
        /\bborder-(\w+(?:-\d+)?)\b/g,
        /\bborder-(?:t|r|b|l|x|y)-(\w+(?:-\d+)?)\b/g,
        /\bborder-color:\s*([^;]+)/g,
        /\bborder:\s*[^;]*\s+([^;]+)/g,
      ],
      
      // Fill color patterns (for SVGs)
      fill: [
        /\bfill-(\w+(?:-\d+)?)\b/g,
        /\bfill:\s*([^;]+)/g,
      ],
      
      // Ring/outline colors
      ring: [
        /\bring-(\w+(?:-\d+)?)\b/g,
        /\boutline-(\w+(?:-\d+)?)\b/g,
      ],
      
      // Shadow colors
      shadow: [
        /\bshadow-(\w+(?:-\d+)?)\b/g,
        /\bbox-shadow:\s*[^;]*\s+([^;]+)/g,
      ]
    };
    
    this.results = {
      components: new Map(),
      colorUsage: new Map(),
      contexts: new Map(),
      summary: {
        totalComponents: 0,
        totalColors: 0,
        uniqueColors: new Set(),
        colorsByType: {
          background: new Set(),
          text: new Set(),
          border: new Set(),
          fill: new Set(),
          ring: new Set(),
          shadow: new Set()
        }
      }
    };
  }

  /**
   * Scan all React components in the project
   */
  async scanProject(rootDir = '.') {
    const componentPaths = await this.findComponentFiles(rootDir);
    
    for (const filePath of componentPaths) {
      await this.scanFile(filePath);
    }
    
    this.generateSummary();
    return this.results;
  }

  /**
   * Find all React component files
   */
  async findComponentFiles(rootDir) {
    const patterns = [
      'components/**/*.{js,jsx,ts,tsx}',
      'src/**/*.{js,jsx,ts,tsx}',
      'pages/**/*.{js,jsx,ts,tsx}',
      'app/**/*.{js,jsx,ts,tsx}'
    ];
    
    const files = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, { 
        cwd: rootDir,
        ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
      });
      files.push(...matches);
    }
    
    return [...new Set(files)]; // Remove duplicates
  }

  /**
   * Scan a single file for color usage
   */
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = path.basename(filePath, path.extname(filePath));
      
      const componentColors = {
        file: filePath,
        colors: {
          background: [],
          text: [],
          border: [],
          fill: [],
          ring: [],
          shadow: []
        },
        contexts: []
      };

      // Extract colors by type
      for (const [colorType, patterns] of Object.entries(this.colorPatterns)) {
        for (const pattern of patterns) {
          const matches = [...content.matchAll(pattern)];
          
          for (const match of matches) {
            const colorValue = match[1];
            if (colorValue && this.isValidColor(colorValue)) {
              const colorInfo = {
                value: colorValue,
                type: colorType,
                line: this.getLineNumber(content, match.index),
                context: this.extractContext(content, match.index)
              };
              
              componentColors.colors[colorType].push(colorInfo);
              this.trackColorUsage(colorValue, colorType, componentName, filePath);
            }
          }
        }
      }

      // Extract usage contexts (component types, props, etc.)
      componentColors.contexts = this.extractUsageContexts(content);
      
      this.results.components.set(componentName, componentColors);
      this.results.summary.totalComponents++;
      
    } catch (error) {
      console.warn(`Error scanning file ${filePath}:`, error.message);
    }
  }

  /**
   * Check if a color value is valid
   */
  isValidColor(colorValue) {
    // Skip obviously invalid values
    if (!colorValue || colorValue.length > 50) return false;
    
    // Skip CSS properties that aren't colors
    const nonColorKeywords = [
      'none', 'auto', 'inherit', 'initial', 'unset', 'revert',
      'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge',
      'inset', 'outset', 'hidden', 'visible', 'collapse'
    ];
    
    if (nonColorKeywords.includes(colorValue.toLowerCase())) return false;
    
    return true;
  }

  /**
   * Get line number for a match
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Extract context around a color usage
   */
  extractContext(content, index) {
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 50);
    return content.substring(start, end).replace(/\s+/g, ' ').trim();
  }

  /**
   * Track color usage across components
   */
  trackColorUsage(colorValue, colorType, componentName, filePath) {
    const key = `${colorValue}-${colorType}`;
    
    if (!this.results.colorUsage.has(key)) {
      this.results.colorUsage.set(key, {
        color: colorValue,
        type: colorType,
        usages: []
      });
    }
    
    this.results.colorUsage.get(key).usages.push({
      component: componentName,
      file: filePath
    });
    
    this.results.summary.uniqueColors.add(colorValue);
    this.results.summary.colorsByType[colorType].add(colorValue);
  }

  /**
   * Extract usage contexts from component content
   */
  extractUsageContexts(content) {
    const contexts = [];
    
    // Check for component types
    const componentPatterns = [
      /export\s+(?:default\s+)?(?:function|const)\s+(\w+)/g,
      /class\s+(\w+)\s+extends/g,
      /const\s+(\w+)\s*=\s*(?:React\.)?forwardRef/g
    ];
    
    for (const pattern of componentPatterns) {
      const matches = [...content.matchAll(pattern)];
      contexts.push(...matches.map(m => ({ type: 'component', name: m[1] })));
    }
    
    // Check for common UI patterns
    const uiPatterns = [
      { pattern: /\b(?:button|btn)\b/gi, type: 'button' },
      { pattern: /\b(?:card|panel)\b/gi, type: 'card' },
      { pattern: /\b(?:modal|dialog)\b/gi, type: 'modal' },
      { pattern: /\b(?:nav|navigation)\b/gi, type: 'navigation' },
      { pattern: /\b(?:form|input)\b/gi, type: 'form' },
      { pattern: /\b(?:header|footer)\b/gi, type: 'layout' }
    ];
    
    for (const { pattern, type } of uiPatterns) {
      if (pattern.test(content)) {
        contexts.push({ type: 'ui-pattern', name: type });
      }
    }
    
    return contexts;
  }

  /**
   * Generate summary statistics
   */
  generateSummary() {
    this.results.summary.totalColors = this.results.summary.uniqueColors.size;
    
    // Convert Sets to Arrays for JSON serialization
    this.results.summary.uniqueColors = Array.from(this.results.summary.uniqueColors);
    
    for (const [type, colorSet] of Object.entries(this.results.summary.colorsByType)) {
      this.results.summary.colorsByType[type] = Array.from(colorSet);
    }
  }

  /**
   * Get colors by specific criteria
   */
  getColorsByType(type) {
    return Array.from(this.results.colorUsage.values())
      .filter(usage => usage.type === type);
  }

  /**
   * Get most used colors
   */
  getMostUsedColors(limit = 10) {
    return Array.from(this.results.colorUsage.values())
      .sort((a, b) => b.usages.length - a.usages.length)
      .slice(0, limit);
  }

  /**
   * Get colors used in specific component types
   */
  getColorsByContext(contextType) {
    const results = [];
    
    for (const [componentName, componentData] of this.results.components) {
      const hasContext = componentData.contexts.some(ctx => 
        ctx.type === contextType || ctx.name.toLowerCase().includes(contextType.toLowerCase())
      );
      
      if (hasContext) {
        for (const [colorType, colors] of Object.entries(componentData.colors)) {
          results.push(...colors.map(color => ({
            ...color,
            component: componentName,
            file: componentData.file
          })));
        }
      }
    }
    
    return results;
  }

  /**
   * Export results to JSON file
   */
  async exportResults(outputPath = 'color-extraction-results.json') {
    const exportData = {
      ...this.results,
      components: Object.fromEntries(this.results.components),
      colorUsage: Object.fromEntries(this.results.colorUsage),
      contexts: Object.fromEntries(this.results.contexts),
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`Color extraction results exported to ${outputPath}`);
  }

  /**
   * Generate human-readable report
   */
  generateReport() {
    const report = [];
    
    report.push('# Color Extraction Report\n');
    report.push(`Generated: ${new Date().toLocaleString()}\n`);
    
    report.push('## Summary');
    report.push(`- Total Components Scanned: ${this.results.summary.totalComponents}`);
    report.push(`- Unique Colors Found: ${this.results.summary.totalColors}`);
    report.push('');
    
    report.push('## Colors by Type');
    for (const [type, colors] of Object.entries(this.results.summary.colorsByType)) {
      report.push(`### ${type.charAt(0).toUpperCase() + type.slice(1)} Colors (${colors.length})`);
      colors.slice(0, 10).forEach(color => {
        const usage = this.results.colorUsage.get(`${color}-${type}`);
        report.push(`- \`${color}\` (used in ${usage?.usages.length || 0} places)`);
      });
      if (colors.length > 10) {
        report.push(`- ... and ${colors.length - 10} more`);
      }
      report.push('');
    }
    
    report.push('## Most Used Colors');
    this.getMostUsedColors(10).forEach((usage, index) => {
      report.push(`${index + 1}. \`${usage.color}\` (${usage.type}) - ${usage.usages.length} usages`);
    });
    
    return report.join('\n');
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new ColorExtractor();
  
  (async () => {
    console.log('Starting color extraction...');
    await extractor.scanProject();
    
    console.log('\n' + extractor.generateReport());
    
    await extractor.exportResults();
  })();
}