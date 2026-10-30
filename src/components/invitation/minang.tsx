"use client";

import { CalendarDays, Check, Copy, Gift, Heart, Images, MailOpen, MapPin, MessageCircleHeart, Radio, Users, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, useInView, type Variants } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatDate, titleCase } from "@/lib/format";
import type { AppState, Guest } from "@/lib/types";
import { RsvpForm, type RsvpInput, type RsvpTheme } from "../invitation-rsvp";
import { EngravedScene, GoldFrame, LandscapeScene, Leaf, Lily, MountainScene, RumahGadang, ScrollMouse, StoneArch, Wash } from "./minang-art";
import { Talempong } from "./talempong";

const RSVP_THEME: RsvpTheme = {
  panel: "bg-minang-maroon border-minang-gold/60 text-white",
  accent: "text-minang-gold font-script",
  muted: "text-white/70",
  button: "bg-minang-gold text-minang-night",
  field: "border-minang-gold/50 bg-white/95 text-minang-night",
};

/* Efek muncul mengikuti scroll: masuk saat terlihat, keluar lagi saat kembali ke atas. */
const ENTER: Record<"up" | "left" | "right", Variants> = {
  up: { hidden: { opacity: 0, y: 96, scale: 0.93 }, show: { opacity: 1, y: 0, scale: 1 } },
  left: { hidden: { opacity: 0, x: "-100%", scale: 0.93 }, show: { opacity: 1, x: 0, scale: 1 } },
  right: { hidden: { opacity: 0, x: "100%", scale: 0.93 }, show: { opacity: 1, x: 0, scale: 1 } },
};

function Enter({ from = "up", className, children }: { from?: keyof typeof ENTER; className?: string; children: ReactNode }) {
  // Posisi dibaca dari pembungkus yang diam; elemen yang digeser ke luar area potong tidak akan pernah terdeteksi terlihat.
  const anchor = useRef<HTMLDivElement>(null);
  const inView = useInView(anchor, { once: false, margin: "0px 0px -120px 0px" });
  return (
    <div ref={anchor}>
      <motion.div className={className} variants={ENTER[from]} initial="hidden" animate={inView ? "show" : "hidden"} transition={{ duration: 1, ease: "easeOut", opacity: { duration: 0.5 } }}>
        {children}
      </motion.div>
    </div>
  );
}

