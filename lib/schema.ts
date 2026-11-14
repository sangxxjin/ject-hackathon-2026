import { z } from "zod";
import { SPORT_IDS } from "./sports";

/**
 * 모델이 채우는 JSON (docs/spec.md 7.4).
 * OpenAI structured outputs strict 모드라 모든 필드는 필수, .optional() 금지.
 * 출처(sources)는 모델이 쓰지 않고 서버가 웹 검색 인용에서 직접 뽑는다.
 */
export const ModelOutputSchema = z.object({
  reveal: z.object({
    athlete: z.string(),
    sport: z.enum(SPORT_IDS),
    athleteBirthYear: z.number().int(),
    eventYear: z.number().int(),
    eventAge: z.number().int(),
    delta: z.number().int(),
    headline: z.string(),
    shortFact: z.string(),
  }),
  comfort: z.object({
    athlete: z.string(),
    lowAge: z.number().int(),
    lowText: z.string(),
    laterAge: z.number().int(),
    laterText: z.string(),
    line: z.string(),
  }),
  motivate: z.object({
    athlete: z.string(),
    habit: z.string(),
    line: z.string(),
  }),
  roast: z.object({ lines: z.array(z.string()) }),
  workout: z.object({
    athleteFact: z.string(),
    prescription: z.string(),
  }),
  confidence: z.enum(["high", "medium"]),
});

export type ModelOutput = z.infer<typeof ModelOutputSchema>;

export type Source = { title: string; url: string };

export type JudgeResult = ModelOutput & {
  sources: Source[];
  source: "ai" | "fallback";
};

export const JudgeRequestSchema = z.object({
  sport: z.string(),
  age: z.number(),
  excludeAthletes: z.array(z.string().max(30)).max(10).default([]),
  /** 이 브라우저에서 이전에 판독한 횟수. 많을수록 더 다양한 선수와 문구를 고른다 */
  visit: z.number().default(0),
});
