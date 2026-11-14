import type { Mode } from "./copy";
import { ONE_LINERS } from "./copy";
import { exerciseBonus } from "./prescriptions";

/** 카드 질문 4개 (docs/spec.md 9절). score는 해당 능력치 점수 */
export const QUESTIONS: { stat: StatName; q: string; options: { text: string; score: number }[] }[] = [
  {
    stat: "체력",
    q: "계단 3층을 만났다",
    options: [
      { text: "두 칸씩 올라간다", score: 80 },
      { text: "올라가긴 하는데 말이 없어진다", score: 45 },
      { text: "엘리베이터 버튼부터 찾는다", score: 10 },
    ],
  },
  {
    stat: "의지",
    q: "알람을 끄면서 한 말은?",
    options: [
      { text: "일어났다", score: 80 },
      { text: "5분만", score: 45 },
      { text: "오늘은 재정비의 날", score: 10 },
    ],
  },
  {
    stat: "변명",
    q: "운동 약속이 취소됐다. 속마음은?",
    options: [
      { text: "아쉽다", score: 20 },
      { text: "사실 안도", score: 60 },
      { text: "내가 먼저 취소하려 했다", score: 95 },
    ],
  },
  {
    stat: "멘탈",
    q: "응원팀이 역전패했다. 당신은?",
    options: [
      { text: "다음 경기를 분석한다", score: 80 },
      { text: "소리 지르고 잔다", score: 50 },
      { text: "이 팀을 응원하게 된 과거의 나를 심문한다", score: 15 },
    ],
  },
];

export type StatName = "체력" | "의지" | "변명" | "멘탈";
export type Grade = "소파" | "벤치" | "후보" | "주전" | "에이스";

export type CardStats = {
  stats: Record<StatName, number>;
  ovr: number;
  baseOvr: number;
  bonus: number;
  grade: Grade;
  oneLiner: string;
};

/**
 * answers: 질문별 선택한 옵션 index. 비어 있으면 가운데 선택지로 계산.
 * exerciseSec: "오늘의 처방 실행"으로 운동한 시간. 30초마다 OVR +1 (최대 +20)
 */
export function computeCard(answers: number[], age: number, mode: Mode | null, exerciseSec = 0): CardStats {
  const score = (i: number) => QUESTIONS[i].options[answers[i] ?? 1].score;
  const over25 = Math.max(0, age - 25);
  const stats: Record<StatName, number> = {
    체력: Math.round(Math.max(5, score(0) - over25 * 0.5)),
    의지: Math.round(Math.min(99, score(1) + (mode === "motivate" ? 10 : mode === "roast" ? 5 : 0))),
    변명: Math.round(Math.min(99, score(2) + over25)),
    멘탈: Math.round(Math.min(99, score(3) + (mode === "comfort" ? 10 : 0))),
  };
  const baseOvr = Math.round(stats.체력 * 0.3 + stats.의지 * 0.3 + stats.멘탈 * 0.2 + (100 - stats.변명) * 0.2);
  const bonus = exerciseBonus(exerciseSec);
  const ovr = Math.min(99, baseOvr + bonus);
  const grade: Grade = ovr < 30 ? "소파" : ovr < 50 ? "벤치" : ovr < 70 ? "후보" : ovr < 85 ? "주전" : "에이스";

  // 가장 약한 능력치 (변명은 높을수록 약점)
  const weakness: [StatName, number][] = [
    ["체력", stats.체력],
    ["의지", stats.의지],
    ["멘탈", stats.멘탈],
    ["변명", 100 - stats.변명],
  ];
  weakness.sort((a, b) => a[1] - b[1]);
  const pool = ONE_LINERS[weakness[0][0]];
  const oneLiner = pool[(ovr + age) % pool.length];

  return { stats, ovr, baseOvr, bonus, grade, oneLiner };
}