/** Denyut pelan pada bunga dan foto. */
function Pulse({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <motion.div className={className} style={style} animate={{ scale: [0.95, 1, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeOut", times: [0, 0.6, 1] }}>
      {children}
    </motion.div>
  );
}

function Sway({ className, children, delay = 0, angle = 8 }: { className?: string; children: ReactNode; delay?: number; angle?: number }) {
  return (
    <motion.div className={className} style={{ originY: 1 }} animate={{ rotate: [0, angle, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay, times: [0, 0.65, 1] }}>
      {children}
    </motion.div>
  );
}

/** Daun yang berpangkal di satu titik, lalu bergoyang pelan. */
function BranchLeaf({ x, y, rotate, width = 46, delay = 0, tone, vein }: { x: number; y: number; rotate: number; width?: number; delay?: number; tone?: string; vein?: string }) {
  const height = width * (130 / 60);
  return (
    <div className="absolute" style={{ left: x - width / 2, top: y - height, width, transform: `rotate(${rotate}deg)`, transformOrigin: "50% 100%" }}>
      <Sway delay={delay} angle={6}>
        <Leaf tone={tone} vein={vein} />
      </Sway>
    </div>
  );
}

/** Rangkaian bunga dan daun di sisi gerbang. */
function Bouquet({ size = 150 }: { size?: number }) {
  const c = size * 0.34;
  return (
    <div className="pointer-events-none relative" style={{ width: size, height: size * 1.25 }} aria-hidden>
      <BranchLeaf x={c} y={size * 0.72} rotate={22} width={size * 0.33} />
      <BranchLeaf x={c} y={size * 0.72} rotate={58} width={size * 0.36} delay={0.5} />
      <BranchLeaf x={c} y={size * 0.72} rotate={92} width={size * 0.28} delay={1} tone="#7fae8d" vein="#234a38" />
      <Pulse className="absolute" style={{ left: -size * 0.32, top: size * 0.38, width: size * 0.92 }}>
        <Lily />
      </Pulse>
    </div>
  );
}

function Photo({ src, alt, fallback, className }: { src?: string; alt: string; fallback: string; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- foto berupa data URL dari unggahan pengguna
    return <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }
  return <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-minang-wine to-minang-night font-script text-7xl text-minang-gold", className)}>{fallback}</div>;
}

/** Panel kiri di desktop: tetap diam saat kolom kanan di-scroll. */
function SidePanel({ guest }: { guest?: Guest | null }) {
  return (
    <aside className="fixed inset-y-0 right-[432px] left-0 hidden overflow-hidden bg-[#8a3249] lg:block">
      <EngravedScene className="absolute inset-0 h-full w-full text-[#6d1830] opacity-80" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
      >
        <p className="text-xl tracking-[0.12em] text-white uppercase">Undangan Pernikahan</p>
        <div className="my-6 h-px w-96 max-w-full bg-white/70" />
        <p className="font-script text-7xl leading-tight text-minang-gold xl:text-8xl">Anda Diundang!</p>
        <p className="mt-2 text-xl tracking-wide text-white">kepada :</p>
        <p className="mt-2 font-script text-6xl leading-tight text-minang-gold xl:text-7xl">{guest?.name ?? "Tamu Undangan"}</p>
        <p className="mt-4 text-xl tracking-wide text-white">mohon hadir di hari bahagia kami</p>
      </motion.div>
    </aside>
  );
}

function Birds() {
  const flock = [
    { x: 0, y: 0, d: 0 },
    { x: 34, y: -18, d: 0.1 },
    { x: 66, y: 10, d: 0.05 },
    { x: 96, y: -12, d: 0.2 },
    { x: -30, y: 22, d: 0.15 },
    { x: 18, y: 34, d: 0.25 },
  ];
  return (
    <motion.div className="absolute top-[10%] left-0 z-10 w-full" initial={{ x: "105%", y: 40 }} animate={{ x: "-40%", y: -10 }} transition={{ duration: 4, ease: "linear" }} aria-hidden>
      {flock.map((b, i) => (
        <motion.svg key={i} viewBox="0 0 30 16" className="absolute w-6" style={{ left: b.x, top: b.y }} animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 0.45, repeat: Infinity, delay: b.d }}>
          <path d="M1 12 Q8 1 15 9 Q22 1 29 12 Q22 7 15 13 Q8 7 1 12 Z" fill="#23303f" />
        </motion.svg>
      ))}
    </motion.div>
  );
}

/** Pembuka sinematis: gunung, lukisan Rumah Gadang, lalu gerbang marun dan nama mempelai. */
function CinematicHero({ bride, groom, date, heightClass }: { bride: string; groom: string; date: string | null; heightClass: string }) {
  const scene = (delay: number) => ({ duration: 1.4, delay, ease: "easeInOut" as const });
  return (
    <section id="m-beranda" className={cn("relative overflow-hidden bg-minang-night", heightClass)}>
      <motion.div className="absolute inset-0 will-change-transform" animate={{ opacity: 0, scale: 1.12 }} transition={{ opacity: scene(2.6), scale: { duration: 4, ease: "linear" } }}>
        <MountainScene className="h-full w-full" />
      </motion.div>
      <Birds />
      <motion.div className="absolute inset-0 will-change-transform" initial={{ opacity: 0, scale: 1.18 }} animate={{ opacity: 1, scale: 1 }} transition={{ opacity: scene(2.6), scale: { duration: 8, delay: 2.6, ease: "easeOut" } }}>
        <LandscapeScene className="h-full w-full" />
      </motion.div>
      <motion.div className="absolute inset-0 bg-[#4f0a22]" initial={{ opacity: 0 }} animate={{ opacity: 0.87 }} transition={scene(5.2)} />

      <motion.div className="absolute inset-0 z-[5]" initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: 5.6, ease: "easeOut" }}>
        <StoneArch className="h-auto w-full" />
      </motion.div>

      <motion.div className="absolute top-[34%] left-0 z-10" initial={{ opacity: 0, x: -120, scale: 0.6 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1.3, delay: 6.3, ease: "easeOut" }}>
        <Bouquet />
      </motion.div>
      <motion.div className="absolute -right-8 -bottom-8 z-10 w-48" initial={{ opacity: 0, x: 120, y: 80, scale: 0.6 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: 1.3, delay: 6.5, ease: "easeOut" }}>
        <BranchLeaf x={70} y={120} rotate={-98} width={52} tone="#7fae8d" vein="#234a38" />
        <Pulse className="relative w-48">
          <Lily />
        </Pulse>
      </motion.div>

      <div className="relative z-20 flex h-full flex-col items-center px-12 pt-[17vh] text-center">
        <motion.div className="w-[46%] min-w-32" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 6.8, ease: "backOut" }}>
          <RumahGadang />
        </motion.div>
        <motion.div className="flex flex-1 flex-col items-center justify-center pb-20" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, delay: 7.6 }}>
          <p className="text-lg tracking-[0.08em] uppercase">The Wedding Of</p>
          <p className="mt-5 font-script text-6xl leading-tight break-words text-minang-gold">{bride}</p>
          <p className="my-1 text-lg">dan</p>
          <p className="font-script text-6xl leading-tight break-words text-minang-gold">{groom}</p>
          <p className="mt-6 text-lg tracking-[0.04em] uppercase">{formatDate(date, "weekday")}</p>
          <motion.div className="mt-8" animate={{ y: [0, 22, 0] }} transition={{ duration: 1.75, repeat: Infinity, ease: "linear" }}>
            <ScrollMouse />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CoupleCard({ title, name, parents, photo, instagram, side, tone }: { title: string; name: string; parents?: string; photo?: string; instagram?: string; side: "left" | "right"; tone: "rose" | "wine" }) {
  return (
    <section className={cn("relative overflow-hidden px-7 py-16", tone === "rose" ? "bg-[#c08093]" : "bg-minang-maroon")}>
      <EngravedScene className={cn("absolute inset-0 h-full w-full opacity-30", tone === "rose" ? "text-[#7a1a3a]" : "text-[#a95c76]")} />
      <Enter from={side} className="relative rounded-t-full bg-[#7a1a3a]/95 px-6 pt-16 pb-12 text-center">
        <p className="font-script text-5xl text-white">{title}</p>
        <Pulse className="relative mx-auto mt-7 w-52">
          <div className="absolute inset-[9%] overflow-hidden rounded-[50%]">
            <Photo src={photo} alt={`Foto ${name}`} fallback={name.charAt(0)} />
          </div>
          <GoldFrame className="relative" />
        </Pulse>
        <p className="mt-6 font-script text-5xl leading-tight break-words text-minang-gold">{name}</p>
        {parents && <p className="mt-3 text-base leading-relaxed text-white/95">{parents}</p>}
        {instagram && (
          <motion.a whileHover={{ scale: 1.15 }} href={`https://instagram.com/${instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" aria-label={`Instagram ${name}`} className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-minang-gold text-minang-night">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </motion.a>
        )}
      </Enter>
    </section>
  );
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const target = new Date(`${date}T08:00:00`).getTime();
  const left = Math.max(0, target - now);
  const units = [
    { label: "Hari", value: Math.floor(left / 86_400_000) },
    { label: "Jam", value: Math.floor(left / 3_600_000) % 24 },
    { label: "Menit", value: Math.floor(left / 60_000) % 60 },
    { label: "Detik", value: Math.floor(left / 1000) % 60 },
  ];
  return (
    <div className="mt-7 grid grid-cols-4 gap-2">
      {units.map((u) => (
        <div key={u.label} className="rounded-lg border border-minang-gold/80 py-3 text-center">
          <p className="text-3xl text-minang-gold tabular-nums">{String(u.value).padStart(2, "0")}</p>
          <p className="mt-1 text-xs text-white/85">{u.label}</p>
        </div>
      ))}
    </div>
  );
}

function EventBlock({ title, date, time, venue, address, mapsUrl }: { title: string; date: string | null; time: string; venue: string; address: string; mapsUrl: string }) {
  return (
    <Enter className="text-center">
      <p className="font-script text-5xl leading-tight text-minang-gold">{title}</p>
      <p className="mt-5 font-semibold text-white">Hari dan Tanggal</p>
      <p className="mt-1 text-minang-gold">{formatDate(date, "weekday")}</p>
      <p className="mt-4 font-semibold text-white">Waktu</p>
      <p className="mt-1 text-minang-gold">{time}</p>
      <p className="mt-4 font-semibold text-white">Lokasi</p>
      <p className="mt-1 text-minang-gold">{venue || "Lokasi menyusul"}</p>
      <p className="mt-1 text-sm text-white/90">{address}</p>
      {mapsUrl && (
        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-minang-gold px-6 py-2.5 text-minang-night">
          <MapPin size={16} /> Lihat Lokasi
        </motion.a>
      )}
    </Enter>
  );
}

const NAV = [
  { id: "m-beranda", label: "Beranda", icon: MailOpen },
  { id: "m-mempelai", label: "Mempelai", icon: Users },
  { id: "m-acara", label: "Acara", icon: CalendarDays },
  { id: "m-kisah", label: "Kisah", icon: Images },
  { id: "m-ucapan", label: "Ucapan", icon: MessageCircleHeart },
];

export function MinangInvitation({
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
  const bride = titleCase(wedding.brideName);
  const groom = titleCase(wedding.groomName);
  const photos = invitation.photos ?? {};
  const story = invitation.story ?? [];
  const gallery = photos.gallery ?? [];
  const visibleEvents = guest ? events.filter((e) => guest.eventIds.includes(e.id)) : events;
  const live = mode === "live";
  const screen = live ? "h-svh" : "h-[640px]";

  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const musicRef = useRef<Talempong | null>(null);

  useEffect(() => () => musicRef.current?.dispose(), []);

  function open() {
    setOpened(true);
    if (invitation.music) {
      musicRef.current ??= new Talempong();
      musicRef.current.start();
      setPlaying(true);
    }
  }

  function toggleMusic() {
    musicRef.current ??= new Talempong();
    if (playing) musicRef.current.stop();
    else musicRef.current.start();
    setPlaying(!playing);
  }

  async function copyAccount() {
    if (!invitation.gift) return;
    await navigator.clipboard?.writeText(invitation.gift.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={cn("relative overflow-x-clip bg-minang-night font-marcellus text-white", live ? "min-h-svh" : "min-h-[640px]")}>
      {live && <SidePanel guest={guest} />}

      <div className={cn("relative", live && "lg:ml-auto lg:w-[432px]")}>
        <AnimatePresence>
          {!opened && (
            <motion.section key="sampul" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={cn("absolute inset-x-0 top-0 z-40 overflow-hidden bg-[#c9a4ae]", screen)}>
              {photos.cover && (
                // eslint-disable-next-line @next/next/no-img-element -- foto berupa data URL dari unggahan pengguna
                <img src={photos.cover} alt={`${bride} dan ${groom}`} className="absolute inset-0 h-full w-full object-cover" />
              )}
              <Wash className="absolute inset-0 h-full w-full" color="#7a3b4f" />
              <div className="absolute inset-0 bg-[#4f1830]/35" />

              {/* Pemandangan ukiran naik dari bawah */}
              <motion.div className="absolute inset-x-0 bottom-0 h-[34%]" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 2, ease: "easeOut" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent" />
                <EngravedScene className="relative h-full w-full text-[#a64f6b]" />
              </motion.div>

              <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[14%] text-center">
                <motion.div className="w-40" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
                  <RumahGadang />
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="mt-5 font-script text-4xl text-minang-gold drop-shadow">
                  Undangan Pernikahan
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-1 font-script text-6xl leading-tight break-words text-white drop-shadow-lg">
                  {bride} &amp; {groom}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="mt-12">
                  <p className="text-lg tracking-wide text-white">Kepada Yth,</p>
                  <p className="mt-1 text-3xl text-minang-gold">{guest?.name ?? "Tamu Undangan"}</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={open} className="mt-4 inline-flex items-center gap-2.5 rounded-md bg-minang-gold px-6 py-2.5 text-lg text-minang-night">
                    Buka Undangan <MailOpen size={19} />
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {!opened && <div className={screen} />}

        {opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="overflow-x-clip">
            <CinematicHero bride={bride} groom={groom} date={wedding.date} heightClass={screen} />

            {/* Kutipan */}
            <section className="relative overflow-hidden bg-[#e3c0ca] px-7 py-16">
              <Wash className="absolute inset-0 h-full w-full" color="#b45f76" />
              <Enter className="relative rounded-t-full bg-minang-maroon px-7 pt-20 pb-12 text-center">
                <div className="mx-auto w-40">
                  <RumahGadang />
                </div>
                {invitation.quote && (
                  <>
                    <p className="mt-6 text-[15px] leading-relaxed text-white">{invitation.quote}</p>
                    <p className="mt-3 text-sm text-minang-gold">{invitation.quoteSource}</p>
                  </>
                )}
              </Enter>
            </section>

            <div id="m-mempelai" className="overflow-x-clip">
              <CoupleCard side="right" tone="rose" title="Pengantin Wanita" name={bride} parents={invitation.brideParents} photo={photos.bride} instagram={invitation.brideInstagram} />
              <CoupleCard side="left" tone="wine" title="Pengantin Pria" name={groom} parents={invitation.groomParents} photo={photos.groom} instagram={invitation.groomInstagram} />
            </div>

            {/* Hari bahagia dan acara */}
            <section id="m-acara" className="relative overflow-hidden bg-minang-night px-7 pt-16 pb-14">
              <div className="bg-songket absolute inset-0" />
              <div className="relative">
                <Enter className="mx-auto w-44">
                  <RumahGadang />
                </Enter>
                {wedding.date && (
                  <Enter className="mt-7">
                    <p className="text-center font-script text-5xl text-minang-gold">Hari Bahagia</p>
                    <Countdown date={wedding.date} />
                  </Enter>
                )}
                <Enter className="mt-8">
                  <p className="text-center text-[15px] leading-relaxed text-white/95">{invitation.opening}</p>
                </Enter>
                <div className="mt-12 space-y-14">
                  {visibleEvents.map((e) => (
                    <EventBlock key={e.id} title={e.name} date={e.date} time={`${e.start} - ${e.end} WIB`} venue={e.venue} address={e.address} mapsUrl={e.mapsUrl} />
                  ))}
                </div>
                {invitation.streamUrl && (
                  <Enter className="mt-14 rounded-3xl border border-minang-gold/60 p-7 text-center">
                    <p className="font-script text-5xl text-minang-gold">Siaran Langsung</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/95">Saksikan acara kami secara daring melalui tautan berikut.</p>
                    <a href={invitation.streamUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-minang-gold px-6 py-2.5 text-minang-night">
                      <Radio size={16} /> Gabung Siaran
                    </a>
                  </Enter>
                )}
              </div>
            </section>

            {/* Galeri dan kisah */}
            {(gallery.length > 0 || story.length > 0) && (
              <section id="m-kisah" className="relative overflow-hidden bg-minang-wine px-7 py-16">
                <EngravedScene className="absolute inset-0 h-full w-full text-[#5a0f28] opacity-40" />
                <div className="relative">
                  {gallery.length > 0 && (
                    <div className="mb-14">
                      <Enter>
                        <p className="text-center font-script text-5xl text-minang-gold">Momen Kami</p>
                      </Enter>
                      <div className="mt-7 grid grid-cols-2 gap-3">
                        {gallery.map((src, i) => (
                          <Enter key={i} from={i % 2 ? "right" : "left"} className="aspect-[3/4] overflow-hidden rounded-xl">
                            <Photo src={src} alt={`Momen ${i + 1}`} fallback="" />
                          </Enter>
                        ))}
                      </div>
                    </div>
                  )}
                  {story.length > 0 && (
                    <Enter className="rounded-3xl bg-minang-night/80 p-6">
                      <p className="text-center font-script text-5xl text-minang-gold">Kisah Kami</p>
                      <ol className="mt-7 space-y-7 overflow-x-clip">
                        {story.map((s, i) => (
                          <Enter key={s.id} from={i % 2 ? "left" : "right"} className={cn("border-minang-gold/70 text-[15px]", i % 2 ? "border-l-2 pl-4" : "border-r-2 pr-4 text-right")}>
                            <li>
                              <p className="font-script text-3xl leading-tight text-white">{s.title}</p>
                              <p className="text-sm text-minang-gold">{s.date}</p>
                              <p className="mt-2 leading-relaxed text-white/95">{s.text}</p>
                            </li>
                          </Enter>
                        ))}
                      </ol>
                    </Enter>
                  )}
                </div>
              </section>
            )}

            {/* Ucapan, RSVP, hadiah */}
            <section id="m-ucapan" className="relative overflow-hidden bg-[#e9ccd4] px-7 py-16">
              <Wash className="absolute inset-0 h-full w-full" color="#b45f76" />
              <div className="relative">
                <Enter>
                  <RsvpForm guest={guest} mode={mode} theme={RSVP_THEME} onRsvp={onRsvp} />
                </Enter>
                {state.wishes.length > 0 && (
                  <Enter className="mt-8 rounded-3xl bg-minang-maroon p-5">
                    <h3 className="text-center font-script text-5xl text-minang-gold">Doa &amp; Ucapan</h3>
                    <ul className="mt-4 max-h-80 space-y-2.5 overflow-y-auto pr-1">
                      {state.wishes.slice(0, 12).map((w) => (
                        <li key={w.id} className="rounded-2xl bg-white/95 px-4 py-3 text-minang-night">
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-minang-wine">
                            <Heart size={13} className="fill-minang-wine" /> {w.name}
                          </p>
                          <p className="mt-0.5 text-sm">{w.message}</p>
                        </li>
                      ))}
                    </ul>
                  </Enter>
                )}
                {invitation.gift?.number && (
                  <Enter className="mt-8 rounded-3xl bg-minang-maroon p-6 text-center">
                    <Gift className="mx-auto text-minang-gold" />
                    <p className="mt-2 font-script text-5xl text-minang-gold">Kirim Hadiah</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/95">Doa restu Anda sudah sangat berarti. Bila berkenan memberi tanda kasih, Anda dapat mengirimkannya secara nontunai.</p>
                    <button onClick={() => setGiftOpen(!giftOpen)} aria-expanded={giftOpen} className="mt-4 rounded-lg bg-minang-gold px-5 py-2 text-sm text-minang-night">
                      {giftOpen ? "Tutup rekening" : "Lihat rekening"}
                    </button>
                    <AnimatePresence>
                      {giftOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-4 rounded-2xl bg-white/10 p-4">
                            <p className="text-sm text-white/85">{invitation.gift.bank}</p>
                            <p className="mt-1 text-xl tracking-wider text-minang-gold">{invitation.gift.number}</p>
                            <p className="text-sm text-white/85">a.n. {invitation.gift.holder}</p>
                            <button onClick={copyAccount} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-minang-gold px-3 py-1.5 text-xs">
                              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Tersalin" : "Salin nomor"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Enter>
                )}
              </div>
            </section>

            {/* Penutup */}
            <section className="relative overflow-hidden bg-[#e9ccd4] px-7 pb-24">
              <Wash className="absolute inset-0 h-full w-full" color="#b45f76" />
              <Enter className="relative rounded-3xl bg-minang-maroon px-6 py-10 text-center">
                <p className="text-[15px] leading-relaxed text-white">{invitation.closing}</p>
                <p className="mt-6 text-sm text-white/80">Kami yang berbahagia,</p>
                <p className="mt-1 font-script text-5xl leading-tight break-words text-minang-gold">
                  {bride} &amp; {groom}
                </p>
                <div className="mx-auto mt-6 w-32">
                  <RumahGadang />
                </div>
              </Enter>
            </section>

            {/* Menu bawah dan tombol musik */}
            <div className="sticky bottom-0 z-30">
              <motion.button
                onClick={toggleMusic}
                animate={playing ? { rotate: 360 } : { rotate: 0 }}
                transition={playing ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                className="absolute -top-12 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-minang-gold text-minang-night"
                aria-label={playing ? "Matikan musik" : "Putar musik"}
                aria-pressed={playing}
              >
                {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </motion.button>
              <nav className="grid grid-cols-5 bg-minang-night/95" aria-label="Bagian undangan">
                {NAV.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} aria-label={label} className="flex justify-center py-3.5 text-minang-glow">
                    <Icon size={21} strokeWidth={1.6} />
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
