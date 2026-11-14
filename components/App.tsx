"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AgeScreen } from "@/components/screens/AgeScreen";
import { CardScreen } from "@/components/screens/CardScreen";
import { ModeScreen } from "@/components/screens/ModeScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { RevealScreen } from "@/components/screens/RevealScreen";
import { SportScreen } from "@/components/screens/SportScreen";
import { VarScreen } from "@/components/screens/VarScreen";
import { Toast } from "@/components/ui";
import type { Mode } from "@/lib/copy";
import { buildFallback } from "@/lib/fallback";
import { shortName } from "@/lib/josa";
import type { JudgeResult } from "@/lib/schema";
import { clampAge, isSportChoice, type SportChoice } from "@/lib/sports";

type Screen = "sport" | "age" | "var" | "reveal" | "mode" | "result" | "card";

/** 클라이언트가 기다리는 최대 시간. 서버 예산(37초)보다 길게 (docs/spec.md 5절 S3) */
const CLIENT_TIMEOUT_MS = 40_000;

export function App() {
  const [screen, setScreen] = useState<Screen>("sport");
  const [sport, setSport] = useState<SportChoice | null>(null);
  const [age, setAge] = useState(28);
  const [nickname, setNickname] = useState("");
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  /** 오늘의 처방 실행으로 누적한 운동 시간(초). 판독을 새로 하면 0으로 */
  const [exerciseSec, setExerciseSec] = useState(0);
  const seen = useRef<string[]>([]);
  const runId = useRef(0);

  const go = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const startJudge = useCallback(
    async (s: SportChoice, a: number) => {
      const id = ++runId.current;
      setResult(null);
      setMode(null);
      setExerciseSec(0);
      setStartedAt(Date.now());
      go("var");
      let r: JudgeResult;
      try {
        const res = await fetch("/api/judge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sport: s, age: a, excludeAthletes: seen.current.slice(-10) }),
          signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(String(res.status));
        r = (await res.json()) as JudgeResult;
      } catch {
        r = buildFallback(s, a, seen.current);
      }
      if (id !== runId.current) return; // 그사이 다시 시작한 경우
      seen.current.push(shortName(r.reveal.athlete));
      setResult(r);
    },
    [go],
  );

  // 공유 링크: ?age=26&sport=nba 로 들어오면 바로 판독 (별명은 링크에 없음)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("sport");
    const a = Number(q.get("age"));
    if (isSportChoice(s) && a) {
      const ca = clampAge(a);
      // 마운트 시 한 번, URL 값을 상태로 옮기고 판독을 시작한다
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSport(s);
      setAge(ca);
      void startJudge(s, ca);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [startJudge]);

  const finishVar = useCallback(() => go("reveal"), [go]);

  return (
    <>
      {screen === "sport" && (
        <SportScreen
          selected={sport}
          onSelect={(s) => {
            setSport(s);
            go("age");
          }}
        />
      )}
      {screen === "age" && sport && (
        <AgeScreen
          sport={sport}
          age={age}
          nickname={nickname}
          onAge={setAge}
          onNickname={setNickname}
          onBack={() => go("sport")}
          onStart={() => void startJudge(sport, clampAge(age))}
        />
      )}
      {screen === "var" && <VarScreen startedAt={startedAt} done={!!result} onFinish={finishVar} />}
      {screen === "reveal" && result && (
        <RevealScreen
          result={result}
          age={clampAge(age)}
          nickname={nickname.trim()}
          onBack={() => go("age")}
          onNext={() => go("mode")}
        />
      )}
      {screen === "mode" && (
        <ModeScreen
          onBack={() => go("reveal")}
          onSelect={(m) => {
            setMode(m);
            go("result");
          }}
        />
      )}
      {screen === "result" && result && mode && (
        <ResultScreen
          result={result}
          mode={mode}
          nickname={nickname.trim()}
          exerciseSec={exerciseSec}
          onExercise={(sec) => setExerciseSec((s) => s + sec)}
          onBack={() => go("mode")}
          onOtherMode={() => go("mode")}
          onCard={() => go("card")}
          onToast={showToast}
        />
      )}
      {screen === "card" && result && sport && (
        <CardScreen
          result={result}
          sport={sport}
          age={clampAge(age)}
          mode={mode}
          nickname={nickname.trim()}
          exerciseSec={exerciseSec}
          onBack={() => go("result")}
          onFriend={() => go("age")}
          onRestart={() => {
            setSport(null);
            go("sport");
          }}
          onToast={showToast}
        />
      )}
      <Toast message={toast ?? ""} show={!!toast} />
    </>
  );
}
