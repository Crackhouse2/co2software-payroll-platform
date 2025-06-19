#!/bin/bash

# Fix missing environment configurations and VS Code setup
# This script creates all the missing configuration files and directories

set -e

echo "🔧 Creating missing environment configurations and VS Code setup..."
echo "=================================================================="

# Create environment directories if they don't exist
echo "📁 Creating environment directories..."
mkdir -p environments/{local,play,dev,stage,prod}

# Create local environment config
echo "🌍 Creating local environment configuration..."
cat > environments/local/config.json << 'EOF'
{
  "environment": "local",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789012",
  "domain": "localhost:3000",
  "features": {
    "multiRegionDR": false,
    "detailedXRayTracing": false,
    "kinesisAnalytics": false,
    "sageMakerML": false,
    "guardDuty": false,
    "advancedWAF": false,
    "cloudWatchSynthetics": false,
    "awsConfig": false,
    "detailedMonitoring": false
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": false,
      "detailedXRayTracing": false,
      "kinesisAnalytics": false,
      "sageMakerML": false
    },
    "niceToHave": {
      "guardDuty": false,
      "advancedWAF": false,
      "cloudWatchSynthetics": false,
      "awsConfig": false,
      "detailedMonitoring": false
    }
  }
}
EOF

# Create play environment config
echo "🎮 Creating play environment configuration..."
cat > environments/play/config.json << 'EOF'
{
  "environment": "play",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789013",
  "domain": "play.co2software.co.uk",
  "features": {
    "multiRegionDR": false,
    "detailedXRayTracing": true,
    "kinesisAnalytics": false,
    "sageMakerML": false,
    "guardDuty": true,
    "advancedWAF": false,
    "cloudWatchSynthetics": false,
    "awsConfig": true,
    "detailedMonitoring": true
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": false,
      "detailedXRayTracing": true,
      "kinesisAnalytics": false,
      "sageMakerML": false
    },
    "niceToHave": {
      "guardDuty": true,
      "advancedWAF": false,
      "cloudWatchSynthetics": false,
      "awsConfig": true,
      "detailedMonitoring": true
    }
  }
}
EOF

# Create dev environment config
echo "🛠️ Creating dev environment configuration..."
cat > environments/dev/config.json << 'EOF'
{
  "environment": "dev",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789014",
  "domain": "dev.co2software.co.uk",
  "features": {
    "multiRegionDR": false,
    "detailedXRayTracing": true,
    "kinesisAnalytics": false,
    "sageMakerML": false,
    "guardDuty": true,
    "advancedWAF": true,
    "cloudWatchSynthetics": true,
    "awsConfig": true,
    "detailedMonitoring": true
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": false,
      "detailedXRayTracing": true,
      "kinesisAnalytics": false,
      "sageMakerML": false
    },
    "niceToHave": {
      "guardDuty": true,
      "advancedWAF": true,
      "cloudWatchSynthetics": true,
      "awsConfig": true,
      "detailedMonitoring": true
    }
  }
}
EOF

# Create stage environment config
echo "🚀 Creating stage environment configuration..."
cat > environments/stage/config.json << 'EOF'
{
  "environment": "stage",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789015",
  "domain": "stage.co2software.co.uk",
  "features": {
    "multiRegionDR": true,
    "detailedXRayTracing": true,
    "kinesisAnalytics": true,
    "sageMakerML": false,
    "guardDuty": true,
    "advancedWAF": true,
    "cloudWatchSynthetics": true,
    "awsConfig": true,
    "detailedMonitoring": true
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": true,
      "detailedXRayTracing": true,
      "kinesisAnalytics": true,
      "sageMakerML": false
    },
    "niceToHave": {
      "guardDuty": true,
      "advancedWAF": true,
      "cloudWatchSynthetics": true,
      "awsConfig": true,
      "detailedMonitoring": true
    }
  }
}
EOF

