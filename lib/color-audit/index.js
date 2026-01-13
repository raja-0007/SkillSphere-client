/**
 * Color Audit Toolkit
 * 
 * Unified interface for comprehensive color analysis including:
 * - Color extraction from React components
 * - WCAG contrast validation
 * - Yellow variant detection and replacement
 */

import { ColorExtractor } from './color-extractor.js';
import { ContrastValidator } from './contrast-validator.js';
import { YellowVariantScanner } from './yellow-variant-scanner.js';
import fs from 'fs';
import path from 'path';

export class ColorAuditToolkit {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || './color-audit-results',
      includeReports: options.includeReports !== false,
      includeScripts: options.includeScripts !== false,
      ...options
    };

    this.extractor = new ColorExtractor();
    this.validator = new ContrastValidator();
    this.yellowScanner = new YellowVariantScanner();
    
    this.results = {
      extraction: null,
      contrast: null,
      yellowAnalysis: null,
      summary: null
    };
  }

  /**
   * Run complete color audit
   */
  async runFullAudit(rootDir = '.') {
    console.log('🎨 Starting comprehensive color audit...\n');
    
    // Ensure output directory exists
    this.ensureOutputDirectory();
    
    try {
      // Step 1: Extract colors
      console.log('📊 Step 1: Extracting colors from components...');
      this.results.extraction = await this.extractor.scanProject(rootDir);
      console.log(`✅ Found ${this.results.extraction.summary.totalColors} unique colors in ${this.results.extraction.summary.totalComponents} components\n`);
      
      // Step 2: Validate contrast
      console.log('🔍 Step 2: Analyzing contrast ratios...');
      this.results.contrast = await this.validator.analyzeColorCombinations(this.results.extraction);
      console.log(`✅ Analyzed contrast ratios, found ${this.results.contrast.violations.length} violations\n`);
      
      // Step 3: Scan for yellow variants
      console.log('🟡 Step 3: Scanning for yellow variants...');
      this.results.yellowAnalysis = await this.yellowScanner.analyzeYellowUsages(this.results.extraction);
      console.log(`✅ Found ${this.results.yellowAnalysis.summary.totalYellowUsages} yellow color usages\n`);
      
      // Step 4: Generate comprehensive summary
      console.log('📋 Step 4: Generating comprehensive summary...');
      this.results.summary = this.generateComprehensiveSummary();
      
      // Step 5: Export results
      console.log('💾 Step 5: Exporting results...');
      await this.exportAllResults();
      
      console.log('🎉 Color audit completed successfully!');
      console.log(`📁 Results saved to: ${this.options.outputDir}`);
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Error during color audit:', error);
      throw error;
    }
  }

  /**
   * Run individual audit components
   */
  async runColorExtraction(rootDir = '.') {
    console.log('📊 Running color extraction...');
    this.results.extraction = await this.extractor.scanProject(rootDir);
    return this.results.extraction;
  }

  async runContrastAnalysis(extractionResults = null) {
    console.log('🔍 Running contrast analysis...');
    const extraction = extractionResults || this.results.extraction;
    if (!extraction) {
      throw new Error('Color extraction results required for contrast analysis');
    }
    this.results.contrast = await this.validator.analyzeColorCombinations(extraction);
    return this.results.contrast;
  }

  async runYellowAnalysis(extractionResults = null) {
    console.log('🟡 Running yellow variant analysis...');
    const extraction = extractionResults || this.results.extraction;
    if (!extraction) {
      throw new Error('Color extraction results required for yellow analysis');
    }
    this.results.yellowAnalysis = await this.yellowScanner.analyzeYellowUsages(extraction);
    return this.results.yellowAnalysis;
  }

  /**
   * Generate comprehensive summary
   */
  generateComprehensiveSummary() {
    const summary = {
      auditDate: new Date().toISOString(),
      overview: {
        totalComponents: this.results.extraction?.summary.totalComponents || 0,
        totalColors: this.results.extraction?.summary.totalColors || 0,
        contrastViolations: this.results.contrast?.violations.length || 0,
        yellowUsages: this.results.yellowAnalysis?.summary.totalYellowUsages || 0
      },
      priorities: this.generatePriorities(),
      recommendations: this.generateTopRecommendations(),
      healthScore: this.calculateHealthScore()
    };

    return summary;
  }

  /**
   * Generate priority action items
   */
  generatePriorities() {
    const priorities = {
      high: [],
      medium: [],
      low: []
    };

    // High priority: Contrast violations
    if (this.results.contrast?.violations) {
      const highContrastViolations = this.results.contrast.violations.filter(v => v.severity === 'high');
      priorities.high.push(...highContrastViolations.map(v => ({
        type: 'contrast',
        description: `Fix contrast violation: ${v.foreground} on ${v.background} (${v.ratio}:1)`,
        context: v.context,
        impact: 'accessibility'
      })));
    }

    // High priority: Yellow variants in critical contexts
    if (this.results.yellowAnalysis?.yellowUsages) {
      const highPriorityYellows = this.results.yellowAnalysis.yellowUsages.filter(y => y.severity === 'high');
      priorities.high.push(...highPriorityYellows.map(y => ({
        type: 'yellow',
        description: `Replace yellow variant: ${y.originalColor} in ${y.component}`,
        context: y.context,
        impact: 'design-consistency'
      })));
    }

    // Medium priority: Medium contrast violations and yellow variants
    if (this.results.contrast?.violations) {
      const mediumContrastViolations = this.results.contrast.violations.filter(v => v.severity === 'medium');
      priorities.medium.push(...mediumContrastViolations.map(v => ({
        type: 'contrast',
        description: `Improve contrast: ${v.foreground} on ${v.background} (${v.ratio}:1)`,
        context: v.context,
        impact: 'accessibility'
      })));
    }

    if (this.results.yellowAnalysis?.yellowUsages) {
      const mediumPriorityYellows = this.results.yellowAnalysis.yellowUsages.filter(y => y.severity === 'medium');
      priorities.medium.push(...mediumPriorityYellows.map(y => ({
        type: 'yellow',
        description: `Consider replacing: ${y.originalColor} in ${y.component}`,
        context: y.context,
        impact: 'design-consistency'
      })));
    }

    // Low priority: Remaining items
    if (this.results.yellowAnalysis?.yellowUsages) {
      const lowPriorityYellows = this.results.yellowAnalysis.yellowUsages.filter(y => y.severity === 'low');
      priorities.low.push(...lowPriorityYellows.map(y => ({
        type: 'yellow',
        description: `Optional replacement: ${y.originalColor} in ${y.component}`,
        context: y.context,
        impact: 'design-consistency'
      })));
    }

    return priorities;
  }

  /**
   * Generate top recommendations
   */
  generateTopRecommendations() {
    const recommendations = [];

    // Top contrast recommendations
    if (this.results.contrast?.recommendations) {
      recommendations.push(...this.results.contrast.recommendations.slice(0, 3).map(r => ({
        type: 'contrast',
        title: `Improve contrast in ${r.context}`,
        description: `Current ratio: ${r.currentRatio}:1, target: ${r.targetRatio}:1`,
        suggestions: r.suggestions.foreground.slice(0, 2).map(s => s.color)
      })));
    }

    // Top yellow replacement recommendations
    if (this.results.yellowAnalysis?.recommendations) {
      recommendations.push(...this.results.yellowAnalysis.recommendations.slice(0, 3).map(r => {
        const primarySuggestion = r.suggestions.find(s => s.priority === 'primary');
        return {
          type: 'yellow',
          title: `Replace yellow in ${r.usage.component}`,
          description: `Replace ${r.usage.originalColor} with modern alternative`,
          suggestions: [primarySuggestion?.suggested].filter(Boolean)
        };
      }));
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  /**
   * Calculate overall color health score
   */
  calculateHealthScore() {
    let score = 100;
    
    // Deduct for contrast violations
    if (this.results.contrast?.violations) {
      const highViolations = this.results.contrast.violations.filter(v => v.severity === 'high').length;
      const mediumViolations = this.results.contrast.violations.filter(v => v.severity === 'medium').length;
      
      score -= (highViolations * 15); // -15 points per high severity
      score -= (mediumViolations * 8); // -8 points per medium severity
    }
    
    // Deduct for yellow variants
    if (this.results.yellowAnalysis?.yellowUsages) {
      const yellowCount = this.results.yellowAnalysis.yellowUsages.length;
      score -= Math.min(yellowCount * 2, 20); // Max -20 points for yellows
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Ensure output directory exists
   */
  ensureOutputDirectory() {
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
  }

  /**
   * Export all results
   */
  async exportAllResults() {
    const outputDir = this.options.outputDir;
    
    // Export individual results
    if (this.results.extraction) {
      await this.extractor.exportResults(path.join(outputDir, 'color-extraction.json'));
    }
    
    if (this.results.contrast) {
      await this.validator.exportResults(path.join(outputDir, 'contrast-analysis.json'));
    }
    
    if (this.results.yellowAnalysis) {
      await this.yellowScanner.exportResults(path.join(outputDir, 'yellow-analysis.json'));
    }
    
    // Export comprehensive summary
    fs.writeFileSync(
      path.join(outputDir, 'audit-summary.json'),
      JSON.stringify(this.results.summary, null, 2)
    );
    
    // Export reports if enabled
    if (this.options.includeReports) {
      await this.exportReports();
    }
    
    // Export scripts if enabled
    if (this.options.includeScripts) {
      await this.exportScripts();
    }
  }

  /**
   * Export human-readable reports
   */
  async exportReports() {
    const outputDir = this.options.outputDir;
    
    // Comprehensive report
    const comprehensiveReport = this.generateComprehensiveReport();
    fs.writeFileSync(path.join(outputDir, 'comprehensive-report.md'), comprehensiveReport);
    
    // Individual reports
    if (this.results.extraction) {
      fs.writeFileSync(path.join(outputDir, 'color-extraction-report.md'), this.extractor.generateReport());
    }
    
    if (this.results.contrast) {
      fs.writeFileSync(path.join(outputDir, 'contrast-report.md'), this.validator.generateReport());
    }
    
    if (this.results.yellowAnalysis) {
      fs.writeFileSync(path.join(outputDir, 'yellow-analysis-report.md'), this.yellowScanner.generateReport());
    }
  }

  /**
   * Export utility scripts
   */
  async exportScripts() {
    const outputDir = this.options.outputDir;
    
    // Yellow replacement script
    if (this.results.yellowAnalysis) {
      await this.yellowScanner.exportReplacementScript(path.join(outputDir, 'replace-yellow-colors.sh'));
    }
    
    // Color migration guide
    const migrationGuide = this.generateMigrationGuide();
    fs.writeFileSync(path.join(outputDir, 'color-migration-guide.md'), migrationGuide);
  }

  /**
   * Generate comprehensive report
   */
  generateComprehensiveReport() {
    const report = [];
    
    report.push('# Comprehensive Color Audit Report\n');
    report.push(`Generated: ${new Date().toLocaleString()}\n`);
    
    // Executive Summary
    report.push('## Executive Summary\n');
    report.push(`**Color Health Score: ${this.results.summary.healthScore}/100**\n`);
    report.push(`- Components Analyzed: ${this.results.summary.overview.totalComponents}`);
    report.push(`- Unique Colors Found: ${this.results.summary.overview.totalColors}`);
    report.push(`- Contrast Violations: ${this.results.summary.overview.contrastViolations}`);
    report.push(`- Yellow Variants: ${this.results.summary.overview.yellowUsages}\n`);
    
    // Priority Actions
    report.push('## Priority Actions\n');
    
    if (this.results.summary.priorities.high.length > 0) {
      report.push('### 🔴 High Priority');
      this.results.summary.priorities.high.forEach((item, index) => {
        report.push(`${index + 1}. **${item.description}**`);
        report.push(`   - Context: ${item.context}`);
        report.push(`   - Impact: ${item.impact}\n`);
      });
    }
    
    if (this.results.summary.priorities.medium.length > 0) {
      report.push('### 🟡 Medium Priority');
      this.results.summary.priorities.medium.slice(0, 5).forEach((item, index) => {
        report.push(`${index + 1}. ${item.description}`);
        report.push(`   - Context: ${item.context}\n`);
      });
    }
    
    // Top Recommendations
    report.push('## Top Recommendations\n');
    this.results.summary.recommendations.forEach((rec, index) => {
      report.push(`### ${index + 1}. ${rec.title}`);
      report.push(`${rec.description}`);
      if (rec.suggestions.length > 0) {
        report.push(`**Suggested colors**: ${rec.suggestions.join(', ')}`);
      }
      report.push('');
    });
    
    // Next Steps
    report.push('## Next Steps\n');
    report.push('1. **Address High Priority Items**: Focus on contrast violations first for accessibility');
    report.push('2. **Review Yellow Replacements**: Use the generated replacement script as a starting point');
    report.push('3. **Test Changes**: Validate all color changes in both light and dark modes');
    report.push('4. **Update Design System**: Document approved color changes in your design system');
    report.push('5. **Re-run Audit**: Verify improvements with another audit after changes\n');
    
    // Files Generated
    report.push('## Generated Files\n');
    report.push('- `color-extraction.json` - Complete color usage data');
    report.push('- `contrast-analysis.json` - WCAG compliance analysis');
    report.push('- `yellow-analysis.json` - Yellow variant detection results');
    report.push('- `replace-yellow-colors.sh` - Automated replacement script');
    report.push('- `color-migration-guide.md` - Step-by-step migration instructions');
    
    return report.join('\n');
  }

  /**
   * Generate migration guide
   */
  generateMigrationGuide() {
    const guide = [];
    
    guide.push('# Color Migration Guide\n');
    guide.push('Step-by-step instructions for implementing color audit recommendations.\n');
    
    guide.push('## Pre-Migration Checklist\n');
    guide.push('- [ ] Backup your current codebase');
    guide.push('- [ ] Review all audit reports');
    guide.push('- [ ] Test current application in both light and dark modes');
    guide.push('- [ ] Prepare testing environment\n');
    
    guide.push('## Phase 1: Critical Accessibility Fixes\n');
    if (this.results.contrast?.violations) {
      const highPriorityViolations = this.results.contrast.violations.filter(v => v.severity === 'high');
      if (highPriorityViolations.length > 0) {
        guide.push('### High Priority Contrast Violations\n');
        highPriorityViolations.forEach((violation, index) => {
          guide.push(`${index + 1}. **${violation.context}**`);
          guide.push(`   - Current: ${violation.foreground} on ${violation.background} (${violation.ratio}:1)`);
          guide.push(`   - Required: ${violation.required}:1`);
          guide.push(`   - Action: Update color combination to meet WCAG AA standards\n`);
        });
      }
    }
    
    guide.push('## Phase 2: Yellow Variant Replacement\n');
    guide.push('### Automated Replacement');
    guide.push('1. Review the generated `replace-yellow-colors.sh` script');
    guide.push('2. Test the script on a copy of your codebase first');
    guide.push('3. Run the script: `./replace-yellow-colors.sh`');
    guide.push('4. Review all changes manually\n');
    
    guide.push('### Manual Review Required');
    if (this.results.yellowAnalysis?.yellowUsages) {
      const contextualYellows = this.results.yellowAnalysis.yellowUsages.slice(0, 5);
      contextualYellows.forEach((usage, index) => {
        guide.push(`${index + 1}. **${usage.component}** (${usage.file}:${usage.line})`);
        guide.push(`   - Current: \`${usage.originalColor}\``);
        guide.push(`   - Context: ${usage.context}`);
        guide.push(`   - Review: Check if automated replacement is appropriate\n`);
      });
    }
    
    guide.push('## Phase 3: Testing and Validation\n');
    guide.push('### Visual Testing');
    guide.push('- [ ] Test all components in light mode');
    guide.push('- [ ] Test all components in dark mode');
    guide.push('- [ ] Verify interactive states (hover, focus, active)');
    guide.push('- [ ] Check responsive behavior\n');
    
    guide.push('### Accessibility Testing');
    guide.push('- [ ] Run automated accessibility tests');
    guide.push('- [ ] Test with screen readers');
    guide.push('- [ ] Verify keyboard navigation');
    guide.push('- [ ] Check color contrast with tools\n');
    
    guide.push('## Phase 4: Documentation and Cleanup\n');
    guide.push('- [ ] Update design system documentation');
    guide.push('- [ ] Remove unused color definitions');
    guide.push('- [ ] Update component documentation');
    guide.push('- [ ] Run final color audit to verify improvements\n');
    
    guide.push('## Rollback Plan\n');
    guide.push('If issues are discovered after deployment:');
    guide.push('1. Revert to backup');
    guide.push('2. Identify specific problematic changes');
    guide.push('3. Apply fixes incrementally');
    guide.push('4. Re-test thoroughly before re-deployment');
    
    return guide.join('\n');
  }
}

// Export individual classes for direct use
export { ColorExtractor, ContrastValidator, YellowVariantScanner };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const toolkit = new ColorAuditToolkit({
    outputDir: './color-audit-results'
  });
  
  (async () => {
    try {
      await toolkit.runFullAudit();
    } catch (error) {
      console.error('Audit failed:', error);
      process.exit(1);
    }
  })();
}