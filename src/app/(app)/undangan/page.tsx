"use client";

import { CalendarDays, Check, Copy, Crown, ExternalLink, Eye, Gift, Heart, ImagePlus, MapPin, Palette, Plus, Trash2, Type, Users } from "lucide-react";
import { useState, type ChangeEvent, type ReactNode } from "react";
import { useApp } from "@/components/app-shell";
import { InvitationView } from "@/components/invitation-view";
import { PremiumModal } from "@/components/premium-modal";
import { Button, Card, Field, HeroCard, IconTile, Segmented, cn, inputClass } from "@/components/ui";
import { formatDate, uid } from "@/lib/format";
import { resizeImage } from "@/lib/image";
import { inviteUrl } from "@/lib/selectors";
import { updateState, withActivity } from "@/lib/store";
import type { Invitation, InvitationPhotos, InvitationTemplate, StoryItem, WeddingEvent } from "@/lib/types";

const TEMPLATES: { id: InvitationTemplate; name: string; desc: string; swatch: string; dot: string }[] = [
  { id: "melati", name: "Melati", desc: "Gading & emas", swatch: "from-[#fbf7f1] to-[#f3e3c8]", dot: "bg-[#8e3b4a]" },
  { id: "sage", name: "Sage", desc: "Hijau lembut", swatch: "from-[#eef3ee] to-[#cfe0d2]", dot: "bg-[#46664f]" },
  { id: "malam", name: "Malam", desc: "Navy & emas", swatch: "from-[#2a3146] to-[#1d2231]", dot: "bg-[#d9b46a]" },
  { id: "minang", name: "Minang", desc: "Marun & emas, animasi", swatch: "from-[#7a1a3a] to-[#3f0a1d]", dot: "bg-[#e9b52a]" },
];

type Tab = "desain" | "detail" | "teks" | "acara" | "pratinjau";

