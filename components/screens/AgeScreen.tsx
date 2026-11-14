import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import { Button, FixedBottomCTA, IconButton, Navigation, TextField, Top } from "@/components/ui";
import { MAX_AGE, MIN_AGE, clampAge, currentYear, sportLabel, type SportChoice } from "@/lib/sports";

/** S2. 나이 입력 */
export function AgeScreen({
  sport,
  age,
  nickname,
  onAge,
  onNickname,
  onBack,
  onStart,
}: {
  sport: SportChoice;
  age: number;
  nickname: string;
  onAge: (n: number) => void;
  onNickname: (s: string) => void;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col pb-32">
      <Navigation onBack={onBack} title={sportLabel(sport)} />
      <Top title="당신의 나이는?" desc="만 나이로 넣어 주세요" />

      <div className="flex flex-col items-center gap-2 py-6">
        <div className="flex items-center gap-6">
          <IconButton label="한 살 빼기" onClick={() => onAge(clampAge(age - 1))} disabled={age <= MIN_AGE}>
            <RiSubtractLine size={22} />
          </IconButton>
          <input
            aria-label="나이"
            inputMode="numeric"
            value={age}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/\D/g, "").slice(0, 2));
              if (Number.isFinite(n)) onAge(n);
            }}
            onBlur={() => onAge(clampAge(age))}
            className="font-display w-[120px] bg-transparent text-center text-[64px] leading-none text-title outline-none"
          />
          <IconButton label="한 살 더하기" onClick={() => onAge(clampAge(age + 1))} disabled={age >= MAX_AGE}>
            <RiAddLine size={22} />
          </IconButton>
        </div>
        <p className="text-sm text-caption">{currentYear() - clampAge(age)}년생으로 추정</p>
      </div>

      <div className="px-5 pt-4">
        <TextField
          label="별명 (선택)"
          value={nickname}
          onChange={onNickname}
          placeholder="무명 선수"
          maxLength={10}
          help="선수 카드에만 들어가요. 어디에도 저장하지 않아요."
        />
      </div>

      <FixedBottomCTA>
        <Button block onClick={onStart}>
          판독 시작
        </Button>
      </FixedBottomCTA>
    </div>
  );
}
