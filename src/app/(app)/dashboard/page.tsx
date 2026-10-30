"use client";

import { ArrowRight, Bell, CalendarHeart, Check, CircleAlert, Clock, ListChecks, Mail, Rocket, Sparkles, UserPlus, Users, Wallet, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { useApp } from "@/components/app-shell";
import { iconFor } from "@/components/icons";
import { Couple, Flower, Heart, Sparkle } from "@/components/landing/characters";
import { AnimatePresence, CountUp, Floaty, Reveal, bounce, burstFrom, motion } from "@/components/landing/fx";
import { reaction } from "@/components/landing/plan-tool";
import { Card, CheckButton, IconTile, Progress, Segmented, inputClass, type Tone } from "@/components/ui";
import { cn } from "@/lib/cn";
import { daysBetween, formatDate, rupiahShort, titleCase, todayISO } from "@/lib/format";
import { budgetSummary, coupleName, guestSummary, hLabel, isOverdue, memberName, taskDaysBefore, taskDue, upcomingPayments } from "@/lib/selectors";
import { updateState, withActivity } from "@/lib/store";
import { adatLabel, agamaLabel } from "@/lib/templates";
import type { AppState, Task } from "@/lib/types";

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

/** Tenggat tugas; tanpa tanggal pernikahan cukup tampilkan posisi H-n. */
function dueLabel(task: Task, state: AppState) {
  const due = taskDue(task, state.wedding);
  const h = hLabel(taskDaysBefore(task, state.wedding));
  return due ? `${h} · ${formatDate(due)}` : h;
}

export default function DashboardPage() {
  const state = useApp();
  const { wedding } = state;
  const today = todayISO();
  const [tab, setTab] = useState<"tugas" | "bayar">("tugas");
  const [bellOpen, setBellOpen] = useState(false);

  const done = state.tasks.filter((t) => t.done).length;
  const taskPct = state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0;
  const budget = budgetSummary(state);
  const budgetPct = budget.total ? (budget.spent / budget.total) * 100 : 0;
  const guests = guestSummary(state);
  const payments = upcomingPayments(state, 30, today);
  const payTotal = payments.reduce((s, p) => s + p.amount, 0);
  const overdue = state.tasks.filter((t) => isOverdue(t, wedding, today));
  const nextTasks = state.tasks
    .filter((t) => !t.done)
    .sort((a, b) => taskDaysBefore(b, wedding) - taskDaysBefore(a, wedding))
    .slice(0, 5);
  const firstName = titleCase(state.members[0].name.split(" ")[0]);

  function toggle(id: string, el: Element | null) {
    if (el) burstFrom(el, 14);
    updateState((s) => {
      const task = s.tasks.find((t) => t.id === id)!;
      const next = { ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) };
      return task.done ? next : withActivity(next, `${s.members[0].name.split(" ")[0]} menandai "${task.title}" selesai`);
    });
  }

  return (
    <div className="space-y-5">
      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-plum/60">{greeting()},</p>
          <h1 className="truncate font-cute text-3xl leading-tight font-semibold text-plum">{firstName}!</h1>
        </div>
        <motion.button
          {...bounce}
          onClick={() => setBellOpen(!bellOpen)}
          className="sticker-sm relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-plum"
          aria-label="Aktivitas terbaru"
          aria-expanded={bellOpen}
        >
          <Bell size={20} strokeWidth={2.4} />
          {state.activity.length > 0 && <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-plum bg-candy-pink" />}
        </motion.button>
        <AnimatePresence>
          {bellOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              style={{ originX: 1, originY: 0 }}
              className="sticker absolute top-14 right-0 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-3xl bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-cute text-lg font-semibold text-plum">Aktivitas terbaru</h2>
                <button onClick={() => setBellOpen(false)} className="rounded-full p-1 text-plum/60 hover:text-plum" aria-label="Tutup">
                  <X size={17} />
                </button>
              </div>
              <ul className="space-y-2.5">
                {state.activity.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex gap-2.5 text-sm font-medium text-plum">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-plum bg-candy-pink" />
                    <span className="min-w-0 flex-1">
                      {a.text}
                      <span className="block text-xs text-plum/55">{formatDate(a.at.slice(0, 10))}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="min-w-0 space-y-5">
          <Hero state={state} done={done} overdue={overdue.length} />
          <QuickStart state={state} />

          <section>
            <h2 className="mb-2.5 font-cute text-xl font-semibold text-plum">Progres persiapan</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard href="/checklist" icon={<ListChecks size={16} strokeWidth={2.6} />} tone="primary" label="Checklist" pct={taskPct} sub={`${done} dari ${state.tasks.length} tugas`}>
                <CountUp to={taskPct} format={(n) => `${Math.round(n)}%`} />
              </StatCard>
              <StatCard href="/anggaran" icon={<Wallet size={16} strokeWidth={2.6} />} tone="gold" label="Terpakai" pct={budgetPct} sub={`dari ${rupiahShort(budget.total)}`}>
                {rupiahShort(budget.spent)}
              </StatCard>
              <StatCard href="/tamu" icon={<Users size={16} strokeWidth={2.6} />} tone="sage" label="Tamu hadir" pct={guests.pax ? (guests.attending / guests.pax) * 100 : 0} sub={guests.invitations ? `${guests.pending} belum jawab` : "Belum ada tamu"}>
                <CountUp to={guests.attending} />
              </StatCard>
              <StatCard href="/anggaran" icon={<Clock size={16} strokeWidth={2.6} />} tone="violet" label="Tagihan" sub={payments.length ? `${payments.length} tagihan, 30 hari` : "Belum ada tagihan"}>
                {rupiahShort(payTotal)}
              </StatCard>
            </div>
          </section>

          <section>
            <h2 className="mb-2.5 font-cute text-xl font-semibold text-plum">Alat persiapan</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ToolTile href="/anggaran" color="bg-candy-yellow" icon={<Wallet size={23} strokeWidth={2.4} />} title="Anggaran" sub={`${rupiahShort(budget.remaining)} sisa`} rotate={-1.5} />
              <ToolTile href="/tamu" color="bg-candy-lilac" icon={<Users size={23} strokeWidth={2.4} />} title="Daftar tamu" sub={`${guests.invitations} undangan`} rotate={1} />
              <ToolTile href="/undangan" color="bg-candy-rose" icon={<Mail size={23} strokeWidth={2.4} />} title="Undangan" sub={state.invitation.published ? "Sudah terbit" : "Masih draf"} rotate={-1} />
              <ToolTile href="/rundown" color="bg-candy-sky" icon={<Clock size={23} strokeWidth={2.4} />} title="Rundown" sub={`${state.events.length} acara`} rotate={1.5} />
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <section>
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: "tugas", label: "Tugas berikutnya" },
                { value: "bayar", label: `Pembayaran (${payments.length})` },
              ]}
            />
            <div className="mt-3 space-y-2.5">
              {tab === "tugas" && (
                <AnimatePresence mode="popLayout" initial={false}>
                  {nextTasks.map((t) => (
                    <TaskRow key={t.id} task={t} state={state} onToggle={toggle} />
                  ))}
                </AnimatePresence>
              )}
              {tab === "tugas" && nextTasks.length === 0 && <Card className="p-6 text-center font-cute text-lg font-semibold text-plum">Yeay, semua tugas selesai!</Card>}
              {tab === "bayar" &&
                (payments.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="font-cute text-lg font-semibold text-plum">Belum ada tagihan dekat</p>
                    <p className="mt-1 text-sm font-medium text-plum/60">Catat DP dan cicilan vendor di menu Anggaran supaya tidak terlewat.</p>
                  </Card>
                ) : (
                  payments.map((p) => {
                    const days = daysBetween(today, p.dueDate);
                    return (
                      <Card key={p.id} className="flex items-center gap-3 p-3 pr-4">
                        <IconTile tone="gold">
                          <Wallet size={19} />
                        </IconTile>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-plum">{p.item.vendorName ?? p.item.category}</p>
                          <p className={cn("text-xs font-medium", days < 0 ? "text-danger" : "text-plum/60")}>
                            {p.label} · {days < 0 ? `lewat ${-days} hari` : `${days} hari lagi`}
                          </p>
                        </div>
                        <p className="font-cute text-base font-semibold text-plum tabular-nums">{rupiahShort(p.amount)}</p>
                      </Card>
                    );
                  })
                ))}
              <Link href={tab === "tugas" ? "/checklist" : "/anggaran"} className="flex items-center justify-center gap-1 py-1 font-cute text-sm font-semibold text-primary hover:underline">
                Lihat semua <ArrowRight size={14} strokeWidth={2.8} />
              </Link>
            </div>
          </section>

          <motion.div {...bounce}>
            <Link href="/advisor" className="sticker relative block overflow-hidden rounded-[2rem] bg-candy-lilac p-5">
              <Floaty className="absolute top-4 right-5 w-9" duration={2.8}>
                <Sparkle />
              </Floaty>
              <Floaty className="absolute right-14 bottom-5 w-10" delay={0.6}>
                <Flower />
              </Floaty>
              <p className="flex items-center gap-1.5 font-cute text-sm font-semibold text-plum/70">
                <Sparkles size={15} /> AI Advisor
              </p>
              <p className="mt-1 max-w-[75%] font-cute text-2xl leading-tight font-semibold text-plum">Bingung urutan adat {adatLabel(wedding.adat)}?</p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full border-[2.5px] border-plum bg-white px-3 py-1 font-cute text-sm font-semibold text-plum">
                Tanya sekarang <ArrowRight size={14} strokeWidth={2.8} />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Hero({ state, done, overdue }: { state: AppState; done: number; overdue: number }) {
  const { wedding } = state;
  const today = todayISO();
  const days = wedding.date ? daysBetween(today, wedding.date) : null;
  const { mood, text } = days !== null && days >= 0 ? reaction(days) : { mood: "happy" as const, text: "Tanggalnya kapan, nih? Biar tenggatnya bisa dihitung." };

  return (
    <section className="sticker relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ffd9e8] via-candy-rose to-candy-pink p-5 sm:p-6">
      <Floaty className="absolute top-4 right-[42%] hidden w-8 sm:block" delay={0.4} duration={2.8}>
        <Sparkle />
      </Floaty>
      <Floaty className="absolute top-5 right-6 hidden w-9 sm:block" delay={1}>
        <Heart fill="#ffd45e" />
      </Floaty>
      <div className="relative flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-cute text-lg leading-tight font-semibold text-plum">{coupleName(wedding)}</p>
          {days !== null ? (
            <>
              <p className="mt-1 font-cute text-6xl leading-none font-semibold text-plum sm:text-7xl">
                <CountUp to={Math.max(days, 0)} />
              </p>
              <p className="font-cute text-lg font-medium text-plum">{days > 0 ? "hari lagi" : days === 0 ? "Hari ini!" : "Sudah menikah"}</p>
              <p className="mt-1 text-sm font-semibold text-plum/70">
                {formatDate(wedding.date, "long")} · {wedding.city}
              </p>
            </>
          ) : (
            <SetDate />
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border-2 border-plum bg-white px-2.5 py-0.5 text-xs font-bold text-plum">Adat {adatLabel(wedding.adat)}</span>
            <span className="rounded-full border-2 border-plum bg-white px-2.5 py-0.5 text-xs font-bold text-plum">{agamaLabel(wedding.agama)}</span>
            <span className="flex items-center gap-1 rounded-full border-2 border-plum bg-candy-mint px-2.5 py-0.5 text-xs font-bold text-plum">
              <Check size={12} strokeWidth={3.5} /> {done} selesai
            </span>
            {overdue > 0 && (
              <Link href="/checklist" className="flex items-center gap-1 rounded-full border-2 border-plum bg-candy-yellow px-2.5 py-0.5 text-xs font-bold text-plum">
                <CircleAlert size={12} strokeWidth={3} /> {overdue} terlambat
              </Link>
            )}
          </div>
        </div>
        <div className="w-32 shrink-0 sm:w-52">
          <Couple mood={mood} />
        </div>
      </div>
      <motion.p
        key={text}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 16, delay: 0.3 }}
        className="sticker-sm relative mt-3 rounded-2xl bg-white px-3.5 py-2 font-cute text-sm font-medium text-plum sm:text-base"
      >
        {text}
      </motion.p>
    </section>
  );
}

/** Pasangan yang belum punya tanggal bisa langsung mengisinya dari kartu utama. */
function SetDate() {
  const [date, setDate] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  function save() {
    if (!date) return;
    if (buttonRef.current) burstFrom(buttonRef.current, 24);
    updateState((s) =>
      withActivity(
        {
          ...s,
          wedding: { ...s.wedding, date },
          events: s.events.map((e) => (e.date ? e : { ...e, date })),
        },
        `Tanggal pernikahan ditetapkan: ${formatDate(date)}`,
      ),
    );
  }

  return (
    <div className="mt-2">
      <p className="flex items-center gap-1.5 font-cute text-2xl leading-tight font-semibold text-plum">
        <CalendarHeart size={22} className="shrink-0" /> Tanggalnya kapan?
      </p>
      <div className="mt-2 flex max-w-xs gap-2">
        <input type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} aria-label="Tanggal pernikahan" />
        <motion.button ref={buttonRef} {...bounce} onClick={save} disabled={!date} className="sticker-sm shrink-0 rounded-2xl bg-candy-yellow px-3.5 font-cute text-sm font-semibold text-plum disabled:opacity-50">
          Simpan
        </motion.button>
      </div>
    </div>
  );
}

