/**
 * Yellow Variant Scanner
 * 
 * Comprehensive yellow color detection with:
 * - Detection of all yellow variants and shades
 * - Mapping to modern palette alternatives
 * - Automated replacement suggestions
 * - Context-aware recommendations
 */

import fs from 'fs';
import { ColorExtractor } from './color-extractor.js';

export class YellowVariantScanner {
  constructor() {
    // Yellow color patterns and variants
    this.yellowPatterns = {
      // Direct yellow references
      direct: [
        /\byellow\b/gi,
        /\byellow-(\d+)\b/gi,
        /\bamber\b/gi,
        /\bamber-(\d+)\b/gi,
        /\bgold\b/gi,
        /\bgoldenrod\b/gi,
        /\bkhaki\b/gi,
        /\blemon\b/gi,
        /\bcanary\b/gi,
        /\bcorn\b/gi,
        /\bsunshine\b/gi,
        /\bbanana\b/gi
      ],
      
      // Hex yellow variants
      hex: [
        /#[fF]{2}[fF]{2}[0-9a-fA-F]{2}/g,  // #FFFF** patterns
        /#[fF][fF][eE][0-9a-fA-F]{3}/g,     // #FFE*** patterns
        /#[fF][fF][dD][0-9a-fA-F]{3}/g,     // #FFD*** patterns
        /#[fF][fF][cC][0-9a-fA-F]{3}/g,     // #FFC*** patterns
        /#[fF][fF][bB][0-9a-fA-F]{3}/g,     // #FFB*** patterns
        /#[fF][fF][aA][0-9a-fA-F]{3}/g,     // #FFA*** patterns
        /#[fF][fF][9][0-9a-fA-F]{3}/g,      // #FF9*** patterns
        /#[fF][fF][8][0-9a-fA-F]{3}/g,      // #FF8*** patterns
      ],
      
      // RGB yellow variants
      rgb: [
        /rgb\(\s*25[0-5]\s*,\s*25[0-5]\s*,\s*[0-9]{1,2}\s*\)/gi,
        /rgb\(\s*25[0-5]\s*,\s*2[0-4][0-9]\s*,\s*[0-9]{1,2}\s*\)/gi,
        /rgb\(\s*25[0-5]\s*,\s*1[0-9]{2}\s*,\s*[0-9]{1,2}\s*\)/gi,
      ],
      
      // HSL yellow variants (hue 40-70 degrees)
      hsl: [
        /hsl\(\s*[4-7][0-9]\s*,\s*[0-9]{1,3}%\s*,\s*[0-9]{1,3}%\s*\)/gi,
      ]
    };

    // Modern palette alternatives for yellow variants
    this.modernAlternatives = {
      // Light yellows -> Warm neutrals or light accent
      'light-yellow': {
        primary: 'accent-50',     // Warm orange-yellow
        secondary: 'neutral-50',  // Clean neutral
        semantic: 'warning-100'   // Light warning state
      },
      
      // Medium yellows -> Accent colors
      'medium-yellow': {
        primary: 'accent-200',    // Warm accent
        secondary: 'accent-300',  // Stronger accent
        semantic: 'warning'       // Warning state
      },
      
      // Dark yellows -> Accent or warning
      'dark-yellow': {
        primary: 'accent-600',    // Deep accent
        secondary: 'accent-700',  // Darker accent
        semantic: 'warning-600'   // Strong warning
      },
      
      // Gold/amber -> Accent variants
      'gold': {
        primary: 'accent-400',    // Golden accent
        secondary: 'accent-500',  // Rich accent
        semantic: 'accent-600'    // Deep accent
      }
    };

    // Context-based recommendations
    this.contextRecommendations = {
      'button': {
        background: ['accent-500', 'warning', 'accent-600'],
        text: ['accent-foreground', 'warning-foreground'],
        border: ['accent-600', 'warning-600']
      },
      'alert': {
        background: ['warning-50', 'accent-50'],
        text: ['warning-foreground', 'warning-800'],
        border: ['warning-200', 'warning-300']
      },
      'badge': {
        background: ['accent-100', 'warning-100'],
        text: ['accent-800', 'warning-800'],
        border: ['accent-200', 'warning-200']
      },
      'text': {
        color: ['accent-600', 'accent-700', 'warning-700']
      },
      'icon': {
        fill: ['accent-500', 'warning-500', 'accent-600']
      },
      'background': {
        color: ['accent-50', 'neutral-50', 'warning-50']
      }
    };

    this.results = {
      yellowUsages: [],
      recommendations: [],
      summary: {
        totalYellowUsages: 0,
        componentsCounted: 0,
        replacementSuggestions: 0,
        contextBreakdown: {}
      }
    };
  }

