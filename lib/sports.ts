export const SPORT_IDS = [
  "baseball_kr",
  "baseball_world",
  "soccer_kr",
  "soccer_world",
  "nba",
  "esports",
] as const;

export type SportId = (typeof SPORT_IDS)[number];
export type SportChoice = SportId | "any";

type SportInfo = {
  label: string;
  /** 프롬프트에 넣는 종목 정의 */
  scope: string;
  /** 농담용 근사치. 화면에는 "약 N세"로 표기 */
  avgRetireAge: number;
};

export const SPORTS: Record<SportId, SportInfo> = {
  baseball_kr: { label: "야구", scope: "KBO 리그와 한국 야구 대표팀", avgRetireAge: 36 },
  baseball_world: { label: "해외야구", scope: "MLB, NPB 등 해외 프로야구", avgRetireAge: 36 },
  soccer_kr: { label: "축구", scope: "K리그와 한국 축구 대표팀", avgRetireAge: 35 },
  soccer_world: { label: "해외축구", scope: "유럽 등 해외 리그와 국제 대회", avgRetireAge: 35 },
  nba: { label: "NBA", scope: "NBA", avgRetireAge: 34 },
  esports: { label: "e스포츠", scope: "리그 오브 레전드(LoL) 프로 선수", avgRetireAge: 26 },
};

export function isSportChoice(v: unknown): v is SportChoice {
  return v === "any" || (typeof v === "string" && (SPORT_IDS as readonly string[]).includes(v));
}

export function sportLabel(s: SportChoice): string {
  return s === "any" ? "아무거나" : SPORTS[s].label;
}

export const MIN_AGE = 10;
export const MAX_AGE = 60;

export function clampAge(n: number): number {
  if (!Number.isFinite(n)) return 28;
  return Math.min(MAX_AGE, Math.max(MIN_AGE, Math.round(n)));
}

export function currentYear(): number {
  return new Date().getFullYear();
}
