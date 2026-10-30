"use client";

import { useState, type FormEvent } from "react";
import type { Guest } from "@/lib/types";
import { cn } from "./ui";

export interface RsvpInput {
  name: string;
  attending: boolean;
  count: number;
  message: string;
}

export interface RsvpTheme {
  panel: string;
  accent: string;
  muted: string;
  button: string;
  field: string;
}

export function RsvpForm({
  guest,
  mode,
  theme: t,
  onRsvp,
}: {
  guest?: Guest | null;
  mode: "preview" | "live";
  theme: RsvpTheme;
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