  /**
   * Scan project for yellow color variants
   */
  async scanProject(rootDir = '.') {
    console.log('Scanning for yellow color variants...');
    
    // First, extract all colors
    const extractor = new ColorExtractor();
    const extractionResults = await extractor.scanProject(rootDir);
    
    // Then analyze for yellow variants
    await this.analyzeYellowUsages(extractionResults);
    
    return this.results;
  }

  /**
   * Analyze extraction results for yellow variants
   */
  async analyzeYellowUsages(extractionResults) {
    this.results.yellowUsages = [];
    this.results.recommendations = [];

    // Analyze each component
    for (const [componentName, componentData] of extractionResults.components) {
      await this.analyzeComponentYellows(componentName, componentData);
    }

    // Generate summary
    this.generateSummary();
  }

  /**
   * Analyze yellow usage in a single component
   */
  async analyzeComponentYellows(componentName, componentData) {
    const yellowUsages = [];

    // Check all color types
    for (const [colorType, colors] of Object.entries(componentData.colors)) {
      for (const colorInfo of colors) {
        if (this.isYellowVariant(colorInfo.value)) {
          const yellowUsage = {
            component: componentName,
            file: componentData.file,
            colorType,
            originalColor: colorInfo.value,
            line: colorInfo.line,
            context: colorInfo.context,
            yellowType: this.classifyYellowType(colorInfo.value),
            severity: this.assessReplacementPriority(colorInfo.value, colorType)
          };

          yellowUsages.push(yellowUsage);
          this.results.yellowUsages.push(yellowUsage);

          // Generate recommendations
          await this.generateRecommendations(yellowUsage, componentData.contexts);
        }
      }
    }

    this.results.summary.componentsCounted++;
    return yellowUsages;
  }

  /**
   * Check if a color is a yellow variant
   */
  isYellowVariant(colorValue) {
    if (!colorValue) return false;

    // Check direct patterns
    for (const pattern of this.yellowPatterns.direct) {
      if (pattern.test(colorValue)) {
        return true;
      }
    }

    // Check hex patterns
    for (const pattern of this.yellowPatterns.hex) {
      if (pattern.test(colorValue)) {
        return this.isHexYellow(colorValue);
      }
    }

    // Check RGB patterns
    for (const pattern of this.yellowPatterns.rgb) {
      if (pattern.test(colorValue)) {
        return true;
      }
    }

    // Check HSL patterns
    for (const pattern of this.yellowPatterns.hsl) {
      if (pattern.test(colorValue)) {
        return true;
      }
    }

    // Check computed yellow-ness
    return this.computeYellowness(colorValue) > 0.7;
  }

  /**
   * Check if hex color is yellow-ish
   */
  isHexYellow(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return false;

    const [r, g, b] = rgb;
    
    // Yellow characteristics: high red and green, low blue
    return (
      r > 200 && 
      g > 200 && 
      b < 150 && 
      Math.abs(r - g) < 50 && // Red and green should be similar
      (r + g) / 2 - b > 100    // Much more red+green than blue
    );
  }

  /**
   * Convert hex to RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  /**
   * Compute yellowness score (0-1)
   */
  computeYellowness(colorValue) {
    // This is a simplified yellowness calculation
    // In a real implementation, you might use more sophisticated color space analysis
    
    if (colorValue.toLowerCase().includes('yellow')) return 1.0;
    if (colorValue.toLowerCase().includes('amber')) return 0.9;
    if (colorValue.toLowerCase().includes('gold')) return 0.8;
    
    // For hex colors
    if (colorValue.startsWith('#')) {
      const rgb = this.hexToRgb(colorValue);
      if (rgb) {
        const [r, g, b] = rgb;
        // Simple yellowness: high red+green, low blue
        const yellowness = Math.min(r, g) / 255 * (1 - b / 255);
        return yellowness;
      }
    }
    
    return 0;
  }

  /**
   * Classify the type of yellow
   */
  classifyYellowType(colorValue) {
    const yellowness = this.computeYellowness(colorValue);
    
    if (colorValue.toLowerCase().includes('gold') || colorValue.toLowerCase().includes('amber')) {
      return 'gold';
    }
    
    if (yellowness > 0.9) return 'bright-yellow';
    if (yellowness > 0.7) return 'medium-yellow';
    if (yellowness > 0.5) return 'light-yellow';
    
    return 'yellow-tinted';
  }