export default function UndanganPage() {
  const state = useApp();
  const { invitation, wedding } = state;
  const premium = wedding.plan === "premium";
  const [tab, setTab] = useState<Tab>("desain");
  const [upsell, setUpsell] = useState(false);
  const [copied, setCopied] = useState(false);

  function patch(p: Partial<Invitation>) {
    updateState((s) => ({ ...s, invitation: { ...s.invitation, ...p } }));
  }

  function patchEvent(id: string, p: Partial<WeddingEvent>) {
    updateState((s) => ({ ...s, events: s.events.map((e) => (e.id === id ? { ...e, ...p } : e)) }));
  }

  function publish() {
    if (!premium) {
      setUpsell(true);
      return;
    }
    updateState((s) => withActivity({ ...s, invitation: { ...s.invitation, published: true } }, "Undangan digital diterbitkan"));
  }

  async function copy() {
    await navigator.clipboard?.writeText(inviteUrl(state));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const preview = (
    <div className="mx-auto w-full max-w-[360px] rounded-[2.75rem] bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgb(42_31_45/0.5)]">
      <div className="relative h-[660px] overflow-y-auto rounded-[2.25rem] [scrollbar-width:none]">
        <InvitationView key={invitation.template} state={state} mode="preview" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl sm:text-3xl">Undangan digital</h1>

      <HeroCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold", invitation.published ? "bg-white text-sage" : "bg-white/20")}>
              {invitation.published ? <Check size={12} /> : null} {invitation.published ? "Sudah terbit" : "Draf"}
            </span>
            <p className="mt-2 text-xl font-bold">
              {invitation.published ? "Undangan siap dibagikan" : premium ? "Siap diterbitkan?" : "Pratinjau gratis, terbitkan dengan Premium"}
            </p>
            {invitation.published ? (
              <p className="mt-1 truncate rounded-full bg-white/15 px-3 py-1 font-mono text-xs">{inviteUrl(state)}</p>
            ) : (
              <p className="mt-1 text-sm text-white/80">Setelah terbit, tamu bisa membuka tautan dan mengisi RSVP.</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            {invitation.published ? (
              <>
                <button onClick={copy} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white/20 px-4 text-sm font-semibold hover:bg-white/30">
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Tersalin" : "Salin"}
                </button>
                <a href={`/u/${wedding.slug}`} target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-primary">
                  <ExternalLink size={15} /> Buka
                </a>
              </>
            ) : (
              <button onClick={publish} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-bold text-primary shadow-lg">
                {!premium && <Crown size={16} />} Terbitkan
              </button>
            )}
          </div>
        </div>
        {invitation.published && (
          <button onClick={() => patch({ published: false })} className="mt-3 text-xs font-semibold text-white/80 underline">
            Tarik dari publik
          </button>
        )}
      </HeroCard>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-4">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "desain", label: "Desain" },
              ...(invitation.template === "minang" ? [{ value: "detail" as const, label: "Detail" }] : []),
              { value: "teks", label: "Teks" },
              { value: "acara", label: "Acara" },
              { value: "pratinjau", label: "Pratinjau" },
            ]}
            className="lg:[&>button:last-child]:hidden"
          />

          {tab === "pratinjau" && <div className="lg:hidden">{preview}</div>}

          {tab === "desain" && (
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <IconTile tone="primary" size="sm">
                  <Palette size={16} />
                </IconTile>
                <h2 className="font-bold">Pilih tema</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => patch({ template: tpl.id })}
                    className={cn("rounded-3xl p-2 text-left transition", invitation.template === tpl.id ? "bg-primary-soft ring-2 ring-primary" : "bg-ivory hover:ring-2 hover:ring-line-strong")}
                  >
                    <span className={cn("relative block aspect-[3/4] rounded-2xl bg-gradient-to-b", tpl.swatch)}>
                      <span className={cn("absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full", tpl.dot)} />
                      {invitation.template === tpl.id && (
                        <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block px-1 text-sm font-bold">{tpl.name}</span>
                    <span className="block px-1 pb-1 text-[11px] text-muted">{tpl.desc}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {tab === "detail" && <MinangDetails invitation={invitation} patch={patch} />}

          {tab === "teks" && (
            <Card className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <IconTile tone="violet" size="sm">
                  <Type size={16} />
                </IconTile>
                <h2 className="font-bold">Teks undangan</h2>
              </div>
              <Field label="Kalimat pembuka">
                <textarea rows={3} value={invitation.opening} onChange={(e) => patch({ opening: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Kutipan ayat / doa">
                <textarea rows={3} value={invitation.quote} onChange={(e) => patch({ quote: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Sumber kutipan">
                <input value={invitation.quoteSource} onChange={(e) => patch({ quoteSource: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Kalimat penutup">
                <textarea rows={2} value={invitation.closing} onChange={(e) => patch({ closing: e.target.value })} className={inputClass} />
              </Field>
            </Card>
          )}

          {tab === "acara" && (
            <div className="space-y-3">
              <p className="px-1 text-xs text-muted">Tamu hanya melihat acara yang mereka diundang.</p>
              {state.events.map((e) => (
                <Card key={e.id} className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <IconTile tone="sky">
                      <CalendarDays size={19} />
                    </IconTile>
                    <div>
                      <p className="font-bold">{e.name}</p>
                      <p className="text-xs text-muted">
                        {formatDate(e.date, "weekday")} · {e.start}–{e.end}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Tanggal">
                      <input type="date" value={e.date ?? ""} onChange={(ev) => patchEvent(e.id, { date: ev.target.value || null })} className={inputClass} />
                    </Field>
                    <Field label="Mulai">
                      <input type="time" value={e.start} onChange={(ev) => patchEvent(e.id, { start: ev.target.value })} className={inputClass} />
                    </Field>
                    <Field label="Selesai">
                      <input type="time" value={e.end} onChange={(ev) => patchEvent(e.id, { end: ev.target.value })} className={inputClass} />
                    </Field>
                    <Field label="Tempat" className="sm:col-span-3">
                      <input value={e.venue} onChange={(ev) => patchEvent(e.id, { venue: ev.target.value })} className={inputClass} />
                    </Field>
                    <Field label="Alamat" className="sm:col-span-2">
                      <input value={e.address} onChange={(ev) => patchEvent(e.id, { address: ev.target.value })} className={inputClass} />
                    </Field>
                    <Field label="Tautan Google Maps">
                      <div className="relative">
                        <MapPin size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
                        <input value={e.mapsUrl} onChange={(ev) => patchEvent(e.id, { mapsUrl: ev.target.value })} className={cn(inputClass, "pl-9")} />
                      </div>
                    </Field>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
            <Eye size={15} /> Pratinjau langsung
          </p>
          {preview}
        </div>
      </div>

      <PremiumModal open={upsell} onClose={() => setUpsell(false)} reason="Menerbitkan undangan dan menerima RSVP adalah fitur Premium." />
    </div>
  );
}

function PhotoField({ label, value, onChange }: { label: string; value?: string; onChange: (src: string | undefined) => void }) {
  async function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onChange(await resizeImage(file));
  }

  return (
    <div>
      <p className="mb-1.5 px-1 font-cute text-sm font-semibold text-plum">{label}</p>
      <div className="relative aspect-square overflow-hidden rounded-2xl border-[2.5px] border-plum bg-cream">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto berupa data URL dari unggahan pengguna
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 text-plum/60 hover:text-plum">
            <ImagePlus size={24} />
            <span className="text-xs font-semibold">Pilih foto</span>
            <input type="file" accept="image/*" onChange={pick} className="sr-only" />
          </label>
        )}
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="absolute top-1.5 right-1.5 rounded-full border-2 border-plum bg-white p-1 text-plum" aria-label={`Hapus ${label}`}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function DetailCard({ icon, tone, title, children }: { icon: ReactNode; tone: "primary" | "violet" | "gold" | "sky"; title: string; children: ReactNode }) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-3">
        <IconTile tone={tone} size="sm">
          {icon}
        </IconTile>
        <h2 className="font-bold">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

const MAX_GALLERY = 4;

/** Isian tambahan khusus tema Minang. */
function MinangDetails({ invitation, patch }: { invitation: Invitation; patch: (p: Partial<Invitation>) => void }) {
  const photos = invitation.photos ?? {};
  const story = invitation.story ?? [];
  const gallery = photos.gallery ?? [];
  const gift = invitation.gift ?? { bank: "", number: "", holder: "" };
  const setPhotos = (p: Partial<InvitationPhotos>) => patch({ photos: { ...photos, ...p } });
  const setStory = (id: string, p: Partial<StoryItem>) => patch({ story: story.map((s) => (s.id === id ? { ...s, ...p } : s)) });

  return (
    <div className="space-y-4">
      <DetailCard icon={<Users size={16} />} tone="primary" title="Mempelai">
        <Field label="Keterangan mempelai wanita">
          <input value={invitation.brideParents ?? ""} onChange={(e) => patch({ brideParents: e.target.value })} placeholder="Putri dari Bapak ... & Ibu ..." className={inputClass} />
        </Field>
        <Field label="Keterangan mempelai pria">
          <input value={invitation.groomParents ?? ""} onChange={(e) => patch({ groomParents: e.target.value })} placeholder="Putra dari Bapak ... & Ibu ..." className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Instagram wanita">
            <input value={invitation.brideInstagram ?? ""} onChange={(e) => patch({ brideInstagram: e.target.value })} placeholder="@nama" className={inputClass} />
          </Field>
          <Field label="Instagram pria">
            <input value={invitation.groomInstagram ?? ""} onChange={(e) => patch({ groomInstagram: e.target.value })} placeholder="@nama" className={inputClass} />
          </Field>
        </div>
        <Field label="Tautan siaran langsung" hint="Opsional. Kosongkan kalau tidak ada siaran.">
          <input value={invitation.streamUrl ?? ""} onChange={(e) => patch({ streamUrl: e.target.value })} placeholder="https://" className={inputClass} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <PhotoField label="Sampul" value={photos.cover} onChange={(cover) => setPhotos({ cover })} />
          <PhotoField label="Wanita" value={photos.bride} onChange={(bride) => setPhotos({ bride })} />
          <PhotoField label="Pria" value={photos.groom} onChange={(groom) => setPhotos({ groom })} />
        </div>
      </DetailCard>

      <DetailCard icon={<ImagePlus size={16} />} tone="sky" title={`Galeri (maks. ${MAX_GALLERY} foto)`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: Math.min(gallery.length + 1, MAX_GALLERY) }, (_, i) => (
            <PhotoField
              key={i}
              label={`Foto ${i + 1}`}
              value={gallery[i]}
              onChange={(src) => {
                const next = [...gallery];
                if (src) next[i] = src;
                else next.splice(i, 1);
                setPhotos({ gallery: next });
              }}
            />
          ))}
        </div>
      </DetailCard>

      <DetailCard icon={<Heart size={16} />} tone="violet" title="Kisah kami">
        {story.map((s) => (
          <div key={s.id} className="space-y-2 rounded-2xl bg-cream p-3">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input value={s.title} onChange={(e) => setStory(s.id, { title: e.target.value })} placeholder="Judul" aria-label="Judul kisah" className={inputClass} />
              <input value={s.date} onChange={(e) => setStory(s.id, { date: e.target.value })} placeholder="Waktu" aria-label="Waktu kisah" className={inputClass} />
              <button type="button" onClick={() => patch({ story: story.filter((x) => x.id !== s.id) })} className="rounded-xl p-2 text-plum/60 hover:text-danger" aria-label={`Hapus ${s.title || "kisah"}`}>
                <Trash2 size={16} />
              </button>
            </div>
            <textarea rows={2} value={s.text} onChange={(e) => setStory(s.id, { text: e.target.value })} placeholder="Ceritakan singkat" aria-label="Isi kisah" className={inputClass} />
          </div>
        ))}
        <Button type="button" size="sm" variant="secondary" onClick={() => patch({ story: [...story, { id: uid(), title: "", date: "", text: "" }] })}>
          <Plus size={14} /> Tambah kisah
        </Button>
      </DetailCard>

      <DetailCard icon={<Gift size={16} />} tone="gold" title="Rekening hadiah">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Bank">
            <input value={gift.bank} onChange={(e) => patch({ gift: { ...gift, bank: e.target.value } })} placeholder="BCA" className={inputClass} />
          </Field>
          <Field label="Nomor rekening">
            <input inputMode="numeric" value={gift.number} onChange={(e) => patch({ gift: { ...gift, number: e.target.value } })} className={inputClass} />
          </Field>
          <Field label="Atas nama">
            <input value={gift.holder} onChange={(e) => patch({ gift: { ...gift, holder: e.target.value } })} className={inputClass} />
          </Field>
        </div>
        <p className="text-xs font-medium text-plum/60">Kosongkan nomor rekening kalau tidak ingin menampilkan bagian hadiah.</p>
      </DetailCard>
    </div>
  );
}
