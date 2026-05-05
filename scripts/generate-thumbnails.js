const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');
const BASE_URL = 'https://nightguarder.github.io/Vue-Education-Materials';

function generateThumbnails() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('Manifest not found. Run generate-manifest.js first.');
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let updated = false;

    const sections = ['infographics', 'presentations'];

    sections.forEach(section => {
        if (!manifest[section]) return;
        
        manifest[section].forEach((item, index) => {
            if (!item.asset_url || !item.asset_url.startsWith(BASE_URL)) return;
            
            const relativeUrlPath = item.asset_url.substring(BASE_URL.length);
            const sourcePath = path.join(ROOT_DIR, relativeUrlPath);
            
            if (fs.existsSync(sourcePath)) {
                const dir = path.dirname(sourcePath);
                const thumbFilename = 'thumbnail.webp';
                const destPath = path.join(dir, thumbFilename);

                console.log('Generating thumbnail for ' + item.id + ' (' + section + ')...');
                try {
                    // For PDFs, we take the first page [0]
                    const inputSpec = sourcePath.toLowerCase().endsWith('.pdf') ? sourcePath + '[0]' : sourcePath;
                    
                    execSync('magick "' + inputSpec + '" -resize 400x -quality 80 "' + destPath + '"');
                    
                    const relativeDestPath = path.relative(ROOT_DIR, destPath);
                    manifest[section][index].thumbnail_url = BASE_URL + '/' + relativeDestPath;
                    updated = true;
                    console.log('Successfully created ' + destPath);
                } catch (error) {
                    console.error('Failed to generate thumbnail for ' + item.id + ':', error.message);
                    if (sourcePath.toLowerCase().endsWith('.pdf')) {
                        console.warn('Note: PDF thumbnail generation requires Ghostscript to be installed.');
                    }
                }
            }
        });
    });

    if (updated) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log('Manifest updated with thumbnail URLs.');
    }
}

generateThumbnails();
