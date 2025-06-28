
// scripts/prepare-html.js
const fs = require('fs');
const path = require('path');

const sourceHtmlPath = path.join(__dirname, '..', 'index.html');
const targetDir = path.join(__dirname, '..', 'build');
const targetHtmlPath = path.join(targetDir, 'index.html');

// Ensure build directory and build/static/js directory exist
const staticJsDir = path.join(targetDir, 'static', 'js');
if (!fs.existsSync(staticJsDir)) {
  fs.mkdirSync(staticJsDir, { recursive: true });
} else if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}


let htmlContent = fs.readFileSync(sourceHtmlPath, 'utf-8');

// Remove import map
htmlContent = htmlContent.replace(/<script type="importmap">[\s\S]*?<\/script>\s*/s, '');

// Replace TSX script with bundled JS, ensuring the path is relative to the build output root
htmlContent = htmlContent.replace(
  '<script type="module" src="/index.tsx"></script>',
  '<script defer src="/static/js/bundle.js"></script>' // Path relative to where index.html will be served from
);

fs.writeFileSync(targetHtmlPath, htmlContent);
console.log('build/index.html prepared successfully.');