#!/bin/bash

# Fix TypeScript project references to only include existing packages
# This resolves the TS6053 errors about missing tsconfig.json files

echo "🔧 Fixing TypeScript project references..."

# Update tsconfig.json to remove references to packages that don't exist yet
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "allowJs": true,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./",
    "composite": true,
    "removeComments": false,
    "noEmit": false,
    "importHelpers": true,
    "downlevelIteration": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@co2software/shared/*": ["packages/shared/src/*"],
      "@co2software/infrastructure/*": ["packages/infrastructure/src/*"],
      "@co2software/workers/*": ["packages/workers/src/*"],
      "@co2software/processors/*": ["packages/processors/src/*"],
      "@co2software/web-worker/*": ["packages/web-worker/src/*"],
      "@co2software/web-payroll/*": ["packages/web-payroll/src/*"],
      "@co2software/employees/*": ["packages/domains/employees/src/*"],
      "@co2software/timesheets/*": ["packages/domains/timesheets/src/*"],
      "@co2software/payments/*": ["packages/domains/payments/src/*"],
      "@co2software/approvals/*": ["packages/domains/approvals/src/*"],
      "@co2software/testing-utilities/*": ["packages/testing/utilities/src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": [
    "packages/**/*",
    "tools/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "cdk.out",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
EOF

echo "✅ Updated tsconfig.json to remove project references until packages are created"
echo ""
echo "📝 Note: Project references will be added back as we create each package in subsequent phases:"
echo "  - Phase 1b: Will add shared package reference"
echo "  - Phase 1c: Will add infrastructure package reference"
echo "  - Phase 2a-2d: Will add domain package references"
echo "  - Phase 3a-3c: Will add workers/processors package references"
echo "  - Phase 4a-4c: Will add web application package references"
echo ""
echo "🔄 Please run the validation script again to confirm TypeScript errors are resolved."