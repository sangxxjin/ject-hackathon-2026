/**
 * 오늘의 처방 풀. 모드마다 강도가 다르다.
 * 위로 = 가볍게, 동기부여 = 적당히, 신랄한 비판 = 세게.
 * 문구를 다듬을 때는 이 파일만 고치면 된다.
 */
import type { Mode } from "./copy";
import type { SportId } from "./sports";

type Group = "baseball" | "soccer" | "nba" | "esports";
type Intensity = "easy" | "normal" | "hard";

const GROUP: Record<SportId, Group> = {
  baseball_kr: "baseball",
  baseball_world: "baseball",
  soccer_kr: "soccer",
  soccer_world: "soccer",
  nba: "nba",
  esports: "esports",
};

const INTENSITY: Record<Mode, Intensity> = { comfort: "easy", motivate: "normal", roast: "hard" };

export const PRESCRIPTIONS: Record<Group, Record<Intensity, string[]>> = {
  baseball: {
    easy: [
      "어깨와 손목 스트레칭 3분부터 천천히 해보세요.",
      "캐치볼 대신 벽에 공 던지기 20번, 가볍게 시작해요.",
      "더그아웃에서 일어나듯, 의자에서 일어나 5분만 걸어요.",
    ],
    normal: [
      "거울 앞에서 빈 스윙 30번, 폼은 프로처럼.",
      "도루하듯 짧은 전력 질주 5번, 사이사이 걷기.",
      "투수처럼 하체부터: 런지 좌우 10번씩.",
    ],
    hard: [
      "빈 스윙 100번. 홈런 타자는 오늘도 더 휘둘렀습니다.",
      "베이스 러닝 흉내: 30초 전력 질주 + 30초 걷기 8세트.",
      "스쿼트 50개. 포수는 경기 내내 앉았다 일어납니다.",
    ],
  },
  soccer: {
    easy: [
      "동네 한 바퀴 10분 걷기, 워밍업도 경기의 일부입니다.",
      "햄스트링과 종아리 스트레칭 5분이면 오늘은 합격.",
      "공 대신 페트병으로 제자리 리프팅 흉내 50번.",
    ],
    normal: [
      "1km만 뛰고 오세요. 선수는 한 경기에 약 10km를 뜁니다.",
      "인터벌 러닝: 1분 빠르게, 1분 천천히 5세트.",
      "사이드 스텝과 백스텝, 수비 스텝 3분 3세트.",
    ],
    hard: [
      "3km 러닝. 후반 추가시간까지 버티는 체력을 만드세요.",
      "버피 30개. 90분 압박 수비의 맛을 보세요.",
      "계단 오르내리기 10분. 헤더 경합은 하체에서 시작합니다.",
    ],
  },
  nba: {
    easy: [
      "제자리 점프 20번이면 오늘은 합격입니다.",
      "손목 털기와 어깨 돌리기 3분, 슈팅 폼부터 풀어요.",
      "자유투 자세로 무릎 굽혔다 펴기 20번.",
    ],
    normal: [
      "제자리 점프 50번, 리바운드는 점프에서 나옵니다.",
      "수비 슬라이드 30초 + 휴식 30초 6세트.",
      "줄넘기(없으면 흉내) 3분 3세트.",
    ],
    hard: [
      "점프 스쿼트 40개. 덩크는 하체로 합니다.",
      "코트 왕복 흉내: 20m 셔틀런 10번.",
      "버피 25개 + 점프 50번. 4쿼터 클러치 체력입니다.",
    ],
  },
  esports: {
    easy: [
      "손목 말고 하체를 쓰세요. 스쿼트 10번부터.",
      "모니터에서 눈 떼고 목·어깨 스트레칭 3분.",
      "한 판 대기 시간 동안 일어나서 5분 걷기.",
    ],
    normal: [
      "스쿼트 20번 + 플랭크 30초, 손가락 말고 코어를 쓰세요.",
      "푸시업 15번. 프로게이머도 체력 관리로 운동합니다.",
      "10분 산책, 리스폰 대기라고 생각하세요.",
    ],
    hard: [
      "스쿼트 50번. 손가락만 국가대표면 곤란합니다.",
      "플랭크 1분 3세트, 한타 집중력은 코어에서 나옵니다.",
      "20분 걷기. 오늘은 미니맵 대신 동네 지도를 보세요.",
    ],
  },
};

/** 종목·모드에 맞는 처방 하나. seed가 같으면 같은 처방 (화면 리렌더에 바뀌지 않게) */
export function pickPrescription(sport: SportId, mode: Mode, seed: number): string {
  const list = PRESCRIPTIONS[GROUP[sport]][INTENSITY[mode]];
  return list[Math.abs(seed) % list.length];
}

/** 운동 시간 → 카드 OVR 보너스. 30초마다 +1, 최대 +20 */
export const BONUS_STEP_SEC = 30;
export const BONUS_MAX = 20;
export function exerciseBonus(sec: number): number {
  return Math.min(BONUS_MAX, Math.floor(sec / BONUS_STEP_SEC));
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
