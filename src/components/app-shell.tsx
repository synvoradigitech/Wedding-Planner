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
import { MotionConfig } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { APP_NAME } from "@/lib/brand";
import { daysBetween, todayISO } from "@/lib/format";
import { coupleName } from "@/lib/selectors";
import { useStoreState } from "@/lib/store";
import type { AppState } from "@/lib/types";
import { Couple, Heart } from "./landing/characters";
import { ConfettiLayer, motion } from "./landing/fx";
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
      <div className="flex min-h-screen items-center justify-center bg-cream text-primary">
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
      <Link key={href} href={href} className={cn("flex flex-col items-center gap-0.5 py-2 font-cute text-[11px] font-semibold", active ? "text-plum" : "text-plum/55")}>
        <span className={cn("flex h-7 w-11 items-center justify-center rounded-full transition", active && "bg-candy-rose")}>
          <Icon size={19} strokeWidth={active ? 2.6 : 2} />
        </span>
        {label}
      </Link>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <ConfettiLayer />
      <div className="min-h-screen lg:flex">
        <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 p-3 lg:block">
          <div className="sticker flex h-full flex-col overflow-y-auto rounded-[2rem] bg-paper [scrollbar-width:none]">
            <div className="px-4 pt-4 pb-2">
              <Link href="/" className="flex items-center gap-2 font-cute text-lg font-semibold text-plum">
                <Heart className="w-6 animate-[wiggle_1.6s_ease-in-out_infinite]" />
                {APP_NAME}
              </Link>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border-[2.5px] border-plum bg-candy-rose p-2.5">
                <Couple className="w-12 shrink-0" />
                <div className="min-w-0">
                  <p className="line-clamp-2 font-cute text-sm leading-tight font-semibold break-words text-plum">{coupleName(state.wedding)}</p>
                  <Countdown state={state} className="block text-[11px] leading-tight font-bold text-plum/70" />
                </div>
              </div>
            </div>
            <nav className="flex-1 space-y-0.5 px-3 py-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link key={href} href={href} className="relative block">
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-2xl border-[2.5px] border-plum bg-candy-pink shadow-[2px_2px_0_#3b2340]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={cn("relative flex items-center gap-3 rounded-2xl px-3.5 py-2 font-cute text-[15px] font-semibold transition", active ? "text-plum" : "text-plum/65 hover:bg-cream hover:text-plum")}>
                      <Icon size={18} strokeWidth={2.4} />
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="space-y-2.5 px-3 pt-1 pb-3">
              <div className="flex -space-x-2 px-1">
                {state.members.map((m, i) => (
                  <Avatar key={m.id} name={m.name} index={i} />
                ))}
              </div>
              {state.wedding.plan === "premium" ? (
                <p className="flex items-center gap-1.5 rounded-2xl border-[2.5px] border-plum bg-candy-yellow px-3 py-2 font-cute text-sm font-semibold text-plum">
                  <Crown size={15} /> Premium aktif
                </p>
              ) : (
                <Link href="/pengaturan#paket" className="sticker-sm flex items-center gap-2 rounded-2xl bg-candy-yellow px-3 py-2 font-cute text-sm font-semibold text-plum transition hover:-translate-y-0.5">
                  <Crown size={15} /> Upgrade ke Premium
                </Link>
              )}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b-[2.5px] border-plum bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 font-cute text-base font-semibold text-plum">
              <Heart className="w-5 animate-[wiggle_1.6s_ease-in-out_infinite]" />
              {APP_NAME}
            </Link>
            <Countdown state={state} className="rounded-full border-2 border-plum bg-candy-yellow px-2.5 py-0.5 font-cute text-xs font-semibold text-plum" />
          </header>
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-32 sm:px-6 lg:px-6 lg:pt-5 lg:pb-10"
          >
            {children}
          </motion.main>
        </div>

        <nav className="no-print sticker-sm fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 items-end rounded-[1.75rem] bg-white px-1 lg:hidden">
          {MOBILE_LEFT.map(mobileItem)}
          <Link href="/advisor" className="flex flex-col items-center pb-2" aria-label="AI Advisor">
            <motion.span whileTap={{ scale: 0.9 }} className={cn("sticker-sm -mt-6 flex h-13 w-13 items-center justify-center rounded-full text-plum", isActive("/advisor") ? "bg-candy-yellow" : "bg-candy-pink")}>
              <Sparkles size={23} strokeWidth={2.4} />
            </motion.span>
            <span className={cn("mt-0.5 font-cute text-[11px] font-semibold", isActive("/advisor") ? "text-plum" : "text-plum/55")}>AI</span>
          </Link>
          {MOBILE_RIGHT.map(mobileItem)}
        </nav>
      </div>
    </MotionConfig>
  );
}
