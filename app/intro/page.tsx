import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "서비스 소개 · GAP",
  description: "선수와 나 사이의 차이(GAP)를 보고, 오늘 운동할 이유를 찾는 서비스.",
};

const steps = [
  {
    title: "입력 두 번",
    body: "응원하는 종목을 고르고 나이를 넣습니다. 로그인도 회원가입도 없습니다.",
  },
  {
    title: "VAR 판독",
    body: "“주심이 직접 모니터로 갑니다”, “부심과 교신 중”… 결과를 만드는 몇 초를 축구 VAR 판독 연출로 채웁니다.",
  },
  {
    title: "충격의 리빌",
    body: "“손흥민은 당신 나이에 챔피언스리그 결승에 선발로 나섰습니다.” 정적 뒤에 붉은 글씨로 “…당신은요?”. 내가 태어난 해에 그 선수가 몇 살이었는지, 평균 은퇴 나이까지 남은 시간도 보여줍니다.",
  },
  {
    title: "감정 선택",
    body: "위로(늦게 피어난 선수 이야기), 동기부여(선수의 실제 습관), 신랄한 비판(“이 앱 볼 시간에 나가서 뛰세요”) 중 지금 필요한 걸 고릅니다.",
  },
  {
    title: "처방 실행과 선수 카드",
    body: "모드에 맞는 강도의 10분 운동 처방을 받고 스톱워치로 실행합니다. 운동한 시간만큼 OVR이 오르고, 질문 4개에 답해 받은 내 선수 카드를 이미지로 저장하거나 친구 나이로 다시 돌려봅니다.",
  },
];

const features = [
  {
    title: "동갑 선수 판독",
    body: "6개 종목(야구, 해외야구, 축구, 해외축구, NBA, e스포츠)과 “아무거나”, 10~60세 어떤 조합이든 3~4초 안에 결과가 나옵니다. 선수·연도·기록은 팀이 준비한 79개 기록에서 고르기 때문에 틀린 사실이 나오지 않습니다.",
  },
  {
    title: "올 때마다 다른 선수",
    body: "처음에는 누구나 아는 슈퍼스타가 나오고, 다시 올수록 나이 폭을 넓히고 팬이라면 아는 스타까지 섞습니다. 최근 본 선수는 다음 날에도 피합니다.",
  },
  {
    title: "AI가 매번 새로 쓰는 문구",
    body: "위로, 동기부여, 독설 문구와 오늘의 처방은 AI가 그 선수의 기록을 바탕으로 매번 새로 씁니다. 같은 선수가 나와도 문장은 달라집니다.",
  },
  {
    title: "처방 스톱워치와 선수 카드",
    body: "처방을 실제로 실행하면 운동 시간만큼 OVR 보너스가 붙습니다. 체력·의지·변명·멘탈과 소파 → 벤치 → 후보 → 주전 → 에이스 등급 카드를 PNG로 저장합니다.",
  },
  {
    title: "멈추지 않는 판독",
    body: "AI가 실패하거나 늦으면 팀이 준비한 문구로 바로 넘어갑니다. 화면은 절대 멈추지 않습니다.",
  },
];

const stack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
  "OpenAI API",
  "zod",
  "html-to-image",
  "Remix Icon",
  "Figma",
];

