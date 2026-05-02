const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');
const PUBLIC_DIR = path.join(__dirname, '../public');
const BASE_URL = 'https://nightguarder.github.io/Vue-Education-Materials';

function getFiles(dir, filename) {
    const results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results.push(...getFiles(filePath, filename));
        } else if (file === filename) {
            results.push(filePath);
        }
    });
    return results;
}

function normalizeAssetUrl(url) {
    if (url.startsWith('/')) {
        return `${BASE_URL}${url}`;
    }
    return url;
}

const manifest = {
    infographics: [],
    episodes: [],
    sources: {}
};

// Index Sources
const sourceFiles = fs.readdirSync(path.join(CONTENT_DIR, 'sources'));
sourceFiles.forEach(file => {
    if (file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'sources', file), 'utf8'));
        manifest.sources[data.id] = data;
    }
});

// Index Infographics
const infoDataFiles = getFiles(path.join(CONTENT_DIR, 'infographics'), 'data.json');
infoDataFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const dir = path.dirname(file);
    const postPath = path.join(dir, 'post.md');
    
    data.asset_url = normalizeAssetUrl(data.asset_url);
    if (data.thumbnail_url) {
        data.thumbnail_url = normalizeAssetUrl(data.thumbnail_url);
    }

    if (fs.existsSync(postPath)) {
        data.content_path = `${BASE_URL}/content/${path.relative(CONTENT_DIR, postPath)}`;
    }
    manifest.infographics.push(data);
});

// Index Episodes
const episodeDataFiles = getFiles(path.join(CONTENT_DIR, 'episodes'), 'data.json');
episodeDataFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const dir = path.dirname(file);
    const notesPath = path.join(dir, 'notes.md');

    data.asset_url = normalizeAssetUrl(data.asset_url);

    if (fs.existsSync(notesPath)) {
        data.content_path = `${BASE_URL}/content/${path.relative(CONTENT_DIR, notesPath)}`;
    }
    manifest.episodes.push(data);
});

if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
}

fs.writeFileSync(
    path.join(PUBLIC_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);

console.log('Manifest generated successfully at /public/manifest.json');