/** Panduan langkah pertama untuk rencana baru. Hilang sendiri kalau semuanya sudah dikerjakan. */
function QuickStart({ state }: { state: AppState }) {
  const steps = [
    { done: !!state.wedding.date, title: "Tentukan tanggal", href: "/pengaturan", icon: CalendarHeart },
    { done: state.tasks.some((t) => t.done), title: "Centang tugas pertama", href: "/checklist", icon: ListChecks },
    { done: state.guests.length > 0, title: "Tambah tamu", href: "/tamu", icon: Users },
    { done: state.budget.some((b) => b.vendorName || b.payments.length > 0 || b.expenses.length > 0), title: "Catat vendor atau belanja", href: "/anggaran", icon: Wallet },
    { done: state.members.length > 1, title: "Undang pasangan", href: "/pengaturan", icon: UserPlus },
  ];
  const finished = steps.filter((s) => s.done).length;
  if (finished === steps.length) return null;

  return (
    <Reveal>
      <section className="sticker rounded-[2rem] bg-candy-yellow p-5">
        <div className="flex items-center gap-3">
          <IconTile tone="neutral">
            <Rocket size={20} strokeWidth={2.4} />
          </IconTile>
          <div className="min-w-0 flex-1">
            <h2 className="font-cute text-xl leading-tight font-semibold text-plum">Mulai dari sini, yuk!</h2>
            <p className="text-xs font-bold text-plum/70">
              {finished} dari {steps.length} langkah selesai
            </p>
          </div>
        </div>
        <div className="mt-3 h-3.5 overflow-hidden rounded-full border-2 border-plum bg-white">
          <motion.div className="h-full bg-candy-pink" initial={false} animate={{ width: `${(finished / steps.length) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {steps.map(({ done, title, href, icon: Icon }) => (
            <li key={title}>
              <Link href={href} className={cn("flex items-center gap-2.5 rounded-2xl border-[2.5px] border-plum px-3 py-2 transition hover:-translate-y-0.5", done ? "bg-white/50" : "bg-white")}>
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-plum", done ? "bg-candy-mint" : "bg-cream")}>
                  {done ? <Check size={14} strokeWidth={3.5} className="text-plum" /> : <Icon size={14} strokeWidth={2.6} className="text-plum" />}
                </span>
                <span className={cn("min-w-0 flex-1 text-sm font-bold text-plum", done && "line-through opacity-60")}>{title}</span>
                {!done && <ArrowRight size={15} strokeWidth={3} className="shrink-0 text-primary" />}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

function TaskRow({ task, state, onToggle }: { task: Task; state: AppState; onToggle: (id: string, el: Element | null) => void }) {
  const today = todayISO();
  const late = isOverdue(task, state.wedding, today);
  const pic = memberName(state, task.pic);
  const { icon: Icon, tone } = iconFor(task.title);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60, rotate: 3, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="sticker-sm flex items-center gap-3 rounded-3xl bg-paper p-2.5 pr-3"
    >
      <IconTile tone={late ? "danger" : tone}>{late ? <CircleAlert size={19} strokeWidth={2.4} /> : <Icon size={19} strokeWidth={2.2} />}</IconTile>
      <Link href="/checklist" className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-plum">{task.title}</p>
        <p className={cn("truncate text-xs font-medium", late ? "text-danger" : "text-plum/60")}>
          {dueLabel(task, state)}
          {pic && ` · ${titleCase(pic.split(" ")[0])}`}
        </p>
      </Link>
      <CheckButton checked={task.done} onClick={() => onToggle(task.id, ref.current)} label={`Tandai ${task.title} selesai`} />
    </motion.div>
  );
}

function StatCard({ href, icon, tone, label, pct, sub, children }: { href: string; icon: ReactNode; tone: Tone; label: string; pct?: number; sub: string; children: ReactNode }) {
  return (
    <motion.div {...bounce}>
      <Link href={href} className="sticker-sm block h-full rounded-3xl bg-paper p-3.5">
        <div className="flex items-center gap-2">
          <IconTile tone={tone} size="sm">
            {icon}
          </IconTile>
          <p className="truncate font-cute text-sm font-semibold text-plum">{label}</p>
        </div>
        <p className="mt-2.5 font-cute text-3xl leading-none font-semibold text-plum tabular-nums">{children}</p>
        {pct !== undefined && <Progress value={pct} tone={tone} className="mt-2.5" />}
        <p className="mt-1.5 truncate text-[11px] font-semibold text-plum/60">{sub}</p>
      </Link>
    </motion.div>
  );
}

function ToolTile({ href, color, icon, title, sub, rotate }: { href: string; color: string; icon: ReactNode; title: string; sub: string; rotate: number }) {
  return (
    <motion.div whileHover={{ y: -4, rotate }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}>
      <Link href={href} className={cn("sticker-sm block rounded-3xl p-3.5 text-plum", color)}>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] border-plum bg-white">{icon}</span>
        <p className="mt-2.5 font-cute text-lg leading-tight font-semibold">{title}</p>
        <p className="truncate text-xs font-semibold text-plum/70">{sub}</p>
      </Link>
    </motion.div>
  );
}
