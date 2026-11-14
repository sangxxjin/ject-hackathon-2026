#!/usr/bin/env node
/**
 * 판독 API 품질 테스트 (/api/judge).
 *
 * 실제 사용자처럼 서버에 요청을 보내고 세 가지를 잰다.
 *   1. 출처 비율: AI 웹 검색 판독 / AI 문구(하이브리드) / 미리 지정한 답(템플릿)
 *   2. 정확성·품질: 나이 계산, 출생 연도, 입력에 없는 숫자, 톤 금지선, 길이, 존댓말 등 규칙 검사
 *      (--judge 를 주면 OpenAI가 재미·톤·사실 근거를 1~5점으로 채점)
 *   3. 다양성: 같은 종목·나이로 여러 번 들어왔을 때 선수와 문구가 얼마나 반복되는지
 *
 * 실행 (개발 서버를 먼저 띄운다: npm run dev)
 *   node scripts/eval-judge.mjs
 *   node scripts/eval-judge.mjs --runs 5 --ages 19,26,33 --sports soccer_world,nba
 *   node scripts/eval-judge.mjs --base https://배포주소 --judge
 *
 * 옵션
 *   --base URL          테스트할 서버 (기본 http://localhost:3000)
 *   --sports a,b        종목 id (기본 전체 + any)
 *   --ages 19,26        나이 목록 (기본 15,19,24,28,33,41)
 *   --runs N            같은 조합 반복 횟수, 다양성 측정용 (기본 3)
 *   --session N         재방문 사용자 시뮬레이션: 종목마다 N번 연속 요청, 앱처럼 직전 선수 제외 (기본 4, 0이면 끔)
 *   --concurrency N     동시 요청 수 (기본 4)
 *   --judge             OpenAI로 AI 답변을 채점 (.env.local의 OPENAI_API_KEY 사용, 비용 발생)
 *   --judge-limit N     채점할 최대 개수 (기본 30)
 *   --check-links       AI 웹 검색 판독의 출처 링크가 실제로 열리는지 확인
 *
 * 결과는 eval/results/<시각>.md 와 .json 으로 저장된다 (커밋하지 않음).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROAST_POOL } from "../lib/copy.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THIS_YEAR = new Date().getFullYear();
const ALL_SPORTS = ["baseball_kr", "baseball_world", "soccer_kr", "soccer_world", "nba", "esports", "any"];

// ───────────────────────── 옵션 ─────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def;
};
const BASE = opt("base", "http://localhost:3000").replace(/\/$/, "");
const SPORTS = opt("sports", ALL_SPORTS.join(",")).split(",");
const AGES = opt("ages", "15,19,24,28,33,41").split(",").map(Number);
const RUNS = Number(opt("runs", 3));
const SESSION_STEPS = Number(opt("session", 4));
const CONCURRENCY = Number(opt("concurrency", 4));
const JUDGE = flag("judge");
const JUDGE_LIMIT = Number(opt("judge-limit", 30));
const CHECK_LINKS = flag("check-links");

if (existsSync(path.join(ROOT, ".env.local"))) process.loadEnvFile(path.join(ROOT, ".env.local"));

// ─────────────── 준비된 기록(lib/fallback.ts)에서 대조용 값 읽기 ───────────────
const fallbackSrc = readFileSync(path.join(ROOT, "lib/fallback.ts"), "utf8");
/** 선수 짧은 이름 → 출생 연도 */
const KNOWN_BIRTH = {};
for (const m of fallbackSrc.matchAll(/P\("([^"]+)",\s*(\d{4}),/g)) KNOWN_BIRTH[shortName(m[1])] = Number(m[2]);
/** 종목 → 템플릿 처방 (AI가 운동 종류·양을 바꿨는지 대조) */
const BASE_PRESCRIPTION = {};
for (const m of fallbackSrc.matchAll(/(\w+): \{ athleteFact: "[^"]*", prescription: "([^"]+)" \}/g)) BASE_PRESCRIPTION[m[1]] = m[2];

const ROAST_TEMPLATES = ROAST_POOL.map(
  (l) => new RegExp("^" + l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("\\{선수은는\\}", ".+") + "$"),
);

// ───────────────────────── 유틸 ─────────────────────────
function shortName(name) {
  return String(name).replace(/\s*\([^)]*\)\s*$/, "").trim();
}
function numbers(text) {
  return (String(text).match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}
function bigrams(s) {
  const t = String(s).replace(/\s+/g, "");
  const set = new Set();
  for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
  return set;
}
function similarity(a, b) {
  const A = bigrams(a);
  const B = bigrams(b);
  if (!A.size && !B.size) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}
function pct(n, d) {
  return d ? `${Math.round((n / d) * 100)}%` : "-";
}
function quantile(arr, q) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
}
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k], k);
      }
    }),
  );
  return out;
}
function progress(label, done, total) {
  process.stdout.write(`\r${label} ${done}/${total}   `);
  if (done === total) process.stdout.write("\n");
}

