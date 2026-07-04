import sharp from 'sharp'
import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT_DIR = join(__dirname, '..', 'public', 'character_image')
const MAX_WIDTH = 900
const WEBP_QUALITY = 82
const WEBP_EFFORT = 6

const files = (await readdir(INPUT_DIR)).filter((f) => f.endsWith('.webp'))

let totalBefore = 0
let totalAfter = 0

for (const file of files) {
    const filePath = join(INPUT_DIR, file)
    const { size: before } = await stat(filePath)

    // Đọc vào buffer trước để sharp không giữ file handle
    const inputBuffer = await readFile(filePath)
    const image = sharp(inputBuffer)
    const { width } = await image.metadata()

    const pipeline = width > MAX_WIDTH
        ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
        : image

    const optimized = await pipeline
        .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
        .toBuffer()

    await writeFile(filePath, optimized)

    const after = optimized.length
    totalBefore += before
    totalAfter += after

    const saved = (((before - after) / before) * 100).toFixed(1)
    const sign = before > after ? `-${saved}%` : `+${Math.abs(saved)}%`
    console.log(`  ${file.padEnd(32)} ${kb(before)} → ${kb(after)}  (${sign})`)
}

const totalSaved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
console.log(`\n  Tổng: ${kb(totalBefore)} → ${kb(totalAfter)}  (tiết kiệm ${totalSaved}%)`)

function kb(bytes) {
    return `${(bytes / 1024).toFixed(1).padStart(7)} KB`
}
