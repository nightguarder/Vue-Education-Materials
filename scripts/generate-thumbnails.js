const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const THUMB_DIR = path.join(ROOT_DIR, 'assets/thumbnails');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');

if (!fs.existsSync(THUMB_DIR)) {
    fs.mkdirSync(THUMB_DIR, { recursive: true });
}

function generateThumbnails() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('Manifest not found. Run generate-manifest.js first.');
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let updated = false;

    manifest.infographics.forEach((item, index) => {
        const urlParts = item.asset_url.split('/assets/');
        if (urlParts.length < 2) return;

        const relativeAssetPath = 'assets/' + urlParts[1];
        const sourcePath = path.join(ROOT_DIR, relativeAssetPath);
        const thumbFilename = item.id + '-thumb.webp';
        const destPath = path.join(THUMB_DIR, thumbFilename);

        if (fs.existsSync(sourcePath)) {
            console.log('Generating thumbnail for ' + item.id + '...');
            try {
                execSync('magick "' + sourcePath + '" -resize 400x -quality 80 "' + destPath + '"');
                
                const baseUrl = item.asset_url.split('/assets/')[0];
                manifest.infographics[index].thumbnail_url = baseUrl + '/assets/thumbnails/' + thumbFilename;
                updated = true;
                console.log('Successfully created ' + destPath);
            } catch (error) {
                console.error('Failed to generate thumbnail for ' + item.id + ':', error.message);
            }
        } else {
            console.warn('Source file not found for ' + item.id + ': ' + sourcePath);
        }
    });

    if (updated) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log('Manifest updated with thumbnail URLs.');
    }
}

generateThumbnails();
