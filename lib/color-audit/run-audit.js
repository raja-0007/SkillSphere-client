#!/usr/bin/env node

/**
 * Color Audit CLI Runner
 * 
 * Simple command-line interface for running color audits
 */

import { ColorAuditToolkit } from './index.js';
import commander from 'commander';
const { program } = commander;
import path from 'path';

// Configure CLI
program
  .name('color-audit')
  .description('Comprehensive color audit toolkit for React applications')
  .version('1.0.0');

program
  .command('full')
  .description('Run complete color audit (extraction, contrast, yellow analysis)')
  .option('-d, --dir <directory>', 'Project directory to scan', '.')
  .option('-o, --output <directory>', 'Output directory for results', './color-audit-results')
  .option('--no-reports', 'Skip generating markdown reports')
  .option('--no-scripts', 'Skip generating utility scripts')
  .action(async (options) => {
    console.log('🎨 Starting comprehensive color audit...\n');
    
    const toolkit = new ColorAuditToolkit({
      outputDir: options.output,
      includeReports: options.reports,
      includeScripts: options.scripts
    });
    
    try {
      const results = await toolkit.runFullAudit(options.dir);
      
      console.log('\n📊 Audit Summary:');
      console.log(`   Color Health Score: ${results.summary.healthScore}/100`);
      console.log(`   Components: ${results.summary.overview.totalComponents}`);
      console.log(`   Colors: ${results.summary.overview.totalColors}`);
      console.log(`   Contrast Violations: ${results.summary.overview.contrastViolations}`);
      console.log(`   Yellow Variants: ${results.summary.overview.yellowUsages}`);
      
      console.log(`\n📁 Results saved to: ${path.resolve(options.output)}`);
      
      if (results.summary.priorities.high.length > 0) {
        console.log(`\n🔴 ${results.summary.priorities.high.length} high priority items need attention`);
      }
      
    } catch (error) {
      console.error('❌ Audit failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('extract')
  .description('Extract colors from components')
  .option('-d, --dir <directory>', 'Project directory to scan', '.')
  .option('-o, --output <file>', 'Output file for results', 'color-extraction.json')
  .action(async (options) => {
    const { ColorExtractor } = await import('./color-extractor.js');
    
    console.log('📊 Extracting colors from components...');
    
    const extractor = new ColorExtractor();
    const results = await extractor.scanProject(options.dir);
    
    await extractor.exportResults(options.output);
    
    console.log(`✅ Found ${results.summary.totalColors} unique colors in ${results.summary.totalComponents} components`);
    console.log(`📁 Results saved to: ${path.resolve(options.output)}`);
  });

program
  .command('contrast')
  .description('Analyze contrast ratios for WCAG compliance')
  .option('-d, --dir <directory>', 'Project directory to scan', '.')
  .option('-o, --output <file>', 'Output file for results', 'contrast-analysis.json')
  .action(async (options) => {
    const { ColorExtractor } = await import('./color-extractor.js');
    const { ContrastValidator } = await import('./contrast-validator.js');
    
    console.log('🔍 Analyzing contrast ratios...');
    
    // First extract colors
    const extractor = new ColorExtractor();
    const extractionResults = await extractor.scanProject(options.dir);
    
    // Then analyze contrast
    const validator = new ContrastValidator();
    const results = await validator.analyzeColorCombinations(extractionResults);
    
    await validator.exportResults(options.output);
    
    console.log(`✅ Analysis complete: ${results.violations.length} violations found`);
    console.log(`📁 Results saved to: ${path.resolve(options.output)}`);
  });

program
  .command('yellow')
  .description('Scan for yellow color variants and generate replacements')
  .option('-d, --dir <directory>', 'Project directory to scan', '.')
  .option('-o, --output <file>', 'Output file for results', 'yellow-analysis.json')
  .option('-s, --script <file>', 'Output file for replacement script', 'replace-yellow-colors.sh')
  .action(async (options) => {
    const { YellowVariantScanner } = await import('./yellow-variant-scanner.js');
    
    console.log('🟡 Scanning for yellow color variants...');
    
    const scanner = new YellowVariantScanner();
    const results = await scanner.scanProject(options.dir);
    
    await scanner.exportResults(options.output);
    await scanner.exportReplacementScript(options.script);
    
    console.log(`✅ Found ${results.summary.totalYellowUsages} yellow color usages`);
    console.log(`📁 Results saved to: ${path.resolve(options.output)}`);
    console.log(`🔧 Replacement script: ${path.resolve(options.script)}`);
  });

program
  .command('health')
  .description('Quick health check - shows summary without full analysis')
  .option('-d, --dir <directory>', 'Project directory to scan', '.')
  .action(async (options) => {
    console.log('🏥 Running quick color health check...\n');
    
    const toolkit = new ColorAuditToolkit({
      outputDir: './temp-audit',
      includeReports: false,
      includeScripts: false
    });
    
    try {
      const results = await toolkit.runFullAudit(options.dir);
      
      console.log('📊 Color Health Summary:');
      console.log(`   Overall Score: ${results.summary.healthScore}/100`);
      
      const score = results.summary.healthScore;
      let status = '🔴 Needs Attention';
      if (score >= 90) status = '🟢 Excellent';
      else if (score >= 75) status = '🟡 Good';
      else if (score >= 60) status = '🟠 Fair';
      
      console.log(`   Status: ${status}`);
      console.log(`   Components: ${results.summary.overview.totalComponents}`);
      console.log(`   Unique Colors: ${results.summary.overview.totalColors}`);
      
      if (results.summary.overview.contrastViolations > 0) {
        console.log(`   ⚠️  ${results.summary.overview.contrastViolations} contrast violations`);
      }
      
      if (results.summary.overview.yellowUsages > 0) {
        console.log(`   🟡 ${results.summary.overview.yellowUsages} yellow variants found`);
      }
      
      console.log('\n💡 Run "color-audit full" for detailed analysis and recommendations');
      
      // Cleanup temp directory
      import('fs').then(fs => {
        if (fs.existsSync('./temp-audit')) {
          fs.rmSync('./temp-audit', { recursive: true, force: true });
        }
      });
      
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      process.exit(1);
    }
  });

// Add help examples
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ color-audit full                    # Run complete audit');
  console.log('  $ color-audit full -d ./src           # Audit specific directory');
  console.log('  $ color-audit health                  # Quick health check');
  console.log('  $ color-audit extract -o colors.json  # Extract colors only');
  console.log('  $ color-audit contrast                # Check contrast ratios');
  console.log('  $ color-audit yellow                  # Find yellow variants');
  console.log('');
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}