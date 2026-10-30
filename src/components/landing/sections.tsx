"use client";

import { ArrowRight, Check, Heart as HeartIcon, LoaderCircle, Plus, RotateCcw, ShieldCheck, Smartphone, Users } from "lucide-react";
import { MotionConfig, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { iconFor } from "@/components/icons";
import { PREMIUM_PRICE } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { rupiah, rupiahShort } from "@/lib/format";
import { createDemoState } from "@/lib/seed";
import { resetDemo } from "@/lib/store";
import { ADAT_OPTIONS, buildTaskTemplates } from "@/lib/templates";
import type { AdatId, InvitationTemplate } from "@/lib/types";
import { Cloud, Coin, Couple, EnvelopeFront, Face, Flower, Heart, Piggy, Ring, Sparkle } from "./characters";
import { AnimatePresence, ConfettiLayer, CountUp, Floaty, Marquee, PopWords, Reveal, bounce, burstAt, burstFrom, motion } from "./fx";
import { PlanTool } from "./plan-tool";

// Undangan menghitung sisa hari dari tanggal browser, jadi hanya dirender di klien.
const InvitationView = dynamic(() => import("@/components/invitation-view").then((m) => m.InvitationView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-primary">
      <LoaderCircle className="animate-spin" />
    </div>
  ),
});

const BRIDESTORY_URL = "https://www.medcom.id/gaya/family/yKXe4A7N-survei-november-2026-jadi-bulan-paling-populer-untuk-gelar-pernikahan";

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ConfettiLayer />
      {children}
    </MotionConfig>
  );
}

