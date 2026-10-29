"use client";

import { ArrowRight, Check, Clock, Heart, ListChecks, Mail, Sparkles, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconTile, cn, type Tone } from "@/components/ui";
import { APP_NAME, APP_TAGLINE, PREMIUM_PRICE } from "@/lib/brand";
import { rupiah } from "@/lib/format";
import { resetDemo } from "@/lib/store";

const FEATURES: { icon: typeof ListChecks; tone: Tone; title: string; text: string }[] = [
  { icon: ListChecks, tone: "primary", title: "Checklist sesuai adat", text: "Tugas disusun untuk adat dan agama Anda, tenggat menyesuaikan tanggal pernikahan." },
  { icon: Wallet, tone: "gold", title: "Anggaran tanpa bocor", text: "Catat DP, cicilan, dan pelunasan vendor, plus belanja kecil seperti seserahan." },
  { icon: Users, tone: "violet", title: "Daftar tamu dua keluarga", text: "Impor dari CSV, kelompokkan per grup, dan pantau jumlah pax." },
  { icon: Mail, tone: "primary", title: "Undangan digital + RSVP", text: "Tautan personal per tamu lewat WhatsApp, RSVP langsung masuk ke daftar tamu." },
  { icon: Clock, tone: "sky", title: "Rundown hari H", text: "Susunan acara per sesi yang bisa dibagikan ke keluarga, MC, dan vendor." },
  { icon: Sparkles, tone: "violet", title: "AI Advisor adat", text: "Tanya urutan prosesi, isi seserahan, hingga etika, kapan saja." },
];

export default function LandingPage() {
  const router = useRouter();

  function openDemo() {
    resetDemo();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <span className="text-brand text-xl font-extrabold tracking-tight">{APP_NAME}</span>
        <div className="flex items-center gap-3">
          <button onClick={openDemo} className="hidden text-sm font-semibold text-muted hover:text-primary sm:block">
            Lihat demo
          </button>
          <Link href="/onboarding" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-pop">
            Mulai gratis
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 pb-16 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <Heart size={13} className="fill-primary" /> Untuk pasangan yang mengurus pernikahan sendiri
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[1.1] sm:text-6xl">
            Rencanakan pernikahan <span className="text-brand">tanpa drama</span> spreadsheet.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted lg:mx-0">{APP_TAGLINE} Checklist, anggaran, tamu, undangan, dan rundown dalam satu aplikasi.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-pop">
              Mulai rencanakan <ArrowRight size={18} />
            </Link>
            <button onClick={openDemo} className="rounded-full bg-paper px-7 py-3.5 font-semibold shadow-soft ring-1 ring-line hover:text-primary">
              Lihat demo Ayu &amp; Raka
            </button>
          </div>
        </div>

        <HeroMock />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <h2 className="font-display text-center text-3xl">Semua yang dibutuhkan, satu tempat</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, tone, title, text }) => (
            <div key={title} className="rounded-3xl bg-paper p-6 shadow-soft">
              <IconTile tone={tone} size="lg">
                <Icon size={24} />
              </IconTile>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-8 pb-20 sm:px-6">
        <h2 className="font-display text-center text-3xl">Harga sederhana</h2>
        <p className="mt-2 text-center text-muted">Tanpa langganan bulanan.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <PriceCard name="Starter" price="Gratis" items={["Checklist, anggaran, daftar tamu", "Rundown hari H", "Pratinjau undangan", "5 pertanyaan AI Advisor"]} />
          <PriceCard
            name="Premium"
            price={`${rupiah(PREMIUM_PRICE)} sekali bayar`}
            highlight
            items={["Semua fitur Starter", "Terbitkan undangan + RSVP", "Grafik anggaran rinci", "50 pertanyaan AI Advisor"]}
          />
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted">{APP_NAME} · Prototipe</footer>
    </div>
  );
}

/** Mockup dekoratif: bola mengilap dengan kartu-kartu kecil mengambang. */
function HeroMock() {
  return (
    <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[440px]" aria-hidden>
      <div className="orb absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 sm:h-72 sm:w-72" />
      <div className="absolute top-4 left-0 w-52 rounded-3xl bg-brand p-4 text-white shadow-pop sm:left-2">
        <p className="text-xs text-white/80">Menuju hari bahagia</p>
        <p className="text-3xl font-extrabold">
          203 <span className="text-sm font-semibold">hari</span>
        </p>
        <div className="mt-2 flex gap-1.5">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">8 selesai</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-primary">1 terlambat</span>
        </div>
      </div>
      <div className="absolute top-24 right-0 w-48 rounded-3xl bg-paper p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <IconTile tone="sage" size="sm">
            <Check size={15} />
          </IconTile>
          <p className="text-xs font-semibold">RSVP masuk</p>
        </div>
        <p className="mt-2 text-sm font-bold">Pakde Sutrisno</p>
        <p className="text-xs text-muted">Hadir · 4 orang</p>
      </div>
      <div className="absolute bottom-4 left-4 w-56 rounded-3xl bg-paper p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <IconTile tone="gold" size="sm">
            <Wallet size={15} />
          </IconTile>
          <p className="text-xs font-semibold">Anggaran terpakai</p>
        </div>
        <p className="mt-2 text-xl font-extrabold">Rp44 jt</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gold-soft">
          <div className="h-full w-[29%] rounded-full bg-gradient-to-r from-[#ffb07c] to-gold" />
        </div>
      </div>
    </div>
  );
}

function PriceCard({ name, price, items, highlight }: { name: string; price: string; items: string[]; highlight?: boolean }) {
  return (
    <div className={cn("rounded-[2rem] p-7", highlight ? "bg-brand text-white shadow-pop" : "bg-paper shadow-soft")}>
      <p className="font-display text-2xl">{name}</p>
      <p className={highlight ? "mt-1 text-white/85" : "mt-1 text-muted"}>{price}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm">
            <Check size={16} className={cn("shrink-0", highlight ? "text-white" : "text-sage")} /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
