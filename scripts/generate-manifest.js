/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio');
const manifestFile = path.join(__dirname, '..', 'src', 'data', 'portfolio-manifest.json');

function scanDirectory(dir, relPath = '') {
    const items = fs.readdirSync(dir);
    const result = [];

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        const itemRelPath = path.join(relPath, item);

        if (stats.isDirectory()) {
            result.push({
                name: item,
                type: 'directory',
                path: itemRelPath,
                children: scanDirectory(fullPath, itemRelPath)
            });
        } else if (/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(item)) {
            result.push({
                name: item,
                type: 'file',
                path: itemRelPath.replace(/\\/g, '/')
            });
        }
    });

    return result;
}

if (!fs.existsSync(path.dirname(manifestFile))) {
    fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
}

try {
    const manifest = scanDirectory(portfolioDir);
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    console.log('Portfolio manifest generated successfully!');
} catch (err) {
    console.error('Error generating manifest:', err);
}
