import { RiBaseballLine, RiBasketballLine, RiDiceLine, RiFootballLine, RiGamepadLine, RiGlobeLine } from "@remixicon/react";
import type { SportChoice } from "@/lib/sports";

export function SportIcon({ sport, size = 24 }: { sport: SportChoice; size?: number }) {
  switch (sport) {
    case "baseball_kr":
      return <RiBaseballLine size={size} />;
    case "baseball_world":
      return (
        <span className="relative inline-flex">
          <RiBaseballLine size={size} />
          <RiGlobeLine size={size * 0.5} className="absolute -right-1.5 -bottom-1" />
        </span>
      );
    case "soccer_kr":
      return <RiFootballLine size={size} />;
    case "soccer_world":
      return (
        <span className="relative inline-flex">
          <RiFootballLine size={size} />
          <RiGlobeLine size={size * 0.5} className="absolute -right-1.5 -bottom-1" />
        </span>
      );
    case "nba":
      return <RiBasketballLine size={size} />;
    case "esports":
      return <RiGamepadLine size={size} />;
    default:
      return <RiDiceLine size={size} />;
  }
}
