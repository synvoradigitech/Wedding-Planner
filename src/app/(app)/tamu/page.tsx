"use client";

import { Check, Copy, Pencil, Search, Share2, Upload, UserPlus } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/app-shell";
import { PremiumModal } from "@/components/premium-modal";
import { Avatar, Badge, Button, Card, EmptyState, Field, HeroCard, Modal, ProgressRing, Segmented, cn, inputClass } from "@/components/ui";
import { slugify, uid } from "@/lib/format";
import { coupleName, guestSummary, inviteUrl } from "@/lib/selectors";
import { updateState, withActivity } from "@/lib/store";
import { GUEST_GROUPS } from "@/lib/templates";
import type { Guest, RsvpStatus } from "@/lib/types";

const RSVP_LABEL: Record<RsvpStatus, { label: string; tone: "sage" | "danger" | "neutral" }> = {
  hadir: { label: "Hadir", tone: "sage" },
  tidak: { label: "Tidak hadir", tone: "danger" },
  pending: { label: "Belum jawab", tone: "neutral" },
};

export default function TamuPage() {
  const state = useApp();
  const summary = guestSummary(state);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("semua");
  const [status, setStatus] = useState<RsvpStatus | "semua">("semua");
  const [editing, setEditing] = useState<Guest | "new" | null>(null);
  const [importing, setImporting] = useState(false);
  const [upsell, setUpsell] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const groups = Array.from(new Set([...GUEST_GROUPS, ...state.guests.map((g) => g.group)]));
  const groupCounts = groups.map((name) => ({ name, count: state.guests.filter((g) => g.group === name).length })).filter((g) => g.count > 0);
  const answeredPct = summary.invitations ? ((summary.invitations - summary.pending) / summary.invitations) * 100 : 0;
  const visible = state.guests.filter(
    (g) =>
      g.name.toLowerCase().includes(query.toLowerCase()) &&
      (group === "semua" || g.group === group) &&
      (status === "semua" || g.rsvp.status === status),
  );

  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  }

  function canShare() {
    if (state.wedding.plan !== "premium") {
      setUpsell("Tautan undangan personal dan RSVP adalah fitur Premium.");
      return false;
    }
    if (!state.invitation.published) {
      showToast("Terbitkan undangan dulu di menu Undangan");
      return false;
    }
    return true;
  }

  async function copyLink(g: Guest) {
    if (!canShare()) return;
    await navigator.clipboard?.writeText(inviteUrl(state, g));
    showToast(`Tautan untuk ${g.name} tersalin`);
  }

  function shareWa(g: Guest) {
    if (!canShare()) return;
    const text = `Kepada Yth. ${g.name},\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i ke acara pernikahan ${coupleName(state.wedding)}.\n\nInfo lengkap dan konfirmasi kehadiran:\n${inviteUrl(state, g)}\n\nTerima kasih.`;
    const phone = g.phone.replace(/\D/g, "").replace(/^0/, "62");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-3xl">Daftar tamu</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setImporting(true)} aria-label="Impor CSV">
            <Upload size={18} /> <span className="hidden sm:inline">Impor CSV</span>
          </Button>
          <Button onClick={() => setEditing("new")} aria-label="Tambah tamu">
            <UserPlus size={18} /> <span className="hidden sm:inline">Tambah tamu</span>
          </Button>
        </div>
      </div>

      <HeroCard>
        <div className="flex items-center gap-5">
          <ProgressRing value={answeredPct}>
            <span className="text-lg font-extrabold">{Math.round(answeredPct)}%</span>
            <span className="text-[10px] text-white/80">menjawab</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white/80">Akan hadir</p>
            <p className="text-4xl font-extrabold tracking-tight">
              {summary.attending}
              <span className="text-base font-semibold text-white/80"> orang</span>
            </p>
            <p className="text-sm text-white/80">
              {summary.invitations} undangan · {summary.pax} pax
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Hadir", value: summary.attendingInvites, key: "hadir" as const },
            { label: "Tidak", value: summary.declined, key: "tidak" as const },
            { label: "Belum", value: summary.pending, key: "pending" as const },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setStatus(status === s.key ? "semua" : s.key)}
              className={cn("rounded-2xl py-2 transition", status === s.key ? "bg-white text-primary" : "bg-white/15 hover:bg-white/25")}
            >
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-[11px] font-semibold opacity-80">{s.label}</p>
            </button>
          ))}
        </div>
      </HeroCard>

      <div className="space-y-3">
        <div className="relative">
          <Search size={17} className="absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama tamu"
            className="w-full rounded-full bg-paper py-3 pr-4 pl-11 text-sm shadow-soft placeholder:text-muted/70 focus:ring-4 focus:ring-primary/10 focus:outline-none"
          />
        </div>
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { value: "semua", label: "Semua" },
            { value: "hadir", label: "Hadir" },
            { value: "tidak", label: "Tidak hadir" },
            { value: "pending", label: "Belum jawab" },
          ]}
        />
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[{ name: "semua", count: state.guests.length }, ...groupCounts].map((g) => (
            <button
              key={g.name}
              onClick={() => setGroup(g.name)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                group === g.name ? "bg-ink text-white" : "bg-paper text-muted shadow-soft",
              )}
            >
              {g.name === "semua" ? "Semua grup" : g.name}
              <span className={cn("rounded-full px-1.5 text-[10px]", group === g.name ? "bg-white/20" : "bg-ivory")}>{g.count}</span>
            </button>
          ))}
        </div>
      </div>

      {state.guests.length === 0 ? (
        <Card>
          <EmptyState icon={<UserPlus size={24} />} title="Belum ada tamu">
            Tambah satu per satu atau impor dari file CSV/Excel.
          </EmptyState>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">Tidak ada tamu yang cocok.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {visible.map((g, i) => (
            <Card key={g.id} className="flex items-center gap-3 p-3 pr-3.5">
              <Avatar name={g.name.replace(/^(Bapak|Ibu|Om|Tante|Pakde|Bulik)\s+/i, "")} index={i} size="lg" />
              <button onClick={() => setEditing(g)} className="min-w-0 flex-1 text-left">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="truncate">{g.name}</span>
                  {g.category === "VIP" && <Badge tone="gold">VIP</Badge>}
                </p>
                <p className="truncate text-xs text-muted">
                  {g.group} · {g.rsvp.status === "hadir" ? `${g.rsvp.count}/${g.pax}` : g.pax} pax
                </p>
                <Badge tone={RSVP_LABEL[g.rsvp.status].tone} className="mt-1">
                  {RSVP_LABEL[g.rsvp.status].label}
                </Badge>
              </button>
              <div className="flex flex-col gap-1.5 sm:flex-row">
                <button onClick={() => copyLink(g)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-muted hover:text-primary" aria-label={`Salin tautan ${g.name}`}>
                  <Copy size={15} />
                </button>
                <button onClick={() => shareWa(g)} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-pop" aria-label={`Kirim undangan ke ${g.name} via WhatsApp`}>
                  <Share2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed inset-x-0 bottom-28 z-40 flex justify-center px-4 lg:bottom-8">
          <p className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-2xl">
            <Check size={15} /> {toast}
          </p>
        </div>
      )}

      {editing && <GuestForm key={editing === "new" ? "new" : editing.id} guest={editing === "new" ? null : editing} groups={groups} onClose={() => setEditing(null)} />}
      <ImportModal open={importing} onClose={() => setImporting(false)} />
      <PremiumModal open={upsell !== null} onClose={() => setUpsell(null)} reason={upsell ?? undefined} />
    </div>
  );
}