export function DemoButton({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <motion.button
      {...bounce}
      onClick={() => {
        resetDemo();
        router.push("/dashboard");
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function SectionHead({ eyebrow, title, color = "bg-candy-mint", center = true, light = false }: { eyebrow: string; title: string; color?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : ""}>
      <motion.span
        initial={{ scale: 0, rotate: -12 }}
        whileInView={{ scale: 1, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
        className={cn("sticker-sm inline-block rounded-full px-4 py-1 font-cute text-sm font-semibold text-plum", color)}
      >
        {eyebrow}
      </motion.span>
      <h2 className={cn("mt-4 font-cute text-4xl leading-[1.1] font-semibold sm:text-5xl", light ? "text-white" : "text-plum")}>
        <PopWords text={title} />
      </h2>
    </div>
  );
}

/* ---------- Hero ---------- */

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 60, damping: 16 });
  const y = useSpring(mouseY, { stiffness: 60, damping: 16 });
  const farX = useTransform(x, (v) => v * -1.6);
  const farY = useTransform(y, (v) => v * -1.6);

  const { scrollY } = useScroll();
  const cloudLeft = useTransform(scrollY, [0, 600], [0, -80]);
  const cloudRight = useTransform(scrollY, [0, 600], [0, 90]);

  function onMove(e: MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 24);
    mouseY.set(((e.clientY - r.top) / r.height - 0.5) * 24);
  }

  return (
    <section onMouseMove={onMove} className="relative overflow-hidden bg-gradient-to-b from-[#ffd9e8] via-[#ffe9f1] to-cream pt-24 lg:pt-28">
      {/* Awan & stiker melayang */}
      <motion.div style={{ x: cloudLeft }} className="absolute top-[68%] -left-10 w-28 sm:w-36">
        <motion.div animate={{ x: [0, 34, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}>
          <Cloud />
        </motion.div>
      </motion.div>
      <motion.div style={{ x: cloudRight }} className="absolute top-40 -right-10 hidden w-44 sm:block">
        <motion.div animate={{ x: [0, -30, 0] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}>
          <Cloud />
        </motion.div>
      </motion.div>
      <motion.div style={{ x: farX, y: farY }} className="pointer-events-none absolute inset-0 hidden sm:block">
        <Floaty className="absolute top-[58%] left-[3%] w-12" delay={0.3}>
          <Flower />
        </Floaty>
        <Floaty className="absolute top-[30%] left-[46%] w-9" delay={1} duration={2.8}>
          <Sparkle />
        </Floaty>
        <Floaty className="absolute top-[22%] right-[8%] w-11" delay={0.6} duration={4}>
          <Heart />
        </Floaty>
        <Floaty className="absolute top-[64%] right-[3%] w-12" delay={1.4}>
          <Ring />
        </Floaty>
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <h1 className="font-cute text-[2.9rem] leading-[1.05] font-semibold text-plum sm:text-7xl">
            <PopWords once text="Nikahnya sehari." />{" "}
            <PopWords once delay={0.2} text="Persiapannya" />{" "}
            <span className="relative inline-block">
              <PopWords once delay={0.35} text="jangan sampai ribut!" className="text-primary" />
              <motion.svg viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full" aria-hidden>
                <motion.path
                  d="M3 9 Q 40 1 78 8 T 152 8 T 226 8 T 297 6"
                  fill="none"
                  stroke="#ffd45e"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                />
              </motion.svg>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-6 max-w-lg text-base font-medium text-plum/75 sm:text-lg lg:mx-0"
          >
            Checklist sesuai adat, anggaran yang jelas sisanya, tamu dan RSVP yang rapi. Satu tempat, diurus berdua, gratis untuk mulai.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <motion.a {...bounce} href="#rencana" className="sticker inline-flex items-center justify-center gap-2 rounded-full bg-candy-pink px-7 py-3.5 font-cute text-lg font-semibold text-plum">
              Coba rencanakan <ArrowRight size={20} strokeWidth={2.8} />
            </motion.a>
            <DemoButton className="sticker rounded-full bg-white px-7 py-3.5 font-cute text-lg font-semibold text-plum">Intip demo Ayu &amp; Raka</DemoButton>
          </motion.div>
        </div>

        <motion.div
          style={{ x, y }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 130, damping: 11, delay: 0.25 }}
          className="relative mx-auto w-full max-w-[22rem] lg:max-w-[28rem]"
        >
          <button
            onClick={(e) => burstAt(e.clientX, e.clientY, 26)}
            className="block w-full cursor-pointer"
            aria-label="Klik pasangan untuk memunculkan konfeti"
          >
            <Couple />
          </button>
          <motion.span
            animate={{ rotate: [8, 3, 8], y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="sticker-sm pointer-events-none absolute top-1 -right-1 rounded-2xl bg-white px-3 py-1.5 font-cute text-sm font-semibold text-plum sm:-right-4"
          >
            Psst, klik kami!
          </motion.span>
        </motion.div>
      </div>

      {/* Bukit bergelombang */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative -mt-10 block h-14 w-full sm:-mt-14 sm:h-24" aria-hidden>
        <path d="M0 70 C 240 10 480 120 720 70 C 960 20 1200 110 1440 60 L1440 120 L0 120 Z" fill="#fff4f8" stroke="#3b2340" strokeWidth="4" />
      </svg>
    </section>
  );
}

export function PlanSection() {
  return (
    <section id="rencana" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-5 pt-4 sm:px-6">
      <Reveal>
        <PlanTool />
      </Reveal>
    </section>
  );
}

const TICKER = ["Checklist sesuai adat", "Anggaran anti bocor", "RSVP otomatis", "Undangan tanpa APK", "Rundown hari H", "Bisa diurus berdua", "AI Advisor adat"];

export function Ticker() {
  return (
    <div className="mt-16 overflow-hidden py-3 lg:mt-24">
      <Marquee
        className="border-y-[3px] border-plum bg-candy-mint py-3"
        items={TICKER.map((t) => (
          <>
            <span className="font-cute text-xl font-semibold whitespace-nowrap text-plum">{t}</span>
            <Heart className="w-6" />
          </>
        ))}
      />
    </div>
  );
}

/* ---------- Grup keluarga ---------- */

const CHAT = [
  {
    who: "Ibu",
    color: "text-primary",
    text: "Nak, tamu keluarga Ibu jadi berapa orang? Katering nanya.",
    answer: "Daftar tamu: 31 orang, 12 sudah konfirmasi",
    bg: "bg-candy-lilac",
  },
  {
    who: "Raka",
    color: "text-[#6a5acd]",
    text: "Yang, DP katering udah dibayar belum sih?",
    answer: "Anggaran: DP Rp15 jt lunas, cicilan berikutnya 10 Januari",
    bg: "bg-candy-yellow",
  },
  {
    who: "Bude Endang",
    color: "text-sage",
    text: "Siramannya jam berapa? Bude mau atur mobil.",
    answer: "Rundown: siraman Jumat pukul 09.00",
    bg: "bg-candy-mint",
  },
];

export function ChatSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || step >= CHAT.length * 2) return;
    const timer = setTimeout(() => setStep((s) => s + 1), step === 0 ? 300 : step % 2 ? 1000 : 700);
    return () => clearTimeout(timer);
  }, [inView, step]);

  const typing = inView && step < CHAT.length * 2 && step % 2 === 0;

  return (
    <section id="cara-kerja" className="mx-auto mt-20 max-w-4xl scroll-mt-24 px-5 sm:px-6 lg:mt-28">
      <SectionHead eyebrow="Kenal situasi ini?" title="Grup keluarga bunyi terus? Jawabannya ada di sini." color="bg-candy-yellow" />
      <div ref={ref} className="sticker mt-10 min-h-[30rem] rounded-[2rem] bg-white p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-3 border-b-[3px] border-dashed border-plum/20 pb-3">
          <span className="sticker-sm flex h-11 w-11 items-center justify-center rounded-full bg-candy-rose">
            <HeartIcon size={19} className="fill-plum text-plum" />
          </span>
          <div>
            <p className="font-cute text-lg font-semibold text-plum">Keluarga Besar Nikahan</p>
            <p className="text-xs font-medium text-plum/60">{typing ? "sedang mengetik..." : "86 pesan belum dibaca"}</p>
          </div>
        </div>
        <div className="space-y-3">
          {CHAT.map((c, i) => (
            <div key={c.who} className="space-y-3">
              <AnimatePresence>
                {step > i * 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, x: -30, originX: 0 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    className="max-w-[85%] w-fit rounded-3xl rounded-tl-md bg-cream px-4 py-2.5"
                  >
                    <p className={cn("text-xs font-bold", c.color)}>{c.who}</p>
                    <p className="text-[15px] font-medium text-plum">{c.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {step > i * 2 + 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4, rotate: 6, originX: 1 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 11 }}
                    className={cn("sticker-sm ml-auto flex w-fit max-w-[88%] items-center gap-2 rounded-3xl rounded-tr-md px-4 py-2.5", c.bg)}
                  >
                    <Check size={17} strokeWidth={3.2} className="shrink-0 text-plum" />
                    <p className="text-sm font-bold text-plum">{c.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {typing && (
            <div className="flex w-fit gap-1.5 rounded-3xl bg-cream px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="h-2.5 w-2.5 rounded-full bg-plum/50" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.14 }} />
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-xs font-medium text-plum/50">Contoh ilustrasi</p>
    </section>
  );
}

/* ---------- Checklist yang bisa dimainkan ---------- */

const GAME_ADAT: AdatId[] = ["jawa", "sunda", "minang", "batak", "bugis", "betawi"];
const TILE_COLORS = ["bg-candy-mint", "bg-candy-yellow", "bg-candy-lilac", "bg-candy-sky", "bg-candy-rose", "bg-candy-mint"];

export function ChecklistGame() {
  const [adat, setAdat] = useState<AdatId>("jawa");
  const [done, setDone] = useState<string[]>([]);
  const general = new Set(buildTaskTemplates("nasional", "islam").map(([, title]) => title));
  const tasks = buildTaskTemplates(adat, "islam").filter(([, title]) => !general.has(title));
  const allDone = tasks.length > 0 && tasks.every(([, t]) => done.includes(t));
  const pct = (tasks.filter(([, t]) => done.includes(t)).length / tasks.length) * 100;

  function toggle(title: string, el: Element) {
    if (done.includes(title)) {
      setDone(done.filter((t) => t !== title));
      return;
    }
    burstFrom(el, 14);
    const next = [...done, title];
    setDone(next);
    if (tasks.every(([, t]) => next.includes(t))) setTimeout(() => burstFrom(el, 44), 200);
  }

  return (
    <section className="relative mx-auto mt-20 grid max-w-6xl grid-cols-1 items-center gap-10 px-5 sm:px-6 lg:mt-28 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionHead center={false} eyebrow="Checklist" title="Paham adat kalian, bukan template luar negeri." color="bg-candy-lilac" />
        <p className="mt-4 text-base font-medium text-plum/75">Dari weton sampai midodareni, dari marhata sinamot sampai mappacci. Tenggatnya dihitung otomatis dari tanggal kalian.</p>
        <div className="mt-6 hidden justify-center lg:flex">
          <Couple mood={allDone ? "wow" : "happy"} className="w-64" />
        </div>
      </div>

      <Reveal rotate={0.6}>
        <div className="sticker rounded-[2rem] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {GAME_ADAT.map((id) => (
              <motion.button
                key={id}
                {...bounce}
                onClick={() => {
                  setAdat(id);
                  setDone([]);
                }}
                className={cn("rounded-full border-[2.5px] border-plum px-3.5 py-1 font-cute text-sm font-semibold text-plum", adat === id ? "bg-candy-pink" : "bg-white")}
              >
                {ADAT_OPTIONS.find((a) => a.id === id)?.label}
              </motion.button>
            ))}
          </div>
          <div className="mt-4 h-5 overflow-hidden rounded-full border-[2.5px] border-plum bg-cream">
            <motion.div className="h-full rounded-full bg-candy-pink" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 14 }} />
          </div>
          <p className="mt-2 mb-3 text-xs font-bold text-plum/70">{allDone ? "Yeay, beres semua!" : "Coba centang tugasnya"}</p>
          <AnimatePresence mode="popLayout">
            <motion.ul key={adat} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-2.5">
              {tasks.map(([offset, title], i) => {
                const checked = done.includes(title);
                const { icon: Icon } = iconFor(title);
                return (
                  <motion.li key={title} variants={{ hidden: { opacity: 0, x: 40, rotate: 2 }, show: { opacity: 1, x: 0, rotate: 0 } }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
                    <motion.button
                      whileHover={{ scale: 1.015, x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => toggle(title, e.currentTarget)}
                      className={cn("flex w-full items-center gap-3 rounded-2xl border-[2.5px] border-plum px-3 py-2.5 text-left transition-colors", checked ? "bg-candy-mint/40" : "bg-white")}
                    >
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-plum text-plum", TILE_COLORS[i % TILE_COLORS.length])}>
                        <Icon size={17} />
                      </span>
                      <span className={cn("min-w-0 flex-1 text-sm font-bold text-plum", checked && "line-through opacity-60")}>{title}</span>
                      <span className="hidden rounded-full bg-cream px-2 py-0.5 text-[11px] font-bold text-primary sm:block">H-{offset}</span>
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2.5px] border-plum", checked ? "bg-candy-pink" : "bg-white")}>
                        <AnimatePresence>
                          {checked && (
                            <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
                              <Check size={17} strokeWidth={3.5} className="text-plum" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Celengan anggaran ---------- */

const SHOPPING = [
  { name: "Kotak hantaran", price: 850_000 },
  { name: "Kain batik tulis", price: 2_100_000 },
  { name: "Set skincare", price: 1_300_000 },
  { name: "Materai & fotokopi", price: 150_000 },
];
const POT = 10_000_000;

export function BudgetPiggy() {
  const [bought, setBought] = useState<string[]>([]);
  const [coins, setCoins] = useState<number[]>([]);
  const spent = SHOPPING.filter((s) => bought.includes(s.name)).reduce((sum, s) => sum + s.price, 0);
  const left = POT - spent;

  function buy(name: string) {
    if (bought.includes(name)) return;
    setBought([...bought, name]);
    setCoins((c) => [...c, bought.length]);
  }

  return (
    <section className="relative mt-20 overflow-hidden bg-candy-lilac py-20 lg:mt-28">
      <Floaty className="absolute top-5 left-[46%] hidden w-12 md:block" duration={3}>
        <Coin />
      </Floaty>
      <Floaty className="absolute right-[7%] bottom-14 hidden w-14 md:block" duration={3.8} delay={0.5}>
        <Coin />
      </Floaty>
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHead center={false} eyebrow="Anggaran" title="Yang bikin bengkak biasanya bukan vendornya." color="bg-candy-yellow" />
          <p className="mt-4 text-base font-medium text-plum/80">
            Kotak hantaran, kain, materai. Kecil-kecil, tapi baru terasa di akhir. Di sini setiap belanja langsung mengurangi sisa anggaran, dan cicilan vendor punya tanggal jatuh temponya sendiri.
          </p>
          <p className="mt-5 font-cute text-lg font-semibold text-plum">Coba belanja, biar celengannya kerja:</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {SHOPPING.map((s) => {
              const isBought = bought.includes(s.name);
              return (
                <motion.button
                  key={s.name}
                  {...bounce}
                  disabled={isBought}
                  onClick={() => buy(s.name)}
                  className={cn("sticker-sm rounded-2xl px-3.5 py-2 text-left", isBought ? "bg-white/50 opacity-60" : "bg-white")}
                >
                  <span className="block text-sm font-bold text-plum">{s.name}</span>
                  <span className="block font-cute text-sm font-semibold text-primary">{rupiahShort(s.price)}</span>
                </motion.button>
              );
            })}
            {bought.length > 0 && (
              <motion.button
                {...bounce}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => {
                  setBought([]);
                  setCoins([]);
                }}
                className="sticker-sm flex h-12 w-12 items-center justify-center rounded-2xl bg-candy-yellow text-plum"
                aria-label="Ulangi belanja"
              >
                <RotateCcw size={18} strokeWidth={2.8} />
              </motion.button>
            )}
          </div>
        </div>

        <Reveal>
          <div className="sticker relative rounded-[2rem] bg-white p-6 text-center">
            <div className="relative mx-auto h-64 w-64">
              {coins.map((c) => (
                <motion.div
                  key={c}
                  className="absolute top-0 left-1/2 w-11 -translate-x-1/2"
                  initial={{ y: -40, opacity: 0, rotate: -40 }}
                  animate={{ y: [-40, 44, 62], opacity: [0, 1, 0], rotate: 200 }}
                  transition={{ duration: 0.7, ease: "easeIn" }}
                >
                  <Coin />
                </motion.div>
              ))}
              <div className="absolute inset-x-0 bottom-0">
                <Piggy feed={bought.length} full={bought.length === SHOPPING.length} />
              </div>
            </div>
            <p className="mt-2 text-sm font-bold text-plum/60">Sisa pos Seserahan &amp; mahar</p>
            <motion.p key={left} initial={{ scale: 1.25, color: "#e2337f" }} animate={{ scale: 1, color: "#3b2340" }} transition={{ type: "spring", stiffness: 300, damping: 13 }} className="font-cute text-5xl font-semibold tabular-nums">
              {rupiahShort(left)}
            </motion.p>
            <div className="mt-3 h-4 overflow-hidden rounded-full border-[2.5px] border-plum bg-cream">
              <motion.div className="h-full bg-candy-yellow" animate={{ width: `${(spent / POT) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 14 }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-plum/60">Terpakai {rupiahShort(spent)} dari {rupiahShort(POT)}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Undangan dalam amplop ---------- */

const THEMES: { id: InvitationTemplate; name: string; bg: string }[] = [
  { id: "melati", name: "Melati", bg: "bg-[#fbf0d9]" },
  { id: "sage", name: "Sage", bg: "bg-candy-mint" },
  { id: "malam", name: "Malam", bg: "bg-[#6e7ab5]" },
  { id: "minang", name: "Minang", bg: "bg-minang-wine" },
];

const demoState = createDemoState();

const INVITE_BENEFITS = [
  { icon: Users, bg: "bg-candy-lilac", title: "Tautan personal per tamu", text: "Nama tamu muncul di undangannya. Kirimnya tinggal lewat WhatsApp." },
  { icon: Smartphone, bg: "bg-candy-sky", title: "Tamu tidak perlu akun", text: "Buka tautan, pilih hadir atau tidak, tulis ucapan. Selesai." },
  { icon: ShieldCheck, bg: "bg-candy-mint", title: "Tanpa file APK", text: "Penipuan berkedok undangan APK bikin tamu waspada. Ini cuma tautan web biasa, tidak ada yang perlu diunduh." },
];

export function InviteSection() {
  const [template, setTemplate] = useState<InvitationTemplate>("melati");
  const state = { ...demoState, invitation: { ...demoState.invitation, template } };
  const stageRef = useRef<HTMLDivElement>(null);
  const opened = useInView(stageRef, { once: true, amount: 0.35 });

  return (
    <section id="undangan" className="mx-auto mt-20 grid max-w-6xl scroll-mt-24 grid-cols-1 items-center gap-12 px-5 sm:px-6 lg:mt-28 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <SectionHead center={false} eyebrow="Undangan digital" title="Sekali sebar, daftar tamunya ikut terisi." color="bg-candy-rose" />
        <p className="mt-4 text-base font-medium text-plum/75">Setiap RSVP langsung masuk ke daftar tamu, jadi angka untuk katering selalu terbaru.</p>
        <div className="mt-7 space-y-3">
          {INVITE_BENEFITS.map(({ icon: Icon, bg, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <motion.div whileHover={{ x: 6, rotate: -0.5 }} className="sticker-sm flex gap-3.5 rounded-3xl bg-white p-3.5">
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-[2.5px] border-plum text-plum", bg)}>
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-cute text-lg font-semibold text-plum">{title}</p>
                  <p className="text-sm font-medium text-plum/70">{text}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      <div ref={stageRef}>
        <div className="relative mx-auto h-[620px] w-full max-w-[360px]">
          <motion.div
            className="absolute inset-x-5 top-0 rounded-[2.5rem] border-[3px] border-plum bg-plum p-2"
            initial={{ y: 330, rotate: -4 }}
            animate={opened ? { y: 0, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.25 }}
          >
            <div className="h-[520px] overflow-y-auto rounded-[2rem] bg-white [scrollbar-width:none]">
              <InvitationView key={template} state={state} mode="preview" />
            </div>
          </motion.div>
          <motion.div
            className="absolute inset-x-0 -bottom-2 z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={opened ? { y: 0, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 150, damping: 13 }}
          >
            <EnvelopeFront className="w-full drop-shadow-[5px_6px_0_#3b2340]" />
          </motion.div>
        </div>
        <div className="relative z-20 mt-6 flex flex-wrap justify-center gap-2">
          {THEMES.map((t) => (
            <motion.button
              key={t.id}
              {...bounce}
              onClick={(e) => {
                setTemplate(t.id);
                burstFrom(e.currentTarget, 8);
              }}
              className={cn("rounded-full border-[2.5px] border-plum px-4 py-1.5 font-cute text-sm font-semibold", t.bg, t.id === "malam" || t.id === "minang" ? "text-white" : "text-plum", template === t.id && "shadow-[3px_3px_0_#3b2340]")}
            >
              {t.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Oper tugas ---------- */

const CREW = [
  { id: "ayu", name: "Ayu", face: "bride" as const, bg: "bg-candy-rose" },
  { id: "raka", name: "Raka", face: "groom" as const, bg: "bg-candy-sky" },
  { id: "ibu", name: "Ibu", face: "mom" as const, bg: "bg-candy-lilac" },
];

const CREW_TASKS = [
  { title: "Pesan cincin", owner: 0 },
  { title: "Booking katering", owner: 1 },
  { title: "Survei gedung", owner: 1 },
  { title: "Rekap tamu keluarga", owner: 2 },
];

export function CrewSection() {
  const [owners, setOwners] = useState(CREW_TASKS.map((t) => t.owner));

  return (
    <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-6 lg:mt-28">
      <SectionHead eyebrow="Berdua, bukan sendirian" title="Biar yang mikir bukan cuma satu orang." color="bg-candy-mint" />
      <p className="mx-auto mt-4 max-w-xl text-center text-base font-medium text-plum/75">Ketuk tugasnya untuk mengoper ke orang lain. Semua melihat data yang sama, jadi tidak perlu lagi saling tanya.</p>
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {CREW.map((person, p) => (
          <Reveal key={person.id} delay={p * 0.1} rotate={p === 1 ? 0 : p === 0 ? -1 : 1}>
            <div className={cn("sticker min-h-64 rounded-[2rem] p-5", person.bg)}>
              <div className="flex items-center gap-3">
                <motion.div animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: p * 0.4 }}>
                  <Face variant={person.face} className="h-16 w-16" />
                </motion.div>
                <p className="font-cute text-2xl font-semibold text-plum">{person.name}</p>
              </div>
              <div className="mt-4 space-y-2">
                {CREW_TASKS.map((t, i) =>
                  owners[i] === p ? (
                    <motion.button
                      key={t.title}
                      layoutId={t.title}
                      whileHover={{ scale: 1.04, rotate: -1 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      onClick={() => setOwners(owners.map((o, x) => (x === i ? (o + 1) % CREW.length : o)))}
                      className="sticker-sm flex w-full items-center justify-between gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-left text-sm font-bold text-plum"
                    >
                      {t.title}
                      <ArrowRight size={15} strokeWidth={3} className="shrink-0 text-primary" />
                    </motion.button>
                  ) : null,
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Angka survei ---------- */

const STATS: { to: number; decimals: number; text: string; bg: string }[] = [
  { to: 44.1, decimals: 1, text: "calon pengantin butuh lebih dari 12 bulan persiapan", bg: "bg-candy-yellow" },
  { to: 91, decimals: 0, text: "sudah memakai undangan dan buku tamu digital", bg: "bg-candy-mint" },
  { to: 42, decimals: 0, text: "mengundang 101 sampai 300 tamu", bg: "bg-candy-sky" },
];

export function StatsSection() {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-6 lg:mt-28">
      <SectionHead eyebrow="Fakta" title="Nikah itu proyek besar. Wajar kalau butuh alat." color="bg-candy-rose" />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal key={s.text} delay={i * 0.12} rotate={i === 1 ? 1 : -1}>
            <motion.div whileHover={{ rotate: i === 1 ? -1.5 : 1.5, scale: 1.03 }} className={cn("sticker rounded-[2rem] p-6 text-center", s.bg)}>
              <p className="font-cute text-6xl font-semibold text-plum">
                <CountUp to={s.to} format={(n) => `${n.toLocaleString("id-ID", { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })}%`} />
              </p>
              <p className="mt-2 text-sm font-semibold text-plum/80">{s.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-xs font-medium text-plum/60">
        Sumber:{" "}
        <a href={BRIDESTORY_URL} target="_blank" rel="noreferrer" className="underline">
          survei Bridestory terhadap 5.000 calon pengantin
        </a>
        , akhir 2025.
      </p>
    </section>
  );
}

/* ---------- Harga ---------- */

function PriceList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm font-semibold text-plum">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-plum bg-white">
            <Check size={12} strokeWidth={4} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PricingSection() {
  return (
    <section id="harga" className="mx-auto mt-20 max-w-4xl scroll-mt-24 px-5 sm:px-6 lg:mt-28">
      <SectionHead eyebrow="Harga" title="Gratis buat merencanakan. Bayar sekali kalau siap sebar." color="bg-candy-yellow" />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal rotate={-1}>
          <motion.div whileHover={{ rotate: 1, y: -4 }} className="sticker h-full rounded-[2rem] bg-white p-7">
            <p className="font-cute text-2xl font-semibold text-plum">Starter</p>
            <p className="mt-1 font-cute text-6xl font-semibold text-plum">Rp0</p>
            <p className="text-sm font-semibold text-plum/60">Selamanya</p>
            <PriceList items={["Checklist sesuai adat dan agama", "Anggaran, cicilan, pengeluaran", "Daftar tamu dan impor CSV", "Rundown hari H", "Pratinjau undangan", "5 pertanyaan AI Advisor"]} />
            <motion.div {...bounce} className="mt-7">
              <Link href="/onboarding" className="sticker-sm block rounded-2xl bg-candy-mint py-3.5 text-center font-cute text-lg font-semibold text-plum">
                Mulai gratis
              </Link>
            </motion.div>
          </motion.div>
        </Reveal>
        <Reveal rotate={1} delay={0.1}>
          <motion.div whileHover={{ rotate: -1, y: -4 }} className="sticker relative h-full rounded-[2rem] bg-candy-pink p-7">
            <motion.span
              animate={{ rotate: [10, 16, 10], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="sticker-sm absolute -top-5 -right-3 rounded-2xl bg-candy-yellow px-3 py-1.5 font-cute text-sm font-semibold text-plum"
            >
              Tanpa langganan!
            </motion.span>
            <p className="font-cute text-2xl font-semibold text-plum">Premium</p>
            <p className="mt-1 font-cute text-6xl font-semibold text-plum">{rupiah(PREMIUM_PRICE).replace(/\s/g, "").replace(/\.000$/, "rb")}</p>
            <p className="text-sm font-semibold text-plum/75">Sekali bayar untuk satu rencana</p>
            <PriceList items={["Semua fitur Starter", "Terbitkan undangan dan terima RSVP", "Tautan personal per tamu", "Grafik anggaran rinci", "50 pertanyaan AI Advisor"]} />
            <motion.div {...bounce} className="mt-7">
              <Link href="/onboarding" className="sticker-sm block rounded-2xl bg-white py-3.5 text-center font-cute text-lg font-semibold text-plum">
                Mulai, upgrade kapan saja
              </Link>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQS = [
  { q: "Kami sudah pakai Excel. Masih perlu?", a: "Excel cukup untuk mulai. Masalahnya muncul saat semuanya saling terkait: tamu berubah, katering ikut berubah, anggaran ikut berubah. Di sini data itu tersambung, dan bisa dibuka berdua dari HP." },
  { q: "Kami pakai WO. Masih berguna?", a: "Masih. WO mengurus vendor dan hari H, sementara daftar tamu dari keluarga, anggaran total, dan seserahan biasanya tetap di tangan kalian." },
  { q: "Tamu harus instal aplikasi?", a: "Tidak. Tamu cukup membuka tautan undangan dan mengisi RSVP tanpa akun. Kami tidak pernah mengirim file APK, jadi tamu tidak perlu mengunduh apa pun." },
  { q: "Bisa dipakai bareng pasangan dan keluarga?", a: "Bisa. Undang pasangan dan keluarga, lalu atur siapa yang boleh mengubah apa. Misalnya Ibu cukup mengurus daftar tamu keluarga." },
  { q: "Persiapan kami mepet. Masih relevan?", a: "Masih. Tenggat dihitung dari tanggal pernikahan kalian, dan tugas yang sudah masuk waktunya langsung terlihat supaya kalian tahu mana yang didahulukan." },
  { q: "Adat kami belum ada di daftar?", a: "Pilih Nasional/modern, lalu tambahkan tugas sendiri. Tradisi tiap keluarga juga bisa berbeda, jadi semua tugas dari template bisa diubah atau dihapus." },
  { q: "Siapa yang bisa melihat data tamu?", a: "Hanya kalian dan kolaborator yang kalian undang. Halaman undangan tidak menampilkan daftar tamu ke tamu lain." },
  { q: "Apa maksud sekali bayar?", a: `Premium ${rupiah(PREMIUM_PRICE)} dibayar satu kali untuk satu rencana pernikahan. Tidak ada biaya bulanan.` },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto mt-20 max-w-3xl scroll-mt-24 px-5 sm:px-6 lg:mt-28">
      <SectionHead eyebrow="FAQ" title="Yang biasanya ditanyakan" color="bg-candy-sky" />
      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.03}>
              <div className={cn("sticker-sm overflow-hidden rounded-3xl transition-colors", isOpen ? "bg-candy-rose" : "bg-white")}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-cute text-lg font-semibold text-plum">
                  {f.q}
                  <motion.span animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2.5px] border-plum bg-candy-yellow">
                    <Plus size={17} strokeWidth={3.2} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 26 }}>
                      <p className="px-5 pb-5 text-[15px] font-medium text-plum/85">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Penutup ---------- */

const FINAL_FLOATERS = [
  { className: "top-10 left-[8%] w-12", el: <Heart fill="#ffd45e" /> },
  { className: "top-16 right-[10%] w-12", el: <Flower /> },
  { className: "bottom-40 left-[14%] w-10 hidden md:block", el: <Sparkle fill="#fff" /> },
  { className: "bottom-48 right-[16%] w-12 hidden md:block", el: <Ring /> },
];

export function FinalCta() {
  return (
    <section className="relative mt-20 overflow-hidden bg-candy-pink pt-20 lg:mt-28">
      {FINAL_FLOATERS.map((f, i) => (
        <Floaty key={f.className} className={cn("absolute", f.className)} delay={i * 0.4} duration={3 + i * 0.4}>
          {f.el}
        </Floaty>
      ))}
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <h2 className="font-cute text-5xl leading-[1.05] font-semibold text-plum sm:text-7xl">
          <PopWords text="Saatnya menikmati prosesnya!" />
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base font-semibold text-plum/80">Mulai dari tanggal dan adat kalian. Gratis, tanpa kartu kredit.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <motion.div {...bounce} onHoverStart={(_, info) => burstAt(info.point.x, info.point.y - window.scrollY, 6)}>
            <Link href="/onboarding" className="sticker flex items-center justify-center gap-2 rounded-full bg-candy-yellow px-8 py-4 font-cute text-xl font-semibold text-plum">
              Mulai rencanakan <ArrowRight size={21} strokeWidth={2.8} />
            </Link>
          </motion.div>
          <DemoButton className="sticker rounded-full bg-white px-8 py-4 font-cute text-xl font-semibold text-plum">Intip demo</DemoButton>
        </div>
      </div>
      <button onClick={(e) => burstAt(e.clientX, e.clientY, 30)} className="relative mx-auto mt-6 block w-72 cursor-pointer sm:w-96" aria-label="Klik pasangan untuk memunculkan konfeti">
        <Couple />
      </button>
    </section>
  );
}
