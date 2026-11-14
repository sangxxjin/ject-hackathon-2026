import { RiHourglassLine, RiCakeLine } from "@remixicon/react";
import { Badge, Button, Card, FixedBottomCTA, Navigation } from "@/components/ui";
import { DISCLAIMER_AI, DISCLAIMER_FALLBACK } from "@/lib/copy";
import { birthYearLine, retireCountdown } from "@/lib/flip";
import { shortName } from "@/lib/josa";
import type { JudgeResult } from "@/lib/schema";
import { SPORTS } from "@/lib/sports";

const delay = (s: number) => ({ animationDelay: `${s}s` });

/** S4. 리빌 */
export function RevealScreen({
  result,
  age,
  nickname,
  onBack,
  onNext,
}: {
  result: JudgeResult;
  age: number;
  nickname: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const r = result.reveal;
  const source = result.sources[0];
  return (
    <div className="flex flex-1 flex-col pb-32">
      <Navigation onBack={onBack} />
      <div className="flex flex-col gap-4 px-5 pt-4">
        <div className="rise flex items-center gap-2">
          <Badge>{SPORTS[r.sport].label}</Badge>
          <span className="text-sm text-caption">
            {shortName(r.athlete)} · {r.eventAge}세 ({r.eventYear})
          </span>
        </div>
        <p className="rise text-[26px] leading-snug font-semibold text-title" style={delay(0.3)}>
          {r.headline}
        </p>
        <p className="rise text-xl font-semibold text-negative" style={delay(1.6)}>
          …{nickname ? `${nickname} 씨는` : "당신은"}요?
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 px-5">
        <div className="rise" style={delay(2.2)}>
          <Card className="flex gap-3">
            <RiCakeLine size={22} className="shrink-0 text-primary" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-caption">생년 모드</span>
              <span className="text-base text-title">{birthYearLine(r.athlete, r.athleteBirthYear, age)}</span>
            </div>
          </Card>
        </div>
        <div className="rise" style={delay(2.5)}>
          <Card className="flex gap-3">
            <RiHourglassLine size={22} className="shrink-0 text-primary" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-caption">은퇴 카운트다운</span>
              <span className="text-base text-title">{retireCountdown(r.sport, age)}</span>
            </div>
          </Card>
        </div>
        <div className="rise flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs text-caption" style={delay(2.8)}>
          <span>{result.source === "ai" ? DISCLAIMER_AI : DISCLAIMER_FALLBACK}</span>
          {source && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-2 active:text-body"
            >
              출처 · {source.title}
            </a>
          )}
        </div>
      </div>

      <FixedBottomCTA>
        <Button block onClick={onNext}>
          그래서 뭘 해야 하죠
        </Button>
      </FixedBottomCTA>
    </div>
  );
}
