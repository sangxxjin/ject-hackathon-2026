import type { ModelOutput } from "./schema";
import { shortName } from "./josa";
import { KNOWN_BIRTH_YEARS } from "./fallback";
import { currentYear } from "./sports";

const BANNED = ["씨발", "시발", "병신", "좆", "개새", "꺼져", "죽어", "뚱뚱", "못생", "늙은이", "틀딱"];

/** docs/spec.md 7.6 서버 검증. 문제 목록을 돌려준다(빈 배열이면 통과). */
export function validateOutput(
  out: ModelOutput,
  ctx: { age: number; exclude: string[]; allowMedium: boolean },
): string[] {
  const issues: string[] = [];
  const r = out.reveal;
  const diff = r.eventYear - r.athleteBirthYear - r.eventAge;
  if (diff !== 0 && diff !== 1) issues.push(`나이 계산 불일치 (${r.eventYear}-${r.athleteBirthYear}≠${r.eventAge})`);
  const known = KNOWN_BIRTH_YEARS[shortName(r.athlete)];
  if (known && known !== r.athleteBirthYear) issues.push(`출생 연도 틀림 (${r.athleteBirthYear}, 실제 ${known})`);
  if (r.delta !== r.eventAge - ctx.age) issues.push("delta 불일치");
  if (ctx.age >= 17 && ctx.age <= 38 && Math.abs(r.delta) > 5) issues.push(`나이 차이 너무 큼 (${r.delta})`);
  if (/[A-Za-z]{3,}/.test(r.athlete.replace(/\([^)]*\)/g, ""))) issues.push("선수 이름이 영문");
  if (r.eventYear > currentYear() || r.athleteBirthYear < 1900) issues.push("연도 범위 오류");
  if (out.comfort.laterAge <= out.comfort.lowAge) issues.push("위로 순서 오류");
  const ex = new Set(ctx.exclude.map(shortName));
  if (ex.has(shortName(r.athlete))) issues.push("제외 선수 선택");
  if (out.confidence !== "high" && !ctx.allowMedium) issues.push("확신도 medium");
  if (r.headline.length > 80) issues.push("headline 너무 김");
  if (out.roast.lines.length !== 3) issues.push("독설 개수 오류");
  if (out.roast.lines.some((l) => l.length > 60)) issues.push("독설 너무 김");
  const allText = JSON.stringify(out);
  if (BANNED.some((w) => allText.includes(w))) issues.push("금칙어 포함");
  return issues;
}
