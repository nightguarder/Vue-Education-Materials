const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');
const BASE_URL = 'https://nightguarder.github.io/Vue-Education-Materials';

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
const SECTIONS = ['infographics', 'presentations', 'episodes'];

function generateThumbnails() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('Manifest not found. Run generate-manifest.js first.');
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let updated = false;

    SECTIONS.forEach(section => {
        if (!manifest[section]) return;

        manifest[section].forEach((item, index) => {
            if (!item.asset_url || !item.asset_url.startsWith(BASE_URL)) return;

            const relativeUrlPath = item.asset_url.substring(BASE_URL.length);
            const assetPath = path.join(ROOT_DIR, relativeUrlPath);
            const dir = path.dirname(assetPath);

            let sourcePath = null;
            const ext = path.extname(assetPath).toLowerCase();

            if (IMAGE_EXTS.includes(ext)) {
                sourcePath = assetPath;
            } else if (ext === '.pdf') {
                const pngPath = path.join(dir, '.temp-thumb-source.png');
                try {
                    execSync(`sips -s format png "${assetPath}" --out "${pngPath}" 2>/dev/null`);
                    sourcePath = pngPath;
                } catch (e) {
                    console.log(`Skipping ${item.id}: cannot convert PDF`);
                    return;
                }
            } else {
                const candidates = ['podcast-cover.png', 'image.png'];
                const found = candidates.find(f => fs.existsSync(path.join(dir, f)));
                if (found) {
                    sourcePath = path.join(dir, found);
                } else {
                    console.log(`Skipping ${item.id}: no image source found`);
                    return;
                }
            }

            if (!sourcePath || !fs.existsSync(sourcePath)) return;

            const thumbFilename = 'thumbnail.webp';
            const destPath = path.join(dir, thumbFilename);

            console.log(`Processing ${item.id} (${section})...`);

            try {
                const pythonScript = path.join(__dirname, 'process-image.py');
                const result = execSync(`python3 "${pythonScript}" "${sourcePath}" "${destPath}"`).toString().trim();
                const { width, height, orientation } = JSON.parse(result);

                manifest[section][index].orientation = orientation;
                updated = true;

                const relativeDestPath = path.relative(ROOT_DIR, destPath);
                manifest[section][index].thumbnail_url = BASE_URL + '/' + relativeDestPath;
                console.log(`  - Orientation: ${orientation}`);
                console.log(`  - Thumbnail: ${destPath}`);

                if (ext === '.pdf') {
                    try { fs.unlinkSync(sourcePath); } catch (e) {}
                }
            } catch (error) {
                console.error(`Failed to process ${item.id}:`, error.message);
            }
        });
    });

    if (updated) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log('Manifest updated with orientations and thumbnail URLs.');
    }
}

generateThumbnails();
