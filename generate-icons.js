#!/usr/bin/env node
/**
 * Generates PNG icon assets from the SVG source files.
 * Required sizes:
 *   192×192  — Android Chrome "Add to Home Screen" (any purpose)
 *   512×512  — Android Chrome / PWA splash      (any purpose)
 *   512×512  — Maskable icon with safe-zone crop (maskable purpose)
 *   180×180  — iOS apple-touch-icon              (PNG required; SVG not supported)
 */
const sharp = require("sharp");
const path = require("path");

const pub = path.join(__dirname, "public");

const icons = [
  { src: "icon-app.svg",      out: "icon-192.png",          size: 192 },
  { src: "icon-app.svg",      out: "icon-512.png",          size: 512 },
  { src: "icon-maskable.svg", out: "icon-maskable-512.png", size: 512 },
  { src: "icon-app.svg",      out: "apple-touch-icon.png",  size: 180 },
];

(async () => {
  for (const { src, out, size } of icons) {
    await sharp(path.join(pub, src))
      .resize(size, size)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(pub, out));
    console.log(`✓  ${out}  (${size}×${size})`);
  }
  console.log("\nAll icons generated.");
})().catch((err) => {
  console.error("Icon generation failed:", err.message);
  process.exit(1);
});