// ───────────────────────── 요청 ─────────────────────────
async function callJudge(sport, age, excludeAthletes = []) {
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}/api/judge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sport, age, excludeAthletes }),
      signal: AbortSignal.timeout(45_000), // 클라이언트(components/App.tsx)는 40초에서 포기
    });
    const ms = Date.now() - started;
    if (!res.ok) return { sport, age, excludeAthletes, ms, error: `HTTP ${res.status}` };
    return { sport, age, excludeAthletes, ms, data: await res.json() };
  } catch (e) {
    return { sport, age, excludeAthletes, ms: Date.now() - started, error: String(e.message ?? e) };
  }
}

/** 응답이 어디서 왔는지: ai_search(웹 검색 판독) / ai_copy(하이브리드 AI 문구) / template(미리 지정한 답) */
function classify(d) {
  if (d.source === "ai") return "ai_search";
  const motivateTpl = d.motivate?.line?.endsWith("오늘 당신은 딱 하나만 가져가세요.");
  const roastTpl = (d.roast?.lines ?? []).every((l) => ROAST_TEMPLATES.some((re) => re.test(l)));
  return motivateTpl && roastTpl ? "template" : "ai_copy";
}
const KIND_LABEL = { ai_search: "AI 웹 검색 판독", ai_copy: "AI 문구 (하이브리드)", template: "미리 지정한 답", error: "요청 실패" };

/** 화면에 그대로 보이는 문구 */
function userTexts(d) {
  return {
    headline: d.reveal.headline,
    comfort: d.comfort.line,
    motivate: d.motivate.line,
    roast1: d.roast.lines[0] ?? "",
    roast2: d.roast.lines[1] ?? "",
    roast3: d.roast.lines[2] ?? "",
    prescription: d.workout.prescription,
  };
}

// ───────────────────────── 규칙 검사 ─────────────────────────
const BANNED = ["씨발", "시발", "병신", "좆", "개새", "꺼져", "죽어", "뚱뚱", "못생", "늙은이", "틀딱", "늙", "나잇값", "아저씨", "아줌마", "돼지", "대머리", "꼰대", "한심", "루저", "인생 망"];
const ALLOWED_EN = new Set(["MVP", "NBA", "KBO", "MLB", "NPB", "EPL", "FA", "NL", "AL", "LoL", "VAR", "OVR", "UCL", "GAP", "km", "kg", "U"]);
const LIMITS = { comfort: 70, motivate: 70, roast1: 50, roast2: 50, roast3: 50, prescription: 40, headline: 80 };

