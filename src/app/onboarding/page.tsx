"use client";

import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleAlert, LoaderCircle, MapPin, Users } from "lucide-react";
import { MotionConfig, useAnimate } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Cloud, Couple, Flower, Heart, Piggy, Sparkle, type Mood } from "@/components/landing/characters";
import { AnimatePresence, ConfettiLayer, Floaty, bounce, burstAt, burstFrom, motion } from "@/components/landing/fx";
import { reaction } from "@/components/landing/plan-tool";
import { APP_NAME } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { addDays, daysBetween, formatDate, rupiah, rupiahShort, todayISO } from "@/lib/format";
import { createFreshState, type OnboardingInput } from "@/lib/seed";
import { replaceState } from "@/lib/store";
import { ADAT_OPTIONS, AGAMA_OPTIONS, BUDGET_CATEGORIES, adatLabel, buildTaskTemplates } from "@/lib/templates";

const STEPS = [
  { title: "Kenalan dulu, yuk!", sub: "Nama ini nanti muncul di dashboard dan undangan." },
  { title: "Kapan hari bahagianya?", sub: "Semua tenggat dihitung mundur dari tanggal ini." },
  { title: "Pakai adat apa?", sub: "Checklist dan rundown disusun sesuai pilihan kalian." },
  { title: "Tamu dan anggarannya?", sub: "Perkiraan saja, nanti bisa diubah kapan pun." },
];

const QUICK_DATES = [
  { label: "3 bulan lagi", days: 90 },
  { label: "6 bulan lagi", days: 180 },
  { label: "1 tahun lagi", days: 365 },
];
const CITIES = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Medan", "Makassar", "Bali"];
const BUDGETS = [50_000_000, 100_000_000, 250_000_000, 500_000_000, 1_000_000_000];
const ADAT_COLORS = ["bg-candy-rose", "bg-candy-mint", "bg-candy-yellow", "bg-candy-sky", "bg-candy-lilac", "bg-[#ffd0b5]", "bg-white"];
const CROWD_COLORS = ["bg-candy-pink", "bg-candy-yellow", "bg-candy-mint", "bg-candy-lilac", "bg-candy-sky"];

const fieldClass =
  "sticker-sm w-full rounded-2xl bg-white px-4 py-3 text-base font-semibold text-plum placeholder:font-medium placeholder:text-plum/35 transition focus:-translate-y-0.5 focus:bg-[#fffbe8] focus:outline-none disabled:opacity-50";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-cream text-primary">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <span className="mb-1.5 flex items-baseline justify-between gap-2 px-1">
      <span className="font-cute text-base font-semibold text-plum">{children}</span>
      {hint && <span className="text-xs font-semibold text-plum/50">{hint}</span>}
    </span>
  );
}

function Chip({ active, onClick, children, className }: { active?: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <motion.button
      type="button"
      {...bounce}
      onClick={onClick}
      className={cn("rounded-full border-[2.5px] border-plum px-3.5 py-1.5 font-cute text-sm font-semibold text-plum", active ? "bg-candy-pink shadow-[2px_2px_0_#3b2340]" : "bg-white", className)}
    >
      {children}
    </motion.button>
  );
}

