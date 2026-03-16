# ✦ Antigravity Inspector

> Drop-in visual element inspector for any web project. Click any element to instantly generate an AI-ready prompt for [Antigravity](https://antigravity.ai).

## Usage

Add this single line before the closing `</body>` tag in any HTML file:

```html
<script src="https://ennygmat.github.io/antigravity-inspector/antigravity-editor.js"></script>
```

That's it. No install, no build step, no dependencies.

## How it works

1. A **✦ Edit Mode** button appears in the bottom-right corner of your page
2. Click it to activate the inspector
3. Hover over any element to highlight it
4. Click any element to generate a ready-made Antigravity prompt
5. Copy the prompt and paste it into Antigravity to make changes

## Features

- 🎯 Visual element highlighting with dashed outline
- 📋 Auto-generated AI prompts for any element type
- 🧠 Smart element role detection (hero, card, nav, footer, etc.)
- 📐 Panel pushes page content — no overlap
- 🔧 Works with any fixed-position navbars and headers
- 🚀 Zero dependencies, single file, drop-in anywhere

## Changelog

### v1.1
- Fix: Panel now pushes page content left instead of overlapping it
- Fix: Fixed-position elements (nav, headers) shift in sync with panel
- Fix: Multiple clicks no longer stack the layout shift on fixed elements

### v1.0
- Initial release