  /**
   * Assess replacement priority
   */
  assessReplacementPriority(colorValue, colorType) {
    const yellowness = this.computeYellowness(colorValue);
    
    // High priority for bright yellows in text or backgrounds
    if (yellowness > 0.9 && (colorType === 'text' || colorType === 'background')) {
      return 'high';
    }
    
    // Medium priority for medium yellows or important UI elements
    if (yellowness > 0.7 || colorType === 'border' || colorType === 'fill') {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Generate replacement recommendations
   */
  async generateRecommendations(yellowUsage, componentContexts) {
    const recommendations = [];
    
    // Determine context
    const context = this.determineContext(yellowUsage, componentContexts);
    
    // Get context-specific recommendations
    const contextRecs = this.contextRecommendations[context] || this.contextRecommendations['text'];
    const typeRecs = this.modernAlternatives[yellowUsage.yellowType] || this.modernAlternatives['medium-yellow'];
    
    // Generate specific recommendations based on color type
    const colorTypeKey = this.mapColorTypeToContext(yellowUsage.colorType);
    const suggestions = contextRecs[colorTypeKey] || typeRecs;
    
    if (Array.isArray(suggestions)) {
      suggestions.forEach((suggestion, index) => {
        recommendations.push({
          original: yellowUsage.originalColor,
          suggested: suggestion,
          reason: this.getRecommendationReason(yellowUsage, suggestion, context),
          priority: index === 0 ? 'primary' : 'alternative',
          colorType: yellowUsage.colorType,
          context
        });
      });
    } else if (typeof suggestions === 'object') {
      Object.entries(suggestions).forEach(([key, suggestion]) => {
        recommendations.push({
          original: yellowUsage.originalColor,
          suggested: suggestion,
          reason: this.getRecommendationReason(yellowUsage, suggestion, context),
          priority: key === 'primary' ? 'primary' : 'alternative',
          colorType: yellowUsage.colorType,
          context
        });
      });
    }

    // Add to results
    this.results.recommendations.push({
      usage: yellowUsage,
      suggestions: recommendations
    });

    this.results.summary.replacementSuggestions += recommendations.length;
  }

  /**
   * Determine usage context from component data
   */
  determineContext(yellowUsage, componentContexts) {
    const { colorType, context } = yellowUsage;
    
    // Check component contexts
    for (const ctx of componentContexts) {
      if (ctx.type === 'ui-pattern') {
        return ctx.name;
      }
    }
    
    // Check context string for clues
    const contextLower = context.toLowerCase();
    if (contextLower.includes('button')) return 'button';
    if (contextLower.includes('alert') || contextLower.includes('warning')) return 'alert';
    if (contextLower.includes('badge') || contextLower.includes('tag')) return 'badge';
    if (contextLower.includes('icon')) return 'icon';
    if (contextLower.includes('background')) return 'background';
    
    // Default based on color type
    if (colorType === 'background') return 'background';
    if (colorType === 'fill') return 'icon';
    if (colorType === 'border') return 'button';
    
    return 'text';
  }

  /**
   * Map color type to context key
   */
  mapColorTypeToContext(colorType) {
    const mapping = {
      'background': 'background',
      'text': 'text',
      'border': 'border',
      'fill': 'fill',
      'ring': 'border',
      'shadow': 'border'
    };
    
    return mapping[colorType] || 'color';
  }

  /**
   * Get recommendation reason
   */
  getRecommendationReason(yellowUsage, suggestion, context) {
    const reasons = {
      'accent-50': 'Provides subtle warmth without accessibility issues',
      'accent-100': 'Light accent color with better contrast',
      'accent-200': 'Warm accent with improved readability',
      'accent-300': 'Balanced accent color for UI elements',
      'accent-400': 'Rich accent color with good contrast',
      'accent-500': 'Primary accent color from modern palette',
      'accent-600': 'Deep accent color for emphasis',
      'accent-700': 'Strong accent for important elements',
      'warning': 'Semantic warning color with proper contrast',
      'warning-50': 'Light warning background',
      'warning-100': 'Subtle warning indication',
      'warning-foreground': 'High contrast warning text',
      'neutral-50': 'Clean neutral alternative'
    };
    
    return reasons[suggestion] || `Modern ${suggestion} provides better accessibility and design consistency`;
  }

  /**
   * Generate summary statistics
   */
  generateSummary() {
    this.results.summary.totalYellowUsages = this.results.yellowUsages.length;
    
    // Context breakdown
    const contextBreakdown = {};
    this.results.yellowUsages.forEach(usage => {
      const context = usage.colorType;
      contextBreakdown[context] = (contextBreakdown[context] || 0) + 1;
    });
    this.results.summary.contextBreakdown = contextBreakdown;
    
    // Severity breakdown
    const severityBreakdown = {};
    this.results.yellowUsages.forEach(usage => {
      const severity = usage.severity;
      severityBreakdown[severity] = (severityBreakdown[severity] || 0) + 1;
    });
    this.results.summary.severityBreakdown = severityBreakdown;
  }

  /**
   * Generate replacement script
   */
  generateReplacementScript() {
    const script = [];
    
    script.push('#!/bin/bash');
    script.push('# Automated Yellow Color Replacement Script');
    script.push('# Generated by Yellow Variant Scanner');
    script.push('');
    script.push('echo "Starting yellow color replacement..."');
    script.push('');

    // Group recommendations by file
    const fileReplacements = new Map();
    
    this.results.recommendations.forEach(rec => {
      const file = rec.usage.file;
      if (!fileReplacements.has(file)) {
        fileReplacements.set(file, []);
      }
      
      // Use primary suggestion
      const primarySuggestion = rec.suggestions.find(s => s.priority === 'primary');
      if (primarySuggestion) {
        fileReplacements.get(file).push({
          original: primarySuggestion.original,
          replacement: primarySuggestion.suggested,
          line: rec.usage.line
        });
      }
    });

    // Generate sed commands for each file
    fileReplacements.forEach((replacements, file) => {
      script.push(`echo "Processing ${file}..."`);
      
      replacements.forEach(rep => {
        // Escape special characters for sed
        const escapedOriginal = rep.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedReplacement = rep.replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        script.push(`sed -i 's/${escapedOriginal}/${escapedReplacement}/g' "${file}"`);
      });
      
      script.push('');
    });

    script.push('echo "Yellow color replacement completed!"');
    script.push('echo "Please review changes and test thoroughly."');
    
    return script.join('\n');
  }

  /**
   * Export results to JSON
   */
  async exportResults(outputPath = 'yellow-variant-analysis.json') {
    const exportData = {
      ...this.results,
      generatedAt: new Date().toISOString(),
      replacementScript: this.generateReplacementScript()
    };

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`Yellow variant analysis exported to ${outputPath}`);
  }

  /**
   * Export replacement script
   */
  async exportReplacementScript(outputPath = 'replace-yellow-colors.sh') {
    const script = this.generateReplacementScript();
    fs.writeFileSync(outputPath, script);
    fs.chmodSync(outputPath, '755'); // Make executable
    console.log(`Replacement script exported to ${outputPath}`);
  }

  /**
   * Generate human-readable report
   */
  generateReport() {
    const report = [];
    
    report.push('# Yellow Variant Analysis Report\n');
    report.push(`Generated: ${new Date().toLocaleString()}\n`);
    
    report.push('## Summary');
    report.push(`- Total Yellow Usages Found: ${this.results.summary.totalYellowUsages}`);
    report.push(`- Components Analyzed: ${this.results.summary.componentsCounted}`);
    report.push(`- Replacement Suggestions: ${this.results.summary.replacementSuggestions}`);
    report.push('');
    
    if (this.results.summary.contextBreakdown) {
      report.push('## Usage by Color Type');
      Object.entries(this.results.summary.contextBreakdown).forEach(([context, count]) => {
        report.push(`- ${context}: ${count} usages`);
      });
      report.push('');
    }
    
    if (this.results.summary.severityBreakdown) {
      report.push('## Replacement Priority');
      Object.entries(this.results.summary.severityBreakdown).forEach(([severity, count]) => {
        report.push(`- ${severity}: ${count} usages`);
      });
      report.push('');
    }
    
    if (this.results.yellowUsages.length > 0) {
      report.push('## Yellow Color Usages');
      this.results.yellowUsages.slice(0, 10).forEach((usage, index) => {
        report.push(`### ${index + 1}. ${usage.component}`);
        report.push(`- **File**: ${usage.file}:${usage.line}`);
        report.push(`- **Color**: \`${usage.originalColor}\` (${usage.colorType})`);
        report.push(`- **Type**: ${usage.yellowType}`);
        report.push(`- **Priority**: ${usage.severity}`);
        report.push('');
      });
      
      if (this.results.yellowUsages.length > 10) {
        report.push(`... and ${this.results.yellowUsages.length - 10} more usages\n`);
      }
    }
    
    if (this.results.recommendations.length > 0) {
      report.push('## Top Recommendations');
      this.results.recommendations.slice(0, 5).forEach((rec, index) => {
        const primarySuggestion = rec.suggestions.find(s => s.priority === 'primary');
        if (primarySuggestion) {
          report.push(`### ${index + 1}. Replace \`${primarySuggestion.original}\` with \`${primarySuggestion.suggested}\``);
          report.push(`- **Context**: ${primarySuggestion.context}`);
          report.push(`- **Reason**: ${primarySuggestion.reason}`);
          report.push(`- **File**: ${rec.usage.file}:${rec.usage.line}`);
          report.push('');
        }
      });
    }
    
    return report.join('\n');
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const scanner = new YellowVariantScanner();
  
  (async () => {
    console.log('Starting yellow variant analysis...');
    
    await scanner.scanProject();
    
    console.log('\n' + scanner.generateReport());
    
    await scanner.exportResults();
    await scanner.exportReplacementScript();
  })();
}