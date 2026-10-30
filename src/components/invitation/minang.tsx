"use client";

import { CalendarDays, Check, Clock, Copy, Gift, Heart, Home, Images, MailOpen, MapPin, MessageCircleHeart, Users, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatDate, titleCase } from "@/lib/format";
import type { AppState, Guest } from "@/lib/types";
import { RsvpForm, type RsvpInput, type RsvpTheme } from "../invitation-rsvp";
import { GoldDivider, GoldFrame, Hibiscus, Leaf, Petal, RumahGadang } from "./minang-art";
import { Talempong } from "./talempong";

const RSVP_THEME: RsvpTheme = {
  panel: "bg-minang-maroon/90 border-minang-gold/60 text-white",
  accent: "text-minang-glow font-script",
  muted: "text-white/70",
  button: "bg-minang-gold text-minang-night",
  field: "border-minang-gold/50 bg-white/95 text-minang-night",
};

const ENTER: Record<"zoom" | "left" | "right" | "up", Variants> = {
  zoom: { hidden: { opacity: 0, scale: 0.55 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -70 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 70 }, show: { opacity: 1, x: 0 } },
  up: { hidden: { opacity: 0, y: 44 }, show: { opacity: 1, y: 0 } },
};

function Enter({ from = "up", delay = 0, className, children }: { from?: keyof typeof ENTER; delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      variants={ENTER[from]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bunga di sudut: membesar-mengecil pelan, daunnya bergoyang. */
function FloralCorner({ side, className }: { side: "left" | "right"; className?: string }) {
  const flip = side === "right";
  return (
    <div className={cn("pointer-events-none absolute z-10 w-32", className)} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <motion.div className="absolute top-2 left-14 w-9 origin-bottom" animate={{ rotate: [-8, 10, -8] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
        <Leaf />
      </motion.div>
      <motion.div className="absolute top-8 left-0 w-9 origin-bottom -rotate-45" animate={{ rotate: [-55, -35, -55] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
        <Leaf tone="#2f6650" />
      </motion.div>
      <motion.div className="relative mt-12 w-24" animate={{ scale: [0.95, 1, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <Hibiscus />
      </motion.div>
    </div>
  );
}

function FallingPetals() {
  const petals = [
    { left: "8%", delay: 0, duration: 11 },
    { left: "26%", delay: 3.5, duration: 13 },
    { left: "48%", delay: 7, duration: 10 },
    { left: "68%", delay: 1.5, duration: 14 },
    { left: "88%", delay: 5, duration: 12 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <motion.div
          key={p.left}
          className="absolute -top-8 w-3.5"
          style={{ left: p.left }}
          animate={{ y: [0, 900], x: [0, 30, -20, 25], rotate: [0, 200, 420], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <Petal />
        </motion.div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Enter from="zoom" className="text-center">
      <h2 className="font-script text-[2.6rem] leading-tight text-minang-glow">{children}</h2>
      <GoldDivider className="mx-auto mt-1 w-36" />
    </Enter>
  );
}

function Photo({ src, alt, fallback, className }: { src?: string; alt: string; fallback: string; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- foto berupa data URL dari unggahan pengguna
    return <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }
  return <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-minang-wine to-minang-night font-script text-7xl text-minang-glow", className)}>{fallback}</div>;
}

function Couple({ title, name, parents, photo, side }: { title: string; name: string; parents?: string; photo?: string; side: "left" | "right" }) {
  return (
    <section className={cn("relative overflow-hidden px-6 py-14", side === "left" ? "bg-minang-rose/90" : "bg-minang-wine")}>
      <div className="bg-songket absolute inset-0" />
      <Enter from={side} className="relative mx-auto max-w-sm rounded-t-full border-2 border-minang-gold/50 bg-minang-maroon px-6 pt-14 pb-10 text-center">
        <p className="font-script text-4xl text-white">{title}</p>
        <motion.div className="relative mx-auto mt-6 w-48" animate={{ scale: [0.97, 1, 0.97] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
          <div className="absolute inset-[9%] overflow-hidden rounded-[50%]">
            <Photo src={photo} alt={`Foto ${name}`} fallback={name.charAt(0)} />
          </div>
          <GoldFrame className="relative" />
        </motion.div>
        <p className="mt-5 font-script text-[2.5rem] leading-tight text-minang-glow">{name}</p>
        {parents && <p className="mt-2 font-marcellus text-sm leading-relaxed text-white/85">{parents}</p>}
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
    <div className="mt-6 grid grid-cols-4 gap-2">
      {units.map((u) => (
        <div key={u.label} className="rounded-xl border border-minang-gold/70 bg-minang-night/50 py-3 text-center">
          <div className="h-9 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={u.value}
                initial={{ y: -28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 28, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="font-marcellus text-3xl leading-9 text-minang-glow tabular-nums"
              >
                {String(u.value).padStart(2, "0")}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-1 font-marcellus text-[11px] text-white/80">{u.label}</p>
        </div>
      ))}
    </div>
  );
}

const NAV = [
  { id: "m-beranda", label: "Beranda", icon: Home },
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

  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(NAV[0].id);
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

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyAccount() {
    if (!invitation.gift) return;
    await navigator.clipboard?.writeText(invitation.gift.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const track = (id: string) => ({ id, onViewportEnter: () => setActive(id), viewport: { amount: 0.3 } });
  const coverHeight = mode === "live" ? "min-h-svh" : "min-h-[640px]";

  return (
    <div className={cn("relative overflow-x-clip bg-minang-night font-marcellus text-white", coverHeight)}>
      <AnimatePresence>
        {!opened && (
          <motion.section
            key="sampul"
            exit={{ y: "-105%", opacity: 0.6 }}
            transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
            className={cn("absolute inset-x-0 top-0 z-40 flex flex-col items-center justify-center overflow-hidden px-6 py-10 text-center", mode === "live" ? "h-svh" : "h-[640px]")}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-minang-wine via-minang-rose to-minang-night">
              {photos.cover && (
                // eslint-disable-next-line @next/next/no-img-element -- foto berupa data URL dari unggahan pengguna
                <img src={photos.cover} alt={`${bride} dan ${groom}`} className="h-full w-full object-cover opacity-75" />
              )}
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(236_208_214/0.55),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(63_10_29/0.85),transparent_60%)]" />
            <div className="bg-songket absolute inset-0" />
            <FloralCorner side="left" className="top-2 -left-3" />
            <FloralCorner side="right" className="-right-3 bottom-4" />

            <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: "backOut" }} className="relative z-10 w-52">
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                <RumahGadang />
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }} className="relative z-10 mt-4">
              <p className="font-script text-3xl text-minang-glow">Undangan Pernikahan</p>
              <p className="mt-1 font-script text-[3.2rem] leading-tight text-white drop-shadow">
                {bride} &amp; {groom}
              </p>
              <p className="mt-2 text-sm tracking-wide text-white/90">{formatDate(wedding.date, "weekday")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }} className="relative z-10 mt-8">
              <p className="text-sm text-white/90">Kepada Yth,</p>
              <p className="mt-1 text-2xl text-minang-glow">{guest?.name ?? "Tamu Undangan"}</p>
              <motion.button
                onClick={open}
                animate={{ scale: [1, 1.05, 1] }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-minang-gold px-6 py-2.5 text-minang-night shadow-lg"
              >
                <MailOpen size={18} /> Buka Undangan
              </motion.button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {opened && (
        <>
          {/* Gerbang pembuka */}
          <motion.section {...track("m-beranda")} className="relative overflow-hidden">
            <FallingPetals />
            <div className="relative flex min-h-[620px] flex-col items-center bg-minang-maroon px-5 pt-5 pb-10">
              <div className="bg-songket absolute inset-0" />
              <FloralCorner side="left" className="top-44 -left-4" />
              <FloralCorner side="right" className="-right-4 bottom-2" />
              <div className="relative w-full max-w-sm rounded-t-full border-[10px] border-minang-blush/90 p-1.5 shadow-[0_0_0_2px_rgb(233_181_42/0.7)]">
                <div className="flex min-h-[530px] flex-col items-center rounded-t-full bg-gradient-to-b from-minang-night to-minang-wine px-6 pt-16 pb-8 text-center">
                  <motion.div className="w-40" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: "backOut" }}>
                    <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                      <RumahGadang />
                    </motion.div>
                  </motion.div>
                  <Enter from="zoom" delay={0.7}>
                    <p className="mt-6 font-script text-5xl leading-tight text-minang-glow">
                      {bride} <span className="text-3xl text-white">&amp;</span> {groom}
                    </p>
                  </Enter>
                  <Enter delay={0.9}>
                    <p className="mt-5 text-[15px] leading-relaxed text-white/90">{invitation.opening}</p>
                  </Enter>
                </div>
              </div>
            </div>
          </motion.section>

          {invitation.quote && (
            <section className="relative overflow-hidden bg-minang-blush px-6 py-12 text-center text-minang-night">
              <Enter from="zoom" className="mx-auto max-w-sm">
                <p className="text-base leading-relaxed italic">“{invitation.quote}”</p>
                <p className="mt-3 text-sm font-semibold text-minang-wine">{invitation.quoteSource}</p>
              </Enter>
            </section>
          )}

          <motion.div {...track("m-mempelai")}>
            <Couple side="left" title="Mempelai Wanita" name={bride} parents={invitation.brideParents} photo={photos.bride} />
            <Couple side="right" title="Mempelai Pria" name={groom} parents={invitation.groomParents} photo={photos.groom} />
          </motion.div>

          {/* Hitung mundur dan acara */}
          <motion.section {...track("m-acara")} className="relative overflow-hidden bg-minang-maroon px-6 py-14">
            <div className="bg-songket absolute inset-0" />
            <div className="relative mx-auto max-w-sm">
              {wedding.date && (
                <>
                  <SectionTitle>Menuju Hari Bahagia</SectionTitle>
                  <Enter>
                    <Countdown date={wedding.date} />
                  </Enter>
                </>
              )}
              <div className="mt-12 space-y-6">
                {visibleEvents.map((e, i) => (
                  <Enter key={e.id} from={i % 2 ? "right" : "left"}>
                    <div className="rounded-t-[7rem] rounded-b-3xl border-2 border-minang-gold/60 bg-minang-night/60 px-6 pt-12 pb-7 text-center">
                      <p className="font-script text-[2.6rem] leading-tight text-minang-glow">{e.name}</p>
                      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/95">
                        <CalendarDays size={15} className="text-minang-gold" /> {formatDate(e.date, "weekday")}
                      </p>
                      <p className="mt-1.5 flex items-center justify-center gap-2 text-sm text-white/95">
                        <Clock size={15} className="text-minang-gold" /> {e.start} – {e.end} WIB
                      </p>
                      <p className="mt-4 text-lg text-minang-glow">{e.venue || "Lokasi menyusul"}</p>
                      <p className="mt-1 text-sm text-white/80">{e.address}</p>
                      {e.mapsUrl && (
                        <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} href={e.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-minang-gold px-5 py-2 text-sm text-minang-night">
                          <MapPin size={15} /> Lihat Lokasi
                        </motion.a>
                      )}
                    </div>
                  </Enter>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Galeri dan kisah */}
          {(gallery.length > 0 || story.length > 0) && (
            <motion.section {...track("m-kisah")} className="relative overflow-hidden bg-minang-wine px-6 py-14">
              <div className="bg-songket absolute inset-0" />
              <div className="relative mx-auto max-w-sm">
                {gallery.length > 0 && (
                  <>
                    <SectionTitle>Momen Kami</SectionTitle>
                    <div className="mt-7 grid grid-cols-2 gap-3">
                      {gallery.map((src, i) => (
                        <Enter key={i} from={i % 2 ? "right" : "left"} className={cn("overflow-hidden rounded-2xl border border-minang-gold/60", i % 3 === 0 ? "aspect-[3/4]" : "aspect-square")}>
                          <Photo src={src} alt={`Momen ${i + 1}`} fallback="" />
                        </Enter>
                      ))}
                    </div>
                  </>
                )}
                {story.length > 0 && (
                  <div className={gallery.length ? "mt-14" : ""}>
                    <SectionTitle>Kisah Kami</SectionTitle>
                    <ol className="relative mt-8 space-y-7 border-l-2 border-minang-gold/60 pl-6">
                      {story.map((s, i) => (
                        <Enter key={s.id} from={i % 2 ? "right" : "left"} className="relative">
                          <li>
                            <span className="absolute top-1 -left-[33px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-minang-gold bg-minang-night" />
                            <p className="font-script text-3xl leading-tight text-minang-glow">{s.title}</p>
                            <p className="text-xs tracking-wide text-minang-gold">{s.date}</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/90">{s.text}</p>
                          </li>
                        </Enter>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Ucapan, RSVP, dan hadiah */}
          <motion.section {...track("m-ucapan")} className="relative overflow-hidden bg-minang-blush px-6 py-14">
            <FloralCorner side="right" className="-top-6 -right-6" />
            <Enter>
              <RsvpForm guest={guest} mode={mode} theme={RSVP_THEME} onRsvp={onRsvp} />
            </Enter>
            {state.wishes.length > 0 && (
              <div className="mx-auto mt-8 max-w-md">
                <h3 className="text-center font-script text-4xl text-minang-wine">Doa &amp; Ucapan</h3>
                <ul className="mt-4 max-h-80 space-y-2.5 overflow-y-auto">
                  {state.wishes.slice(0, 12).map((w, i) => (
                    <Enter key={w.id} delay={i * 0.04}>
                      <li className="rounded-2xl bg-white/85 px-4 py-3 text-minang-night">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-minang-wine">
                          <Heart size={13} className="fill-minang-wine" /> {w.name}
                        </p>
                        <p className="mt-0.5 text-sm">{w.message}</p>
                      </li>
                    </Enter>
                  ))}
                </ul>
              </div>
            )}
            {invitation.gift?.number && (
              <Enter className="mx-auto mt-8 max-w-md rounded-3xl bg-minang-wine p-6 text-center text-white">
                <Gift className="mx-auto text-minang-glow" />
                <p className="mt-2 font-script text-4xl text-minang-glow">Kirim Hadiah</p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">Doa restu Anda sudah sangat berarti. Bila berkenan memberi tanda kasih, Anda dapat mengirimkannya secara nontunai.</p>
                <button onClick={() => setGiftOpen(!giftOpen)} aria-expanded={giftOpen} className="mt-4 rounded-lg bg-minang-gold px-5 py-2 text-sm text-minang-night">
                  {giftOpen ? "Tutup rekening" : "Lihat rekening"}
                </button>
                <AnimatePresence>
                  {giftOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 rounded-2xl bg-white/10 p-4">
                        <p className="text-sm text-white/85">{invitation.gift.bank}</p>
                        <p className="mt-1 text-xl tracking-wider text-minang-glow">{invitation.gift.number}</p>
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
          </motion.section>

          {/* Penutup */}
          <section className="relative overflow-hidden bg-minang-night px-6 pt-14 pb-24 text-center">
            <div className="bg-songket absolute inset-0" />
            <Enter from="zoom" className="relative mx-auto max-w-sm">
              <div className="mx-auto w-32">
                <RumahGadang />
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-white/90">{invitation.closing}</p>
              <p className="mt-6 text-sm text-white/70">Kami yang berbahagia,</p>
              <p className="mt-1 font-script text-5xl leading-tight text-minang-glow">
                {bride} &amp; {groom}
              </p>
            </Enter>
          </section>

          {/* Menu bawah dan tombol musik */}
          <div className="sticky bottom-0 z-30">
            <motion.button
              onClick={toggleMusic}
              animate={playing ? { rotate: 360 } : { rotate: 0 }}
              transition={playing ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
              className="absolute -top-12 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-minang-gold bg-minang-night text-minang-glow"
              aria-label={playing ? "Matikan musik" : "Putar musik"}
              aria-pressed={playing}
            >
              {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </motion.button>
            <nav className="grid grid-cols-5 border-t border-minang-gold/50 bg-minang-night/95 backdrop-blur" aria-label="Bagian undangan">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => goTo(id)} aria-label={label} aria-current={active === id ? "true" : undefined} className={cn("relative flex justify-center py-3 transition-colors", active === id ? "text-minang-glow" : "text-white/55")}>
                  {active === id && <motion.span layoutId="minang-nav" className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-minang-gold" />}
                  <Icon size={20} />
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
