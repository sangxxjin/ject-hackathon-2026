"use client";

import { forwardRef, useRef, useState } from "react";
import { Button, FixedBottomCTA, ListRow, Navigation, ProgressStepper, Top } from "@/components/ui";
import { QUESTIONS, computeCard, type Grade, type StatName } from "@/lib/card";
import type { Mode } from "@/lib/copy";
import { shortName } from "@/lib/josa";
import type { JudgeResult } from "@/lib/schema";
import { SPORTS, type SportChoice } from "@/lib/sports";

const GRADE_STYLE: Record<Grade, string> = {
  소파: "bg-surface-strong text-body",
  벤치: "bg-gray-600 text-title",
  후보: "bg-primary-weak text-primary",
  주전: "bg-primary-heavy text-onprimary",
  에이스: "bg-primary text-onprimary",
};

/** S7. 선수 카드: 질문 4개 → 카드 발급 */
export function CardScreen({
  result,
  sport,
  age,
  mode,
  nickname,
  onBack,
  onFriend,
  onRestart,
  onToast,
}: {
  result: JudgeResult;
  sport: SportChoice;
  age: number;
  mode: Mode | null;
  nickname: string;
  onBack: () => void;
  onFriend: () => void;
  onRestart: () => void;
  onToast: (msg: string) => void;
}) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [issuing, setIssuing] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const qi = answers.length;

  const answer = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length === QUESTIONS.length) {
      setIssuing(true);
      setTimeout(() => setIssuing(false), 900);
    }
  };

  if (qi < QUESTIONS.length) {
    const q = QUESTIONS[qi];
    return (
      <div className="flex flex-1 flex-col pb-10">
        <Navigation onBack={qi === 0 ? onBack : () => setAnswers(answers.slice(0, -1))} title="선수 카드 발급" />
        <div className="px-5 pt-2">
          <ProgressStepper steps={["Q1", "Q2", "Q3", "Q4"]} current={qi} />
        </div>
        <div key={qi} className="rise">
          <Top sub={`${q.stat} 측정`} title={q.q} />
          <div className="flex flex-col">
            {q.options.map((o, i) => (
              <ListRow key={o.text} title={o.text} onClick={() => answer(i)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (issuing) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="animate-pulse text-lg font-semibold text-title">카드 발급 중…</p>
      </div>
    );
  }

  const card = computeCard(answers, age, mode);

  const save = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `선수카드-${nickname || "무명선수"}.png`;
      a.click();
      onToast("이미지를 저장했어요");
    } catch {
      onToast("저장이 안 되면 화면을 캡처해 주세요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col pb-32">
      <Navigation onBack={() => setAnswers(answers.slice(0, -1))} title="선수 카드" />
      <div className="rise flex justify-center px-5 pt-4">
        <PlayerCard
          ref={cardRef}
          grade={card.grade}
          ovr={card.ovr}
          stats={card.stats}
          oneLiner={card.oneLiner}
          nickname={nickname || "무명 선수"}
          sportLabel={SPORTS[result.reveal.sport].label}
          age={age}
          footer={`${shortName(result.reveal.athlete)} ${result.reveal.eventAge}세: ${result.reveal.shortFact}`}
        />
      </div>
      <div className="mt-5 flex justify-center gap-5 text-sm">
        <button
          type="button"
          className="text-caption underline underline-offset-2"
          onClick={async () => {
            // 별명은 링크에 넣지 않는다 (docs/spec.md 8절)
            const url = `${window.location.origin}/?age=${age}&sport=${sport}`;
            try {
              await navigator.clipboard.writeText(url);
              onToast("판독 링크를 복사했어요");
            } catch {
              onToast(url);
            }
          }}
        >
          판독 링크 복사
        </button>
        <button type="button" className="text-caption underline underline-offset-2" onClick={onRestart}>
          처음으로
        </button>
      </div>
      <FixedBottomCTA>
        <Button color="dark" block onClick={onFriend}>
          친구 나이로
        </Button>
        <Button block onClick={save} disabled={saving}>
          {saving ? "저장 중…" : "이미지 저장"}
        </Button>
      </FixedBottomCTA>
    </div>
  );
}

const PlayerCard = forwardRef<
  HTMLDivElement,
  {
    grade: Grade;
    ovr: number;
    stats: Record<StatName, number>;
    oneLiner: string;
    nickname: string;
    sportLabel: string;
    age: number;
    footer: string;
  }
>(function PlayerCard({ grade, ovr, stats, oneLiner, nickname, sportLabel, age, footer }, ref) {
  return (
    <div ref={ref} className={`flex w-[300px] flex-col gap-4 rounded-[20px] p-5 ${GRADE_STYLE[grade]}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="font-display text-[56px] leading-none">{ovr}</span>
          <span className="mt-1 text-sm font-semibold">OVR · {grade}</span>
        </div>
        <div className="flex flex-col items-end text-sm font-semibold">
          <span>{sportLabel}</span>
          <span>{age}세</span>
        </div>
      </div>
      <p className="py-1 text-center text-2xl font-bold tracking-wide">{nickname}</p>
      <div className="flex flex-col">
        {(Object.keys(stats) as StatName[]).map((k) => (
          <div key={k} className="flex justify-between border-b border-current/20 py-1.5 text-base">
            <span>{k}</span>
            <span className="font-display">{stats[k]}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-semibold">“{oneLiner}”</p>
      <div className="flex flex-col gap-0.5 text-[11px] opacity-80">
        <span>{footer}</span>
        <span>그 나이에 걔는 · 젝커톤 2026</span>
      </div>
    </div>
  );
});
