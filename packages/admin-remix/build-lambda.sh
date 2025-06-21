#!/bin/bash
echo "🔨 Building Remix app for Lambda deployment..."

# Build the Remix app
npm run build

# Copy Lambda handler
cp lambda/index.mjs build/

# Create deployment package
mkdir -p dist
cd build
zip -r ../dist/lambda-deployment.zip . -x "*.DS_Store*"
cd ..

echo "✅ Lambda deployment package created: dist/lambda-deployment.zip"
echo "📦 Package size: $(du -h dist/lambda-deployment.zip | cut -f1)"
