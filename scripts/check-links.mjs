import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error(`Error: Directory dist not found at ${distDir}`);
  process.exit(1);
}

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(distDir);
let hasErrors = false;
let linksChecked = 0;

for (const filePath of htmlFiles) {
  const relativeHtmlPath = path.relative(distDir, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Match href and src attributes
  const linkRegex = /(?:href|src)=["']([^"']+)["']/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1].trim();

    // Skip external links, fragments, protocols
    if (
      !target ||
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('//') ||
      target.startsWith('#') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('javascript:') ||
      target.startsWith('data:')
    ) {
      continue;
    }

    linksChecked++;

    // Remove query params or fragment from target
    const cleanTarget = target.split('?')[0].split('#')[0];
    if (!cleanTarget) continue;

    let targetPath;
    if (cleanTarget.startsWith('/')) {
      // Root-relative path
      targetPath = path.join(distDir, cleanTarget);
    } else {
      // Relative to current html file's directory
      targetPath = path.join(path.dirname(filePath), cleanTarget);
    }

    // Check if path exists directly, or as .html, or as /index.html
    const exists =
      fs.existsSync(targetPath) ||
      fs.existsSync(`${targetPath}.html`) ||
      fs.existsSync(path.join(targetPath, 'index.html'));

    if (!exists) {
      console.error(
        `✖ Broken link in ${relativeHtmlPath}: "${target}" -> Target not found in dist/`
      );
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error('\nBuild validation failed: One or more internal links or asset paths are broken.');
  process.exit(1);
} else {
  console.log(`✔ Verified ${linksChecked} internal links/assets across ${htmlFiles.length} HTML files without errors.`);
}
