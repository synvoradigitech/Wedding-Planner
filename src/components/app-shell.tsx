"use client";

import {
  Clock,
  Crown,
  Ellipsis,
  House,
  ListChecks,
  LoaderCircle,
  Mail,
  Settings,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { APP_NAME } from "@/lib/brand";
import { daysBetween, todayISO } from "@/lib/format";
import { coupleName } from "@/lib/selectors";
import { useStoreState } from "@/lib/store";
import type { AppState } from "@/lib/types";
import { Avatar, cn } from "./ui";

export const NAV = [
  { href: "/dashboard", label: "Beranda", icon: House },
  { href: "/checklist", label: "Checklist", icon: ListChecks },
  { href: "/anggaran", label: "Anggaran", icon: Wallet },
  { href: "/tamu", label: "Tamu", icon: Users },
  { href: "/undangan", label: "Undangan", icon: Mail },
  { href: "/rundown", label: "Rundown", icon: Clock },
  { href: "/advisor", label: "AI Advisor", icon: Sparkles },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

/** Bottom nav HP: AI Advisor jadi tombol tengah. */
const MOBILE_LEFT = [NAV[0], NAV[1]];
const MOBILE_RIGHT = [NAV[3], { href: "/lainnya", label: "Lainnya", icon: Ellipsis }];
const MORE_HREFS = ["/anggaran", "/undangan", "/rundown", "/pengaturan", "/lainnya"];

/** Halaman di dalam shell selalu punya state; pakai hook ini, bukan useStoreState. */
export function useApp(): AppState {
  const state = useStoreState();
  if (!state) throw new Error("useApp dipanggil di luar AppShell");
  return state;
}

export function countdownText(state: AppState) {
  const date = state.wedding.date;
  if (!date) return "Tanggal belum pasti";
  const days = daysBetween(todayISO(), date);
  return days > 0 ? `${days} hari lagi` : days === 0 ? "Hari ini!" : "Sudah menikah";
}

export function Countdown({ state, className }: { state: AppState; className?: string }) {
  return <span className={className}>{countdownText(state)}</span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const state = useStoreState();
  const pathname = usePathname();

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center text-primary">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/lainnya" && MORE_HREFS.some((h) => pathname.startsWith(h)));

  const mobileItem = ({ href, label, icon: Icon }: (typeof NAV)[number]) => {
    const active = isActive(href);
    return (
      <Link key={href} href={href} className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold", active ? "text-primary" : "text-muted")}>
        <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen lg:flex">
      <aside className="no-print sticky top-0 hidden h-screen w-72 shrink-0 p-4 lg:block">
        <div className="flex h-full flex-col rounded-[2rem] bg-paper shadow-soft">
          <div className="px-5 pt-6 pb-4">
            <Link href="/" className="text-brand text-lg font-extrabold tracking-tight">
              {APP_NAME}
            </Link>
            <div className="relative mt-5 overflow-hidden rounded-3xl bg-brand p-4 text-white shadow-pop">
              <div className="orb absolute -top-6 -right-6 h-20 w-20 opacity-80" />
              <p className="relative text-xs text-white/80">Rencana pernikahan</p>
              <p className="relative text-lg font-bold">{coupleName(state.wedding)}</p>
              <Countdown state={state} className="relative mt-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold" />
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                  isActive(href) ? "bg-brand text-white shadow-pop" : "text-muted hover:bg-primary-soft/60 hover:text-primary",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="space-y-3 p-4">
            <div className="flex -space-x-2 px-1">
              {state.members.map((m, i) => (
                <Avatar key={m.id} name={m.name} index={i} />
              ))}
            </div>
            {state.wedding.plan === "premium" ? (
              <p className="flex items-center gap-1.5 rounded-2xl bg-gold-soft px-4 py-2.5 text-xs font-bold text-gold">
                <Crown size={14} /> Premium aktif
              </p>
            ) : (
              <Link
                href="/pengaturan#paket"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#ffa36c] to-gold px-4 py-3 text-xs font-bold text-white shadow-[0_14px_30px_-12px_rgb(240_123_63/0.6)]"
              >
                <Crown size={15} /> Upgrade ke Premium
              </Link>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex items-center justify-between bg-ivory/80 px-5 py-3 backdrop-blur-lg lg:hidden">
          <Link href="/dashboard" className="text-brand text-base font-extrabold tracking-tight">
            {APP_NAME}
          </Link>
          <Countdown state={state} className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-primary shadow-soft" />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-4 pb-32 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12">{children}</main>
      </div>

      <nav className="no-print fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 items-end rounded-[1.75rem] bg-paper/95 px-1 shadow-[0_10px_40px_-10px_rgb(226_51_127/0.35)] backdrop-blur lg:hidden">
        {MOBILE_LEFT.map(mobileItem)}
        <Link href="/advisor" className="flex flex-col items-center pb-2.5" aria-label="AI Advisor">
          <span
            className={cn(
              "-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-pop ring-4 ring-ivory transition",
              isActive("/advisor") && "scale-105",
            )}
          >
            <Sparkles size={24} />
          </span>
          <span className={cn("mt-1 text-[10px] font-semibold", isActive("/advisor") ? "text-primary" : "text-muted")}>AI</span>
        </Link>
        {MOBILE_RIGHT.map(mobileItem)}
      </nav>
    </div>
  );
}
