import { buildFallback } from "@/lib/fallback";
import { judge } from "@/lib/judge";
import { allowAiCall, readSession, sessionCookie } from "@/lib/ratelimit";
import { JudgeRequestSchema } from "@/lib/schema";
import { clampAge, isSportChoice } from "@/lib/sports";

export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "잘못된 요청" }, { status: 400 });
  }
  const parsed = JudgeRequestSchema.safeParse(body);
  if (!parsed.success || !isSportChoice(parsed.data.sport)) {
    return Response.json({ error: "잘못된 요청" }, { status: 400 });
  }
  const sport = parsed.data.sport;
  const age = clampAge(parsed.data.age);
  const exclude = parsed.data.excludeAthletes.map((s) => s.trim()).filter(Boolean);
  const visit = Math.min(100, Math.max(0, Math.floor(parsed.data.visit) || 0));
  const session = readSession(request);

  const json = (body: unknown) => {
    const headers = new Headers();
    if (session.fresh) headers.set("Set-Cookie", sessionCookie(session.id, request));
    return Response.json(body, { headers });
  };

  if (!allowAiCall(session.id)) {
    console.log(`[judge] 호출 제한 ${sport} ${age}세 → fallback`);
    return json(buildFallback(sport, age, exclude, visit));
  }

  try {
    const { result, log } = await judge({ sport, age, exclude, visit });
    console.log(`[judge] ${sport} ${age}세 방문${visit} → ${result.source} | ${log.join(" | ")}`);
    return json(result);
  } catch (e) {
    console.error("[judge] 예외", e);
    return json(buildFallback(sport, age, exclude, visit));
  }
}
