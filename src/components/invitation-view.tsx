"use client";

import { CalendarDays, Clock, Heart, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";
import { APP_NAME } from "@/lib/brand";
import { daysBetween, formatDate, todayISO } from "@/lib/format";
import type { AppState, Guest, InvitationTemplate } from "@/lib/types";
import { cn } from "./ui";

const THEMES: Record<InvitationTemplate, { page: string; panel: string; accent: string; muted: string; button: string; line: string; field: string }> = {
  melati: {
    page: "bg-[#fbf7f1] text-[#2b2320]",
    panel: "bg-white/80 border-[#ece2d6]",
    accent: "text-[#8e3b4a]",
    muted: "text-[#7a6e68]",
    button: "bg-[#8e3b4a] text-white",
    line: "bg-[#a87a2c]",
    field: "border-[#dccfbf] bg-white",
  },
  sage: {
    page: "bg-[#eef3ee] text-[#26322a]",
    panel: "bg-white/80 border-[#d5e0d6]",
    accent: "text-[#46664f]",
    muted: "text-[#62706a]",
    button: "bg-[#46664f] text-white",
    line: "bg-[#8fae95]",
    field: "border-[#c6d4c8] bg-white",
  },
  malam: {
    page: "bg-[#1d2231] text-[#f4ecdf]",
    panel: "bg-white/5 border-white/10",
    accent: "text-[#d9b46a]",
    muted: "text-[#b9b2a6]",
    button: "bg-[#d9b46a] text-[#1d2231]",
    line: "bg-[#d9b46a]",
    field: "border-white/20 bg-white/10 text-[#f4ecdf]",
  },
};

export interface RsvpInput {
  name: string;
  attending: boolean;
  count: number;
  message: string;
}

export function InvitationView({
  state,
  guest,
  mode,
  onRsvp,
}: {
  state: AppState;
  guest?: Guest | null;
  mode: "preview" | "live";
  onRsvp?: (input: RsvpInput) => void;
}) {
  const { wedding, invitation, events } = state;
  const t = THEMES[invitation.template];
  const [opened, setOpened] = useState(mode === "preview");
  const daysLeft = wedding.date ? daysBetween(todayISO(), wedding.date) : null;
  const visibleEvents = guest ? events.filter((e) => guest.eventIds.includes(e.id)) : events;

  return (
    <div className={cn("min-h-full font-sans", t.page)}>
      <section
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center",
          mode === "live" && !opened ? "min-h-svh" : "min-h-[560px]",
        )}
      >
        <div className="bg-kawung absolute inset-0 opacity-70" />
        <div className="relative">
          <p className={cn("text-xs tracking-[0.3em] uppercase", t.muted)}>Undangan Pernikahan</p>
          <h1 className={cn("mt-6 font-serif text-5xl leading-tight font-medium italic", t.accent)}>
            {wedding.brideName}
            <span className="block text-3xl not-italic">&amp;</span>
            {wedding.groomName}
          </h1>
          <div className={cn("mx-auto my-6 h-px w-16", t.line)} />
          <p className="text-sm">{formatDate(wedding.date, "weekday")}</p>
          {guest && (
            <div className="mt-10">
              <p className={cn("text-xs", t.muted)}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="mt-1 text-lg font-semibold">{guest.name}</p>
            </div>
          )}
          {!opened && (
            <button onClick={() => setOpened(true)} className={cn("mt-8 rounded-full px-6 py-2.5 text-sm font-medium shadow-sm", t.button)}>
              Buka undangan
            </button>
          )}
        </div>
      </section>

      {opened && (
        <div className="space-y-12 px-6 pb-12">
          <section className="mx-auto max-w-md text-center">
            <p className="text-sm leading-relaxed">{invitation.opening}</p>
            <p className={cn("mt-6 font-serif text-3xl italic", t.accent)}>
              {wedding.brideName} &amp; {wedding.groomName}
            </p>
          </section>

          {invitation.quote && (
            <section className={cn("mx-auto max-w-md rounded-3xl border px-6 py-6 text-center", t.panel)}>
              <p className="font-serif text-base leading-relaxed italic">“{invitation.quote}”</p>
              <p className={cn("mt-3 text-xs", t.muted)}>{invitation.quoteSource}</p>
            </section>
          )}

          {daysLeft !== null && daysLeft >= 0 && (
            <section className="text-center">
              <p className={cn("font-serif text-6xl", t.accent)}>{daysLeft}</p>
              <p className={cn("text-sm", t.muted)}>hari menuju hari bahagia</p>
            </section>
          )}

          <section className="mx-auto max-w-md space-y-4">
            {visibleEvents.map((e) => (
              <div key={e.id} className={cn("rounded-3xl border px-6 py-5 text-center", t.panel)}>
                <h3 className={cn("font-serif text-2xl", t.accent)}>{e.name}</h3>
                <p className="mt-3 flex items-center justify-center gap-2 text-sm">
                  <CalendarDays size={15} /> {formatDate(e.date, "weekday")}
                </p>
                <p className="mt-1 flex items-center justify-center gap-2 text-sm">
                  <Clock size={15} /> {e.start}–{e.end} WIB
                </p>
                <p className="mt-3 font-semibold">{e.venue || "Lokasi menyusul"}</p>
                <p className={cn("text-sm", t.muted)}>{e.address}</p>
                {e.mapsUrl && (
                  <a href={e.mapsUrl} target="_blank" rel="noreferrer" className={cn("mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium", t.button)}>
                    <MapPin size={14} /> Lihat peta
                  </a>
                )}
              </div>
            ))}
          </section>

          <RsvpForm guest={guest} mode={mode} theme={t} onRsvp={onRsvp} />

          {state.wishes.length > 0 && (
            <section className="mx-auto max-w-md">
              <h3 className={cn("mb-4 text-center font-serif text-2xl", t.accent)}>Ucapan &amp; doa</h3>
              <ul className="space-y-3">
                {state.wishes.slice(0, 8).map((w) => (
                  <li key={w.id} className={cn("rounded-2xl border px-4 py-3", t.panel)}>
                    <p className="text-sm font-semibold">{w.name}</p>
                    <p className={cn("mt-0.5 text-sm", t.muted)}>{w.message}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mx-auto max-w-md text-center">
            <p className="text-sm leading-relaxed">{invitation.closing}</p>
            <Heart className={cn("mx-auto mt-6", t.accent)} size={20} />
            <p className={cn("mt-2 font-serif text-2xl italic", t.accent)}>
              {wedding.brideName} &amp; {wedding.groomName}
            </p>
          </section>

          <p className={cn("text-center text-[11px]", t.muted)}>Dibuat dengan {APP_NAME}</p>
        </div>
      )}
    </div>
  );
}

function RsvpForm({
  guest,
  mode,
  theme: t,
  onRsvp,
}: {
  guest?: Guest | null;
  mode: "preview" | "live";
  theme: (typeof THEMES)[InvitationTemplate];
  onRsvp?: (input: RsvpInput) => void;
}) {
  const answered = guest && guest.rsvp.status !== "pending";
  const [name, setName] = useState(guest?.name ?? "");
  const [attending, setAttending] = useState(guest?.rsvp.status !== "tidak");
  const [count, setCount] = useState(Math.max(1, guest?.rsvp.count || guest?.pax || 1));
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const maxPax = guest?.pax ?? 4;
  const disabled = mode === "preview";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (disabled || !name.trim()) return;
    onRsvp?.({ name: name.trim(), attending, count: attending ? count : 0, message: message.trim() });
    setSent(true);
  }

  const fieldClass = cn("w-full rounded-xl border px-3 py-2 text-sm focus:outline-none", t.field);

  return (
    <section className={cn("mx-auto max-w-md rounded-3xl border px-6 py-6", t.panel)}>
      <h3 className={cn("text-center font-serif text-2xl", t.accent)}>Konfirmasi kehadiran</h3>
      {sent ? (
        <p className="mt-4 text-center text-sm">Terima kasih! Konfirmasi Anda sudah kami terima.</p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          {answered && <p className={cn("text-center text-xs", t.muted)}>Anda sudah mengonfirmasi. Kirim lagi untuk mengubah jawaban.</p>}
          {!guest && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className={fieldClass} disabled={disabled} />}
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <button
                type="button"
                key={String(v)}
                disabled={disabled}
                onClick={() => setAttending(v)}
                className={cn("rounded-xl border px-3 py-2 text-sm font-medium", attending === v ? t.button : t.field)}
              >
                {v ? "Hadir" : "Tidak hadir"}
              </button>
            ))}
          </div>
          {attending && (
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={fieldClass} disabled={disabled} aria-label="Jumlah orang">
              {Array.from({ length: maxPax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} orang
                </option>
              ))}
            </select>
          )}
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Tulis ucapan dan doa (opsional)" className={fieldClass} disabled={disabled} />
          <button type="submit" disabled={disabled} className={cn("w-full rounded-full py-2.5 text-sm font-medium disabled:opacity-60", t.button)}>
            Kirim konfirmasi
          </button>
          {disabled && <p className={cn("text-center text-xs", t.muted)}>Pratinjau: form RSVP aktif setelah undangan diterbitkan.</p>}
        </form>
      )}
    </section>
  );
}
