/**
 * 브라우저(쿠키) 기준 호출 제한. IP는 쓰지 않는다.
 * 시연장이 한 공유기 뒤에 있어도 폰마다 따로 센다.
 * 인스턴스 메모리라 서버가 나뉘면 한도도 나뉜다.
 * 넘기면 AI를 호출하지 않고 준비된 기록으로 넘긴다.
 */

const SESSION_LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;
const GLOBAL_LIMIT = 800;

const hits = new Map<string, number[]>();

function prune(key: string, now: number): number[] {
  const kept = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(key, kept);
  return kept;
}

export function readSession(request: Request): { id: string; fresh: boolean } {
  const raw = request.headers.get("cookie") ?? "";
  const match = raw.match(/(?:^|;)\s*gap_sid=([A-Za-z0-9-]{16,80})/);
  if (match) return { id: match[1], fresh: false };
  return { id: crypto.randomUUID(), fresh: true };
}

export function sessionCookie(id: string, request: Request): string {
  const proto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  const secure = proto === "https" ? "; Secure" : "";
  return `gap_sid=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`;
}

/** true면 이번 요청은 AI를 호출해도 된다. */
export function allowAiCall(sessionId: string, now = Date.now()): boolean {
  if (hits.size > 2000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  const sessionHits = prune(`s:${sessionId}`, now);
  const globalHits = prune("global", now);
  if (sessionHits.length >= SESSION_LIMIT || globalHits.length >= GLOBAL_LIMIT) return false;
  sessionHits.push(now);
  globalHits.push(now);
  return true;
}
