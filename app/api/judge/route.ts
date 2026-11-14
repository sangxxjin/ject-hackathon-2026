import { buildFallback } from "@/lib/fallback";
import { judge } from "@/lib/judge";
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

  try {
    const { result, log } = await judge({ sport, age, exclude });
    console.log(`[judge] ${sport} ${age}세 → ${result.source} | ${log.join(" | ")}`);
    return Response.json(result);
  } catch (e) {
    console.error("[judge] 예외", e);
    return Response.json(buildFallback(sport, age, exclude));
  }
}
