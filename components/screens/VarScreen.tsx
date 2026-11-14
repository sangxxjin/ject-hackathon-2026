"use client";

import { RiTvLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { ProgressBar, ProgressStepper } from "@/components/ui";
import { VAR_LINES, VAR_STEPS } from "@/lib/copy";

const MIN_SHOW_MS = 3000;

/** S3. VAR 판독 — AI 응답을 기다리는 화면. done이 되고 최소 3초가 지나면 onFinish */
export function VarScreen({ startedAt, done, onFinish }: { startedAt: number; done: boolean; onFinish: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const elapsed = (now - startedAt) / 1000;
  const ready = done && now - startedAt >= MIN_SHOW_MS;

  useEffect(() => {
    if (ready) {
      const t = setTimeout(onFinish, 700);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [ready, onFinish]);

  const line = [...VAR_LINES].reverse().find((l) => l.at <= elapsed)?.text ?? VAR_LINES[0].text;
  const step = ready ? 4 : elapsed < 1.5 ? 0 : elapsed < 3 ? 1 : 2;
  const progress = ready ? 100 : Math.min(90, (elapsed / 25) * 90);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-16">
      <div className="flex flex-col items-center gap-3">
        <span className={ready ? "text-primary" : "animate-pulse text-primary"}>
          <RiTvLine size={44} />
        </span>
        <h2 className="text-[22px] font-semibold text-title">{ready ? "판정 완료" : "VAR 판독 중…"}</h2>
      </div>
      <ProgressStepper steps={VAR_STEPS} current={step} />
      <div className="flex w-full flex-col gap-3">
        <ProgressBar value={progress} />
        <p key={line} className="rise text-center text-sm text-caption">
          {ready ? "판정이 나왔습니다" : line}
        </p>
      </div>
    </div>
  );
}
