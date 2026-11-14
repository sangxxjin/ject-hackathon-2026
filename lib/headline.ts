import { josa, shortName } from "./josa";

/** delta별 리빌 문구 (docs/spec.md 5절). fact는 "~했습니다"로 끝나는 서술어 절. */
export function buildHeadline(athlete: string, fact: string, eventAge: number, delta: number): string {
  const subj = josa(shortName(athlete), "은/는");
  const body = fact.replace(/[.。]\s*$/, "");
  if (delta === 0) return `${subj} 당신 나이에 ${body}.`;
  if (delta < 0) return `${subj} 당신보다 ${-delta}살 어릴 때 ${body}.`;
  return `${subj} 당신보다 ${delta}살 많은 ${eventAge}세에 ${body}. 아직 ${delta}년 남았습니다.`;
}
