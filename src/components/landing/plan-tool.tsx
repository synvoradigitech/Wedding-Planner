"use client";

import { ArrowRight, CircleAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { iconFor } from "@/components/icons";
import { cn } from "@/lib/cn";
import { addDays, daysBetween, formatDate, rupiahShort, todayISO } from "@/lib/format";
import { ADAT_OPTIONS, AGAMA_OPTIONS, BUDGET_CATEGORIES, adatLabel, buildTaskTemplates } from "@/lib/templates";
import type { AdatId, AgamaId } from "@/lib/types";
import { Couple, type Mood } from "./characters";
import { AnimatePresence, CountUp, bounce, burstFrom, motion } from "./fx";

const BUDGETS = [100_000_000, 250_000_000, 500_000_000, 1_000_000_000];
const DEFAULT_DAYS_AHEAD = 300;

const fieldClass =
  "sticker-sm w-full rounded-2xl bg-white px-4 py-3 font-cute text-base font-medium text-plum focus:ring-4 focus:ring-candy-pink/40 focus:outline-none";

export function reaction(days: number): { mood: Mood; text: string } {
  if (days >= 365) return { mood: "happy", text: "Santai, waktunya masih lega. Mulai dari keputusan besar dulu ya!" };
  if (days >= 180) return { mood: "happy", text: "Waktunya cukup, asal mulai dari sekarang. Semangat!" };
  if (days >= 60) return { mood: "wow", text: "Wah, agak mepet! Tapi masih terkejar kalau fokus ke yang penting." };
  return { mood: "panic", text: "Aduh, mepet banget! Tenang, kerjakan yang wajib dulu." };
}

interface Plan {
  date: string;
  adat: AdatId;
  agama: AgamaId;
}

/** Pengunjung langsung mendapat rencana pribadi tanpa perlu daftar. */
export function PlanTool() {
  const [date, setDate] = useState("");
  const [adat, setAdat] = useState<AdatId>("jawa");
  const [agama, setAgama] = useState<AgamaId>("islam");
  const [plan, setPlan] = useState<Plan | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    setPlan({ date: date || addDays(todayISO(), DEFAULT_DAYS_AHEAD), adat, agama });
    if (buttonRef.current) burstFrom(buttonRef.current, 22);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  }

  return (
    <>
      <form onSubmit={submit} className="sticker rounded-[2rem] bg-candy-yellow p-4 sm:p-6">
        <p className="font-cute text-2xl font-semibold text-plum sm:text-3xl">Kapan hari bahagianya?</p>
        <p className="mt-0.5 mb-4 text-sm font-medium text-plum/75">Coba dulu tanpa daftar. Kami susunkan rencananya sekarang juga.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block px-1 text-xs font-bold text-plum">Tanggal nikah</span>
            <input type="date" value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
          </label>
          <label className="block">
            <span className="mb-1 block px-1 text-xs font-bold text-plum">Adat</span>
            <select value={adat} onChange={(e) => setAdat(e.target.value as AdatId)} className={fieldClass}>
              {ADAT_OPTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block px-1 text-xs font-bold text-plum">Agama</span>
            <select value={agama} onChange={(e) => setAgama(e.target.value as AgamaId)} className={fieldClass}>
              {AGAMA_OPTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <motion.button
            ref={buttonRef}
            type="submit"
            {...bounce}
            className="sticker-sm mt-auto flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-candy-pink px-6 font-cute text-lg font-semibold whitespace-nowrap text-plum sm:col-span-2 lg:col-span-1"
          >
            Lihat rencana <ArrowRight size={19} strokeWidth={2.8} />
          </motion.button>
        </div>
        {!date && <p className="mt-3 px-1 text-xs font-medium text-plum/70">Belum tahu tanggalnya? Klik saja, kami pakai perkiraan {DEFAULT_DAYS_AHEAD} hari lagi.</p>}
      </form>

      <div ref={resultRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">{plan && <PlanResult key={`${plan.date}-${plan.adat}-${plan.agama}`} plan={plan} />}</AnimatePresence>
      </div>
    </>
  );
}

function PlanResult({ plan }: { plan: Plan }) {
  const today = todayISO();
  const [budget, setBudget] = useState(BUDGETS[1]);
  const days = daysBetween(today, plan.date);
  const { mood, text } = reaction(days);
  const tasks = buildTaskTemplates(plan.adat, plan.agama);
  const late = tasks.filter(([offset]) => offset >= days);
  const upcoming = tasks.filter(([offset]) => offset < days);
  const shown = (late.length ? late : upcoming).slice(0, 4);
  const onboardingUrl = `/onboarding?date=${plan.date}&adat=${plan.adat}&agama=${plan.agama}&budget=${budget}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 60, scale: 0.9, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
      className="sticker mt-6 overflow-hidden rounded-[2rem] bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.1fr_1fr]">
        <div className="bg-candy-rose p-6 text-center">
          <Couple mood={mood} className="mx-auto w-44" />
          <p className="font-cute text-7xl leading-none font-semibold text-plum">
            <CountUp to={days} />
          </p>
          <p className="mt-1 font-cute text-lg font-medium text-plum">hari lagi</p>
          <p className="text-xs font-semibold text-plum/70">{formatDate(plan.date, "weekday")}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 13 }}
            className="sticker-sm mt-4 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-plum"
          >
            {text}
          </motion.p>
        </div>

        <div className="border-t-[3px] border-plum p-6 lg:border-t-0 lg:border-l-[3px]">
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Sparkles size={14} /> {tasks.length} tugas untuk adat {adatLabel(plan.adat)}
          </p>
          <h3 className="mt-1 font-cute text-2xl font-semibold text-plum">{late.length ? "Yuk, kerjakan ini dulu" : "Mulai dari sini"}</h3>
          {late.length > 0 && (
            <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-danger">
              <CircleAlert size={14} /> {late.length} tugas sudah masuk waktunya
            </p>
          )}
          <ul className="mt-4 space-y-2.5">
            {shown.map(([offset, title], i) => {
              const { icon: Icon } = iconFor(title);
              return (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.12, type: "spring", stiffness: 240, damping: 16 }}
                  className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2.5"
                >
                  <span className="sticker-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-candy-mint text-plum">
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-plum">{title}</p>
                    <p className="text-xs font-medium text-plum/60">{offset >= days ? "Mulai sekarang" : `Paling lambat ${formatDate(addDays(plan.date, -offset))}`}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col border-t-[3px] border-plum p-6 lg:border-t-0 lg:border-l-[3px]">
          <h3 className="font-cute text-2xl font-semibold text-plum">Kira-kira anggarannya</h3>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {BUDGETS.map((b) => (
              <motion.button
                key={b}
                {...bounce}
                onClick={() => setBudget(b)}
                className={cn("rounded-xl border-[2.5px] border-plum py-2 font-cute text-sm font-semibold text-plum", budget === b ? "bg-candy-lilac" : "bg-white")}
              >
                {rupiahShort(b).replace("Rp", "")}
              </motion.button>
            ))}
          </div>
          <ul className="mt-4 flex-1 space-y-2.5">
            {BUDGET_CATEGORIES.slice(0, 4).map(([category, percent]) => (
              <li key={category} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-plum/70">
                  {category} <span className="text-xs">({percent}%)</span>
                </span>
                <motion.span key={budget} initial={{ scale: 1.35, color: "#e2337f" }} animate={{ scale: 1, color: "#3b2340" }} className="font-cute text-base font-semibold tabular-nums">
                  {rupiahShort((budget * percent) / 100)}
                </motion.span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] font-medium text-plum/60">Patokan awal, bisa kalian ubah.</p>
          <motion.div {...bounce} className="mt-4">
            <Link href={onboardingUrl} className="sticker-sm flex items-center justify-center gap-2 rounded-2xl bg-candy-pink px-5 py-3.5 font-cute text-lg font-semibold text-plum">
              Simpan rencana ini <ArrowRight size={18} strokeWidth={2.8} />
            </Link>
          </motion.div>
          <p className="mt-2 text-center text-[11px] font-semibold text-plum/60">Gratis, tanpa kartu kredit</p>
        </div>
      </div>
    </motion.section>
  );
}
