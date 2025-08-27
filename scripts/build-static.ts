#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const EXAMPLE_DOCS_DIR = path.join(__dirname, '../example_documents');
const DOCS_DIR = path.join(__dirname, '../docs');
const DIST_DIR = path.join(__dirname, '../dist');
const FRONTEND_DIST = path.join(DIST_DIR, 'frontend');

function log(message: string): void {
  console.log(`[build-static] ${message}`);
}

function runCommand(command: string, cwd: string = process.cwd()): void {
  log(`Running: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    process.exit(1);
  }
}

function createNetlifyRedirects(): void {
  const redirectsContent = `# Netlify redirects for SPA
/api/filetree/* /.netlify/functions/filetree/:splat 200
/api/outline/* /.netlify/functions/outline/:splat 200
/api/markdown/* /.netlify/functions/markdown/:splat 200
/api/config /.netlify/functions/config 200
/* /index.html 200
`;

  fs.writeFileSync(path.join(FRONTEND_DIST, '_redirects'), redirectsContent);
  log('Created _redirects file for Netlify');
}

function copyDemoContent(): void {
  // Copy example_documents as the main demo content for frontend display
  if (fs.existsSync(EXAMPLE_DOCS_DIR)) {
    const targetDir = path.join(FRONTEND_DIST, 'demo-content');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    runCommand(`cp -r ${EXAMPLE_DOCS_DIR}/* ${targetDir}/`);
    log('Copied example_documents to demo-content');
  }
  
  // Also copy docs directory for documentation and images
  if (fs.existsSync(DOCS_DIR)) {
    const docsTargetDir = path.join(FRONTEND_DIST, 'docs');
    if (!fs.existsSync(docsTargetDir)) {
      fs.mkdirSync(docsTargetDir, { recursive: true });
    }
    
    runCommand(`cp -r ${DOCS_DIR}/* ${docsTargetDir}/`);
    log('Copied docs to frontend root for image access');
  }
  
  // Note: No need to copy to functions directory anymore - using embedded data
}

function createNetlifyConfig(): void {
  const netlifyConfigContent = `[build]
  publish = "dist/frontend"
  functions = "netlify/functions"
  
[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/filetree/*"
  to = "/.netlify/functions/filetree/:splat"
  status = 200

[[redirects]]
  from = "/api/outline/*"
  to = "/.netlify/functions/outline/:splat"
  status = 200

[[redirects]]
  from = "/api/markdown/*"
  to = "/.netlify/functions/markdown/:splat"
  status = 200

[[redirects]]
  from = "/api/config"
  to = "/.netlify/functions/config"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

  fs.writeFileSync(
    path.join(__dirname, '../netlify.toml'),
    netlifyConfigContent
  );
  log('Created netlify.toml configuration');
}

async function main(): Promise<void> {
  try {
    log('Starting static site build for Netlify deployment');
    
    // Clean previous builds
    if (fs.existsSync(DIST_DIR)) {
      runCommand(`rm -rf ${DIST_DIR}`);
    }
    
    // Install frontend dependencies
    log('Installing frontend dependencies...');
    runCommand('npm ci', path.join(__dirname, '../packages/frontend'));
    
    // Generate demo data for Netlify Functions
    log('Generating demo data...');
    runCommand('npx ts-node scripts/generate-demo-data.ts', path.join(__dirname, '..'));
    
    // Build the project
    log('Building TypeScript backend...');
    runCommand('npm run build');
    
    log('Building React frontend...');
    runCommand('NODE_ENV=production npm run build:frontend', path.join(__dirname, '..'));
    
    // Create Netlify-specific files
    createNetlifyRedirects();
    createNetlifyConfig();
    copyDemoContent();
    
    log('✅ Static site build completed successfully!');
    log(`📁 Build output: ${FRONTEND_DIST}`);
    log('🚀 Ready for Netlify deployment');
    
  } catch (error) {
    console.error('❌ Build failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main };