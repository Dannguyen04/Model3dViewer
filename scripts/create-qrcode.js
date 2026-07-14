import fs from "fs";
import QRCode from "qrcode";
import raw from "../src/data.json" with { type: "json" };

const BASE_URL = "https://modelgameviewer.vercel.app/";

const outputDir = "./public/qrcodes";

fs.mkdirSync(outputDir, { recursive: true });

const urls = [
    {
        id: "home",
        url: BASE_URL,
    },
    ...Array.from({ length: raw.characterCount }, (_, i) => ({
        id: `c${i}`,
        url: `${BASE_URL}/#/c/c${i}`,
    })),
    ...(raw.adventures ?? []).map((a) => ({
        id: a.id,
        url: `${BASE_URL}/#/c/${a.id}`,
    })),
];

for (const item of urls) {
    await QRCode.toFile(`./public/qrcodes/${item.id}.png`, item.url, {
        width: 500,
        margin: 2,
    });

    console.log(`✓ ${item.id}`);
}

console.log("Done");