function GuestForm({ guest, groups, onClose }: { guest: Guest | null; groups: string[]; onClose: () => void }) {
  const state = useApp();
  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [group, setGroup] = useState(guest?.group ?? groups[0]);
  const [pax, setPax] = useState(guest?.pax ?? 2);
  const [vip, setVip] = useState(guest?.category === "VIP");
  const [eventIds, setEventIds] = useState<string[]>(guest?.eventIds ?? state.events.map((e) => e.id));

  function save() {
    if (!name.trim()) return;
    const fields = { name: name.trim(), phone: phone.trim(), group, pax, category: vip ? ("VIP" as const) : ("Reguler" as const), eventIds };
    updateState((s) =>
      guest
        ? { ...s, guests: s.guests.map((g) => (g.id === guest.id ? { ...g, ...fields } : g)) }
        : withActivity(
            { ...s, guests: [...s.guests, { id: uid(), slug: slugify(fields.name) + "-" + uid().slice(0, 3), rsvp: { status: "pending", count: 0 }, ...fields }] },
            `${s.members[0].name.split(" ")[0]} menambahkan tamu ${fields.name}`,
          ),
    );
    onClose();
  }

  function remove() {
    if (!guest) return;
    updateState((s) => ({ ...s, guests: s.guests.filter((g) => g.id !== guest.id) }));
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={guest ? "Ubah tamu" : "Tambah tamu"}
      footer={
        <>
          {guest && (
            <Button variant="danger" className="mr-auto" onClick={remove}>
              Hapus
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={save} disabled={!name.trim()}>
            Simpan
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nama">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="No. WhatsApp">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08…" className={inputClass} />
          </Field>
          <Field label="Jumlah orang (pax)">
            <input type="number" min={1} max={10} value={pax} onChange={(e) => setPax(Number(e.target.value))} className={inputClass} />
          </Field>
        </div>
        <Field label="Grup">
          <input list="guest-groups" value={group} onChange={(e) => setGroup(e.target.value)} className={inputClass} />
          <datalist id="guest-groups">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </Field>
        <div>
          <p className="mb-1 text-sm font-medium">Diundang ke</p>
          <div className="flex flex-wrap gap-2">
            {state.events.map((e) => (
              <label key={e.id} className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={eventIds.includes(e.id)}
                  onChange={() => setEventIds((ids) => (ids.includes(e.id) ? ids.filter((x) => x !== e.id) : [...ids, e.id]))}
                />
                {e.name}
              </label>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-primary" checked={vip} onChange={(e) => setVip(e.target.checked)} /> Tamu VIP
        </label>
        {guest && guest.rsvp.status !== "pending" && (
          <p className="flex items-center gap-2 rounded-xl bg-ivory px-3 py-2 text-xs text-muted">
            <Pencil size={12} /> RSVP diisi tamu: {RSVP_LABEL[guest.rsvp.status].label}
            {guest.rsvp.status === "hadir" && `, ${guest.rsvp.count} orang`}
          </p>
        )}
      </div>
    </Modal>
  );
}

const CSV_SAMPLE = "nama,whatsapp,grup,pax\nBapak Joko,081234500001,Keluarga mempelai pria,2\nDewi Anggraini,081234500002,Teman kantor,1";

function ImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const state = useApp();
  const [text, setText] = useState(CSV_SAMPLE);
  const [result, setResult] = useState<string | null>(null);

  function runImport() {
    const rows = text
      .split(/\r?\n/)
      .map((l) => l.split(/[,;\t]/).map((c) => c.trim()))
      .filter((r) => r[0] && r[0].toLowerCase() !== "nama");
    const existingPhones = new Set(state.guests.map((g) => g.phone.replace(/\D/g, "")));
    const fresh: Guest[] = [];
    let duplicates = 0;
    for (const [name, phone = "", group = "Lainnya", pax = "1"] of rows) {
      const key = phone.replace(/\D/g, "");
      if (key && existingPhones.has(key)) {
        duplicates++;
        continue;
      }
      existingPhones.add(key);
      fresh.push({
        id: uid(),
        name,
        phone,
        group,
        pax: Math.max(1, Number(pax) || 1),
        category: "Reguler",
        eventIds: state.events.map((e) => e.id),
        slug: `${slugify(name)}-${uid().slice(0, 3)}`,
        rsvp: { status: "pending", count: 0 },
      });
    }
    updateState((s) => withActivity({ ...s, guests: [...s.guests, ...fresh] }, `${fresh.length} tamu diimpor dari CSV`));
    setResult(`${fresh.length} tamu ditambahkan${duplicates ? `, ${duplicates} dilewati karena nomor sudah ada` : ""}.`);
  }

  function close() {
    setResult(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Impor tamu dari CSV"
      footer={
        result ? (
          <Button onClick={close}>Selesai</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={close}>
              Batal
            </Button>
            <Button onClick={runImport}>Impor</Button>
          </>
        )
      }
    >
      {result ? (
        <p className="rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage">{result}</p>
      ) : (
        <Field label="Tempel isi CSV/Excel" hint="Kolom: nama, whatsapp, grup, pax. Nomor yang sudah ada ditandai duplikat dan dilewati.">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className={cn(inputClass, "font-mono text-xs")} />
        </Field>
      )}
    </Modal>
  );
}
