"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, Progress, cn, inputClass } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { rupiah } from "@/lib/format";
import { createFreshState, type OnboardingInput } from "@/lib/seed";
import { replaceState } from "@/lib/store";
import { ADAT_OPTIONS, AGAMA_OPTIONS } from "@/lib/templates";

const STEPS = ["Mempelai", "Tanggal", "Adat & agama", "Tamu & anggaran"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uncertain, setUncertain] = useState(false);
  const [form, setForm] = useState<OnboardingInput>({
    brideName: "",
    groomName: "",
    date: null,
    city: "",
    adat: "jawa",
    agama: "islam",
    guestEstimate: 300,
    totalBudget: 100_000_000,
    ownerName: "",
    ownerEmail: "",
  });
  const set = <K extends keyof OnboardingInput>(k: K, v: OnboardingInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const valid = [
    form.brideName.trim() && form.groomName.trim() && form.ownerName.trim(),
    (uncertain || form.date) && form.city.trim(),
    true,
    form.totalBudget > 0,
  ][step];

  function finish() {
    replaceState(createFreshState({ ...form, date: uncertain ? null : form.date }));
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-5">
        <Link href="/" className="text-brand text-lg font-extrabold tracking-tight">
          {APP_NAME}
        </Link>
        <span className="text-sm text-muted">
          Langkah {step + 1} dari {STEPS.length}
        </span>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16">
        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-8" />
        <h1 className="font-display text-3xl sm:text-4xl">
          {["Siapa yang akan menikah?", "Kapan dan di mana?", "Adat dan agama", "Tamu dan anggaran"][step]}
        </h1>
        <p className="mt-2 text-muted">
          {
            [
              "Nama ini muncul di dashboard dan undangan.",
              "Tenggat checklist dihitung mundur dari tanggal ini.",
              "Checklist dan rundown disusun sesuai pilihan ini.",
              "Perkiraan saja, bisa diubah kapan pun.",
            ][step]
          }
        </p>

        <div className="mt-8 space-y-5">
          {step === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama panggilan mempelai wanita">
                  <input autoFocus value={form.brideName} onChange={(e) => set("brideName", e.target.value)} placeholder="Ayu" className={inputClass} />
                </Field>
                <Field label="Nama panggilan mempelai pria">
                  <input value={form.groomName} onChange={(e) => set("groomName", e.target.value)} placeholder="Raka" className={inputClass} />
                </Field>
              </div>
              <Field label="Nama lengkap Anda" hint="Anda menjadi pemilik rencana ini dan bisa mengundang pasangan nanti.">
                <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.ownerEmail} onChange={(e) => set("ownerEmail", e.target.value)} className={inputClass} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Tanggal acara utama">
                <input type="date" disabled={uncertain} value={form.date ?? ""} onChange={(e) => set("date", e.target.value || null)} className={inputClass} />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-primary" checked={uncertain} onChange={(e) => setUncertain(e.target.checked)} />
                Tanggal belum pasti
              </label>
              <Field label="Kota">
                <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Yogyakarta" className={inputClass} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <p className="mb-2 text-sm font-medium">Adat</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ADAT_OPTIONS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => set("adat", a.id)}
                      className={cn("rounded-2xl border p-4 text-left transition", form.adat === a.id ? "border-primary bg-primary-soft shadow-pop" : "border-transparent bg-paper shadow-soft hover:border-line-strong")}
                    >
                      <p className="font-medium">{a.label}</p>
                      <p className="text-xs text-muted">{a.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Agama</p>
                <div className="flex flex-wrap gap-2">
                  {AGAMA_OPTIONS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => set("agama", a.id)}
                      className={cn("rounded-full border px-4 py-1.5 text-sm", form.agama === a.id ? "border-transparent bg-brand text-white shadow-pop" : "border-transparent bg-paper shadow-soft")}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Field label={`Perkiraan jumlah tamu: ${form.guestEstimate} orang`}>
                <input type="range" min={50} max={1500} step={50} value={form.guestEstimate} onChange={(e) => set("guestEstimate", Number(e.target.value))} className="w-full accent-primary" />
              </Field>
              <Field label="Total anggaran (Rp)" hint={rupiah(form.totalBudget)}>
                <input
                  inputMode="numeric"
                  value={form.totalBudget}
                  onChange={(e) => set("totalBudget", Number(e.target.value.replace(/\D/g, "")) || 0)}
                  className={inputClass}
                />
              </Field>
              <p className="rounded-2xl bg-gold-soft px-4 py-3 text-sm text-gold">
                Kami akan membagi anggaran ke 10 pos (katering 30%, venue 20%, dan seterusnya). Anda bisa mengubahnya nanti.
              </p>
            </>
          )}
        </div>

        <div className="mt-10 flex justify-between">
          <Button variant="ghost" onClick={() => (step === 0 ? router.push("/") : setStep(step - 1))}>
            <ArrowLeft size={16} /> Kembali
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!valid}>
              Lanjut <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={finish} disabled={!valid}>
              Buat rencana <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
