/**
 * 피그마 디자인 시스템 컴포넌트 (docs/spec.md 10.5). 이름과 규격은 피그마를 따른다.
 * 색은 app/globals.css 토큰 유틸리티만 쓴다.
 */
import { RiArrowLeftSLine, RiArrowRightSLine, RiCheckLine, RiCloseLine } from "@remixicon/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ---------- Logo ---------- */

/** GAP 로고 (public/logo.svg, 원본 79×39). 파비콘은 app/icon.svg */
export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.svg" alt="GAP" width={65} height={32} className="h-8 w-auto" />
  );
}

/* ---------- Navigation ---------- */

export function Navigation({ title, onBack, right }: { title?: string; onBack?: () => void; right?: ReactNode }) {
  if (!onBack) {
    return (
      <header className="flex h-14 items-center justify-between px-5">
        <Logo />
        {right}
      </header>
    );
  }
  return (
    <header className="relative flex h-14 items-center justify-center px-5">
      <button
        type="button"
        aria-label="뒤로"
        onClick={onBack}
        className="absolute left-3 flex size-11 items-center justify-center rounded-full text-title active:bg-surface"
      >
        <RiArrowLeftSLine size={24} />
      </button>
      {title && <h1 className="text-lg font-semibold text-title">{title}</h1>}
    </header>
  );
}

/* ---------- Top ---------- */

export function Top({ sub, title, desc }: { sub?: ReactNode; title: ReactNode; desc?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-5 pt-5 pb-6">
      {sub && <p className="text-sm text-caption">{sub}</p>}
      <h2 className="text-[22px] leading-snug font-semibold text-title">{title}</h2>
      {desc && <p className="text-base text-body">{desc}</p>}
    </div>
  );
}

/* ---------- Button ---------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "primary" | "dark";
  variant?: "fill" | "weak";
  size?: "xl" | "l" | "m" | "s";
  block?: boolean;
};

export function Button({ color = "primary", variant = "fill", size = "xl", block, className, ...rest }: ButtonProps) {
  const sizes = {
    xl: "h-14 rounded-2xl px-5 text-base",
    l: "h-12 rounded-[14px] px-4 text-base",
    m: "h-[38px] rounded-[10px] px-3 text-sm",
    s: "h-8 rounded-lg px-2.5 text-xs",
  };
  const colors = {
    "primary-fill": "bg-primary text-onprimary active:bg-primary-strong",
    "primary-weak": "bg-primary-weak text-primary active:opacity-80",
    "dark-fill": "bg-surface-strong text-title active:opacity-80",
    "dark-weak": "bg-surface text-body active:bg-surface-strong",
  };
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-1.5 font-semibold transition disabled:opacity-40",
        sizes[size],
        colors[`${color}-${variant}`],
        block && "w-full",
        className,
      )}
      {...rest}
    />
  );
}

export function TextButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cx("inline-flex items-center gap-0.5 text-sm font-medium text-caption active:text-body", className)}
      {...rest}
    >
      {children}
      <RiArrowRightSLine size={16} />
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        "flex size-12 items-center justify-center rounded-2xl bg-primary-weak text-primary active:opacity-80 disabled:opacity-30",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- Input ---------- */

export function TextField({
  label,
  help,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-caption">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="h-[54px] rounded-[14px] border border-line bg-surface px-4 text-base text-title outline-none placeholder:text-disable focus:border-primary"
      />
      {help && <span className="text-xs text-caption">{help}</span>}
    </label>
  );
}

/* ---------- Display ---------- */

export function Card({
  children,
  variant = "filled",
  selected,
  className,
  onClick,
}: {
  children: ReactNode;
  variant?: "filled" | "outline";
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cx(
    "rounded-[20px] p-5 text-left",
    variant === "filled" ? "bg-surface" : "border border-line",
    selected && "outline-2 outline-primary",
    onClick && "transition active:scale-[0.98]",
    className,
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  ) : (
    <div className={cls}>{children}</div>
  );
}

export function ListRow({
  leading,
  title,
  sub,
  onClick,
}: {
  leading?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-5 py-3 text-left active:bg-surface"
    >
      {leading && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
          {leading}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-base font-semibold text-title">{title}</span>
        {sub && <span className="text-sm text-caption">{sub}</span>}
      </span>
      <RiArrowRightSLine size={20} className="shrink-0 text-caption" />
    </button>
  );
}

export function Badge({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "dark" }) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold",
        tone === "primary" ? "bg-primary-weak text-primary" : "bg-surface-strong text-body",
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
      <div
        className="h-full rounded-full bg-primary-heavy transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ProgressStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex w-full items-start">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="relative flex flex-1 flex-col items-center gap-1.5">
            {i > 0 && (
              <span
                className={cx("absolute top-3 right-1/2 h-0.5 w-full", i <= current ? "bg-primary" : "bg-surface-strong")}
              />
            )}
            <span
              className={cx(
                "relative z-10 flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                done && "bg-primary text-onprimary",
                active && "border-2 border-primary bg-bg text-primary",
                !done && !active && "bg-surface-strong text-caption",
              )}
            >
              {done ? <RiCheckLine size={14} /> : i + 1}
            </span>
            <span className={cx("text-xs", done || active ? "text-title" : "text-caption")}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Feedback & Overlay ---------- */

export function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      role="status"
      className={cx(
        "pointer-events-none fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-surface-strong px-4 py-3 text-sm font-semibold text-title shadow-lg transition-all",
        show ? "opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <span className="flex size-5 items-center justify-center rounded-full bg-positive text-bg">
        <RiCheckLine size={14} />
      </span>
      {message}
    </div>
  );
}

export function Result({ success, title, desc }: { success: boolean; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span
        className={cx(
          "flex size-14 items-center justify-center rounded-full",
          success ? "bg-primary-weak text-primary" : "bg-surface-strong text-negative",
        )}
      >
        {success ? <RiCheckLine size={28} /> : <RiCloseLine size={28} />}
      </span>
      <p className="text-xl font-semibold text-title">{title}</p>
      {desc && <p className="text-sm text-caption">{desc}</p>}
    </div>
  );
}

export function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-dimmer" onClick={onClose}>
      <div
        className="w-full max-w-[402px] rounded-t-[20px] bg-bg-alt px-5 pt-3 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-surface-strong" />
        {children}
      </div>
    </div>
  );
}

/** 하위 화면의 주요 버튼 하단 고정 영역. 화면 콘텐츠에는 pb-32 정도 여백을 둔다. */
export function FixedBottomCTA({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[402px] -translate-x-1/2 gap-2 bg-bg px-5 pt-3 pb-6">
      {children}
    </div>
  );
}
