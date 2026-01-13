/**
 * Contrast Ratio Validator
 * 
 * Implements WCAG 2.1 AA contrast checking with:
 * - Automated violation detection
 * - Color recommendation generation
 * - Comprehensive accessibility analysis
 */

import fs from 'fs';
import { ColorExtractor } from './color-extractor.js';

export class ContrastValidator {
  constructor() {
    // WCAG 2.1 contrast requirements
    this.contrastRequirements = {
      AA: {
        normal: 4.5,    // Normal text
        large: 3.0,     // Large text (18pt+ or 14pt+ bold)
        ui: 3.0         // UI components and graphics
      },
      AAA: {
        normal: 7.0,
        large: 4.5,
        ui: 4.5
      }
    };

    // Common color mappings from Tailwind and CSS custom properties
    this.colorMappings = new Map();
    this.initializeColorMappings();
    
    this.violations = [];
    this.recommendations = [];
  }

  /**
   * Initialize color mappings from CSS custom properties and Tailwind
   */
  initializeColorMappings() {
    // CSS Custom Properties (from globals.css)
    const cssProperties = {
      // Primary colors
      'primary': [37, 99, 235],
      'primary-50': [239, 246, 255],
      'primary-100': [219, 234, 254],
      'primary-200': [191, 219, 254],
      'primary-300': [147, 197, 253],
      'primary-400': [96, 165, 250],
      'primary-500': [59, 130, 246],
      'primary-600': [37, 99, 235],
      'primary-700': [29, 78, 216],
      'primary-800': [30, 64, 175],
      'primary-900': [30, 58, 138],
      'primary-foreground': [255, 255, 255],

      // Secondary colors
      'secondary': [139, 92, 246],
      'secondary-50': [245, 243, 255],
      'secondary-100': [237, 233, 254],
      'secondary-200': [221, 214, 254],
      'secondary-300': [196, 181, 253],
      'secondary-400': [167, 139, 250],
      'secondary-500': [139, 92, 246],
      'secondary-600': [124, 58, 237],
      'secondary-700': [109, 40, 217],
      'secondary-800': [91, 33, 182],
      'secondary-900': [76, 29, 149],
      'secondary-foreground': [255, 255, 255],

      // Accent colors
      'accent': [245, 158, 11],
      'accent-50': [255, 251, 235],
      'accent-100': [254, 243, 199],
      'accent-200': [253, 230, 138],
      'accent-300': [252, 211, 77],
      'accent-400': [251, 191, 36],
      'accent-500': [245, 158, 11],
      'accent-600': [217, 119, 6],
      'accent-700': [180, 83, 9],
      'accent-800': [146, 64, 14],
      'accent-900': [120, 53, 15],
      'accent-foreground': [255, 255, 255],

      // Neutral colors
      'neutral-50': [248, 250, 252],
      'neutral-100': [241, 245, 249],
      'neutral-200': [226, 232, 240],
      'neutral-300': [203, 213, 225],
      'neutral-400': [148, 163, 184],
      'neutral-500': [100, 116, 139],
      'neutral-600': [71, 85, 105],
      'neutral-700': [51, 65, 85],
      'neutral-800': [30, 41, 59],
      'neutral-900': [15, 23, 42],
      'neutral-950': [2, 6, 23],

      // Semantic colors
      'success': [16, 185, 129],
      'success-foreground': [255, 255, 255],
      'warning': [245, 158, 11],
      'warning-foreground': [255, 255, 255],
      'error': [239, 68, 68],
      'error-foreground': [255, 255, 255],
      'info': [6, 182, 212],
      'info-foreground': [255, 255, 255],

      // Surface colors
      'background': [248, 250, 252],
      'foreground': [15, 23, 42],
      'card': [255, 255, 255],
      'card-foreground': [15, 23, 42],
      'muted': [241, 245, 249],
      'muted-foreground': [100, 116, 139],

      // Common colors
      'white': [255, 255, 255],
      'black': [0, 0, 0],
      'transparent': null
    };

    for (const [name, rgb] of Object.entries(cssProperties)) {
      if (rgb) {
        this.colorMappings.set(name, rgb);
      }
    }
  }

  /**
   * Convert color value to RGB array
   */
  parseColor(colorValue) {
    if (!colorValue) return null;

    // Check color mappings first
    if (this.colorMappings.has(colorValue)) {
      return this.colorMappings.get(colorValue);
    }

    // Handle hex colors
    if (colorValue.startsWith('#')) {
      return this.hexToRgb(colorValue);
    }

    // Handle rgb/rgba colors
    const rgbMatch = colorValue.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const values = rgbMatch[1].split(',').map(v => parseInt(v.trim()));
      return values.slice(0, 3); // Ignore alpha
    }

