import { Card, Navigation, Top } from "@/components/ui";
import { SportIcon } from "@/components/SportIcon";
import { SPORT_IDS, SPORTS, type SportChoice } from "@/lib/sports";

/** S1. 종목 선택 */
export function SportScreen({ selected, onSelect }: { selected: SportChoice | null; onSelect: (s: SportChoice) => void }) {
  return (
    <div className="flex flex-1 flex-col pb-10">
      <Navigation />
      <Top sub="당신의 나이 값 판독" title="응원하는 종목은?" desc="이 종목 선수들만 나와요" />
      <div className="grid grid-cols-2 gap-3 px-5">
        {SPORT_IDS.map((s) => (
          <Card key={s} selected={selected === s} onClick={() => onSelect(s)} className="flex flex-col gap-3">
            <span className="text-primary">
              <SportIcon sport={s} size={28} />
            </span>
            <span className="text-base font-semibold text-title">{SPORTS[s].label}</span>
          </Card>
        ))}
        <Card
          selected={selected === "any"}
          onClick={() => onSelect("any")}
          className="col-span-2 flex items-center gap-3"
        >
          <span className="text-primary">
            <SportIcon sport="any" size={24} />
          </span>
          <span className="text-base font-semibold text-title">아무거나</span>
          <span className="ml-auto text-sm text-caption">잘 몰라도 괜찮아요</span>
        </Card>
      </div>
    </div>
  );
}
