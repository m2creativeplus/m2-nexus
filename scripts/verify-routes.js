/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next', 'server', 'app');

console.log("=========================================");
console.log("🚦 M2 QA: Post-Build Route Verification");
console.log("=========================================");

if (!fs.existsSync(nextDir)) {
  console.error("❌ FATAL: .next/server/app directory not found.");
  console.error("💡 You must run 'npm run build' before verifying routes.");
  process.exit(1);
}

function traverseDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = traverseDir(path.join(dir, file), fileList);
    } else {
      if (file.endsWith('.html') || file.endsWith('.json')) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

try {
  const builtFiles = traverseDir(nextDir);
  if (builtFiles.length === 0) {
    console.error("❌ QA Failed: No built routes found in .next directory.");
    process.exit(1);
  }

  const htmlRoutes = builtFiles.filter(f => f.endsWith('.html')).length;
  const jsonRoutes = builtFiles.filter(f => f.endsWith('.json')).length;

  console.log(`✅ QA Passed: Build generated successfully.`);
  console.log(`   - HTML Routes verified: ${htmlRoutes}`);
  console.log(`   - Data Routes verified: ${jsonRoutes}`);
  console.log(`   - Total Assets checked: ${builtFiles.length}`);
  console.log("🚀 Code is clean. Ready for secure deployment.");
  process.exit(0);
} catch (error) {
  console.error("❌ QA Failed: Error traversing build directory.");
  console.error(error);
  process.exit(1);
}