export default function IntroPage() {
  return (
    <div className="min-h-dvh bg-bg-alt px-4 py-6 md:px-6 md:py-10">
      <article className="mx-auto w-full max-w-[720px] rounded-[20px] bg-bg px-5 py-8 md:px-10 md:py-12">
        {/* public/logo.svg. 서비스 화면 Logo와 같은 파일 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="GAP" width={79} height={39} className="h-8 w-auto" />
        <p className="mt-3 text-sm text-caption">젝커톤 2026 · 서비스 소개</p>

        <header className="mt-6">
          <h1 className="text-[26px] font-semibold leading-snug text-title md:text-[32px]">
            GAP
          </h1>
          <p className="mt-3 text-lg font-semibold leading-snug text-title">
            선수와 나 사이의 차이(GAP)를 보고, 오늘 운동할 이유를 찾는 서비스.
          </p>
          <p className="mt-5 text-base leading-relaxed text-body">
            나이와 응원하는 종목만 넣으면 같은 나이에 그 종목 선수가 해낸 일을
            보여줍니다. 충격받은 당신에게 위로, 동기부여, 독설 중 하나를 고르게
            하고, 마지막에는 오늘 10분 안에 할 수 있는 운동 처방과 공유용 선수
            카드를 줍니다.
          </p>
          <blockquote className="mt-5 border-l-2 border-primary pl-4 text-sm leading-relaxed text-subtitle">
            세상에서 가장 쓸데없는 비교로 시작해서, 오늘 밖으로 나갈 이유
            하나로 끝나는 스포츠 서비스입니다.
          </blockquote>
        </header>

        <div className="mt-8 flex aspect-[3/2] flex-col justify-between rounded-[20px] border border-line bg-surface p-6 md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={158} height={78} className="h-16 w-auto" />
          <div>
            <p className="text-sm text-caption">GAP</p>
            <p className="mt-2 max-w-md text-[22px] font-semibold leading-snug text-title md:text-[26px]">
              그 나이에 걔는 이미 해냈습니다.
            </p>
            <p className="mt-4 text-sm font-semibold text-negative">…당신은요?</p>
          </div>
        </div>

        <Section title="한 줄 소개">
          <p>
            우리 서비스는 <Em>스포츠를 좋아하는 20~40대 팬</Em>이 <Em>“그 나이에 걔는 뭘 했지?” 하고 선수와 나를 비교하게 되는 순간</Em>에, <Em>충격 → 감정 선택 → 오늘의 운동 처방</Em>으로 이어지는 경험을 할 수 있도록 돕는 서비스입니다.
          </p>
        </Section>

        <Section title="1. 타깃 사용자">
          <ul className="flex flex-col gap-3">
            <li>
              야구, 축구, NBA, e스포츠(LoL) 같은 종목을 응원하는 20~40대 팬.
              선수 나이를 보고 “내가 저 나이에 뭐 했더라” 하고 한 번쯤 자기와
              비교해 본 사람.
            </li>
            <li>스포츠를 잘 몰라도 괜찮습니다. “아무거나”를 고르면 됩니다.</li>
          </ul>
        </Section>

        <Section title="2. 해결하려는 문제 또는 상황">
          <ul className="flex flex-col gap-3">
            <li>
              응원하는 선수가 나보다 어린 나이에 우승하고 국가대표가 된 걸
              보면, 동경과 질투, 약간의 자기비하가 함께 옵니다. 다들 한 번쯤
              해봤지만 아무도 대놓고 꺼내지 않는 감정입니다.
            </li>
            <li>
              이런 비교는 보통 “나는 뭐 하고 살았나”로 끝나고 아무 행동으로도
              이어지지 않습니다.
            </li>
            <li>
              우리는 이 쓸데없는 비교를 장난으로 꺼내 웃게 만들고, 그 끝을 <Em>오늘 실제로 몸을 움직이는 작은 행동</Em>으로 바꾸고 싶었습니다.
            </li>
          </ul>
        </Section>

        <Section title="3. 핵심 사용자 경험">
          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-1 border-t border-line py-4 md:grid-cols-[40px_1fr] md:gap-4"
              >
                <p className="text-sm font-semibold text-primary">{index + 1}</p>
                <div>
                  <p className="text-base font-semibold text-title">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="4. 주요 기능">
          <ul className="flex flex-col gap-4">
            {features.map((feature) => (
              <li key={feature.title}>
                <p className="text-sm font-semibold text-title">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-body">{feature.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5. AI 활용 방식">
          <h3 className="text-sm font-semibold text-subtitle">서비스 기능</h3>
          <ul className="mt-3 flex flex-col gap-3">
            <li>
              AI는 화면 뒤의 카피라이터입니다. 채팅창도 자유 입력도 없고,
              사용자는 탭 몇 번만 합니다. 출력은 팀이 정한 JSON
              스키마(structured outputs)로만 받아 팀이 설계한 화면에 꽂습니다.
            </li>
            <li>
              처음에는 AI가 웹 검색으로 선수 기록을 찾게 했지만, 실측해 보니
              빠른 모델은 사실 오류가 섞이고 정확한 모델은 30초 넘게
              걸렸습니다. 그래서 <Em>사실은 팀이 준비한 기록, 문구는 AI</Em>로
              나눴습니다. 틀린 기록은 막고 매번 다른 문장은 지키면서 응답이 3~4초로
              줄었습니다.
            </li>
            <li>
              AI 문구는 서버에서 길이, 금칙어, 일본어·한자 섞임을 검사하고,
              통과하지 못하면 템플릿 문구를 씁니다. 독설의 과녁은 나이나 외모가
              아니라 “지금 이 앱을 보고 있는 행동”으로 한정했습니다.
            </li>
            <li>
              판독 품질 테스트 스크립트로 AI 문구 비율(99%), 사실 규칙 통과율,
              같은 선수가 반복되는 비율(82% → 35%)을 재며 다듬었습니다.
            </li>
          </ul>

          <h3 className="mt-6 text-sm font-semibold text-subtitle">제작 과정</h3>
          <dl className="mt-3 grid gap-3 md:grid-cols-3">
            <AiRow
              label="기획"
              body="AI와 대화하며 주제 해석, 핵심 경험, 하지 않을 것, 리스크를 정리해 의도 문서(intent.md)와 구현 명세(spec.md)로 만들었습니다."
            />
            <AiRow
              label="디자인"
              body="팀 피그마 디자인 시스템(다크 + 라임 포인트)을 만들고, 컴포넌트 이름과 규격을 그대로 코드로 옮겼습니다."
            />
            <AiRow
              label="개발"
              body="Claude Code로 명세를 기준 삼아 화면, API, 프롬프트, 검증 로직을 함께 구현했습니다."
            />
          </dl>
        </Section>

        <Section title="호출 제한">
          <p>
            시연장은 여러 폰이 같은 공유기를 쓰므로 IP가 아니라 브라우저
            쿠키로 셉니다. <Em>브라우저마다 10분에 20번</Em>, 서버 전체 10분에
            800번까지 AI를 부르고, 넘으면 준비한 기록과 문구로 답합니다. 화면은
            그대로 이어집니다.
          </p>
        </Section>

        <Section title="6. 사용한 기술 스택 및 인프라">
          <h3 className="text-sm font-semibold text-subtitle">기술 스택</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stack.map((item) => (
              <li
                key={item}
                className="rounded-full bg-surface-strong px-3 py-1 text-sm text-subtitle"
              >
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold text-subtitle">인프라 구성</h3>
          <ul className="mt-3 flex flex-col gap-3">
            <li>Vercel 배포. 정적 화면과 서버리스 API 라우트 /api/judge.</li>
            <li>OpenAI API 키는 서버 환경 변수에만 두고 브라우저에 노출하지 않습니다.</li>
            <li>DB, 로그인 없음. 판독 횟수와 최근 본 선수만 브라우저(localStorage)에 남깁니다.</li>
          </ul>
        </Section>

        <Section title="7. 서비스 URL">
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              서비스:{" "}
              <a
                href="https://gap-motivation.vercel.app/"
                className="font-semibold text-primary"
                target="_blank"
                rel="noreferrer"
              >
                gap-motivation.vercel.app
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/sangxxjin/ject-hackathon-2026"
                className="font-semibold text-primary"
                target="_blank"
                rel="noreferrer"
              >
                github.com/sangxxjin/ject-hackathon-2026
              </a>
            </li>
            <li>
              Figma:{" "}
              <a
                href="https://www.figma.com/design/m0zrNpkCmTUNG4wQuygvyC/%EC%A0%9D%EC%BB%A4%ED%86%A4"
                className="font-semibold text-primary"
                target="_blank"
                rel="noreferrer"
              >
                젝커톤 디자인
              </a>
            </li>
          </ul>
          <a
            href="https://gap-motivation.vercel.app/"
            className="mt-6 flex h-14 w-full items-center justify-center rounded-[16px] bg-primary text-base font-medium text-onprimary md:w-fit md:px-8"
          >
            서비스 홈으로
          </a>
        </Section>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-title">{title}</h2>
      <div className="mt-3 text-base leading-relaxed text-body">{children}</div>
    </section>
  );
}

function Em({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-title">{children}</strong>;
}

function AiRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-[16px] bg-surface p-4">
      <dt className="text-sm font-semibold text-subtitle">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-body">{body}</dd>
    </div>
  );
}
