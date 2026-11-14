"use client";

import { RiRunLine, RiTimerFlashLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Badge, BottomSheet, Button, Card, FixedBottomCTA, Navigation, ProgressBar, TextButton } from "@/components/ui";
import { MODE_LABEL, type Mode } from "@/lib/copy";
import { shortName } from "@/lib/josa";
import { BONUS_MAX, BONUS_STEP_SEC, exerciseBonus, formatDuration, pickPrescription } from "@/lib/prescriptions";
import type { JudgeResult } from "@/lib/schema";

/** S6. 모드 결과 + 오늘의 처방 + 처방 실행(스톱워치) */
export function ResultScreen({
  result,
  mode,
  nickname,
  exerciseSec,
  onExercise,
  onBack,
  onOtherMode,
  onCard,
  onToast,
}: {
  result: JudgeResult;
  mode: Mode;
  nickname: string;
  /** 지금까지 누적한 운동 시간(초) */
  exerciseSec: number;
  /** 이번에 운동한 시간(초)을 누적에 더한다 */
  onExercise: (sec: number) => void;
  onBack: () => void;
  onOtherMode: () => void;
  onCard: () => void;
  onToast: (msg: string) => void;
}) {
  const [roastIdx, setRoastIdx] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const prefix = nickname ? `${nickname} 씨, ` : "";
  const prescription = pickPrescription(result.reveal.sport, mode, seed);
  const bonus = exerciseBonus(exerciseSec);

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
          <p className="text-lg font-semibold text-title">{prescription}</p>
          <p className="text-xs text-caption">
            처방을 실행한 시간만큼 선수 카드 OVR이 올라가요. {BONUS_STEP_SEC}초마다 +1, 최대 +{BONUS_MAX}.
            {exerciseSec > 0 && (
              <span className="text-primary">
                {" "}
                지금까지 {formatDuration(exerciseSec)}, OVR +{bonus}
              </span>
            )}
          </p>
        </Card>
        <div className="mt-4 flex justify-center">
          <TextButton onClick={onOtherMode}>다른 모드 보기</TextButton>
        </div>
      </div>

      <FixedBottomCTA>
        <Button color="dark" block onClick={() => setSheetOpen(true)}>
          오늘의 처방 실행
        </Button>
        <Button block onClick={onCard}>
          선수 카드 만들기
        </Button>
      </FixedBottomCTA>

      {/* 바깥을 눌러도 닫히지 않게 한다 (운동 시간이 날아가지 않도록). 닫기는 시트 안 버튼으로만 */}
      <BottomSheet open={sheetOpen} onClose={() => {}}>
        <ExerciseSheet
          prescription={prescription}
          baseSec={exerciseSec}
          onFinish={(sec) => {
            setSheetOpen(false);
            if (sec <= 0) return;
            onExercise(sec);
            const total = exerciseSec + sec;
            onToast(`${formatDuration(sec)} 운동 완료! 카드 OVR +${exerciseBonus(total)}`);
          }}
        />
      </BottomSheet>
    </div>
  );
}

/** 0초부터 올라가는 스톱워치. 누적 시간 기준으로 OVR 보너스를 실시간으로 보여준다 */
function ExerciseSheet({
  prescription,
  baseSec,
  onFinish,
}: {
  prescription: string;
  baseSec: number;
  onFinish: (sec: number) => void;
}) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now() - sec * 1000;
    const id = setInterval(() => setSec(Math.floor((Date.now() - startedAt) / 1000)), 250);
    return () => clearInterval(id);
    // 시작 시점의 sec만 쓴다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const total = baseSec + sec;
  const bonus = exerciseBonus(total);
  const toNext = bonus >= BONUS_MAX ? 0 : BONUS_STEP_SEC - (total % BONUS_STEP_SEC);
  const progress = bonus >= BONUS_MAX ? 100 : ((total % BONUS_STEP_SEC) / BONUS_STEP_SEC) * 100;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2 text-primary">
        <RiTimerFlashLine size={20} />
        <p className="text-lg font-semibold text-title">오늘의 처방 실행</p>
      </div>
      <p className="text-center text-sm text-body">{prescription}</p>
      <p className="font-display text-[64px] leading-none text-primary tabular-nums">{formatDuration(sec)}</p>

      <div className="flex w-full flex-col gap-2 rounded-2xl bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-body">선수 카드 OVR 보너스</span>
          <span className="font-display text-2xl text-primary tabular-nums">+{bonus}</span>
        </div>
        <ProgressBar value={progress} />
        {/* 초 숫자가 한 자리↔두 자리로 바뀌어도 글자가 흔들리지 않게 숫자 폭을 고정한다 */}
        <span className="text-xs text-caption">
          {bonus >= BONUS_MAX ? (
            `최대 보너스 +${BONUS_MAX} 달성! 이제 진짜 선수입니다.`
          ) : (
            <>
              다음 +1까지 <span className="inline-block w-[2ch] text-right tabular-nums">{toNext}</span>초. 오래
              할수록 오버롤이 올라가요.
            </>
          )}
        </span>
      </div>

      <div className="flex w-full gap-2">
        <Button color="dark" block onClick={() => onFinish(sec)}>
          {sec > 0 ? "운동 끝, 기록하기" : "닫기"}
        </Button>
        <Button block onClick={() => setRunning((r) => !r)}>
          {running ? "일시정지" : sec === 0 ? "시작" : "계속"}
        </Button>
      </div>
    </div>
  );
}
