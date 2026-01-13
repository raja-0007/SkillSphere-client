# Color Audit Toolkit

A comprehensive set of utilities for analyzing and improving color usage in React applications. This toolkit provides automated tools for color extraction, WCAG contrast validation, and yellow variant detection with actionable recommendations.

## Features

### 🎨 Color Extraction (`color-extractor.js`)
- Scans React components for all color usage
- Extracts background, text, border, fill, ring, and shadow colors
- Maps colors to their usage contexts and components
- Supports Tailwind CSS classes and CSS custom properties
- Generates detailed usage statistics

### 🔍 Contrast Validation (`contrast-validator.js`)
- Implements WCAG 2.1 AA/AAA contrast checking
- Automated violation detection with severity levels
- Generates color recommendations for accessibility fixes
- Supports multiple color formats (hex, rgb, hsl, named colors)
- Provides specific suggestions for improving contrast ratios

### 🟡 Yellow Variant Scanner (`yellow-variant-scanner.js`)
- Comprehensive detection of yellow color variants
- Maps yellow colors to modern palette alternatives
- Context-aware replacement suggestions
- Generates automated replacement scripts
- Prioritizes replacements based on usage context

### 🛠️ Unified Toolkit (`index.js`)
- Runs complete color audit with all tools
- Generates comprehensive reports and summaries
- Calculates color health scores
- Provides migration guides and action plans
- Exports results in multiple formats

## Installation

The toolkit is designed to work with Node.js and ES modules. Ensure your project supports ES modules or adapt the imports as needed.

```bash
# Install required dependencies
npm install glob
```

## Usage

### Quick Start - Full Audit

```javascript
import { ColorAuditToolkit } from './lib/color-audit/index.js';

const toolkit = new ColorAuditToolkit({
  outputDir: './color-audit-results'
});

// Run complete audit
const results = await toolkit.runFullAudit();
console.log(`Color Health Score: ${results.summary.healthScore}/100`);
```

### Individual Tools

#### Color Extraction
```javascript
import { ColorExtractor } from './lib/color-audit/color-extractor.js';

const extractor = new ColorExtractor();
const results = await extractor.scanProject();

// Get most used colors
const topColors = extractor.getMostUsedColors(10);

// Get colors by type
const backgroundColors = extractor.getColorsByType('background');

// Export results
await extractor.exportResults('colors.json');
```

#### Contrast Validation
```javascript
import { ContrastValidator } from './lib/color-audit/contrast-validator.js';

const validator = new ContrastValidator();

// Analyze with extraction results
const contrastResults = await validator.analyzeColorCombinations(extractionResults);

// Check specific color combination
const ratio = validator.getContrastRatio('#000000', '#ffffff');
const passes = validator.meetsContrastRequirement(ratio, 'AA', 'normal');

// Export results
await validator.exportResults('contrast-analysis.json');
```

#### Yellow Variant Scanner
```javascript
import { YellowVariantScanner } from './lib/color-audit/yellow-variant-scanner.js';

const scanner = new YellowVariantScanner();
const results = await scanner.scanProject();

// Generate replacement script
await scanner.exportReplacementScript('replace-yellows.sh');

// Export analysis
await scanner.exportResults('yellow-analysis.json');
```

### Command Line Usage

Each tool can be run directly from the command line:

```bash
# Run full audit
node lib/color-audit/index.js

# Run individual tools
node lib/color-audit/color-extractor.js
node lib/color-audit/contrast-validator.js
node lib/color-audit/yellow-variant-scanner.js
```

## Configuration Options

### ColorAuditToolkit Options
```javascript
const toolkit = new ColorAuditToolkit({
  outputDir: './audit-results',     // Output directory for results
  includeReports: true,             // Generate markdown reports
  includeScripts: true,             // Generate utility scripts
});
```

### File Patterns
The tools automatically scan these file patterns:
- `components/**/*.{js,jsx,ts,tsx}`
- `src/**/*.{js,jsx,ts,tsx}`
- `pages/**/*.{js,jsx,ts,tsx}`
- `app/**/*.{js,jsx,ts,tsx}`

