"use client";

import { CalendarDays, Clock, MapPin, Plus, Printer, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/app-shell";
import { Button, Card, EmptyState, Field, HeroCard, Modal, Segmented, cn, inputClass } from "@/components/ui";
import { formatDate, uid } from "@/lib/format";
import { updateState } from "@/lib/store";
import { RUNDOWN_TEMPLATES, adatLabel } from "@/lib/templates";
import type { RundownItem } from "@/lib/types";

const DOT_COLORS = ["bg-primary", "bg-violet", "bg-gold", "bg-sky", "bg-sage"];

export default function RundownPage() {
  const state = useApp();
  const [eventId, setEventId] = useState(state.events[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const event = state.events.find((e) => e.id === eventId) ?? state.events[0];

  if (!event) {
    return (
      <Card>
        <EmptyState icon={<Clock size={24} />} title="Belum ada acara">
          Tambahkan acara di menu Undangan.
        </EmptyState>
      </Card>
    );
  }

  const items = [...event.rundown].sort((a, b) => a.start.localeCompare(b.start));
  const template = RUNDOWN_TEMPLATES[event.name];

  function setRundown(rundown: RundownItem[]) {
    updateState((s) => ({ ...s, events: s.events.map((e) => (e.id === event.id ? { ...e, rundown } : e)) }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Rundown hari H</h1>
          <p className="text-xs text-muted">Template mengikuti adat {adatLabel(state.wedding.adat)}</p>
        </div>
        <div className="no-print flex gap-2">
          <Button variant="secondary" onClick={() => window.print()} aria-label="Cetak atau simpan PDF">
            <Printer size={18} /> <span className="hidden sm:inline">Cetak / PDF</span>
          </Button>
          <Button onClick={() => setAdding(true)} aria-label="Tambah susunan acara">
            <Plus size={18} /> <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>
      </div>

      <div className="no-print">
        <Segmented value={event.id} onChange={setEventId} options={state.events.map((e) => ({ value: e.id, label: e.name }))} />
      </div>

      <HeroCard>
        <p className="text-xs font-semibold text-white/80">Sesi acara</p>
        <p className="text-3xl font-extrabold tracking-tight">{event.name}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
            <CalendarDays size={13} /> {formatDate(event.date, "weekday")}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
            <Clock size={13} /> {event.start}–{event.end} WIB
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-primary">
            <MapPin size={13} /> {event.venue || "Tempat belum diisi"}
          </span>
        </div>
      </HeroCard>

      {items.length === 0 ? (
        <Card>
          <EmptyState icon={<Clock size={24} />} title="Susunan acara masih kosong">
            {template ? (
              <Button size="sm" className="mt-3" onClick={() => setRundown(template.map((r) => ({ ...r, id: uid() })))}>
                Pakai template {event.name}
              </Button>
            ) : (
              "Tambahkan susunan acara satu per satu."
            )}
          </EmptyState>
        </Card>
      ) : (
        <ol className="relative space-y-3">
          <span className="absolute top-6 bottom-6 left-[calc(0.75rem-1px)] w-0.5 rounded-full bg-gradient-to-b from-blush via-primary/40 to-violet/40 sm:left-[calc(2.1rem-1px)]" aria-hidden />
          {items.map((r, i) => (
            <li key={r.id} className="group relative flex items-stretch gap-3 sm:gap-4">
              <div className="relative z-10 flex w-6 shrink-0 flex-col items-center sm:w-[4.2rem]">
                <span className={cn("mt-5 h-3.5 w-3.5 rounded-full ring-4 ring-ivory", DOT_COLORS[i % DOT_COLORS.length])} />
              </div>
              <Card className="flex min-w-0 flex-1 items-start gap-3 p-4">
                <div className="shrink-0 rounded-2xl bg-primary-soft px-2.5 py-1.5 text-center">
                  <p className="text-sm font-extrabold text-primary tabular-nums">{r.start}</p>
                  <p className="text-[10px] font-semibold text-primary/70 tabular-nums">{r.end}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{r.activity}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {r.pic}
                    </span>
                    {r.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {r.location}
                      </span>
                    )}
                  </p>
                  {r.note && <p className="mt-2 rounded-xl bg-ivory px-3 py-1.5 text-xs">{r.note}</p>}
                </div>
                <button
                  onClick={() => setRundown(event.rundown.filter((x) => x.id !== r.id))}
                  className="no-print rounded-full p-1.5 text-muted transition hover:bg-danger-soft hover:text-danger sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                  aria-label={`Hapus ${r.activity}`}
                >
                  <Trash2 size={15} />
                </button>
              </Card>
            </li>
          ))}
        </ol>
      )}

      {adding && <AddItemModal onClose={() => setAdding(false)} onSave={(r) => setRundown([...event.rundown, r])} />}
    </div>
  );
}

function AddItemModal({ onClose, onSave }: { onClose: () => void; onSave: (r: RundownItem) => void }) {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("09:30");
  const [activity, setActivity] = useState("");
  const [pic, setPic] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  function save() {
    if (!activity.trim()) return;
    onSave({ id: uid(), start, end, activity: activity.trim(), pic: pic.trim() || "-", location: location.trim() || undefined, note: note.trim() || undefined });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Tambah susunan acara"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={save} disabled={!activity.trim()}>
            Simpan
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Mulai">
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Selesai">
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Kegiatan">
          <input autoFocus value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Mis. Panggih (temu pengantin)" className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="PIC">
            <input value={pic} onChange={(e) => setPic(e.target.value)} placeholder="MC, WO, keluarga" className={inputClass} />
          </Field>
          <Field label="Lokasi">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Opsional" className={inputClass} />
          </Field>
        </div>
        <Field label="Catatan">
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
        </Field>
      </div>
    </Modal>
  );
}
