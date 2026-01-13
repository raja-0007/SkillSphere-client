#!/usr/bin/env node

/**
 * Simple Yellow Variant Scanner Runner
 */

import { YellowVariantScanner } from './lib/color-audit/yellow-variant-scanner.js';

console.log('🟡 Starting comprehensive yellow variant scan...\n');

const scanner = new YellowVariantScanner();

try {
  const results = await scanner.scanProject('.');
  
  console.log('\n📊 Yellow Variant Analysis Results:');
  console.log(`   Total Yellow Usages: ${results.summary.totalYellowUsages}`);
  console.log(`   Components Analyzed: ${results.summary.componentsCounted}`);
  console.log(`   Replacement Suggestions: ${results.summary.replacementSuggestions}`);
  
  if (results.summary.contextBreakdown) {
    console.log('\n📋 Usage by Color Type:');
    Object.entries(results.summary.contextBreakdown).forEach(([context, count]) => {
      console.log(`   - ${context}: ${count} usages`);
    });
  }
  
  if (results.summary.severityBreakdown) {
    console.log('\n⚠️  Replacement Priority:');
    Object.entries(results.summary.severityBreakdown).forEach(([severity, count]) => {
      console.log(`   - ${severity}: ${count} usages`);
    });
  }
  
  // Generate and display report
  console.log('\n' + scanner.generateReport());
  
  // Export results
  await scanner.exportResults('yellow-variant-analysis.json');
  await scanner.exportReplacementScript('replace-yellow-colors.sh');
  
  console.log('\n✅ Analysis complete!');
  console.log('📁 Results saved to: yellow-variant-analysis.json');
  console.log('🔧 Replacement script: replace-yellow-colors.sh');
  
} catch (error) {
  console.error('❌ Yellow variant scan failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}