# Create production environment config
echo "🏭 Creating production environment configuration..."
cat > environments/prod/config.json << 'EOF'
{
  "environment": "prod",
  "tenant": "co2software",
  "region": "eu-west-2",
  "accountId": "123456789016",
  "domain": "payroll.co2software.co.uk",
  "features": {
    "multiRegionDR": true,
    "detailedXRayTracing": true,
    "kinesisAnalytics": true,
    "sageMakerML": true,
    "guardDuty": true,
    "advancedWAF": true,
    "cloudWatchSynthetics": true,
    "awsConfig": true,
    "detailedMonitoring": true
  },
  "nonStartup": {
    "essential": {
      "multiRegionDR": true,
      "detailedXRayTracing": true,
      "kinesisAnalytics": true,
      "sageMakerML": true
    },
    "niceToHave": {
      "guardDuty": true,
      "advancedWAF": true,
      "cloudWatchSynthetics": true,
      "awsConfig": true,
      "detailedMonitoring": true
    }
  }
}
EOF

# Create VS Code directory and configurations
echo "💻 Creating VS Code workspace configuration..."
mkdir -p .vscode

# VS Code settings
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/cdk.out": true,
    "**/coverage": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/cdk.out": true,
    "**/coverage": true
  },
  "eslint.workingDirectories": [
    "./packages/shared",
    "./packages/infrastructure",
    "./packages/workers",
    "./packages/processors",
    "./packages/web-worker",
    "./packages/web-payroll",
    "./packages/domains/employees",
    "./packages/domains/timesheets",
    "./packages/domains/payments",
    "./packages/domains/approvals"
  ],
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
EOF

# VS Code launch configuration for debugging
cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    },
    {
      "name": "Debug CDK App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/packages/infrastructure/bin/app.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Lambda Function",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/packages/workers/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "console": "integratedTerminal",
      "env": {
        "AWS_REGION": "eu-west-2",
        "NODE_ENV": "development"
      }
    }
  ]
}
EOF

# VS Code tasks
cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"  
      }
    },
    {
      "label": "test:watch",
      "type": "npm",
      "script": "test",
      "args": ["--", "--watch"],
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "lint",
      "type": "npm",
      "script": "lint",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "lint:fix",
      "type": "npm",
      "script": "lint:fix",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "cdk deploy",
      "type": "shell",
      "command": "npm run deploy:local",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "cdk diff",
      "type": "shell",
      "command": "npm run cdk:diff",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "cdk synth",
      "type": "shell",
      "command": "npm run cdk:synth",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
EOF

# VS Code extensions recommendations
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-jest",
    "amazonwebservices.aws-toolkit-vscode",
    "ms-vscode.vscode-docker",
    "github.copilot",
    "github.copilot-chat",
    "ms-playwright.playwright"
  ]
}
EOF

# Create Husky directory and pre-commit hook if missing
echo "🐶 Setting up Husky Git hooks..."
mkdir -p .husky

cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test:unit
EOF

chmod +x .husky/pre-commit

# Create commit message hook for conventional commits
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format (conventional commits)
npx --no -- commitlint --edit "$1"
EOF

chmod +x .husky/commit-msg

echo ""
echo "✅ Environment Configuration Summary:"
echo "  📁 Created environments/local/config.json"
echo "  📁 Created environments/play/config.json"
echo "  📁 Created environments/dev/config.json"
echo "  📁 Created environments/stage/config.json"
echo "  📁 Created environments/prod/config.json"
echo ""
echo "✅ VS Code Configuration Summary:"
echo "  💻 Created .vscode/settings.json"
echo "  🐛 Created .vscode/launch.json"
echo "  ⚙️  Created .vscode/tasks.json"
echo "  🔌 Created .vscode/extensions.json"
echo ""
echo "✅ Git Hooks Summary:"
echo "  🐶 Created .husky/pre-commit"
echo "  📝 Created .husky/commit-msg"
echo ""
echo "🎉 All missing configurations have been created!"
echo "🔄 Please run the validation script again to confirm all issues are resolved."