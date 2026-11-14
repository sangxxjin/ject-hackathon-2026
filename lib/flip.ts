import { josa, shortName } from "./josa";
import { SPORTS, type SportId, currentYear } from "./sports";

/** 은퇴 카운트다운 (docs/spec.md 6절) */
export function retireCountdown(sport: SportId, age: number): string {
  const n = SPORTS[sport].avgRetireAge;
  const remain = n - age;
  if (remain > 0) return `이 종목 평균 은퇴 나이는 약 ${n}세. 남은 시간 약 ${remain}년`;
  if (remain === 0) return "올해가 평균 은퇴 나이입니다. 마지막 시즌입니다";
  return `평균 은퇴 나이는 약 ${n}세. 이미 ${-remain}년째 연장전입니다`;
}

/** 생년 모드 (docs/spec.md 6절) */
export function birthYearLine(athlete: string, athleteBirthYear: number, age: number): string {
  const birthYear = currentYear() - age;
  const a = birthYear - athleteBirthYear;
  const subj = josa(shortName(athlete), "은/는");
  if (a > 0) return `당신이 태어난 ${birthYear}년, ${subj} ${a}살이었습니다`;
  if (a === 0) return `당신과 ${subj} 같은 해에 태어났습니다`;
  return `당신이 태어난 ${birthYear}년, ${subj} 아직 태어나지도 않았습니다`;
}