/** 정확성: 숫자와 사실이 맞는지 */
function checkAccuracy(r) {
  const d = r.data;
  const v = d.reveal;
  const issues = [];
  const diff = v.eventYear - v.athleteBirthYear - v.eventAge;
  if (diff !== 0 && diff !== 1) issues.push(`나이 계산 불일치 (${v.eventYear}-${v.athleteBirthYear}≠${v.eventAge})`);
  if (v.delta !== v.eventAge - r.age) issues.push(`delta 불일치 (${v.delta} ≠ ${v.eventAge}-${r.age})`);
  const known = KNOWN_BIRTH[shortName(v.athlete)];
  if (known && known !== v.athleteBirthYear) issues.push(`출생 연도 틀림 (${v.athleteBirthYear}, 기록상 ${known})`);
  if (v.eventYear > THIS_YEAR) issues.push(`미래 연도 (${v.eventYear})`);
  if (r.sport !== "any" && v.sport !== r.sport) issues.push(`종목 불일치 (${v.sport})`);
  if (d.comfort.laterAge <= d.comfort.lowAge) issues.push("위로 나이 순서 오류");
  if (!v.headline.includes(shortName(v.athlete))) issues.push("headline에 선수 이름 없음");
  if (v.delta > 0 && !v.headline.includes(`${v.delta}살`)) issues.push("headline 나이 차이 표기 누락");
  if (v.delta < 0 && !v.headline.includes(`${-v.delta}살`)) issues.push("headline 나이 차이 표기 누락");
  if (v.delta === 0 && !v.headline.includes("당신 나이에")) issues.push("headline 동갑 표기 누락");
  if (r.age >= 17 && r.age <= 38 && Math.abs(v.delta) > 5) issues.push(`동갑과 거리가 멂 (차이 ${v.delta}세)`);
  const ex = new Set((r.excludeAthletes ?? []).map(shortName));
  if (ex.has(shortName(v.athlete))) issues.push("제외한 선수가 다시 나옴");
  if (r.kind === "ai_search") {
    if (!d.sources?.length) issues.push("출처 없음");
    if (d.sources?.some((s) => !s.url.startsWith("https://"))) issues.push("https 아닌 출처");
  }
  // AI가 쓴 문구에 입력 사실에 없는 숫자가 들어갔는지 (지어낸 기록 탐지)
  if (r.kind === "ai_copy") {
    const allowed = new Set([
      r.age, v.eventAge, v.eventYear, v.athleteBirthYear, Math.abs(v.delta),
      d.comfort.lowAge, d.comfort.laterAge, d.comfort.laterAge - d.comfort.lowAge,
      ...numbers(v.headline), ...numbers(d.comfort.lowText), ...numbers(d.comfort.laterText),
      ...numbers(d.motivate.habit), ...numbers(d.workout.athleteFact), ...numbers(BASE_PRESCRIPTION[v.sport] ?? ""),
      1, 10, // "딱 1개", "10분" 같은 처방 표현은 허용
    ]);
    const t = userTexts(d);
    for (const key of ["comfort", "motivate", "roast1", "roast2", "roast3", "prescription"]) {
      const extra = numbers(t[key]).filter((n) => !allowed.has(n));
      if (extra.length) issues.push(`입력에 없는 숫자 (${key}: ${extra.join(", ")})`);
    }
    const basePres = BASE_PRESCRIPTION[v.sport];
    if (basePres) {
      const need = numbers(basePres);
      if (need.length && !need.every((n) => numbers(d.workout.prescription).includes(n)))
        issues.push(`처방 운동량이 바뀜 ("${d.workout.prescription}" / 원래 "${basePres}")`);
    }
  }
  return issues;
}

