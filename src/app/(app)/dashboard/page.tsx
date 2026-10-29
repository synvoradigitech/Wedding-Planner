"use client";

import { ArrowRight, Bell, Check, CircleAlert, Clock, ListChecks, Mail, Sparkles, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { countdownText, useApp } from "@/components/app-shell";
import { Avatar, Card, IconTile, Progress, Segmented, cn, type Tone } from "@/components/ui";
import { daysBetween, formatDate, rupiahShort, todayISO } from "@/lib/format";
import {
  budgetSummary,
  coupleName,
  guestSummary,
  hLabel,
  isOverdue,
  memberName,
  taskDaysBefore,
  taskDue,
  upcomingPayments,
} from "@/lib/selectors";
import { updateState, withActivity } from "@/lib/store";
import { adatLabel, agamaLabel } from "@/lib/templates";

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function DashboardPage() {
  const state = useApp();
  const { wedding } = state;
  const today = todayISO();
  const [tab, setTab] = useState<"tugas" | "bayar">("tugas");

  const done = state.tasks.filter((t) => t.done).length;
  const taskPct = state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0;
  const budget = budgetSummary(state);
  const guests = guestSummary(state);
  const payments = upcomingPayments(state, 30, today);
  const overdue = state.tasks.filter((t) => isOverdue(t, wedding, today));
  const nextTasks = state.tasks
    .filter((t) => !t.done)
    .sort((a, b) => (taskDue(a, wedding) ?? "9").localeCompare(taskDue(b, wedding) ?? "9"))
    .slice(0, 5);
  const me = state.members[0];
  const daysLeft = wedding.date ? daysBetween(today, wedding.date) : null;

  function toggle(id: string) {
    updateState((s) => {
      const task = s.tasks.find((t) => t.id === id)!;
      const next = { ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) };
      return task.done ? next : withActivity(next, `${s.members[0].name.split(" ")[0]} menandai "${task.title}" selesai`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar name={me.name} size="lg" />
        <div className="flex-1">
          <p className="text-xs text-muted">{greeting()},</p>
          <p className="font-display text-lg leading-tight">{coupleName(wedding)}</p>
        </div>
        <a href="#aktivitas" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink shadow-soft" aria-label="Aktivitas terbaru">
          <Bell size={19} />
          <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-primary ring-2 ring-paper" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-6">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[2rem] bg-brand p-6 text-white shadow-pop">
            <div className="bg-kawung absolute inset-0 opacity-40" />
            <RingsArt className="absolute -right-4 -bottom-6 h-44 w-44 sm:right-4 sm:h-52 sm:w-52" />
            <div className="relative max-w-[60%]">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
                <Sparkles size={14} /> Menuju hari bahagia
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight">
                {daysLeft !== null && daysLeft >= 0 ? daysLeft : "–"}
                <span className="ml-1.5 text-lg font-semibold">hari</span>
              </p>
              <p className="mt-1 text-sm text-white/85">
                {formatDate(wedding.date, "long")} · {wedding.city}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Check size={13} /> {done} selesai
                </span>
                {overdue.length > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                    <CircleAlert size={13} /> {overdue.length} terlambat
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Progres */}
          <section>
            <h2 className="mb-3 font-display text-base">Progres persiapan</h2>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <ProgressCard icon={<ListChecks size={16} />} tone="primary" label="Checklist" value={`${taskPct}`} unit="/100" sub={`${done} dari ${state.tasks.length} tugas`} pct={taskPct} />
              <ProgressCard icon={<Wallet size={16} />} tone="gold" label="Anggaran" value={rupiahShort(budget.spent)} sub={`dari ${rupiahShort(budget.total)}`} pct={(budget.spent / budget.total) * 100} />
              <ProgressCard icon={<Users size={16} />} tone="sage" label="Tamu hadir" value={`${guests.attending}`} unit=" org" sub={`${guests.pending} belum jawab`} pct={guests.pax ? (guests.attending / guests.pax) * 100 : 0} />
              <ProgressCard icon={<Clock size={16} />} tone="violet" label="Jatuh tempo" value={rupiahShort(payments.reduce((s, p) => s + p.amount, 0))} sub={`${payments.length} tagihan 30 hari`} />
            </div>
          </section>

          {/* Alat */}
          <section>
            <h2 className="mb-3 font-display text-base">Alat persiapan</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ToolTile href="/anggaran" tone="gold" icon={<Wallet size={24} />} title="Anggaran" sub={`${rupiahShort(budget.remaining)} sisa`} />
              <ToolTile href="/tamu" tone="violet" icon={<Users size={24} />} title="Daftar tamu" sub={`${guests.invitations} undangan`} />
              <ToolTile href="/undangan" tone="primary" icon={<Mail size={24} />} title="Undangan" sub={state.invitation.published ? "Sudah terbit" : "Masih draf"} />
              <ToolTile href="/rundown" tone="sky" icon={<Clock size={24} />} title="Rundown" sub={`${state.events.length} acara`} />
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-6">
          {/* Tugas & pembayaran */}
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
              {tab === "tugas" &&
                nextTasks.map((t) => {
                  const late = isOverdue(t, wedding, today);
                  const pic = memberName(state, t.pic);
                  return (
                    <Card key={t.id} className="flex items-center gap-3 p-3 pr-4">
                      <IconTile tone={late ? "danger" : "primary"}>{late ? <CircleAlert size={19} /> : <ListChecks size={19} />}</IconTile>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{t.title}</p>
                        <p className={cn("text-xs", late ? "font-medium text-danger" : "text-muted")}>
                          {hLabel(taskDaysBefore(t, wedding))} · {formatDate(taskDue(t, wedding))}
                          {pic && ` · ${pic.split(" ")[0]}`}
                        </p>
                      </div>
                      <button
                        onClick={() => toggle(t.id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-line-strong text-transparent transition hover:border-primary hover:text-primary"
                        aria-label={`Tandai ${t.title} selesai`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                    </Card>
                  );
                })}
              {tab === "bayar" &&
                (payments.length === 0 ? (
                  <Card className="p-6 text-center text-sm text-muted">Tidak ada tagihan dalam 30 hari.</Card>
                ) : (
                  payments.map((p) => (
                    <Card key={p.id} className="flex items-center gap-3 p-3 pr-4">
                      <IconTile tone="gold">
                        <Wallet size={19} />
                      </IconTile>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.item.vendorName ?? p.item.category}</p>
                        <p className={cn("text-xs", p.dueDate < today ? "text-danger" : "text-muted")}>
                          {p.label} · {formatDate(p.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold tabular-nums">{rupiahShort(p.amount)}</p>
                        <p className="text-[10px] font-semibold text-primary">{daysBetween(today, p.dueDate)} hari lagi</p>
                      </div>
                    </Card>
                  ))
                ))}
              <Link href={tab === "tugas" ? "/checklist" : "/anggaran"} className="flex items-center justify-center gap-1 py-1 text-xs font-semibold text-primary">
                Lihat semua <ArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* Banner AI */}
          <Link href="/advisor" className="relative block overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#c084fc] via-[#e879b9] to-primary p-5 text-white shadow-pop">
            <div className="orb absolute -right-8 -bottom-10 h-36 w-36" />
            <p className="relative text-xs font-semibold text-white/80">AI Advisor</p>
            <p className="relative mt-1 max-w-[60%] text-xl leading-snug font-bold">
              Bingung urutan adat {adatLabel(wedding.adat)}?
            </p>
            <span className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary">
              Tanya sekarang <ArrowRight size={13} />
            </span>
          </Link>

          <Card className="p-5">
            <h2 id="aktivitas" className="mb-3 scroll-mt-24 font-display text-base">
              Aktivitas terbaru
            </h2>
            <ul className="space-y-3">
              {state.activity.slice(0, 5).map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blush" />
                  <span className="flex-1">{a.text}</span>
                  <span className="shrink-0 text-xs text-muted">{formatDate(a.at.slice(0, 10))}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Adat {adatLabel(wedding.adat)} · {agamaLabel(wedding.agama)} · {countdownText(state)}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProgressCard({
  icon,
  tone,
  label,
  value,
  unit,
  sub,
  pct,
}: {
  icon: ReactNode;
  tone: Tone;
  label: string;
  value: string;
  unit?: string;
  sub: string;
  pct?: number;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <IconTile tone={tone} size="sm">
          {icon}
        </IconTile>
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight tabular-nums">
        {value}
        {unit && <span className="text-sm font-semibold text-muted">{unit}</span>}
      </p>
      {pct !== undefined && <Progress value={pct} tone={tone} className="mt-2" />}
      <p className="mt-1.5 text-[11px] text-muted">{sub}</p>
    </Card>
  );
}

function ToolTile({ href, tone, icon, title, sub }: { href: string; tone: Tone; icon: ReactNode; title: string; sub: string }) {
  return (
    <Link href={href} className="group rounded-3xl bg-paper p-4 shadow-soft transition hover:-translate-y-0.5">
      <IconTile tone={tone} size="lg">
        {icon}
      </IconTile>
      <p className="mt-3 text-sm font-bold">{title}</p>
      <p className="text-xs text-muted">{sub}</p>
    </Link>
  );
}

/** Ilustrasi sepasang cincin mengilap untuk kartu hero. */
function RingsArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="ring-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#ffd6e7" />
          <stop offset="1" stopColor="#ffb0d0" />
        </linearGradient>
        <linearGradient id="ring-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset="0.6" stopColor="#ffd59e" />
          <stop offset="1" stopColor="#ffb36b" />
        </linearGradient>
        <radialGradient id="gem" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#ffe3f0" />
          <stop offset="1" stopColor="#f6a8ff" />
        </radialGradient>
      </defs>
      <circle cx="82" cy="118" r="46" fill="none" stroke="url(#ring-a)" strokeWidth="14" />
      <circle cx="128" cy="110" r="42" fill="none" stroke="url(#ring-b)" strokeWidth="12" />
      <path d="M82 72 C 70 60, 70 50, 82 42 C 94 50, 94 60, 82 72 Z" fill="url(#gem)" />
      <path d="M160 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#fff" opacity="0.9" />
      <path d="M40 50 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 Z" fill="#fff" opacity="0.7" />
    </svg>
  );
}
