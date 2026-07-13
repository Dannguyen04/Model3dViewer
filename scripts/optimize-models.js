// ---------------------------------------------------------------------------
// Tối ưu model .glb trong public/.
//
// Model gốc là bản scan: 1 mesh, ~2 triệu tam giác, texture PNG 4096, KHÔNG có
// animation. Ở cỡ hiển thị thực tế (canvas ~600px) mắt thường không phân biệt
// được 2M với 300k tam giác — chi tiết nằm ở texture chứ không ở lưới — nhưng
// 2M tam giác thì tải lâu, decode lâu và ngốn VRAM trên điện thoại.
//
// Pipeline: weld -> simplify (~TARGET_TRIS) -> texture WebP 2048 -> quantize
// -> nén meshopt. Bản gốc được backup sang _model_backup_orig/ (đã gitignore).
//
//   node scripts/optimize-models.js           # ghi đè public/*.glb
//   node scripts/optimize-models.js --dry     # chỉ in bảng, không ghi
//   node scripts/optimize-models.js --out dir # ghi ra thư mục khác để so sánh
// ---------------------------------------------------------------------------
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
    dedup,
    prune,
    weld,
    simplify,
    quantize,
    textureCompress,
    meshopt,
} from "@gltf-transform/functions";
import {
    MeshoptDecoder,
    MeshoptEncoder,
    MeshoptSimplifier,
} from "meshoptimizer";
import draco3d from "draco3d";
import sharp from "sharp";
import { readdir, mkdir, copyFile, stat, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const BACKUP_DIR = join(ROOT, "_model_backup_orig");

// Ngân sách lưới. Model scan ở cỡ xem trên web: 300k tam giác là dư dùng.
const TARGET_TRIS = 300_000;
// Ngưỡng sai số hình học cho phép khi giảm lưới (tỉ lệ theo bbox của mesh).
// Giảm lưới sẽ DỪNG SỚM nếu vượt ngưỡng này -> model mỏng/nhiều chi tiết sẽ tự
// giữ lại nhiều tam giác hơn thay vì bị bóp méo.
const SIMPLIFY_ERROR = 0.001;
const TEXTURE_SIZE = 2048;
const WEBP_QUALITY = 85;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const outIdx = args.indexOf("--out");
const OUT_DIR = outIdx !== -1 ? join(ROOT, args[outIdx + 1]) : PUBLIC_DIR;

const exists = (p) =>
    access(p).then(
        () => true,
        () => false,
    );
const mb = (n) => (n / 1048576).toFixed(1);

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(),
        "draco3d.encoder": await draco3d.createEncoderModule(),
        "meshopt.decoder": MeshoptDecoder,
        "meshopt.encoder": MeshoptEncoder,
    });

const countTris = (doc) => {
    let tris = 0;
    for (const mesh of doc.getRoot().listMeshes()) {
        for (const prim of mesh.listPrimitives()) {
            const idx = prim.getIndices();
            const pos = prim.getAttribute("POSITION");
            tris += ((idx ?? pos)?.getCount() ?? 0) / 3;
        }
    }
    return Math.round(tris);
};

const files = (await readdir(PUBLIC_DIR))
    .filter((f) => f.endsWith(".glb"))
    .sort((a, b) => parseInt(a) - parseInt(b));

if (!dryRun) {
    await mkdir(BACKUP_DIR, { recursive: true });
    if (OUT_DIR !== PUBLIC_DIR) await mkdir(OUT_DIR, { recursive: true });
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
    const src = join(PUBLIC_DIR, file);
    const backup = join(BACKUP_DIR, file);

    // Backup 1 lần duy nhất. Chạy lại script sẽ luôn đọc từ BẢN GỐC, không nén
    // chồng lên bản đã nén (nén chồng = mất chất lượng, giảm lưới 2 lần).
    if (!dryRun && !(await exists(backup))) await copyFile(src, backup);
    const input = (await exists(backup)) ? backup : src;
    const { size: before } = await stat(input);

    const doc = await io.read(input);

    // Vài model gốc được nén sẵn bằng Draco. Đọc xong phải GỠ HẲN extension đó:
    // nếu không, lúc ghi ra gltf-transform sẽ nén lại bằng Draco *song song* với
    // meshopt -> file chứa 2 bản geometry (phình ~1MB) và trình duyệt còn phải
    // tải thêm bộ giải mã Draco từ CDN. Chỉ giữ meshopt (drei nhúng sẵn decoder).
    for (const ext of doc.getRoot().listExtensionsUsed()) {
        if (ext.extensionName === "KHR_draco_mesh_compression") ext.dispose();
    }

    const trisBefore = countTris(doc);
    const ratio = Math.min(1, TARGET_TRIS / Math.max(trisBefore, 1));

    await doc.transform(
        dedup(),
        // Gộp vertex trùng -> điều kiện bắt buộc để simplify chạy đúng.
        weld(),
        simplify({
            simplifier: MeshoptSimplifier,
            ratio,
            error: SIMPLIFY_ERROR,
        }),
        textureCompress({
            encoder: sharp,
            targetFormat: "webp",
            resize: [TEXTURE_SIZE, TEXTURE_SIZE],
            quality: WEBP_QUALITY,
        }),
        // Bỏ node/material/texture mồ côi sinh ra sau các bước trên.
        prune(),
        quantize(),
        meshopt({ encoder: MeshoptEncoder, level: "high" }),
    );

    const trisAfter = countTris(doc);
    const bytes = await io.writeBinary(doc);
    if (!dryRun) {
        const { writeFile } = await import("fs/promises");
        await writeFile(join(OUT_DIR, file), bytes);
    }

    const after = bytes.byteLength;
    totalBefore += before;
    totalAfter += after;
    const saved = (((before - after) / before) * 100).toFixed(1);
    console.log(
        `${file.padEnd(8)} ${mb(before).padStart(6)}MB -> ${mb(after).padStart(5)}MB  (-${saved}%)  ` +
            `tris ${trisBefore.toLocaleString().padStart(9)} -> ${trisAfter.toLocaleString().padStart(7)}`,
    );
}

console.log(
    `\nTổng: ${mb(totalBefore)}MB -> ${mb(totalAfter)}MB ` +
        `(-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)` +
        (dryRun ? "  [DRY RUN — chưa ghi file nào]" : ""),
);
