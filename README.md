# Vue Education Materials Repository

This repository serves as a headless CMS and asset host for the Vue Education platform. It provides structured data, metadata, and assets for educational materials.

## Quick Navigation

- **[View Manifest (API)](https://nightguarder.github.io/Vue-Education-Materials/manifest.json)** - Structured JSON index of all materials
- **[Browse Assets Folder](https://nightguarder.github.io/Vue-Education-Materials/assets/)** - Direct access to all infographics, audio, and thumbnails
- **[Browse Content Folder](https://nightguarder.github.io/Vue-Education-Materials/content/)** - Markdown posts and JSON sources

## Table of Contents

- [Topic: Diet During Psychiatric Treatment (Metabolic Psychiatry)](#topic-diet-during-psychiatric-treatment-metabolic-psychiatry)
  - [Infographics](#1-infographics)
  - [Podcast Episodes](#2-podcast-episodes)

---

## Topic: Diet During Psychiatric Treatment (Metabolic Psychiatry)

### 1. Infographics
- **[Dieta při léčbě duševních onemocnění](https://nightguarder.github.io/Vue-Education-Materials/assets/infographics/dieta-pri-lecbe.png)** ([Thumbnail](https://nightguarder.github.io/Vue-Education-Materials/assets/thumbnails/dieta-pri-lecbe-thumb.webp))
  - [Read more (Post)](https://nightguarder.github.io/Vue-Education-Materials/content/infographics/metabolic-psychiatry/post.md)
  - [View Sources](https://nightguarder.github.io/Vue-Education-Materials/content/sources/)

### 2. Podcast Episodes
- **[Keto dieta jako lék na psychiku](https://nightguarder.github.io/Vue-Education-Materials/assets/audio/Keto_dieta_jako_lék_na_psychiku.m4a)** (Summary) ([Thumbnail](https://nightguarder.github.io/Vue-Education-Materials/assets/thumbnails/Vue%20Podcast%20logo.png))
- **[Jídlo jako evoluční dudlík pro mozek](https://nightguarder.github.io/Vue-Education-Materials/assets/audio/Jídlo_jako_evoluční_dudlík_pro_mozek.m4a)** (Summary) ([Thumbnail](https://nightguarder.github.io/Vue-Education-Materials/assets/thumbnails/Vue%20Podcast%20logo.png))
- **[Léčba vážných duševních nemocí keto dietou](https://nightguarder.github.io/Vue-Education-Materials/assets/audio/Léčba_vážných_duševních_nemocí_keto_dietou.m4a)** (Debate) ([Thumbnail](https://nightguarder.github.io/Vue-Education-Materials/assets/thumbnails/Vue%20Podcast%20logo.png))

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
- **Large Assets**: Audio (`.m4a`) and high-res Infographics (`.png`) should be placed in `assets/audio/` and `assets/infographics/` respectively.
- **Metadata**: Every new material must have a corresponding `data.json` and `.md` file in the `content/` directory to be indexed.
- **Thumbnails**: Infographic thumbnails are automatically generated as optimized `.webp` files in `assets/thumbnails/`. Podcasts use the default branded logo at `assets/thumbnails/Vue Podcast logo.png`.
