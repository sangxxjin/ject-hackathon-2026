/**
 * 비상용 결과 (docs/fallback.md). AI 판독이 실패했을 때만 쓴다.
 * verified: false 항목은 팀 검증 전이다. 검증하면 true로 바꾸고, 틀리면 지운다.
 */
import { buildHeadline } from "./headline";
import { josa, shortName } from "./josa";
import { ROAST_POOL } from "./copy";
import type { JudgeResult } from "./schema";
import { SPORT_IDS, type SportChoice, type SportId } from "./sports";

type Peak = {
  athlete: string;
  birthYear: number;
  eventYear: number;
  eventAge: number;
  fact: string;
  shortFact: string;
  verified: boolean;
};

type Comfort = { athlete: string; lowAge: number; lowText: string; laterAge: number; laterText: string };

const P = (
  athlete: string,
  birthYear: number,
  eventYear: number,
  eventAge: number,
  fact: string,
  shortFact: string,
): Peak => ({ athlete, birthYear, eventYear, eventAge, fact, shortFact, verified: false });

export const PEAKS: Record<SportId, Peak[]> = {
  baseball_kr: [
    P("류현진", 1987, 2006, 19, "데뷔 첫해에 KBO 신인왕과 정규시즌 MVP를 동시에 받았습니다", "신인왕+MVP"),
    P("김광현", 1988, 2008, 20, "KBO 정규시즌 MVP를 받았습니다", "정규시즌 MVP"),
    P("이정후", 1998, 2022, 24, "KBO 정규시즌 MVP를 받았습니다", "정규시즌 MVP"),
    P("이승엽", 1976, 2003, 27, "한 시즌 56홈런을 쳐 아시아 단일 시즌 최다 홈런 기록을 세웠습니다", "시즌 56홈런"),
    P("이대호", 1982, 2010, 28, "타격 7관왕을 차지했습니다", "타격 7관왕"),
    P("양현종", 1988, 2017, 29, "정규시즌 MVP와 한국시리즈 MVP를 한 해에 모두 받았습니다", "MVP 2관왕"),
    P("최정", 1987, 2024, 37, "KBO 통산 최다 홈런 기록을 새로 썼습니다", "통산 최다 홈런"),
  ],
  baseball_world: [
    P("박찬호", 1973, 1994, 20, "한국인 최초로 메이저리그 마운드에 올랐습니다", "한국인 첫 MLB"),
    P("오타니 쇼헤이", 1994, 2018, 24, "아메리칸리그 신인왕을 받았습니다", "AL 신인왕"),
    P("오타니 쇼헤이", 1994, 2021, 27, "투타 겸업으로 아메리칸리그 MVP를 만장일치로 받았습니다", "만장일치 MVP"),
    P("박찬호", 1973, 2001, 28, "메이저리그 올스타에 뽑혔습니다", "MLB 올스타"),
    P("스즈키 이치로", 1973, 2001, 28, "메이저리그 데뷔 첫해에 신인왕과 MVP를 동시에 받았습니다", "신인왕+MVP"),
    P("추신수", 1982, 2013, 31, "텍사스와 7년 1억 3천만 달러 FA 계약을 맺었습니다", "대형 FA 계약"),
    P("류현진", 1987, 2019, 32, "내셔널리그 평균자책점 1위에 올랐습니다", "NL 평균자책점 1위"),
  ],
  soccer_kr: [
    P("이강인", 2001, 2019, 18, "U-20 월드컵 골든볼을 받았습니다", "U-20 골든볼"),
    P("이동국", 1979, 1998, 19, "국가대표로 월드컵 본선 무대를 밟았습니다", "월드컵 출전"),
    P("박지성", 1981, 2002, 21, "월드컵 포르투갈전에서 결승골을 넣었습니다", "포르투갈전 결승골"),
    P("조규성", 1998, 2022, 24, "월드컵 가나전에서 혼자 두 골을 넣었습니다", "월드컵 멀티골"),
    P("이동국", 1979, 2009, 30, "K리그 MVP와 득점왕을 함께 차지했습니다", "K리그 MVP"),
    P("손흥민", 1992, 2022, 30, "국가대표 주장으로 월드컵 16강을 이끌었습니다", "주장, 월드컵 16강"),
    P("이동국", 1979, 2017, 38, "K리그 최초로 통산 200골을 넣었습니다", "K리그 200골"),
  ],
  soccer_world: [
    P("킬리안 음바페", 1998, 2018, 19, "월드컵에서 우승했습니다", "월드컵 우승"),
    P("리오넬 메시", 1987, 2009, 22, "첫 발롱도르를 받았습니다", "첫 발롱도르"),
    P("크리스티아누 호날두", 1985, 2008, 23, "첫 발롱도르를 받았습니다", "첫 발롱도르"),
    P("손흥민", 1992, 2019, 26, "챔피언스리그 결승에 선발로 나섰습니다", "챔스 결승 선발"),
    P("김민재", 1996, 2023, 26, "나폴리의 33년 만의 세리에A 우승을 이끌었습니다", "세리에A 우승"),
    P("손흥민", 1992, 2022, 29, "프리미어리그 득점왕에 올랐습니다", "EPL 득점왕"),
    P("크리스티아누 호날두", 1985, 2016, 31, "포르투갈의 유로 우승을 이끌었습니다", "유로 우승"),
    P("리오넬 메시", 1987, 2022, 35, "월드컵에서 우승했습니다", "월드컵 우승"),
  ],
  nba: [
    P("코비 브라이언트", 1978, 1996, 17, "고등학교 졸업과 동시에 NBA 드래프트에 뽑혔습니다", "고졸 드래프트"),
    P("르브론 제임스", 1984, 2003, 18, "NBA 드래프트 전체 1순위로 뽑혔습니다", "전체 1순위"),
    P("코비 브라이언트", 1978, 2000, 21, "첫 NBA 우승을 차지했습니다", "첫 우승"),
    P("르브론 제임스", 1984, 2009, 24, "첫 정규시즌 MVP를 받았습니다", "첫 MVP"),
    P("스테픈 커리", 1988, 2015, 27, "첫 NBA 우승을 차지했습니다", "첫 우승"),
    P("스테픈 커리", 1988, 2016, 28, "NBA 역사상 첫 만장일치 MVP를 받았습니다", "만장일치 MVP"),
    P("마이클 조던", 1963, 1991, 28, "첫 NBA 우승과 파이널 MVP를 차지했습니다", "첫 우승"),
    P("더크 노비츠키", 1978, 2011, 32, "첫 NBA 우승과 파이널 MVP를 차지했습니다", "첫 우승"),
    P("르브론 제임스", 1984, 2020, 35, "네 번째 NBA 우승을 차지했습니다", "4번째 우승"),
  ],
  esports: [
    P("페이커 (이상혁)", 1996, 2013, 17, "롤드컵에서 첫 우승을 차지했습니다", "첫 롤드컵 우승"),
    P("룰러 (박재혁)", 1998, 2017, 18, "롤드컵에서 우승했습니다", "롤드컵 우승"),
    P("페이커 (이상혁)", 1996, 2016, 20, "세 번째 롤드컵 우승을 차지했습니다", "롤드컵 3회"),
    P("데프트 (김혁규)", 1996, 2022, 26, "데뷔 9년 만에 첫 롤드컵 우승을 차지했습니다", "첫 롤드컵 우승"),
    P("페이커 (이상혁)", 1996, 2023, 27, "네 번째 롤드컵 우승을 차지했습니다", "롤드컵 4회"),
    P("페이커 (이상혁)", 1996, 2024, 28, "다섯 번째 롤드컵 우승을 차지했습니다", "롤드컵 5회"),
  ],
};

