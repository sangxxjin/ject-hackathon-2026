import { RiEmotionSadLine, RiFireLine, RiSwordLine } from "@remixicon/react";
import { ListRow, Navigation, Top } from "@/components/ui";
import { MODES, type Mode } from "@/lib/copy";

const ICONS: Record<Mode, React.ReactNode> = {
  comfort: <RiEmotionSadLine size={20} />,
  motivate: <RiFireLine size={20} />,
  roast: <RiSwordLine size={20} />,
};

/** S5. 모드 선택 */
export function ModeScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (m: Mode) => void }) {
  return (
    <div className="flex flex-1 flex-col pb-10">
      <Navigation onBack={onBack} />
      <Top title="지금 필요한 건?" desc="하나만 고르세요" />
      <div className="flex flex-col">
        {MODES.map((m) => (
          <ListRow key={m.id} leading={ICONS[m.id]} title={m.title} sub={m.desc} onClick={() => onSelect(m.id)} />
        ))}
      </div>
    </div>
  );
}
