#!/usr/bin/env node

/**
 * Simple Contrast Audit Runner
 */

import { ColorExtractor } from './lib/color-audit/color-extractor.js';
import { ContrastValidator } from './lib/color-audit/contrast-validator.js';
import fs from 'fs';

console.log('🔍 Starting comprehensive contrast audit...\n');

try {
  // First extract colors
  console.log('📊 Extracting colors from components...');
  const extractor = new ColorExtractor();
  const extractionResults = await extractor.scanProject('.');
  
  console.log(`   Found ${extractionResults.summary.totalColors} unique colors in ${extractionResults.summary.totalComponents} components`);
  
  // Then analyze contrast
  console.log('\n🎨 Analyzing contrast ratios...');
  const validator = new ContrastValidator();
  const results = await validator.analyzeColorCombinations(extractionResults);
  
  // Export results
  await validator.exportResults('contrast-audit-results.json');
  
  console.log('\n📊 Contrast Audit Results:');
  console.log(`   Total Combinations Checked: ${results.summary.totalCombinations}`);
  console.log(`   WCAG Violations: ${results.violations.length}`);
  console.log(`   AA Violations: ${results.violations.filter(v => v.level === 'AA').length}`);
  console.log(`   AAA Violations: ${results.violations.filter(v => v.level === 'AAA').length}`);
  
  if (results.violations.length > 0) {
    console.log('\n🔴 High Priority Violations:');
    const highPriority = results.violations
      .filter(v => v.level === 'AA' && parseFloat(v.ratio) < 3.0)
      .slice(0, 10);
    
    highPriority.forEach(violation => {
      const ratio = parseFloat(violation.ratio);
      console.log(`   ${violation.background} + ${violation.foreground}: ${ratio.toFixed(2)} (needs ${violation.required})`);
    });
    
    if (results.violations.length > 10) {
      console.log(`   ... and ${results.violations.length - 10} more violations`);
    }
  }
  
  console.log(`\n📁 Detailed results saved to: contrast-audit-results.json`);
  
  // Generate summary report
  const report = {
    timestamp: new Date().toISOString(),
    summary: results.summary,
    highPriorityViolations: results.violations.filter(v => v.level === 'AA' && parseFloat(v.ratio) < 3.0).length,
    mediumPriorityViolations: results.violations.filter(v => v.level === 'AA' && parseFloat(v.ratio) >= 3.0 && parseFloat(v.ratio) < 4.5).length,
    lowPriorityViolations: results.violations.filter(v => v.level === 'AAA').length,
    passRate: ((results.summary.totalCombinations - results.violations.length) / results.summary.totalCombinations * 100).toFixed(1)
  };
  
  fs.writeFileSync('contrast-audit-summary.json', JSON.stringify(report, null, 2));
  
  console.log('\n✅ Contrast audit completed successfully!');
  
} catch (error) {
  console.error('❌ Contrast audit failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}