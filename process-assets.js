const fs = require('fs');
const path = require('path');

const rawAssets = JSON.parse(fs.readFileSync('src/data/raw-assets.json', 'utf8'));
const rawHeros = JSON.parse(fs.readFileSync('src/data/raw-heros.json', 'utf8'));

const transformPath = (fullPath) => {
    const parts = fullPath.split('public');
    if (parts.length > 1) {
        return parts[1].replace(/\\/g, '/');
    }
    return fullPath;
};

// Returns an array of breadcrumbs after 'portfolio'
const getBreadcrumbs = (fullPath) => {
    const normalized = fullPath.replace(/\\/g, '/');
    const parts = normalized.split('/assets/portfolio/');
    if (parts.length > 1) {
        const subPath = parts[1];
        const segments = subPath.split('/');
        // Remove the filename (last segment)
        segments.pop();
        return segments;
    }
    return [];
};

const assets = rawAssets.map(a => ({
    Name: a.Name,
    path: transformPath(a.FullName),
    breadcrumbs: getBreadcrumbs(a.FullName)
}));

const heros = rawHeros.map(h => ({
    Name: h.Name,
    path: transformPath(h.FullName)
}));

const output = `
export type PortfolioItem = {
    Name: string;
    path: string;
    breadcrumbs: string[];
}

export type HeroItem = {
    Name: string;
    path: string;
}

export const ASSET_MAP: PortfolioItem[] = ${JSON.stringify(assets, null, 4)};

export const HERO_ASSETS: HeroItem[] = ${JSON.stringify(heros, null, 4)};
`;

fs.writeFileSync('src/data/assets.ts', output);
console.log('Assets generated successfully with nested paths');