const COMFORTS: Record<SportId, Comfort[]> = {
  baseball_kr: [{ athlete: "박병호", lowAge: 25, lowText: "1군에 자리를 잡지 못하고 트레이드됐습니다", laterAge: 26, laterText: "정규시즌 MVP를 받았습니다" }],
  baseball_world: [{ athlete: "추신수", lowAge: 24, lowText: "마이너리그를 오가며 자리를 잡지 못했습니다", laterAge: 31, laterText: "7년 대형 FA 계약을 맺었습니다" }],
  soccer_kr: [{ athlete: "이동국", lowAge: 23, lowText: "월드컵 최종 명단에서 빠졌습니다", laterAge: 30, laterText: "K리그 MVP와 득점왕을 차지했습니다" }],
  soccer_world: [{ athlete: "제이미 바디", lowAge: 25, lowText: "5부 리그 팀에서 뛰다 겨우 2부 리그 팀으로 옮겼습니다", laterAge: 29, laterText: "프리미어리그 우승을 차지했습니다" }],
  nba: [
    { athlete: "마이클 조던", lowAge: 15, lowText: "고등학교 대표팀 선발에서 떨어졌습니다", laterAge: 28, laterText: "첫 NBA 우승을 차지했습니다" },
    { athlete: "더크 노비츠키", lowAge: 28, lowText: "MVP를 받은 해에 플레이오프 1라운드에서 탈락했습니다", laterAge: 32, laterText: "첫 NBA 우승을 차지했습니다" },
  ],
  esports: [{ athlete: "데프트", lowAge: 25, lowText: "프로 8년이 넘도록 롤드컵 우승이 없었습니다", laterAge: 26, laterText: "첫 롤드컵 우승을 차지했습니다" }],
};

