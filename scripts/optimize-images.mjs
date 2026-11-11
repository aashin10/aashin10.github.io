// Turns the full-size photos in media/originals into the responsive WebP
// files the site ships, plus a manifest with their intrinsic sizes.
//
//   npm run images
//
// To add a picture: drop the original into media/originals, add a line to
// SOURCES below, run the script, then reference it by name with <Picture>.

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'media/originals')
const outDir = path.join(root, 'src/assets/img')

/** name -> [source file, widths to emit (largest first)] */
const SOURCES = {
  'host-portrait': ['host-portrait.jpeg', [664, 400]],
  'best-project-award': ['best-project-award.jpeg', [1280, 640]],
  'team-executives': ['team-executives.jpeg', [1280, 640]],
  'team-outing': ['team-outing.jpg', [1280, 640]],
  marathon: ['marathon.jpeg', [960, 480]],
  'hackathon-certificate': ['hackathon-certificate.jpeg', [842, 480]],
  debtflix: ['debtflix.jpeg', [780, 390]],
  dietx: ['dietx.png', [960, 480]],
  'cert-machine-learning': ['cert-machine-learning.jpg', [960, 480]],
  'cert-image-processing': ['cert-image-processing.jpg', [960, 480]],
  'cert-claude-code-101': ['cert-claude-code-101.png', [960, 480]],
}

await mkdir(outDir, { recursive: true })
for (const file of await readdir(outDir)) {
  if (file.endsWith('.webp')) await rm(path.join(outDir, file))
}

const manifest = {}

for (const [name, [file, widths]] of Object.entries(SOURCES)) {
  const input = path.join(srcDir, file)
  const meta = await sharp(input).rotate().metadata()
  const variants = []

  for (const requested of widths) {
    const width = Math.min(requested, meta.width)
    const outFile = `${name}-${width}.webp`
    const info = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(path.join(outDir, outFile))
    variants.push({ width: info.width, height: info.height, file: outFile })
    console.log(`${outFile.padEnd(36)} ${(info.size / 1024).toFixed(0).padStart(4)} kB`)
  }

  manifest[name] = { width: variants[0].width, height: variants[0].height, variants }
}

await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\n${Object.keys(manifest).length} images -> src/assets/img`)
