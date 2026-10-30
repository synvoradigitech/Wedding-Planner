"use client";

import { X } from "lucide-react";
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

export { cn };

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("sticker-sm rounded-3xl bg-paper", className)}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "gold";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "sticker-sm bg-candy-pink text-plum hover:-translate-y-0.5 hover:bg-[#ff93bd]",
  secondary: "sticker-sm bg-paper text-plum hover:-translate-y-0.5 hover:bg-cream",
  ghost: "text-plum/70 hover:bg-candy-rose/50 hover:text-plum",
  danger: "text-danger hover:bg-danger-soft",
  gold: "sticker-sm bg-candy-yellow text-plum hover:-translate-y-0.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "sm" | "md" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-cute font-semibold transition active:translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-sm" : "h-11 px-5 text-base",
        buttonVariants[variant],
        className,
      )}
    />
  );
}

export type Tone = "neutral" | "primary" | "gold" | "sage" | "danger" | "violet" | "sky";

const badgeTones: Record<Tone, string> = {
  neutral: "bg-line/70 text-plum/70",
  primary: "bg-candy-rose/70 text-plum",
  gold: "bg-candy-yellow/70 text-plum",
  sage: "bg-candy-mint/70 text-plum",
  danger: "bg-danger-soft text-danger",
  violet: "bg-candy-lilac/70 text-plum",
  sky: "bg-candy-sky/70 text-plum",
};

const tileTones: Record<Tone, string> = {
  neutral: "bg-cream",
  primary: "bg-candy-rose",
  gold: "bg-candy-yellow",
  sage: "bg-candy-mint",
  danger: "bg-[#ffb0a8]",
  violet: "bg-candy-lilac",
  sky: "bg-candy-sky",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

/** Ikon dalam kotak berwarna, seperti tile fitur di referensi. */
export function IconTile({ tone = "primary", size = "md", children }: { tone?: Tone; size?: "sm" | "md" | "lg"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border-[2.5px] border-plum text-plum",
        size === "sm" ? "h-8 w-8 rounded-xl" : size === "md" ? "h-11 w-11 rounded-2xl" : "h-14 w-14 rounded-[1.25rem]",
        tileTones[tone],
      )}
    >
      {children}
    </span>
  );
}

const barTones: Record<Tone, string> = {
  neutral: "bg-muted",
  primary: "bg-candy-pink",
  gold: "bg-candy-yellow",
  sage: "bg-candy-mint",
  danger: "bg-danger",
  violet: "bg-candy-lilac",
  sky: "bg-candy-sky",
};

export function Progress({ value, tone = "primary", className }: { value: number; tone?: Tone; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-3 overflow-hidden rounded-full border-2 border-plum bg-white", className)}>
      <div className={cn("h-full rounded-full transition-all", barTones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  icon,
  tone = "primary",
  children,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {icon && (
          <IconTile tone={tone} size="sm">
            {icon}
          </IconTile>
        )}
        <p className="text-xs font-semibold text-muted">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
      {children}
    </Card>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sticker flex max-h-[90vh] w-full flex-col rounded-t-[2rem] bg-paper sm:max-w-lg sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-line sm:hidden" />
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="font-display text-lg">{title}</h2>
          <button onClick={onClose} className="rounded-full bg-ivory p-2 text-muted hover:bg-primary-soft hover:text-primary" aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-3">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 pt-2 pb-5">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block px-1 font-cute text-sm font-semibold text-plum">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border-[2.5px] border-plum bg-white px-4 py-2.5 text-sm font-semibold text-plum placeholder:font-medium placeholder:text-plum/40 focus:bg-[#fffbe8] focus:outline-none disabled:opacity-60";

const avatarColors = ["bg-candy-rose", "bg-candy-sky", "bg-candy-lilac"];

export function Avatar({ name, index = 0, size = "md" }: { name: string; index?: number; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-plum font-bold text-plum",
        size === "sm" ? "h-6 w-6 text-[10px]" : size === "md" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm",
        avatarColors[index % avatarColors.length],
      )}
    >
      {initials(name)}
    </span>
  );
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <IconTile tone="primary" size="lg">
        {icon}
      </IconTile>
      <p className="mt-3 font-semibold text-ink">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-muted">{children}</div>}
    </div>
  );
}

/** Tombol centang bulat, seperti penanda selesai di referensi. */
export function CheckButton({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={checked}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2.5px] transition active:scale-90",
        checked ? "border-plum bg-candy-pink text-plum" : "border-plum bg-white text-transparent hover:text-plum/40",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L19 7" />
      </svg>
    </button>
  );
}

/** Cincin progres untuk kartu hero. */
export function ProgressRing({ value, size = 88, children }: { value: number; size?: number; children?: ReactNode }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">{children}</div>
    </div>
  );
}

/** Kartu hero bergradasi untuk bagian atas halaman. */
export function HeroCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("sticker relative overflow-hidden rounded-[2rem] bg-brand p-5 text-white sm:p-6", className)}>
      <div className="bg-kawung pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="mb-2.5 inline-flex rounded-full border-2 border-plum bg-candy-yellow px-3 py-0.5 font-cute text-sm font-semibold text-plum">{children}</h2>;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("sticker-sm flex gap-1 overflow-x-auto rounded-full bg-paper p-1 [scrollbar-width:none]", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-full px-4 py-1.5 font-cute text-sm font-semibold whitespace-nowrap transition",
            value === o.value ? "bg-candy-pink text-plum" : "text-plum/60 hover:text-plum",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
