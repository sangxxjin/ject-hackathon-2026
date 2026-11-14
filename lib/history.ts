/**
 * 이 브라우저의 판독 기록 (클라이언트 전용, localStorage).
 * 다시 찾아온 사람에게 같은 선수만 보여주지 않으려고 판독 횟수와 최근 선수만 남긴다.
 * 저장소가 막혀 있어도(시크릿 창 등) 판독은 그대로 동작한다.
 */
const KEY = "gap:history";
/** 다음 방문에 제외할 최근 선수 수. 너무 많으면 나이와 먼 선수가 나온다 */
const KEEP_SEEN = 5;

export type History = { visits: number; seen: string[] };

export function loadHistory(): History {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<History> | null;
    return {
      visits: Number.isFinite(raw?.visits) ? Math.max(0, Number(raw?.visits)) : 0,
      seen: Array.isArray(raw?.seen) ? raw.seen.filter((s): s is string => typeof s === "string").slice(-KEEP_SEEN) : [],
    };
  } catch {
    return { visits: 0, seen: [] };
  }
}

export function recordVisit(athlete: string): void {
  try {
    const h = loadHistory();
    const seen = [...h.seen.filter((s) => s !== athlete), athlete].slice(-KEEP_SEEN);
    localStorage.setItem(KEY, JSON.stringify({ visits: h.visits + 1, seen }));
  } catch {
    // 저장 실패는 무시한다
  }
}