function OnboardingForm() {
  const router = useRouter();
  // Pilihan dari alat rencana di landing page dibawa lewat URL supaya tidak perlu diisi ulang.
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formScope, animateForm] = useAnimate<HTMLFormElement>();
  const [feed, setFeed] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [form, setForm] = useState<OnboardingInput>(() => {
    const date = params.get("date");
    const adat = ADAT_OPTIONS.find((a) => a.id === params.get("adat"))?.id;
    const agama = AGAMA_OPTIONS.find((a) => a.id === params.get("agama"))?.id;
    const budget = Number(params.get("budget"));
    return {
      brideName: "",
      groomName: "",
      date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
      city: "",
      adat: adat ?? "jawa",
      agama: agama ?? "islam",
      guestEstimate: 300,
      totalBudget: budget > 0 ? budget : 100_000_000,
      ownerName: "",
      ownerEmail: "",
    };
  });
  const fromPlan = params.has("date");
  const set = <K extends keyof OnboardingInput>(k: K, v: OnboardingInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError(null);
  };

  const today = todayISO();
  const days = form.date && !uncertain ? daysBetween(today, form.date) : null;
  const taskCount = buildTaskTemplates(form.adat, form.agama).length;
  const adatInfo = ADAT_OPTIONS.find((a) => a.id === form.adat)!;

  function problem(): string | null {
    if (step === 0) {
      if (!form.brideName.trim() || !form.groomName.trim()) return "Nama kedua mempelai diisi dulu ya.";
      if (!form.ownerName.trim()) return "Nama lengkap kamu diisi dulu ya.";
      if (form.ownerEmail && !/^\S+@\S+\.\S+$/.test(form.ownerEmail)) return "Sepertinya emailnya belum benar.";
    }
    if (step === 1) {
      if (!uncertain && !form.date) return "Pilih tanggalnya, atau centang \"belum pasti\".";
      if (days !== null && days < 0) return "Tanggalnya sudah lewat. Coba pilih tanggal lain.";
      if (!form.city.trim()) return "Kotanya di mana?";
    }
    if (step === 3 && form.totalBudget <= 0) return "Isi perkiraan anggarannya dulu ya.";
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const issue = problem();
    if (issue) {
      setError(issue);
      animateForm(formScope.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.4 });
      return;
    }
    setError(null);
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep(step + 1);
      return;
    }
    replaceState(createFreshState({ ...form, date: uncertain ? null : form.date }));
    setFinishing(true);
  }

  function back() {
    setError(null);
    if (step === 0) {
      router.push("/");
      return;
    }
    setDirection(-1);
    setStep(step - 1);
  }

  function goTo(target: number) {
    if (target >= step) return;
    setError(null);
    setDirection(-1);
    setStep(target);
  }

  // Ucapan dan ekspresi pasangan mengikuti isian.
  const bride = form.brideName.trim();
  const groom = form.groomName.trim();
  let speech = "Hai! Kita kenalan dulu, yuk.";
  let mood: Mood = "happy";
  if (step === 0 && bride && groom) speech = `Halo, ${bride} & ${groom}! Senang kenalan.`;
  else if (step === 0 && (bride || groom)) speech = `Halo, ${bride || groom}! Pasangannya siapa, nih?`;
  if (step === 1) {
    if (uncertain) speech = "Santai, tanggalnya bisa menyusul.";
    else if (days === null) speech = "Sudah ada tanggal incaran?";
    else if (days < 0) {
      speech = "Eh, tanggal itu sudah lewat!";
      mood = "wow";
    } else {
      ({ text: speech, mood } = reaction(days));
    }
  }
  if (step === 2) speech = form.adat === "nasional" ? `Nasional, bebas! ${taskCount} tugas sudah siap.` : `Adat ${adatInfo.label}! ${taskCount} tugas sudah kami siapkan.`;
  if (step === 3) speech = `${form.guestEstimate} tamu, ${rupiahShort(form.totalBudget)}. Siap dibagi!`;

  const crowd = Math.min(Math.round(form.guestEstimate / 50), 30);
  const cateringPerGuest = form.guestEstimate ? (form.totalBudget * 0.3) / form.guestEstimate : 0;

  return (
    <MotionConfig reducedMotion="user">
      <ConfettiLayer />
      <div className="relative flex min-h-svh flex-col overflow-x-clip bg-gradient-to-b from-[#ffd9e8] via-[#ffe9f1] to-cream">
        <Floaty className="absolute top-24 left-[3%] hidden w-10 lg:block" delay={0.3}>
          <Flower />
        </Floaty>
        <Floaty className="absolute right-[4%] bottom-16 hidden w-10 lg:block" delay={1} duration={2.8}>
          <Sparkle />
        </Floaty>

        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-cute text-lg font-semibold text-plum">
            <Heart className="w-6 animate-[wiggle_1.6s_ease-in-out_infinite]" />
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>
          <ol className="flex items-center" aria-label={`Langkah ${step + 1} dari ${STEPS.length}`}>
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex items-center">
                {i > 0 && (
                  <span className="h-1.5 w-6 overflow-hidden bg-white ring-2 ring-plum sm:w-12">
                    <motion.span className="block h-full bg-candy-pink" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
                  </span>
                )}
                <motion.button
                  type="button"
                  disabled={i >= step}
                  onClick={() => goTo(i)}
                  animate={i === step ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={i === step ? { duration: 1.1, repeat: Infinity } : undefined}
                  className="relative z-10 w-8 sm:w-9"
                  aria-label={`Langkah ${i + 1}`}
                >
                  <Heart fill={i < step ? "#ff7eb0" : i === step ? "#ffd45e" : "#fff"} />
                </motion.button>
              </li>
            ))}
          </ol>
        </header>

        <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-5 px-5 pt-4 pb-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pt-6">
          {/* Panggung karakter */}
          <section className="order-1 flex min-w-0 items-center gap-2 lg:order-2 lg:flex-col" aria-live="polite">
            <div className="relative w-32 shrink-0 sm:w-40 lg:order-2 lg:w-full lg:max-w-md">
              <Cloud className="absolute top-2 -left-8 hidden w-28 lg:block" />
              {step === 3 ? (
                <div className="mx-auto w-full lg:w-72">
                  <Piggy feed={feed} full={form.totalBudget >= 250_000_000} />
                </div>
              ) : (
                <Couple mood={mood} className="relative" />
              )}
              <AnimatePresence>
                {step !== 3 && bride && (
                  <motion.span
                    key="bride"
                    initial={{ scale: 0, y: 8 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="sticker-sm absolute bottom-0 left-[28%] hidden max-w-[42%] -translate-x-1/2 truncate rounded-full bg-candy-rose px-3 py-0.5 font-cute text-sm font-semibold text-plum lg:block"
                  >
                    {bride}
                  </motion.span>
                )}
                {step !== 3 && groom && (
                  <motion.span
                    key="groom"
                    initial={{ scale: 0, y: 8 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="sticker-sm absolute bottom-0 left-[72%] hidden max-w-[42%] -translate-x-1/2 truncate rounded-full bg-candy-sky px-3 py-0.5 font-cute text-sm font-semibold text-plum lg:block"
                  >
                    {groom}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="relative min-w-0 flex-1 lg:order-1 lg:mb-1 lg:flex-none">
              <AnimatePresence mode="wait">
                <motion.p
                  key={speech}
                  initial={{ scale: 0.7, opacity: 0, rotate: -3 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  className="sticker-sm relative rounded-3xl bg-white px-4 py-2.5 text-center font-cute text-base leading-snug font-medium text-plum sm:text-lg"
                >
                  {speech}
                </motion.p>
              </AnimatePresence>
            </div>
          </section>

          {/* Kartu isian */}
          <form ref={formScope} onSubmit={submit} noValidate className="sticker order-2 flex min-w-0 flex-col rounded-[2rem] bg-white p-5 sm:p-7 lg:order-1">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 70, opacity: 0, rotate: d * 1.5 }),
                  center: { x: 0, opacity: 1, rotate: 0 },
                  exit: (d: number) => ({ x: d * -70, opacity: 0, rotate: d * -1.5 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
              >
                <p className="font-cute text-sm font-semibold text-primary">
                  Langkah {step + 1} dari {STEPS.length}
                </p>
                <h1 className="mt-1 font-cute text-3xl leading-tight font-semibold text-plum sm:text-4xl">{STEPS[step].title}</h1>
                <p className="mt-1 mb-5 text-sm font-medium text-plum/65">{STEPS[step].sub}</p>

                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <Label>Mempelai wanita</Label>
                        <input autoFocus value={form.brideName} onChange={(e) => set("brideName", e.target.value)} placeholder="Nama panggilan" className={fieldClass} />
                      </label>
                      <label className="block">
                        <Label>Mempelai pria</Label>
                        <input value={form.groomName} onChange={(e) => set("groomName", e.target.value)} placeholder="Nama panggilan" className={fieldClass} />
                      </label>
                    </div>
                    <label className="block">
                      <Label>Nama lengkap kamu</Label>
                      <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} placeholder="Yang mengurus rencana ini" className={fieldClass} />
                    </label>
                    <label className="block">
                      <Label hint="Opsional">Email</Label>
                      <input type="email" value={form.ownerEmail} onChange={(e) => set("ownerEmail", e.target.value)} placeholder="nama@email.com" className={fieldClass} />
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    {fromPlan && form.date && !uncertain && (
                      <p className="flex items-center gap-2 rounded-2xl bg-candy-mint/40 px-3 py-2 text-sm font-semibold text-plum">
                        <Check size={16} strokeWidth={3} /> Tanggal dari rencana kamu sudah terisi
                      </p>
                    )}
                    <label className="block">
                      <Label>Tanggal acara utama</Label>
                      <input type="date" min={today} disabled={uncertain} value={form.date ?? ""} onChange={(e) => set("date", e.target.value || null)} className={fieldClass} />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_DATES.map((q) => {
                        const value = addDays(today, q.days);
                        return (
                          <Chip
                            key={q.label}
                            active={!uncertain && form.date === value}
                            onClick={() => {
                              setUncertain(false);
                              set("date", value);
                            }}
                          >
                            {q.label}
                          </Chip>
                        );
                      })}
                      <Chip
                        active={uncertain}
                        onClick={() => {
                          setUncertain(!uncertain);
                          setError(null);
                        }}
                      >
                        Belum pasti
                      </Chip>
                    </div>
                    <AnimatePresence>
                      {days !== null && days >= 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 rounded-2xl bg-candy-yellow/50 px-4 py-3">
                            <CalendarDays className="shrink-0 text-plum" size={22} />
                            <p className="text-sm font-semibold text-plum">
                              {formatDate(form.date, "weekday")}. Tinggal <span className="font-cute text-lg">{days}</span> hari lagi.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <label className="block">
                      <Label>Kota</Label>
                      <div className="relative">
                        <MapPin size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-primary" />
                        <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Di mana acaranya?" className={cn(fieldClass, "pl-11")} />
                      </div>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CITIES.map((c) => (
                        <Chip key={c} active={form.city === c} onClick={() => set("city", c)} className="px-3 py-1 text-xs">
                          {c}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {ADAT_OPTIONS.map((a, i) => {
                        const active = form.adat === a.id;
                        return (
                          <motion.button
                            key={a.id}
                            type="button"
                            {...bounce}
                            animate={{ rotate: active ? -2 : 0, scale: active ? 1.03 : 1 }}
                            onClick={(e) => {
                              set("adat", a.id);
                              if (!active) burstFrom(e.currentTarget, 8);
                            }}
                            className={cn(
                              "relative min-h-24 rounded-2xl border-[2.5px] border-plum p-3 text-left",
                              ADAT_COLORS[i % ADAT_COLORS.length],
                              active ? "shadow-[4px_4px_0_#3b2340]" : "opacity-80 hover:opacity-100",
                            )}
                          >
                            <span className="block font-cute text-lg font-semibold text-plum">{a.label}</span>
                            <span className="mt-0.5 block text-[11px] leading-tight font-semibold text-plum/70">{a.desc}</span>
                            <AnimatePresence>
                              {active && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 13 }}
                                  className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-plum bg-candy-pink"
                                >
                                  <Check size={15} strokeWidth={3.5} className="text-plum" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </div>
                    <div>
                      <Label>Agama</Label>
                      <div className="flex flex-wrap gap-2">
                        {AGAMA_OPTIONS.map((a) => (
                          <Chip key={a.id} active={form.agama === a.id} onClick={() => set("agama", a.id)}>
                            {a.label}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <Label hint="orang">
                        <span className="inline-flex items-center gap-1.5">
                          <Users size={17} /> Perkiraan tamu: <span className="text-primary">{form.guestEstimate.toLocaleString("id-ID")}</span>
                        </span>
                      </Label>
                      <input
                        type="range"
                        min={50}
                        max={1500}
                        step={50}
                        value={form.guestEstimate}
                        onChange={(e) => set("guestEstimate", Number(e.target.value))}
                        className="w-full cursor-pointer accent-[#ff7eb0]"
                        aria-label="Perkiraan jumlah tamu"
                      />
                      <div className="mt-2 flex min-h-10 flex-wrap gap-1">
                        <AnimatePresence initial={false}>
                          {Array.from({ length: crowd }, (_, i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0, y: 8 }}
                              animate={{ scale: 1, y: 0 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 14 }}
                              className={cn("h-4 w-4 rounded-full border-2 border-plum", CROWD_COLORS[i % CROWD_COLORS.length])}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div>
                      <Label>Perkiraan anggaran</Label>
                      <div className="mb-2.5 flex flex-wrap gap-2">
                        {BUDGETS.map((b) => (
                          <Chip
                            key={b}
                            active={form.totalBudget === b}
                            onClick={() => {
                              set("totalBudget", b);
                              setFeed((f) => f + 1);
                            }}
                          >
                            {rupiahShort(b)}
                          </Chip>
                        ))}
                      </div>
                      <input
                        inputMode="numeric"
                        value={form.totalBudget ? rupiah(form.totalBudget) : ""}
                        onChange={(e) => set("totalBudget", Number(e.target.value.replace(/\D/g, "")) || 0)}
                        placeholder="Rp0"
                        aria-label="Perkiraan anggaran dalam rupiah"
                        className={fieldClass}
                      />
                    </div>
                    <div className="rounded-2xl bg-candy-lilac/35 p-4">
                      <p className="font-cute text-base font-semibold text-plum">Kira-kira nanti terbagi begini:</p>
                      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                        {BUDGET_CATEGORIES.slice(0, 4).map(([category, percent]) => (
                          <li key={category} className="flex justify-between gap-2 text-sm">
                            <span className="truncate font-medium text-plum/70">{category}</span>
                            <span className="font-bold text-plum tabular-nums">{rupiahShort((form.totalBudget * percent) / 100)}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs font-semibold text-plum/70">Katering sekitar {rupiahShort(cateringPerGuest)} per tamu.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="mt-4 flex items-center gap-2 overflow-hidden rounded-2xl bg-danger-soft px-3 py-2 text-sm font-bold text-danger"
                >
                  <CircleAlert size={16} className="shrink-0" /> {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between gap-3">
              <motion.button type="button" {...bounce} onClick={back} className="flex items-center gap-1.5 rounded-full px-3 py-2.5 font-cute text-base font-semibold text-plum/70 hover:text-plum">
                <ArrowLeft size={18} strokeWidth={2.8} /> Kembali
              </motion.button>
              <motion.button type="submit" {...bounce} className="sticker-sm flex items-center gap-2 rounded-full bg-candy-pink px-6 py-3 font-cute text-lg font-semibold text-plum">
                {step < STEPS.length - 1 ? "Lanjut" : "Buat rencana"} <ArrowRight size={19} strokeWidth={2.8} />
              </motion.button>
            </div>
          </form>
        </main>
      </div>

      <AnimatePresence>
        {finishing && <FinishScreen names={`${bride} & ${groom}`} taskCount={taskCount} adat={adatLabel(form.adat)} onDone={() => router.push("/dashboard")} />}
      </AnimatePresence>
    </MotionConfig>
  );
}

/** Perayaan singkat saat rencana selesai dibuat, lalu lanjut ke dashboard. */
function FinishScreen({ names, taskCount, adat, onDone }: { names: string; taskCount: number; adat: string; onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const lines = [`Menyusun ${taskCount} tugas adat ${adat}`, "Membagi anggaran ke 10 pos", "Menyiapkan hitung mundur"];
  const done = phase >= lines.length;
  const doneRef = useRef(onDone);

  useEffect(() => {
    if (done) {
      burstAt(window.innerWidth / 2, window.innerHeight * 0.3, 50);
      const timer = setTimeout(() => doneRef.current(), 1900);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPhase((p) => p + 1), 650);
    return () => clearTimeout(timer);
  }, [done, phase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-candy-pink p-5" role="status">
      <div className="w-full max-w-md text-center">
        <motion.div initial={{ scale: 0.4, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 11 }}>
          <Couple mood={done ? "wow" : "happy"} className="mx-auto w-56 sm:w-64" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.h2 key={String(done)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 13 }} className="mt-2 font-cute text-4xl leading-tight font-semibold text-plum">
            {done ? `Yeay, rencana ${names} siap!` : "Sebentar, lagi disiapkan..."}
          </motion.h2>
        </AnimatePresence>
        <ul className="sticker mt-5 space-y-2.5 rounded-3xl bg-white p-5 text-left">
          {lines.map((line, i) => (
            <li key={line} className="flex items-center gap-3 text-sm font-bold text-plum">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[2.5px] border-plum transition-colors", phase > i ? "bg-candy-mint" : "bg-white")}>
                {phase > i ? (
                  <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
                    <Check size={15} strokeWidth={3.5} />
                  </motion.span>
                ) : phase === i ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : null}
              </span>
              {line}
            </li>
          ))}
        </ul>
        {done && <p className="mt-4 font-cute text-lg font-semibold text-plum">Menuju dashboard...</p>}
      </div>
    </motion.div>
  );
}
