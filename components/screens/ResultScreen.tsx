"use client";

import { RiRunLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Badge, BottomSheet, Button, Card, FixedBottomCTA, Navigation, Result, TextButton } from "@/components/ui";
import { MODE_LABEL, type Mode } from "@/lib/copy";
import { shortName } from "@/lib/josa";
import type { JudgeResult } from "@/lib/schema";

const TIMER_SEC = 600;

/** S6. 모드 결과 + 오늘의 처방 */
export function ResultScreen({
  result,
  mode,
  nickname,
  onBack,
  onOtherMode,
  onCard,
  onToast,
}: {
  result: JudgeResult;
  mode: Mode;
  nickname: string;
  onBack: () => void;
  onOtherMode: () => void;
  onCard: () => void;
  onToast: (msg: string) => void;
}) {
  const [roastIdx, setRoastIdx] = useState(0);
  const [timerOpen, setTimerOpen] = useState(false);
  const prefix = nickname ? `${nickname} 씨, ` : "";

  let main = "";
  let sub = "";
  if (mode === "comfort") {
    main = result.comfort.line;
    sub = `${shortName(result.comfort.athlete)} · ${result.comfort.lowAge}세 → ${result.comfort.laterAge}세`;
  } else if (mode === "motivate") {
    main = result.motivate.line;
    sub = `${shortName(result.motivate.athlete)}의 습관: ${result.motivate.habit}`;
  } else {
    main = result.roast.lines[roastIdx % result.roast.lines.length];
  }

  return (
    <div className="flex flex-1 flex-col pb-32">
      <Navigation onBack={onBack} />
      <div key={`${mode}-${roastIdx}`} className="flex flex-col gap-4 px-5 pt-4">
        <span className="rise">
          <Badge>{MODE_LABEL[mode]}</Badge>
        </span>
        <p className="rise text-[26px] leading-snug font-semibold text-title" style={{ animationDelay: "0.15s" }}>
          {prefix}
          {main}
        </p>
        {sub && (
          <p className="rise text-base text-body" style={{ animationDelay: "0.3s" }}>
            {sub}
          </p>
        )}
        {mode === "roast" && (
          <Button color="dark" variant="weak" size="m" className="self-start" onClick={() => setRoastIdx((i) => i + 1)}>
            한 대 더 맞기
          </Button>
        )}
      </div>

      <div className="mt-8 px-5">
        <Card variant="outline" className="flex flex-col gap-3 border-primary">
          <div className="flex items-center gap-2 text-primary">
            <RiRunLine size={20} />
            <span className="text-sm font-semibold">오늘의 처방</span>
          </div>
          <p className="text-sm text-body">{result.workout.athleteFact}</p>
          <p className="text-lg font-semibold text-title">{result.workout.prescription}</p>
        </Card>
        <div className="mt-4 flex justify-center">
          <TextButton onClick={onOtherMode}>다른 모드 보기</TextButton>
        </div>
      </div>

      <FixedBottomCTA>
        <Button color="dark" block onClick={() => setTimerOpen(true)}>
          10분 타이머
        </Button>
        <Button block onClick={onCard}>
          선수 카드 만들기
        </Button>
      </FixedBottomCTA>

      <BottomSheet open={timerOpen} onClose={() => setTimerOpen(false)}>
        <TimerSheet
          prescription={result.workout.prescription}
          onDone={() => {
            setTimerOpen(false);
            onToast("오늘의 처방 완료. 장하십니다.");
          }}
          onCancel={() => setTimerOpen(false)}
        />
      </BottomSheet>
    </div>
  );
}

function TimerSheet({ prescription, onDone, onCancel }: { prescription: string; onDone: () => void; onCancel: () => void }) {
  const [left, setLeft] = useState(TIMER_SEC);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const end = Date.now() + left * 1000;
    const id = setInterval(() => {
      const l = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(l);
      if (l === 0) setRunning(false);
    }, 250);
    return () => clearInterval(id);
    // left는 시작 시점 값만 쓴다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  if (left === 0) {
    return (
      <div className="flex flex-col gap-6 pt-2">
        <Result success title="10분 완료" desc="정말 뛰었습니까?" />
        <div className="flex gap-2">
          <Button color="dark" block onClick={onCancel}>
            사실 누워 있었다
          </Button>
          <Button block onClick={onDone}>
            정말 뛰었다
          </Button>
        </div>
      </div>
    );
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-lg font-semibold text-title">오늘의 처방</p>
      <p className="text-center text-sm text-body">{prescription}</p>
      <p className="font-display text-[64px] leading-none text-primary tabular-nums">
        {mm}:{ss}
      </p>
      <div className="flex w-full gap-2">
        <Button color="dark" block onClick={onCancel}>
          그만두기
        </Button>
        <Button block onClick={() => setRunning((r) => !r)}>
          {running ? "일시정지" : left === TIMER_SEC ? "시작" : "계속"}
        </Button>
      </div>
    </div>
  );
}
