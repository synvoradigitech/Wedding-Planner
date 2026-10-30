"use client";

import { Check, Crown, RotateCcw, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useApp } from "@/components/app-shell";
import { PremiumModal } from "@/components/premium-modal";
import { Avatar, Badge, Button, Card, Field, PageHeader, cn, inputClass } from "@/components/ui";
import { PREMIUM_PRICE } from "@/lib/brand";
import { rupiah, uid } from "@/lib/format";
import { resetDemo, updateState, withActivity } from "@/lib/store";
import { ADAT_OPTIONS, AGAMA_OPTIONS } from "@/lib/templates";
import type { ModuleId, Role, Wedding } from "@/lib/types";

const MODULES: { id: ModuleId; label: string }[] = [
  { id: "checklist", label: "Checklist" },
  { id: "anggaran", label: "Anggaran" },
  { id: "tamu", label: "Tamu" },
  { id: "undangan", label: "Undangan" },
  { id: "rundown", label: "Rundown" },
];

const ROLE_LABEL: Record<Role, string> = { owner: "Pemilik", editor: "Editor", viewer: "Hanya lihat" };

export default function PengaturanPage() {
  const state = useApp();
  const [upsell, setUpsell] = useState(false);

  return (
    <>
      <PageHeader title="Pengaturan" description="Profil pernikahan, kolaborator, dan paket." />
      <div className="space-y-6">
        <ProfileForm key={JSON.stringify(state.wedding)} wedding={state.wedding} />
        <Members />

        <Card className="p-5" >
          <h2 id="paket" className="mb-4 scroll-mt-24 font-semibold">
            Paket
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <PlanCard
              name="Starter"
              price="Gratis"
              active={state.wedding.plan === "starter"}
              features={["Checklist otomatis per adat", "Anggaran, cicilan, pengeluaran", "Daftar tamu dan impor CSV", "Pratinjau undangan digital", "5 pertanyaan AI Advisor"]}
            />
            <PlanCard
              name="Premium"
              price={`${rupiah(PREMIUM_PRICE)} sekali bayar`}
              highlight
              active={state.wedding.plan === "premium"}
              features={["Semua fitur Starter", "Terbitkan undangan dan terima RSVP", "Tautan personal per tamu", "Grafik anggaran rinci", "50 pertanyaan AI Advisor"]}
              action={
                state.wedding.plan === "starter" && (
                  <Button variant="gold" className="w-full" onClick={() => setUpsell(true)}>
                    <Crown size={16} /> Upgrade sekarang
                  </Button>
                )
              }
            />
          </div>
          {state.wedding.plan === "premium" && (
            <button
              className="mt-3 text-xs text-muted underline"
              onClick={() => updateState((s) => ({ ...s, wedding: { ...s.wedding, plan: "starter" } }))}
            >
              Kembali ke Starter (khusus demo)
            </button>
          )}
        </Card>

        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Data demo</h2>
            <p className="text-sm text-muted">Prototipe ini menyimpan data di browser. Kembalikan ke contoh Ayu &amp; Raka, atau mulai dari onboarding.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/onboarding" className="inline-flex h-11 items-center rounded-full bg-paper px-5 text-sm font-semibold sticker-sm ring-1 ring-line hover:bg-primary-soft/40">
              Onboarding baru
            </Link>
            <Button variant="secondary" onClick={() => confirm("Ganti semua data dengan data demo?") && resetDemo()}>
              <RotateCcw size={16} /> Reset demo
            </Button>
          </div>
        </Card>
      </div>
      <PremiumModal open={upsell} onClose={() => setUpsell(false)} />
    </>
  );
}