    // Handle hsl colors
    const hslMatch = colorValue.match(/hsla?\(([^)]+)\)/);
    if (hslMatch) {
      const values = hslMatch[1].split(',').map(v => parseFloat(v.trim()));
      return this.hslToRgb(values[0], values[1], values[2]);
    }

    // Handle named colors
    const namedColors = {
      red: [255, 0, 0],
      green: [0, 128, 0],
      blue: [0, 0, 255],
      yellow: [255, 255, 0],
      orange: [255, 165, 0],
      purple: [128, 0, 128],
      pink: [255, 192, 203],
      gray: [128, 128, 128],
      grey: [128, 128, 128]
    };

    if (namedColors[colorValue.toLowerCase()]) {
      return namedColors[colorValue.toLowerCase()];
    }

    return null;
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
   * Convert HSL to RGB
   */
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   * Calculate relative luminance
   */
  getRelativeLuminance(rgb) {
    if (!rgb || rgb.length < 3) return 0;

    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1, color2) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);

    if (!rgb1 || !rgb2) return null;

    const l1 = this.getRelativeLuminance(rgb1);
    const l2 = this.getRelativeLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if contrast ratio meets WCAG requirements
   */
  meetsContrastRequirement(ratio, level = 'AA', textSize = 'normal') {
    if (!ratio) return false;
    return ratio >= this.contrastRequirements[level][textSize];
  }

  /**
   * Analyze color combinations from extraction results
   */
  async analyzeColorCombinations(extractionResults) {
    this.violations = [];
    this.recommendations = [];

    // Common color combinations to check
    const combinations = [
      // Text on backgrounds
      { fg: 'foreground', bg: 'background', context: 'body text' },
      { fg: 'card-foreground', bg: 'card', context: 'card content' },
      { fg: 'muted-foreground', bg: 'muted', context: 'muted text' },
      { fg: 'primary-foreground', bg: 'primary', context: 'primary buttons' },
      { fg: 'secondary-foreground', bg: 'secondary', context: 'secondary buttons' },
      { fg: 'accent-foreground', bg: 'accent', context: 'accent elements' },
      { fg: 'success-foreground', bg: 'success', context: 'success messages' },
      { fg: 'warning-foreground', bg: 'warning', context: 'warning messages' },
      { fg: 'error-foreground', bg: 'error', context: 'error messages' },
      { fg: 'info-foreground', bg: 'info', context: 'info messages' },
    ];

    for (const combo of combinations) {
      await this.checkColorCombination(combo.fg, combo.bg, combo.context);
    }

    // Check extracted color combinations
    if (extractionResults && extractionResults.components) {
      for (const [componentName, componentData] of extractionResults.components) {
        await this.analyzeComponentColors(componentName, componentData);
      }
    }

    return {
      violations: this.violations,
      recommendations: this.recommendations,
      summary: this.generateContrastSummary()
    };
  }

  /**
   * Check a specific color combination
   */
  async checkColorCombination(foregroundColor, backgroundColor, context) {
    const ratio = this.getContrastRatio(foregroundColor, backgroundColor);
    
    if (!ratio) return;

    const checks = [
      { level: 'AA', size: 'normal', label: 'Normal Text (AA)' },
      { level: 'AA', size: 'large', label: 'Large Text (AA)' },
      { level: 'AAA', size: 'normal', label: 'Normal Text (AAA)' },
      { level: 'AAA', size: 'large', label: 'Large Text (AAA)' }
    ];

    for (const check of checks) {
      const passes = this.meetsContrastRequirement(ratio, check.level, check.size);
      
      if (!passes && check.level === 'AA') {
        this.violations.push({
          foreground: foregroundColor,
          background: backgroundColor,
          context,
          ratio: ratio.toFixed(2),
          required: this.contrastRequirements[check.level][check.size],
          level: check.level,
          textSize: check.size,
          severity: ratio < 3 ? 'high' : 'medium'
        });

        // Generate recommendation
        await this.generateRecommendation(foregroundColor, backgroundColor, context, ratio, check);
      }
    }
  }

  /**
   * Analyze colors within a component
   */
  async analyzeComponentColors(componentName, componentData) {
    const backgrounds = componentData.colors.background || [];
    const texts = componentData.colors.text || [];

    // Check text colors against background colors in the same component
    for (const bg of backgrounds) {
      for (const text of texts) {
        if (Math.abs(bg.line - text.line) <= 5) { // Colors used close together
          await this.checkColorCombination(
            text.value,
            bg.value,
            `${componentName} component (lines ${text.line}-${bg.line})`
          );
        }
      }
    }
  }

  /**
   * Generate color recommendations for violations
   */
  async generateRecommendation(foreground, background, context, currentRatio, check) {
    const targetRatio = this.contrastRequirements[check.level][check.size];
    
    // Try to adjust the foreground color
    const fgRecommendations = this.generateColorVariants(foreground, background, targetRatio, 'foreground');
    
    // Try to adjust the background color
    const bgRecommendations = this.generateColorVariants(background, foreground, targetRatio, 'background');

    this.recommendations.push({
      original: { foreground, background },
      context,
      currentRatio: currentRatio.toFixed(2),
      targetRatio,
      level: check.level,
      textSize: check.size,
      suggestions: {
        foreground: fgRecommendations,
        background: bgRecommendations
      }
    });
  }

  /**
   * Generate color variants that meet contrast requirements
   */
  generateColorVariants(colorToAdjust, fixedColor, targetRatio, adjustType) {
    const variants = [];
    const fixedRgb = this.parseColor(fixedColor);
    const adjustRgb = this.parseColor(colorToAdjust);

    if (!fixedRgb || !adjustRgb) return variants;

    // Try different lightness adjustments
    const adjustments = [-0.3, -0.2, -0.1, 0.1, 0.2, 0.3, 0.4, 0.5];
    
    for (const adjustment of adjustments) {
      const newRgb = this.adjustColorLightness(adjustRgb, adjustment);
      const newHex = this.rgbToHex(newRgb);
      const ratio = this.getContrastRatio(
        adjustType === 'foreground' ? newHex : fixedColor,
        adjustType === 'background' ? newHex : fixedColor
      );

      if (ratio && ratio >= targetRatio) {
        variants.push({
          color: newHex,
          rgb: newRgb,
          ratio: ratio.toFixed(2),
          adjustment: adjustment > 0 ? 'lighter' : 'darker'
        });
      }
    }

    return variants.slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Adjust color lightness
   */
  adjustColorLightness(rgb, adjustment) {
    return rgb.map(c => {
      const adjusted = c + (adjustment * 255);
      return Math.max(0, Math.min(255, Math.round(adjusted)));
    });
  }

  /**
   * Convert RGB to hex
   */
  rgbToHex(rgb) {
    return '#' + rgb.map(c => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Generate contrast analysis summary
   */
  generateContrastSummary() {
    const totalChecks = this.violations.length + this.recommendations.length;
    const highSeverity = this.violations.filter(v => v.severity === 'high').length;
    const mediumSeverity = this.violations.filter(v => v.severity === 'medium').length;

    return {
      totalViolations: this.violations.length,
      highSeverityViolations: highSeverity,
      mediumSeverityViolations: mediumSeverity,
      totalRecommendations: this.recommendations.length,
      passRate: totalChecks > 0 ? ((totalChecks - this.violations.length) / totalChecks * 100).toFixed(1) : 100
    };
  }

  /**
   * Export contrast analysis results
   */
  async exportResults(outputPath = 'contrast-analysis-results.json') {
    const exportData = {
      violations: this.violations,
      recommendations: this.recommendations,
      summary: this.generateContrastSummary(),
      generatedAt: new Date().toISOString(),
      wcagRequirements: this.contrastRequirements
    };

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`Contrast analysis results exported to ${outputPath}`);
  }

  /**
   * Generate human-readable contrast report
   */
  generateReport() {
    const report = [];
    const summary = this.generateContrastSummary();

    report.push('# WCAG Contrast Analysis Report\n');
    report.push(`Generated: ${new Date().toLocaleString()}\n`);

    report.push('## Summary');
    report.push(`- Total Violations: ${summary.totalViolations}`);
    report.push(`- High Severity: ${summary.highSeverityViolations}`);
    report.push(`- Medium Severity: ${summary.mediumSeverityViolations}`);
    report.push(`- Pass Rate: ${summary.passRate}%`);
    report.push('');

    if (this.violations.length > 0) {
      report.push('## Contrast Violations');
      this.violations.forEach((violation, index) => {
        report.push(`### ${index + 1}. ${violation.context}`);
        report.push(`- **Colors**: ${violation.foreground} on ${violation.background}`);
        report.push(`- **Current Ratio**: ${violation.ratio}:1`);
        report.push(`- **Required**: ${violation.required}:1 (${violation.level} ${violation.textSize})`);
        report.push(`- **Severity**: ${violation.severity}`);
        report.push('');
      });
    }

    if (this.recommendations.length > 0) {
      report.push('## Recommendations');
      this.recommendations.slice(0, 5).forEach((rec, index) => {
        report.push(`### ${index + 1}. ${rec.context}`);
        report.push(`- **Current**: ${rec.currentRatio}:1 ratio`);
        report.push(`- **Target**: ${rec.targetRatio}:1 ratio`);
        
        if (rec.suggestions.foreground.length > 0) {
          report.push('- **Foreground Options**:');
          rec.suggestions.foreground.forEach(suggestion => {
            report.push(`  - ${suggestion.color} (${suggestion.ratio}:1, ${suggestion.adjustment})`);
          });
        }
        
        if (rec.suggestions.background.length > 0) {
          report.push('- **Background Options**:');
          rec.suggestions.background.forEach(suggestion => {
            report.push(`  - ${suggestion.color} (${suggestion.ratio}:1, ${suggestion.adjustment})`);
          });
        }
        report.push('');
      });
    }

    return report.join('\n');
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ContrastValidator();
  
  (async () => {
    console.log('Starting contrast analysis...');
    
    // First extract colors, then analyze contrast
    const extractor = new ColorExtractor();
    const extractionResults = await extractor.scanProject();
    
    const results = await validator.analyzeColorCombinations(extractionResults);
    
    console.log('\n' + validator.generateReport());
    
    await validator.exportResults();
  })();
}