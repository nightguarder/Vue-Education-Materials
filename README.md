# Vue Education Materials Repository

This repository serves as a headless CMS and asset host for the Vue Education platform. It provides structured data, metadata, and assets for educational materials.

## Structure

The project is organized by **topics** to keep related content and assets together.

- `content/topics/`: Contains all educational content grouped by topic.
  - `[topic-id]/`:
    - `README.md`: Overview of the topic (rendered on GitHub).
    - `episodes/`: Podcast episodes. Each folder contains `data.json`, `audio.m4a`, and optionally `notes.md`.
    - `infographics/`: Visual materials. Each folder contains `data.json`, `image.png`, `post.md`, and `thumbnail.webp`.
    - `sources/`: JSON data for citations and sources specific to the topic.
    - `presentations/`: PDF and other presentation materials.
- `assets/`: Shared global assets (e.g., brand logos).
- `manifest.json`: Automatically generated index of all content, used by the Vue app.
- `scripts/`: Utilities for generating the manifest and thumbnails.

## Quick Navigation

- **[View Manifest (API)](https://nightguarder.github.io/Vue-Education-Materials/manifest.json)** - Structured JSON index of all materials
- **[Browse Topics](content/topics/)** - Direct access to all educational materials

### Current Topics
- **[Metabolic Psychiatry](content/topics/metabolic-psychiatry/)**
- **[Mental Health](content/topics/mental-health/)**
- **[Adiktologie](content/topics/adiktologie/)**

---

## Technical Integration
The primary API endpoint for the Vue application is the `manifest.json`.

- **Manifest URL**: `https://nightguarder.github.io/Vue-Education-Materials/manifest.json`

## Development and Maintenance

### Prerequisites
- **Node.js**: Required to run management scripts.
- **ImageMagick**: Required for automatic thumbnail generation.

### Adding Content
1. Create a new folder in `content/topics/` or add to an existing one.
2. Add your content (audio, images, markdown).
3. Create/update `data.json` for each item. Use relative paths for assets (e.g., `"asset_url": "./audio.m4a"`).
4. Run the generation script:

```bash
# Generate manifest and thumbnails
node scripts/generate-manifest.js
```

### Automation
- **Manifest**: `scripts/generate-manifest.js` scans the `topics` folder and builds the global index.
- **Thumbnails**: `scripts/generate-thumbnails.js` (triggered by the manifest script) automatically generates `.webp` thumbnails for infographics if a source image is found.