/** 품질: 톤, 길이, 형식 */
function checkQuality(r) {
  const t = userTexts(r.data);
  const issues = [];
  for (const [key, text] of Object.entries(t)) {
    const hit = BANNED.find((w) => text.includes(w));
    if (hit) issues.push(`금지 표현 "${hit}" (${key})`);
    if (/\p{Extended_Pictographic}/u.test(text)) issues.push(`이모지 (${key})`);
    if (/#\S/.test(text)) issues.push(`해시태그 (${key})`);
    if (/[぀-ヿ一-鿿]/.test(text)) issues.push(`일본어/한자 섞임 (${key})`);
    const en = (text.replace(/\([^)]*\)/g, "").match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !ALLOWED_EN.has(w));
    if (en.length) issues.push(`영어 단어 (${key}: ${en.join(", ")})`);
    if (/["“”]/.test(text)) issues.push(`큰따옴표 인용 (${key})`);
    if (LIMITS[key] && text.length > LIMITS[key]) issues.push(`너무 김 (${key} ${text.length}자 > ${LIMITS[key]})`);
    if (/(했어|하냐|하니|해라|해|냐|니|야|지|자|을까|될까|거야|잖아|봐|데|네)[.!?…]*$/.test(text.trim()) && !/(니다|세요|까요|네요|데요)[.!?…]*$/.test(text.trim()))
      issues.push(`반말 종결 (${key})`);
    if (key.startsWith("roast") && /(젊|늙|나이|몇 살|살이죠|살인데)/.test(text)) issues.push(`독설이 나이를 건드림 (${key})`);
    if (!text.trim()) issues.push(`빈 문구 (${key})`);
  }
  const roasts = r.data.roast.lines;
  if (roasts.length !== 3) issues.push(`독설 ${roasts.length}개`);
  if (new Set(roasts).size !== roasts.length) issues.push("독설 중복");
  for (let i = 0; i < roasts.length; i++)
    for (let j = i + 1; j < roasts.length; j++)
      if (similarity(roasts[i], roasts[j]) > 0.6) issues.push("독설끼리 너무 비슷함");
  return issues;
}

async function checkLinks(r) {
  const out = [];
  for (const s of r.data.sources ?? []) {
    try {
      const res = await fetch(s.url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(8000) });
      if (res.status >= 400) out.push(`출처 링크 ${res.status}: ${s.url}`);
    } catch {
      out.push(`출처 링크 열리지 않음: ${s.url}`);
    }
  }
  return out;
}

// ───────────────────────── AI 채점 (--judge) ─────────────────────────
async function judgeWithAI(results) {
  const { default: OpenAI } = await import("openai");
  const { zodTextFormat } = await import("openai/helpers/zod");
  const { z } = await import("zod");
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY가 없어 AI 채점을 건너뜁니다.");
    return;
  }
  const client = new OpenAI();
  const model = process.env.EVAL_JUDGE_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const Score = z.object({
    fun: z.number().int(),
    tone: z.number().int(),
    grounded: z.number().int(),
    natural: z.number().int(),
    actionable: z.number().int(),
    factCheck: z.enum(["correct", "wrong", "unsure"]),
    issues: z.array(z.string()),
  });
  const RUBRIC = `당신은 한국어 스포츠 엔터테인먼트 서비스 "GAP"의 품질 검수자입니다.
서비스: 사용자가 나이와 종목을 넣으면 같은 나이에 선수가 해낸 일(reveal)을 보여주고, 위로(comfort)/동기부여(motivate)/신랄한 비판(roast) 문구와 오늘의 10분 운동 처방(prescription)을 줍니다. 쓸데없는 비교로 웃기고, 결국 오늘 운동하게 만드는 게 목표입니다.

아래 응답을 1~5점으로 채점하세요. 5가 최고입니다.
- fun: 피식 웃기고 캡처해서 친구에게 보내고 싶은가
- tone: 금지선을 지켰는가. 독설의 과녁이 "지금 이 앱을 보는 행동"인가. 나이 자체·외모·체형·성별·질병·장애·직업 조롱, 욕설, 선수 비하가 있으면 1점
- grounded: comfort/motivate/roast/prescription이 주어진 사실(reveal, comfort 사실, motivate 습관, workout)만 썼는가. 사실을 지어내거나 선수 말을 인용했으면 감점
- natural: 한국어가 자연스럽고 존댓말이며 문장이 짧은가
- actionable: 처방이 일반인이 오늘 10분 안에 할 수 있는 구체적인 행동인가
- factCheck: reveal의 선수·연도·나이·기록이 실제 사실과 맞는가 (correct / wrong / unsure). 확신이 없으면 unsure
- issues: 구체적인 문제를 한국어로 짧게. 없으면 빈 배열`;

  const targets = results.filter((r) => r.data && r.kind !== "template").slice(0, JUDGE_LIMIT);
  let done = 0;
  await pool(targets, Math.min(CONCURRENCY, 4), async (r) => {
    const d = r.data;
    const payload = {
      userAge: r.age,
      requestedSport: r.sport,
      reveal: { athlete: d.reveal.athlete, birthYear: d.reveal.athleteBirthYear, eventYear: d.reveal.eventYear, eventAge: d.reveal.eventAge, headline: d.reveal.headline },
      comfortFacts: { athlete: d.comfort.athlete, lowAge: d.comfort.lowAge, lowText: d.comfort.lowText, laterAge: d.comfort.laterAge, laterText: d.comfort.laterText },
      motivateFacts: { athlete: d.motivate.athlete, habit: d.motivate.habit },
      workoutFact: d.workout.athleteFact,
      outputs: { comfort: d.comfort.line, motivate: d.motivate.line, roast: d.roast.lines, prescription: d.workout.prescription },
    };
    try {
      const res = await client.responses.parse(
        {
          model,
          instructions: RUBRIC,
          input: JSON.stringify(payload),
          ...(r.kind === "ai_search" ? { tools: [{ type: "web_search" }] } : {}),
          text: { format: zodTextFormat(Score, "score") },
        },
        { signal: AbortSignal.timeout(60_000) },
      );
      r.score = res.output_parsed;
    } catch (e) {
      r.scoreError = String(e.message ?? e).slice(0, 120);
    }
    progress("AI 채점", ++done, targets.length);
  });
}

