import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "서비스 소개 · GAP · 그 나이에 걔는",
  description: "당신의 나이 값, VAR로 판독해 드립니다.",
};

const steps = [
  {
    title: "입력 두 번",
    body: "응원하는 종목을 고르고 나이를 넣습니다. 로그인도 회원가입도 없습니다.",
  },
  {
    title: "VAR 판독",
    body: "“주심이 직접 모니터로 갑니다”, “부심과 교신 중”… AI가 웹을 검색하는 20~30초를 축구 VAR 판독 연출로 채웁니다. 기다림이 곧 콘텐츠입니다.",
  },
  {
    title: "충격의 리빌",
    body: "“○○○는 당신 나이에 월드컵 결승에서 골을 넣었습니다.” 1초 정적 뒤에 붉은 글씨로 “…당신은요?”. 이 종목 평균 은퇴 나이까지 남은 시간, 내가 태어난 해에 그 선수가 몇 살이었는지도 함께 보여줍니다.",
  },
  {
    title: "감정 선택",
    body: "지금 필요한 걸 내가 고릅니다. 위로(같은 나이에 무명·부상을 겪고 나중에 성공한 진짜 선수 이야기), 동기부여(선수의 실제 훈련 습관), 신랄한 비판(“이 앱 볼 시간에 나가서 뛰세요”).",
  },
  {
    title: "행동과 공유",
    body: "선수의 실제 훈련량을 일반인이 10분 안에 할 수 있게 줄인 오늘의 처방을 받고, 질문 4개에 답해 내 선수 카드(OVR, 등급, 능력치)를 받아 이미지로 저장합니다. 친구 나이로 한 번 더 돌려볼 수 있습니다.",
  },
];

const features = [
  {
    title: "AI 동갑 선수 판독",
    body: "종목과 나이를 넣으면 OpenAI가 웹 검색으로 선수의 출생 연도와 사건 연도를 확인해 동갑 시절 기록을 찾고, 화면에 실제 출처 링크를 붙입니다. 6개 종목(야구, 해외야구, 축구, 해외축구, NBA, e스포츠)과 “아무거나”, 10~60세 어떤 조합이든 결과가 나옵니다.",
  },
  {
    title: "VAR 판독 연출과 리빌",
    body: "응답 대기 시간 동안 단계별 판독 문구와 진행 바, “판정 완료” 도장 뒤에 기록이 하나씩 드러납니다. 은퇴 카운트다운과 생년 모드로 나이 비교를 한 번 더 뒤집습니다.",
  },
  {
    title: "3가지 모드 + 오늘의 처방",
    body: "한 번의 AI 응답에 위로, 동기부여, 독설 문구와 운동 처방이 모두 담겨 있어 모드를 바꿔도 기다리지 않습니다.",
  },
  {
    title: "선수 카드",
    body: "질문 4개(계단, 알람, 운동 약속, 응원팀 역전패)의 답과 나이로 체력·의지·변명·멘탈과 OVR을 계산하고, 소파 → 벤치 → 후보 → 주전 → 에이스 등급 카드를 PNG로 저장합니다.",
  },
  {
    title: "멈추지 않는 판독",
    body: "AI가 실패하거나 응답이 늦거나 사실 검증에 걸리면, 팀이 직접 검증해 둔 비상용 기록으로 자연스럽게 넘어갑니다. 화면은 절대 멈추지 않습니다.",
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
            그 나이에 걔는
          </h1>
          <p className="mt-3 text-lg font-semibold leading-snug text-title">
            당신의 나이 값, VAR로 판독해 드립니다.
          </p>
          <p className="mt-5 text-base leading-relaxed text-body">
            나이와 응원하는 종목만 넣으면, AI가 웹을 뒤져 같은 나이에 그 종목
            선수가 뭘 해냈는지 찾아옵니다. 충격받은 당신에게 위로, 동기부여,
            독설 중 하나를 고르게 하고, 마지막에는 오늘 10분 안에 할 수 있는
            운동 처방과 공유용 선수 카드를 줍니다.
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
            <p className="text-sm text-caption">그 나이에 걔는</p>
            <p className="mt-2 max-w-md text-[22px] font-semibold leading-snug text-title md:text-[26px]">
              당신의 나이 값, VAR로 판독해 드립니다.
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
              AI는 화면 뒤의 판독 엔진입니다. 채팅창도 자유 입력도 없고,
              사용자는 탭 몇 번만 합니다. AI의 출력은 팀이 정한 JSON
              스키마(structured outputs)로만 받아서 팀이 설계한 화면에 꽂습니다.
            </li>
            <li>
              선수 기록 DB를 미리 만들지 않았습니다. 6개 종목 × 모든 나이를
              사람이 채울 수 없어서, 요청마다 <Em>OpenAI Responses API + 내장 웹 검색</Em>으로 실제 문서를 찾아 연도와 나이를 확인하게 했습니다. 출처 링크는
              모델이 쓴 주소가 아니라 실제 웹 검색 결과에서 뽑습니다.
            </li>
            <li>
              가장 큰 위험인 “AI가 사실을 지어내는 것”을 줄이려고 세 겹으로
              막았습니다. ① 프롬프트의 사실 규칙(확인한 사실만, 확신이 없으면
              다른 선수), ② 서버 검증(출생 연도 + 사건 연도 = 사건 당시 나이
              계산, 길이, 금칙어, 출처 형식), ③ 실패 시 팀이 검증한 비상용 결과.
            </li>
            <li>
              독설의 과녁은 나이나 외모가 아니라 “지금 이 앱을 보고 있는
              행동”으로 한정했습니다. 톤과 금지선은 모두 프롬프트로 정의했습니다.
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
            AI 호출은 횟수로 막습니다. 시연장은 여러 폰이 같은 공유기를 쓰므로
            접속 주소(IP)로는 세지 않습니다. 브라우저마다 구분을 붙여 그
            브라우저만 셉니다.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <Em>한 브라우저, 10분에 20번.</Em> 한 사람이 시연하면서 여러 번
              돌려볼 수 있는 양입니다. 옆 사람은 따로 셉니다.
            </li>
            <li>
              <Em>그 서버 전체, 10분에 800번.</Em> 시연으로 닿기 어려운 수이고,
              호출이 끝없이 쌓이는 것만 막습니다.
            </li>
            <li>
              한도를 넘기면 OpenAI를 호출하지 않고, 팀이 검증해 둔 비상용
              기록으로 넘깁니다. 화면은 그대로 이어집니다.
            </li>
            <li>
              구분은 로그인 없이 브라우저 쿠키로 남기고, 하루 뒤 사라집니다.
            </li>
            <li>
              이 횟수는 서버 메모리에 있어서, 서버가 나뉘면 한도도 나뉩니다.
              비용의 최종 상한은 OpenAI 사용 한도입니다.
            </li>
          </ul>
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
            <li>DB, 로그인 없음. 상태는 브라우저 메모리에만 둡니다.</li>
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
