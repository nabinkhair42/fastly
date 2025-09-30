#!/bin/bash
# This script ensures the correct Node.js version and pnpm configuration for Vercel builds

# Ensure we're using the correct Node.js version
echo "Node.js version: $(node --version)"
echo "pnpm version: $(pnpm --version)"

# Create .npmrc file if it doesn't exist
if [ ! -f .npmrc ]; then
  echo "Creating .npmrc file..."
  cat > .npmrc << EOL
shamefully-hoist=true
strict-peer-dependencies=false
node-linker=hoisted
EOL
fi

# Install dependencies using pnpm
echo "Installing dependencies..."
pnpm install

# Build the Next.js application
echo "Building application..."
pnpm build
