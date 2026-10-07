// 앱 아이콘(PNG) 생성: 검정 라운드 배경 + 흰 "P"
// 실행: node scripts/generate-icons.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

// size: 전체 크기, pad: 안쪽 여백 비율(마스커블용), radius: 모서리 둥글기 비율
function svg(size, { pad = 0, radius = 0.22 } = {}) {
  const inset = Math.round(size * pad);
  const box = size - inset * 2;
  const r = Math.round(box * radius);
  const fontSize = Math.round(box * 0.62);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  <rect x="${inset}" y="${inset}" width="${box}" height="${box}" rx="${r}" fill="#0a0a0a"/>
  <text x="50%" y="50%" dy="0.02em" text-anchor="middle" dominant-baseline="central"
    font-family="Arial, Helvetica, sans-serif" font-weight="900"
    font-size="${fontSize}" fill="#ffffff">P</text>
</svg>`;
}

async function png(name, size, opts) {
  const buf = Buffer.from(svg(size, opts));
  await sharp(buf).png().toFile(path.join(outDir, name));
  console.log("생성:", name);
}

await png("icon-192.png", 192, { radius: 0.22 });
await png("icon-512.png", 512, { radius: 0.22 });
// 마스커블: 가장자리 잘려도 괜찮게 안쪽 여백(안전영역) 확보
await png("icon-maskable-512.png", 512, { pad: 0.14, radius: 0.28 });
// 애플: 투명 없이 꽉 찬 사각(라운드는 iOS가 자동 적용)
await png("apple-touch-icon.png", 180, { radius: 0 });

console.log("완료 → public/icons/");
