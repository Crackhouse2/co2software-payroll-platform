#!/bin/bash

# Create the missing .lintstagedrc configuration file
# This file configures lint-staged to run linting and formatting on staged files

echo "🔧 Creating .lintstagedrc configuration..."

cat > .lintstagedrc << 'EOF'
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx}": [
    "eslint --fix", 
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ],
  "*.{css,scss,less}": [
    "prettier --write"
  ],
  "package.json": [
    "prettier --write"
  ]
}
EOF

echo "✅ .lintstagedrc created successfully!"

# Also create .gitignore if it doesn't exist (good practice)
if [ ! -f ".gitignore" ]; then
    echo "🔧 Creating .gitignore file..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# AWS CDK
cdk.out/
cdk.context.json

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage/
.nyc_output/

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# Remix build output
build/
public/build/

# AWS
.aws/

# Terraform
*.tfstate
*.tfstate.*
.terraform/

# Local development
.localstack/
docker-compose.override.yml

# Temporary files
tmp/
temp/

# Package manager lockfiles (if using npm, keep package-lock.json)
# yarn.lock
# pnpm-lock.yaml
EOF
    echo "✅ .gitignore created successfully!"
fi

# Create .npmrc for workspace optimization
if [ ! -f ".npmrc" ]; then
    echo "🔧 Creating .npmrc for npm workspace optimization..."
    cat > .npmrc << 'EOF'
# NPM workspace configuration for monorepo
save-exact=true
fund=false
audit-level=moderate
engine-strict=true

# Increase memory for large monorepo builds
max_old_space_size=4096

# Workspace configuration
workspaces-update=true
prefer-workspace-packages=true
EOF
    echo "✅ .npmrc created successfully!"
fi

echo ""
echo "🎉 All missing configuration files have been created!"
echo ""
echo "📋 Files created/updated:"
echo "  ✅ .lintstagedrc (lint-staged configuration)"
echo "  ✅ .gitignore (Git ignore patterns)"  
echo "  ✅ .npmrc (NPM workspace optimization)"
echo ""
echo "🔄 Please run the validation script again to confirm all warnings are resolved."