function ProfileForm({ wedding }: { wedding: Wedding }) {
  const [form, setForm] = useState(wedding);
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof Wedding>(k: K, v: Wedding[K]) => setForm((f) => ({ ...f, [k]: v }));

  function save() {
    updateState((s) => {
      const dateChanged = s.wedding.date !== form.date;
      // Tanggal acara di hari H ikut bergeser; tenggat checklist dihitung ulang otomatis dari H-n.
      const events = dateChanged ? s.events.map((e) => (e.date === s.wedding.date ? { ...e, date: form.date } : e)) : s.events;
      const next = { ...s, wedding: form, events };
      return dateChanged ? withActivity(next, "Tanggal pernikahan diubah; tenggat checklist disesuaikan") : next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <Card className="p-5">
      <h2 className="mb-4 font-semibold">Profil pernikahan</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama mempelai wanita">
          <input value={form.brideName} onChange={(e) => set("brideName", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Nama mempelai pria">
          <input value={form.groomName} onChange={(e) => set("groomName", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Tanggal pernikahan" hint="Mengubah tanggal menggeser semua tenggat checklist dari template.">
          <input type="date" value={form.date ?? ""} onChange={(e) => set("date", e.target.value || null)} className={inputClass} />
        </Field>
        <Field label="Kota">
          <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Adat">
          <select value={form.adat} onChange={(e) => set("adat", e.target.value as Wedding["adat"])} className={inputClass}>
            {ADAT_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Agama">
          <select value={form.agama} onChange={(e) => set("agama", e.target.value as Wedding["agama"])} className={inputClass}>
            {AGAMA_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Total anggaran (Rp)">
          <input inputMode="numeric" value={form.totalBudget} onChange={(e) => set("totalBudget", Number(e.target.value.replace(/\D/g, "")) || 0)} className={inputClass} />
        </Field>
        <Field label="Perkiraan tamu (orang)">
          <input inputMode="numeric" value={form.guestEstimate} onChange={(e) => set("guestEstimate", Number(e.target.value.replace(/\D/g, "")) || 0)} className={inputClass} />
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={save}>{saved ? <><Check size={16} /> Tersimpan</> : "Simpan perubahan"}</Button>
      </div>
    </Card>
  );
}

function Members() {
  const state = useApp();
  const [email, setEmail] = useState("");

  function invite() {
    if (!email.includes("@")) return;
    updateState((s) =>
      withActivity(
        { ...s, members: [...s.members, { id: uid(), name: email.split("@")[0], email, role: "editor", modules: ["checklist", "tamu"], pending: true }] },
        `Undangan kolaborasi dikirim ke ${email}`,
      ),
    );
    setEmail("");
  }

  function patch(id: string, p: { role?: Role; modules?: ModuleId[] }) {
    updateState((s) => ({ ...s, members: s.members.map((m) => (m.id === id ? { ...m, ...p } : m)) }));
  }

  return (
    <Card className="p-5">
      <h2 className="font-semibold">Kolaborasi</h2>
      <p className="mb-4 text-sm text-muted">Undang pasangan atau keluarga. Editor bisa dibatasi ke modul tertentu.</p>
      <ul className="divide-y divide-line">
        {state.members.map((m, i) => (
          <li key={m.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <Avatar name={m.name} index={i} />
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {m.name} {m.pending && <Badge>Menunggu</Badge>}
                </p>
                <p className="text-xs text-muted">{m.email}</p>
              </div>
            </div>
            {m.role === "owner" ? (
              <Badge tone="primary">{ROLE_LABEL.owner}</Badge>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {m.role === "editor" &&
                  MODULES.map((mod) => {
                    const on = m.modules.includes(mod.id);
                    return (
                      <button
                        key={mod.id}
                        onClick={() => patch(m.id, { modules: on ? m.modules.filter((x) => x !== mod.id) : [...m.modules, mod.id] })}
                        className={cn("rounded-full border px-2 py-0.5 text-xs", on ? "border-primary bg-primary-soft text-primary" : "border-line text-muted")}
                      >
                        {mod.label}
                      </button>
                    );
                  })}
                <select value={m.role} onChange={(e) => patch(m.id, { role: e.target.value as Role })} className="rounded-lg border border-line px-2 py-1 text-xs" aria-label={`Peran ${m.name}`}>
                  <option value="editor">{ROLE_LABEL.editor}</option>
                  <option value="viewer">{ROLE_LABEL.viewer}</option>
                </select>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@contoh.id" className={inputClass} />
        <Button onClick={invite} disabled={!email.includes("@")}>
          <UserPlus size={16} /> Undang
        </Button>
      </div>
    </Card>
  );
}

function PlanCard({
  name,
  price,
  features,
  active,
  highlight,
  action,
}: {
  name: string;
  price: string;
  features: string[];
  active: boolean;
  highlight?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border p-5", highlight ? "border-gold bg-gold-soft/40" : "border-line")}>
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl">{name}</p>
        {active && <Badge tone="sage">Paket aktif</Badge>}
      </div>
      <p className="mt-1 text-sm text-muted">{price}</p>
      <ul className="my-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-sm">
            <Check size={16} className="shrink-0 text-sage" /> {f}
          </li>
        ))}
      </ul>
      {action}
    </div>
  );
}
