# Vue Education Materials Repository

This repository serves as a headless CMS and asset host for the Vue Education platform. It provides structured data, metadata, and assets for educational materials.

## Table of Contents

- [Topic: Diet During Psychiatric Treatment (Metabolic Psychiatry)](#topic-diet-during-psychiatric-treatment-metabolic-psychiatry)
  - [Infographics](#1-infographics)
  - [Podcast Episodes](#2-podcast-episodes)

---

## Topic: Diet During Psychiatric Treatment (Metabolic Psychiatry)

### 1. Infographics
- **Dieta při léčbě duševních onemocnění**

### 2. Podcast Episodes
- **Keto dieta jako lék na psychiku** (Summary)
- **Jídlo jako evoluční dudlík pro mozek** (Summary)
- **Léčba vážných duševních nemocí keto dietou** (Debate)

---

## Technical Integration
The primary API endpoint for the Vue application is the `manifest.json`.

- **Manifest URL**: `https://nightguarder.github.io/Vue-Education-Materials/manifest.json`
- **Asset Root**: `https://nightguarder.github.io/Vue-Education-Materials/assets/`

## Development and Maintenance

### Prerequisites
- **Node.js**: Required to run management scripts.
- **ImageMagick**: Required for automatic thumbnail generation.

### Running Scripts
To update the manifest and regenerate thumbnails after adding new content:

```bash
# Generate manifest and thumbnails
node scripts/generate-manifest.js
```

### Notes on Content
- **Large Assets**: Audio (`.m4a`) and high-res Infographics (`.png`) should be placed in `public/assets/audio/` and `public/assets/infographics/` respectively.
- **Metadata**: Every new material must have a corresponding `data.json` and `.md` file in the `content/` directory to be indexed.
- **Thumbnails**: Infographic thumbnails are automatically generated as optimized `.webp` files. Podcasts use the default branded logo.