const MOTIVATES: Record<SportId, { athlete: string; habit: string }> = {
  baseball_kr: { athlete: "최정", habit: "한 팀에서 20년 가까이 꾸준히 뛰며 통산 최다 홈런을 쌓았습니다." },
  baseball_world: { athlete: "오타니 쇼헤이", habit: "고등학생 때 목표를 81칸 계획표(만다라트)로 쪼개 하나씩 실천했습니다." },
  soccer_kr: { athlete: "박지성", habit: "작은 체격을 엄청난 활동량으로 이겨내 '두 개의 심장'이라 불렸습니다." },
  soccer_world: { athlete: "손흥민", habit: "어린 시절 아버지와 몇 년 동안 기본기 훈련만 반복했습니다." },
  nba: { athlete: "코비 브라이언트", habit: "남들이 자는 새벽에 먼저 나와 훈련하는 것으로 유명했습니다." },
  esports: { athlete: "페이커", habit: "10년 넘게 한 팀에서 뛰며 정상을 지켰습니다." },
};

const WORKOUTS: Record<SportId, { athleteFact: string; prescription: string }> = {
  baseball_kr: { athleteFact: "KBO 선수는 한 시즌에 144경기를 뜁니다.", prescription: "거울 앞에서 빈 스윙 30번만 하세요." },
  baseball_world: { athleteFact: "메이저리거는 한 시즌에 162경기를 뜁니다.", prescription: "거울 앞에서 빈 스윙 30번만 하세요." },
  soccer_kr: { athleteFact: "축구 선수는 한 경기에 약 10km를 뜁니다.", prescription: "당신은 1km만 뛰고 오세요." },
  soccer_world: { athleteFact: "축구 선수는 한 경기에 약 10km를 뜁니다.", prescription: "당신은 1km만 뛰고 오세요." },
  nba: { athleteFact: "NBA 선수는 정규시즌에만 82경기를 뜁니다.", prescription: "제자리 점프 20번이면 오늘은 합격입니다." },
  esports: { athleteFact: "프로게이머도 체력 관리로 운동을 따로 합니다.", prescription: "손목 말고 하체를 쓰세요. 스쿼트 20번." },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** 배포 전 팀 검증 규칙: 모든 항목이 검증되면 verified만 쓴다. 지금은 전체를 쓴다. */
function usablePeaks(sport: SportId): Peak[] {
  const all = PEAKS[sport];
  const verified = all.filter((p) => p.verified);
  return verified.length >= 3 ? verified : all;
}

export function buildFallback(choice: SportChoice, age: number, exclude: string[] = []): JudgeResult {
  const pool: { sport: SportId; p: Peak }[] = (choice === "any" ? [...SPORT_IDS] : [choice]).flatMap((s) =>
    usablePeaks(s).map((p) => ({ sport: s, p })),
  );
  const excluded = new Set(exclude.map(shortName));
  const filtered = pool.filter((x) => !excluded.has(shortName(x.p.athlete)));
  const candidates = filtered.length ? filtered : pool;

  const minD = Math.min(...candidates.map((x) => Math.abs(x.p.eventAge - age)));
  const { sport, p } = pickRandom(candidates.filter((x) => Math.abs(x.p.eventAge - age) === minD));
  const delta = p.eventAge - age;

  const comfortList = [...COMFORTS[sport]].sort((a, b) => Math.abs(a.lowAge - age) - Math.abs(b.lowAge - age));
  const c = comfortList[0];
  const cSubj = josa(shortName(c.athlete), "은/는");
  const m = MOTIVATES[sport];
  const name = shortName(p.athlete);

  return {
    reveal: {
      athlete: p.athlete,
      sport,
      athleteBirthYear: p.birthYear,
      eventYear: p.eventYear,
      eventAge: p.eventAge,
      delta,
      headline: buildHeadline(p.athlete, p.fact, p.eventAge, delta),
      shortFact: p.shortFact,
    },
    comfort: {
      ...c,
      line: `${c.lowAge}세의 ${cSubj} ${c.lowText.replace(/\.$/, "")}. 그런데 ${c.laterAge}세에 ${c.laterText.replace(/\.$/, "")}.`,
    },
    motivate: {
      athlete: m.athlete,
      habit: m.habit,
      line: `${m.athlete}의 습관: ${m.habit} 오늘 당신은 딱 하나만 가져가세요.`,
    },
    roast: {
      lines: shuffle(ROAST_POOL)
        .slice(0, 3)
        .map((l) => l.replace("{선수은는}", josa(name, "은/는"))),
    },
    workout: WORKOUTS[sport],
    confidence: "high",
    sources: [],
    source: "fallback",
  };
}
