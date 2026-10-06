// mockPrompts.ts 의 배열을 읽어 Supabase seed.sql 을 생성한다.
// 실행: node scripts/generate-seed.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const srcPath = path.join(root, "src/lib/mockPrompts.ts");
const src = fs.readFileSync(srcPath, "utf8");

// 배열 리터럴만 추출
const start = src.indexOf("[", src.indexOf("mockPrompts"));
const end = src.indexOf("\n];", start);
const arrLiteral = src.slice(start, end + 2); // 닫는 ']' 포함

const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const prompts = new Function("img", `return ${arrLiteral};`)(img);

// 달러 인용 → 따옴표 이스케이프 불필요
const dq = (s) => `$$${s}$$`;
const dqArr = (arr) =>
  `array[${arr.map(dq).join(", ")}]::text[]`;

const rows = prompts.map((p) => {
  const cols = [
    dq(p.title),
    dq(p.body),
    dq(p.description),
    dq(p.category),
    dq(p.model),
    dq(p.imageUrl),
    dq(p.aspect),
    dqArr(p.tags),
    dq(p.author.name),
    dq(p.author.avatarUrl),
    p.likes,
    p.saves,
  ];
  return `  (${cols.join(", ")})`;
});

const sql = `-- 프롬피 시드 데이터 (자동 생성: scripts/generate-seed.mjs)
-- schema.sql 을 먼저 실행한 뒤, 이 파일을 SQL Editor 에 붙여넣고 RUN 하세요.

insert into public.prompts
  (title, body, description, category, model, image_url, aspect, tags, author_name, author_avatar, likes, saves)
values
${rows.join(",\n")};
`;

const outPath = path.join(root, "supabase/seed.sql");
fs.writeFileSync(outPath, sql, "utf8");
console.log(`seed.sql 생성 완료 — ${prompts.length}개 행`);