// ───────────────────────── 실행 ─────────────────────────
async function main() {
  console.log(`대상: ${BASE}`);
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(5000) });
  } catch {
    console.error(`서버에 연결할 수 없습니다. 먼저 npm run dev 로 띄우거나 --base 로 주소를 주세요.`);
    process.exit(1);
  }

  // 1) 매트릭스: 종목 × 나이 × 반복
  const jobs = [];
  for (const sport of SPORTS) for (const age of AGES) for (let run = 0; run < RUNS; run++) jobs.push({ sport, age, run });
  let done = 0;
  const matrix = await pool(jobs, CONCURRENCY, async (j) => {
    const r = await callJudge(j.sport, j.age);
    progress("판독 요청", ++done, jobs.length);
    return { ...r, run: j.run, phase: "matrix" };
  });

  // 2) 재방문 사용자: 같은 종목으로 연달아 하면서 앱처럼 직전 선수들을 제외
  const sessions = [];
  if (SESSION_STEPS > 0) {
    done = 0;
    const sessSports = SPORTS.filter((s) => s !== "any").concat(SPORTS.includes("any") ? ["any"] : []);
    await pool(sessSports, CONCURRENCY, async (sport) => {
      const seen = [];
      const steps = [];
      for (let i = 0; i < SESSION_STEPS; i++) {
        const age = 28;
        const r = await callJudge(sport, age, seen.slice(-10));
        steps.push({ ...r, phase: "session", step: i });
        if (r.data) seen.push(shortName(r.data.reveal.athlete));
      }
      sessions.push({ sport, steps, athletes: steps.map((s) => (s.data ? shortName(s.data.reveal.athlete) : "실패")) });
      progress("재방문 시뮬레이션", ++done, sessSports.length);
    });
  }

  const all = [...matrix, ...sessions.flatMap((s) => s.steps)];
  for (const r of all) {
    if (!r.data) {
      r.kind = "error";
      continue;
    }
    r.kind = classify(r.data);
    r.accuracy = checkAccuracy(r);
    r.quality = checkQuality(r);
  }
  if (CHECK_LINKS) {
    const withSrc = all.filter((r) => r.kind === "ai_search");
    await pool(withSrc, 4, async (r) => r.accuracy.push(...(await checkLinks(r))));
  }
  if (JUDGE) await judgeWithAI(matrix);

  const report = buildReport(matrix, sessions, all);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dir = path.join(ROOT, "eval/results");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${stamp}.md`), report);
  writeFileSync(path.join(dir, `${stamp}.json`), JSON.stringify({ options: { BASE, SPORTS, AGES, RUNS, SESSION_STEPS }, matrix, sessions }, null, 2));
  console.log("\n" + report);
  console.log(`저장: eval/results/${stamp}.md`);
}

// ───────────────────────── 리포트 ─────────────────────────
function buildReport(matrix, sessions, all) {
  const L = [];
  const ok = matrix.filter((r) => r.data);
  L.push(`# 판독 품질 테스트`, "");
  L.push(`- 대상: ${BASE}`);
  L.push(`- 종목 ${SPORTS.length}개 × 나이 ${AGES.length}개(${AGES.join(", ")}) × ${RUNS}회 = ${matrix.length}건, 재방문 시뮬레이션 ${sessions.length}명 × ${SESSION_STEPS}회`);
  L.push(`- 실행 시각: ${new Date().toLocaleString("ko-KR")}`, "");

  // 1. 출처 비율
  L.push(`## 1. 답변 출처 비율`, "");
  L.push(`| 출처 | 건수 | 비율 | 응답 시간 p50 | p90 |`, `| --- | --- | --- | --- | --- |`);
  for (const k of ["ai_search", "ai_copy", "template", "error"]) {
    const rs = all.filter((r) => r.kind === k);
    if (!rs.length) continue;
    const ms = rs.map((r) => r.ms);
    L.push(`| ${KIND_LABEL[k]} | ${rs.length} | ${pct(rs.length, all.length)} | ${(quantile(ms, 0.5) / 1000).toFixed(1)}초 | ${(quantile(ms, 0.9) / 1000).toFixed(1)}초 |`);
  }
  L.push("", "> AI 문구(하이브리드): 선수·연도 같은 사실은 준비된 기록, 위로·동기부여·독설·처방 문구만 AI. 미리 지정한 답: AI가 실패하거나 9초를 넘겨 템플릿 문구를 그대로 쓴 경우.", "");
  const bySport = SPORTS.map((s) => {
    const rs = all.filter((r) => r.sport === s);
    const ai = rs.filter((r) => r.kind === "ai_copy" || r.kind === "ai_search").length;
    return `${s} ${pct(ai, rs.length)}`;
  });
  L.push(`종목별 AI 비율: ${bySport.join(" · ")}`, "");
  for (const r of all.filter((r) => r.kind === "error").slice(0, 5)) L.push(`- 실패: ${r.sport} ${r.age}세 → ${r.error}`);

  // 2. 정확성
  const okAll = all.filter((r) => r.data);
  L.push("", `## 2. 정확성`, "");
  const accFail = okAll.filter((r) => r.accuracy.length);
  L.push(`정확성 규칙 통과: **${pct(okAll.length - accFail.length, okAll.length)}** (${okAll.length - accFail.length}/${okAll.length})`, "");
  L.push(...topIssues(okAll, "accuracy"));

  // 3. 품질
  L.push("", `## 3. 문구 품질 (규칙 검사)`, "");
  for (const k of ["ai_search", "ai_copy", "template"]) {
    const rs = okAll.filter((r) => r.kind === k);
    if (!rs.length) continue;
    const pass = rs.filter((r) => !r.quality.length).length;
    L.push(`- ${KIND_LABEL[k]}: 통과 ${pct(pass, rs.length)} (${pass}/${rs.length})`);
  }
  L.push("", ...topIssues(okAll, "quality"));

  const scored = matrix.filter((r) => r.score);
  if (scored.length) {
    L.push("", `### AI 채점 (${scored.length}건, 1~5점)`, "");
    const avg = (k) => (scored.reduce((s, r) => s + r.score[k], 0) / scored.length).toFixed(2);
    L.push(`| 재미 | 톤 안전 | 사실 근거 | 자연스러움 | 처방 실행성 |`, `| --- | --- | --- | --- | --- |`);
    L.push(`| ${avg("fun")} | ${avg("tone")} | ${avg("grounded")} | ${avg("natural")} | ${avg("actionable")} |`, "");
    const fc = (v) => scored.filter((r) => r.score.factCheck === v).length;
    L.push(`리빌 사실 확인: 맞음 ${fc("correct")} · 틀림 ${fc("wrong")} · 불확실 ${fc("unsure")}`, "");
    const worst = [...scored].sort((a, b) => sumScore(a) - sumScore(b)).slice(0, 5);
    L.push(`가장 낮은 점수:`);
    for (const r of worst) L.push(`- ${r.sport} ${r.age}세 (합 ${sumScore(r)}/25): ${r.score.issues.join(" / ") || "지적 없음"}`);
    for (const r of scored.filter((r) => r.score.factCheck === "wrong")) L.push(`- **사실 틀림 의심** ${r.sport} ${r.age}세: ${r.data.reveal.headline} — ${r.score.issues.join(" / ")}`);
  }

  // 4. 다양성
  L.push("", `## 4. 다양성 (같은 종목·나이로 ${RUNS}번 들어왔을 때)`, "");
  const groups = new Map();
  for (const r of ok) {
    const key = `${r.sport}|${r.age}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  const fields = {
    athlete: (d) => shortName(d.reveal.athlete),
    headline: (d) => d.reveal.headline,
    comfort: (d) => d.comfort.line,
    motivate: (d) => d.motivate.line,
    roast: (d) => [...d.roast.lines].sort().join(" | "),
    prescription: (d) => d.workout.prescription,
  };
  const FIELD_LABEL = { athlete: "리빌 선수", headline: "리빌 문장", comfort: "위로", motivate: "동기부여", roast: "독설 세트", prescription: "처방" };
  const multi = [...groups.values()].filter((g) => g.length > 1);
  if (multi.length) {
    L.push(`"똑같이 나온 비율"은 같은 조합을 두 번 했을 때 완전히 같은 결과가 나온 쌍의 비율입니다. 낮을수록 좋습니다.`, "");
    L.push(`| 항목 | 똑같이 나온 비율 | 평균 유사도 |`, `| --- | --- | --- |`);
    for (const [f, get] of Object.entries(fields)) {
      let same = 0;
      let pairs = 0;
      let simSum = 0;
      for (const g of multi)
        for (let i = 0; i < g.length; i++)
          for (let j = i + 1; j < g.length; j++) {
            const a = get(g[i].data);
            const b = get(g[j].data);
            pairs++;
            if (a === b) same++;
            simSum += similarity(a, b);
          }
      L.push(`| ${FIELD_LABEL[f]} | ${pct(same, pairs)} | ${(simSum / pairs).toFixed(2)} |`);
    }
  }
  const athletesBySport = SPORTS.map((s) => `${s} ${new Set(ok.filter((r) => r.sport === s).map((r) => shortName(r.data.reveal.athlete))).size}명`);
  L.push("", `종목별 등장한 리빌 선수 수: ${athletesBySport.join(" · ")}`);
  const roastCount = new Map();
  for (const r of ok) for (const l of r.data.roast.lines) roastCount.set(l, (roastCount.get(l) ?? 0) + 1);
  const totalRoast = [...roastCount.values()].reduce((a, b) => a + b, 0);
  L.push(`독설: 총 ${totalRoast}줄 중 서로 다른 문장 ${roastCount.size}개`);
  const topRoast = [...roastCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  L.push("", `가장 많이 반복된 독설:`);
  for (const [l, c] of topRoast) L.push(`- ${c}회: ${l}`);

  // 5. 재방문 사용자
  if (sessions.length) {
    L.push("", `## 5. 재방문 사용자 시뮬레이션 (28세, 같은 종목 ${SESSION_STEPS}번 연속, 직전 선수 제외)`, "");
    for (const s of sessions) {
      const uniq = new Set(s.athletes).size;
      L.push(`- ${s.sport}: ${s.athletes.join(" → ")} (${uniq}/${s.athletes.length}명이 서로 다름${uniq < s.athletes.length ? ", **반복 있음**" : ""})`);
    }
  }

  // 6. 예시
  L.push("", `## 6. 예시 응답`, "");
  const samples = [...new Map(ok.map((r) => [r.kind, r])).values()];
  for (const r of samples) {
    const t = userTexts(r.data);
    L.push(`**${KIND_LABEL[r.kind]}** · ${r.sport} ${r.age}세 · ${(r.ms / 1000).toFixed(1)}초`, "");
    for (const [k, v] of Object.entries(t)) L.push(`- ${k}: ${v}`);
    L.push("");
  }
  return L.join("\n");
}

function sumScore(r) {
  const s = r.score;
  return s.fun + s.tone + s.grounded + s.natural + s.actionable;
}

function topIssues(rs, key) {
  const count = new Map();
  for (const r of rs)
    for (const i of r[key]) {
      const label = i.replace(/\s*\(.*$/, "");
      if (!count.has(label)) count.set(label, { n: 0, ex: `${r.sport} ${r.age}세: ${i}` });
      count.get(label).n++;
    }
  if (!count.size) return ["문제 없음"];
  return [...count.entries()].sort((a, b) => b[1].n - a[1].n).map(([label, v]) => `- ${label}: ${v.n}건 (예: ${v.ex})`);
}

main();
