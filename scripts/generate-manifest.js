const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOPICS_DIR = path.join(__dirname, '../content/topics');
const ROOT_DIR = path.join(__dirname, '..');
const BASE_URL = 'https://nightguarder.github.io/Vue-Education-Materials';

function getFiles(dir, filename) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
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

function normalizeAssetUrl(assetUrl, filePath) {
    if (!assetUrl) return '';
    if (assetUrl.startsWith('./')) {
        const dirRelToRoot = path.relative(ROOT_DIR, path.dirname(filePath));
        return BASE_URL + '/' + dirRelToRoot + '/' + assetUrl.substring(2);
    }
    if (assetUrl.startsWith('/')) {
        return BASE_URL + assetUrl;
    }
    return assetUrl;
}

const manifest = {
    infographics: [],
    episodes: [],
    presentations: [],
    sources: {}
};

// Index Sources from all topics
const topicDirs = fs.existsSync(TOPICS_DIR) ? fs.readdirSync(TOPICS_DIR) : [];
topicDirs.forEach(topic => {
    const sourcesDir = path.join(TOPICS_DIR, topic, 'sources');
    if (fs.existsSync(sourcesDir)) {
        const sourceFiles = fs.readdirSync(sourcesDir);
        sourceFiles.forEach(file => {
            if (file.endsWith('.json')) {
                const data = JSON.parse(fs.readFileSync(path.join(sourcesDir, file), 'utf8'));
                manifest.sources[data.id] = data;
            }
        });
    }
});

// Helper function to process items
function processItems(type, folderPattern, fallbackContentFileName) {
    const files = getFiles(TOPICS_DIR, 'data.json').filter(f => f.includes(`/${folderPattern}/`));
    files.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        const dir = path.dirname(file);
        
        data.asset_url = normalizeAssetUrl(data.asset_url, file);
        if (data.thumbnail_url) {
            data.thumbnail_url = normalizeAssetUrl(data.thumbnail_url, file);
        } else if (type === 'episode') {
            data.thumbnail_url = BASE_URL + '/assets/thumbnails/Vue Podcast logo.png';
        }

        // Always prioritize README.md for GitHub Pages browsability
        const contentPath = fs.existsSync(path.join(dir, 'README.md')) ? path.join(dir, 'README.md') : 
                            fs.existsSync(path.join(dir, fallbackContentFileName)) ? path.join(dir, fallbackContentFileName) : null;
        
        if (contentPath) {
            data.content_path = BASE_URL + '/' + path.relative(ROOT_DIR, contentPath);
        }
        manifest[type + 's'].push(data);
    });
}

// Index Items
processItems('infographic', 'infographics', 'post.md');
processItems('episode', 'episodes', 'notes.md');
processItems('presentation', 'presentations', 'page.md');

fs.writeFileSync(
    path.join(ROOT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);

console.log('Manifest generated successfully at /manifest.json');

// Trigger thumbnail generation
try {
    console.log('Triggering thumbnail generation...');
    const thumbScript = path.join(__dirname, 'generate-thumbnails.js');
    if (fs.existsSync(thumbScript)) {
        execSync('node "' + thumbScript + '"', { stdio: 'inherit' });
    }
} catch (e) {
    console.error('Thumbnail generation failed, but manifest was created.');
}