Excluded directories:
- `node_modules/**`
- `.next/**`
- `dist/**`
- `build/**`

## Output Files

### JSON Data Files
- `color-extraction.json` - Complete color usage data
- `contrast-analysis.json` - WCAG compliance analysis
- `yellow-analysis.json` - Yellow variant detection results
- `audit-summary.json` - Comprehensive audit summary

### Reports
- `comprehensive-report.md` - Executive summary with priorities
- `color-extraction-report.md` - Detailed color usage report
- `contrast-report.md` - Accessibility compliance report
- `yellow-analysis-report.md` - Yellow variant analysis

### Utility Scripts
- `replace-yellow-colors.sh` - Automated yellow replacement script
- `color-migration-guide.md` - Step-by-step migration instructions

## Understanding Results

### Color Health Score
The toolkit calculates a health score (0-100) based on:
- **Contrast violations**: -15 points per high severity, -8 per medium
- **Yellow variants**: -2 points each (max -20 total)

### Priority Levels
- **High**: Critical accessibility issues, yellow variants in important contexts
- **Medium**: Minor accessibility issues, moderate yellow usage
- **Low**: Optional improvements, low-impact yellow variants

### Severity Classifications
- **High**: Contrast ratio < 3:1, bright yellows in text/backgrounds
- **Medium**: Contrast ratio 3-4.5:1, moderate yellow usage
- **Low**: Minor issues, subtle yellow tints

## Color Mappings

The toolkit includes comprehensive color mappings for:

### CSS Custom Properties
- Primary colors (`--primary-50` through `--primary-900`)
- Secondary colors (`--secondary-50` through `--secondary-900`)
- Accent colors (`--accent-50` through `--accent-900`)
- Neutral colors (`--neutral-50` through `--neutral-950`)
- Semantic colors (`--success`, `--warning`, `--error`, `--info`)

### Tailwind CSS Classes
- All standard Tailwind color classes
- Custom color extensions
- Opacity variants

### Modern Alternatives for Yellow
- Light yellows → `accent-50`, `neutral-50`, `warning-100`
- Medium yellows → `accent-200`, `accent-300`, `warning`
- Dark yellows → `accent-600`, `accent-700`, `warning-600`
- Gold/amber → `accent-400`, `accent-500`, `accent-600`

## Best Practices

### Running Audits
1. **Backup first**: Always backup your codebase before making changes
2. **Test thoroughly**: Run audits on a complete, built application
3. **Review manually**: Don't blindly apply automated suggestions
4. **Test both modes**: Verify changes in light and dark themes

### Implementing Changes
1. **Prioritize accessibility**: Fix contrast violations first
2. **Gradual migration**: Implement changes incrementally
3. **Test interactively**: Verify hover, focus, and active states
4. **Document changes**: Update design system documentation

### Maintenance
1. **Regular audits**: Run audits as part of your CI/CD pipeline
2. **Monitor regressions**: Set up automated contrast checking
3. **Update mappings**: Keep color mappings current with design system
4. **Team training**: Ensure team understands color accessibility

## Troubleshooting

### Common Issues

**"Module not found" errors**
- Ensure you're using Node.js with ES module support
- Check that all dependencies are installed
- Verify file paths are correct

**No colors detected**
- Check that file patterns match your project structure
- Verify components contain actual color usage
- Ensure color formats are supported

**Inaccurate contrast calculations**
- Verify color mappings are up to date
- Check that CSS custom properties are correctly defined
- Test with known good color combinations

**False positive yellow detections**
- Review yellow detection patterns
- Adjust yellowness threshold if needed
- Check color space calculations

### Performance Considerations

For large codebases:
- Run audits on specific directories first
- Use file pattern filtering
- Consider running tools individually
- Monitor memory usage during scans

## Contributing

To extend the toolkit:

1. **Add new color patterns**: Update detection regex patterns
2. **Extend color mappings**: Add new color definitions
3. **Improve algorithms**: Enhance contrast or yellowness calculations
4. **Add new contexts**: Extend context-aware recommendations

## License

This toolkit is designed for internal use in color system modernization projects. Adapt and extend as needed for your specific requirements.