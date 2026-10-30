"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";

const INK = "#3b2340";
const line = { stroke: INK, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" } as const;
/** Titik putar transform dalam SVG mengikuti kotak elemennya sendiri. */
const pivot = (x: string, y: string): CSSProperties => ({ transformBox: "fill-box", transformOrigin: `${x} ${y}` });

export type Mood = "happy" | "wow" | "panic";

function Eyes({ left, right, y, delay = 0 }: { left: number; right: number; y: number; delay?: number }) {
  return (
    <motion.g
      style={pivot("50%", "50%")}
      animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
      transition={{ duration: 4.2, times: [0, 0.9, 0.94, 0.98, 1], repeat: Infinity, delay }}
    >
      {[left, right].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx="6.5" ry="8" fill={INK} />
          <circle cx={x + 2.2} cy={y - 3} r="2.4" fill="#fff" />
        </g>
      ))}
    </motion.g>
  );
}

function Mouth({ x, y, mood }: { x: number; y: number; mood: Mood }) {
  if (mood === "wow") return <ellipse cx={x} cy={y + 3} rx="7" ry="9" fill="#d9486f" {...line} strokeWidth={3} />;
  if (mood === "panic") return <path d={`M${x - 11} ${y + 4} q5.5 -7 11 0 q5.5 7 11 0`} fill="none" {...line} strokeWidth={3.5} />;
  return <path d={`M${x - 11} ${y - 2} Q${x} ${y + 13} ${x + 11} ${y - 2} Z`} fill="#d9486f" {...line} strokeWidth={3} />;
}

function Cheeks({ left, right, y }: { left: number; right: number; y: number }) {
  return (
    <>
      <ellipse cx={left} cy={y} rx="9" ry="6" fill="#ff8fb3" opacity="0.75" />
      <ellipse cx={right} cy={y} rx="9" ry="6" fill="#ff8fb3" opacity="0.75" />
    </>
  );
}

function Sweat({ x, y }: { x: number; y: number }) {
  return (
    <motion.path
      d={`M${x} ${y} q-9 14 0 19 q9 -5 0 -19 Z`}
      fill="#8ed6ff"
      {...line}
      strokeWidth={3}
      animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.3, repeat: Infinity }}
    />
  );
}

/** Pasangan chibi: pengantin wanita bersiger dan pengantin pria berpeci. */
export function Couple({ mood = "happy", className }: { mood?: Mood; className?: string }) {
  return (
    <svg viewBox="0 0 340 320" className={className} role="img" aria-label="Ilustrasi pasangan pengantin yang lucu">
      <ellipse cx="170" cy="300" rx="130" ry="14" fill={INK} opacity="0.12" />

      {/* Pengantin wanita */}
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M58 296 Q60 205 112 198 Q164 205 166 296 Q112 310 58 296 Z" fill="#fff" {...line} />
        <path d="M66 270 q11 11 23 0 q11 11 23 0 q11 11 23 0 q11 11 23 0" fill="none" stroke="#ff7eb0" strokeWidth="4" strokeLinecap="round" />
        <path d="M92 202 L112 232 L132 202" fill="none" stroke="#ffd45e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <motion.g style={pivot("50%", "100%")} animate={{ rotate: [-2, 4, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {/* Siger */}
          <path d="M60 104 L70 62 L84 88 L97 46 L112 82 L127 46 L140 88 L154 62 L164 104 Q112 76 60 104 Z" fill="#ffd45e" {...line} />
          <circle cx="97" cy="58" r="4.5" fill="#ff7eb0" />
          <circle cx="127" cy="58" r="4.5" fill="#ff7eb0" />
          <circle cx="112" cy="84" r="5.5" fill="#7be3c4" stroke={INK} strokeWidth="2.5" />
          {/* Kepala */}
          <circle cx="112" cy="138" r="56" fill="#ffd9bd" {...line} />
          <path d="M57 134 Q58 88 112 88 Q166 88 167 134 Q150 104 112 104 Q74 104 57 134 Z" fill={INK} />
          {/* Roncean melati */}
          {[120, 138, 156, 174].map((y) => (
            <g key={y}>
              <circle cx="56" cy={y} r="7.5" fill="#fff" {...line} strokeWidth={2.5} />
              <circle cx="168" cy={y} r="7.5" fill="#fff" {...line} strokeWidth={2.5} />
            </g>
          ))}
          <Eyes left={92} right={132} y={138} />
          <Cheeks left={80} right={144} y={156} />
          <Mouth x={112} y={160} mood={mood} />
        </motion.g>
      </motion.g>

      {/* Pengantin pria */}
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <path d="M180 296 Q180 208 236 202 Q292 208 292 296 Q236 310 180 296 Z" fill="#6a5acd" {...line} />
        <path d="M216 204 L236 244 L256 204 Z" fill="#fff" {...line} strokeWidth={3} />
        <circle cx="236" cy="262" r="4.5" fill="#ffd45e" stroke={INK} strokeWidth="2.5" />
        <circle cx="236" cy="282" r="4.5" fill="#ffd45e" stroke={INK} strokeWidth="2.5" />
        {/* Tangan melambai */}
        <motion.g style={pivot("15%", "95%")} animate={{ rotate: [0, -28, 0, -28, 0, 0] }} transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.14, 0.28, 0.42, 0.56, 1] }}>
          <path d="M286 232 L316 188" fill="none" stroke={INK} strokeWidth="19" strokeLinecap="round" />
          <path d="M286 232 L316 188" fill="none" stroke="#6a5acd" strokeWidth="12" strokeLinecap="round" />
          <circle cx="319" cy="180" r="11" fill="#f2c29c" {...line} strokeWidth={3.5} />
        </motion.g>
        <motion.g style={pivot("50%", "100%")} animate={{ rotate: [2, -4, 2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="236" cy="142" r="54" fill="#f2c29c" {...line} />
          {/* Peci */}
          <path d="M186 118 L190 82 Q236 66 282 82 L286 118 Q236 100 186 118 Z" fill={INK} {...line} />
          <path d="M190 104 Q236 88 282 104" fill="none" stroke="#ffd45e" strokeWidth="4" />
          <Eyes left={216} right={256} y={144} delay={0.7} />
          <Cheeks left={204} right={268} y={162} />
          <Mouth x={236} y={166} mood={mood} />
          {mood === "panic" && <Sweat x={284} y={126} />}
        </motion.g>
      </motion.g>

      {/* Hati kecil di antara mereka */}
      {[0, 1.1].map((delay) => (
        <motion.path
          key={delay}
          d="M174 60 c-9 -13 -26 -3 -15 11 l15 15 l15 -15 c11 -14 -6 -24 -15 -11 Z"
          fill="#ff7eb0"
          {...line}
          strokeWidth={3}
          style={pivot("50%", "50%")}
          initial={{ opacity: 0, y: 40, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], y: [50, 10, -30], scale: [0.4, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

/** Wajah kecil anggota keluarga untuk bagian bagi tugas. */
export function Face({ variant, className }: { variant: "bride" | "groom" | "mom"; className?: string }) {
  const skin = variant === "groom" ? "#f2c29c" : "#ffd9bd";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {variant === "bride" && <path d="M18 34 L26 10 L38 26 L50 4 L62 26 L74 10 L82 34 Q50 18 18 34 Z" fill="#ffd45e" {...line} strokeWidth={3} />}
      {variant === "mom" && <path d="M12 54 Q10 12 50 12 Q90 12 88 54 L92 92 Q50 104 8 92 Z" fill="#c8b6ff" {...line} strokeWidth={3} />}
      <circle cx="50" cy="54" r="36" fill={skin} {...line} strokeWidth={3} />
      {variant === "bride" && <path d="M14 52 Q16 24 50 24 Q84 24 86 52 Q72 36 50 36 Q28 36 14 52 Z" fill={INK} />}
      {variant === "groom" && <path d="M16 42 L19 18 Q50 8 81 18 L84 42 Q50 30 16 42 Z" fill={INK} {...line} strokeWidth={3} />}
      {variant === "mom" && <path d="M16 46 Q50 16 84 46 Q50 34 16 46 Z" fill="#a78bfa" />}
      <Eyes left={37} right={63} y={55} delay={variant === "groom" ? 1 : variant === "mom" ? 2 : 0} />
      <ellipse cx="28" cy="68" rx="6" ry="4" fill="#ff8fb3" opacity="0.75" />
      <ellipse cx="72" cy="68" rx="6" ry="4" fill="#ff8fb3" opacity="0.75" />
      <path d="M41 69 Q50 79 59 69" fill="none" {...line} strokeWidth={3} />
    </svg>
  );
}

/** Celengan: berguncang setiap kali `feed` berubah. */
export function Piggy({ feed, full, className }: { feed: number; full: boolean; className?: string }) {
  return (
    <motion.svg
      key={feed}
      viewBox="0 0 260 210"
      className={className}
      role="img"
      aria-label="Celengan babi yang lucu"
      initial={{ rotate: 0, scale: 1 }}
      animate={feed ? { rotate: [0, -7, 7, -5, 5, 0], scale: [1, 1.08, 0.97, 1.03, 1] } : {}}
      transition={{ duration: 0.6 }}
    >
      <ellipse cx="125" cy="196" rx="86" ry="9" fill={INK} opacity="0.12" />
      <path d="M38 108 q-22 -6 -18 -24 q3 -11 13 -6" fill="none" {...line} strokeWidth={5} />
      {[70, 106, 150, 186].map((x) => (
        <rect key={x} x={x - 12} y="158" width="24" height="34" rx="9" fill="#ff7eb0" {...line} />
      ))}
      <ellipse cx="125" cy="108" rx="92" ry="70" fill="#ffa6c9" {...line} />
      <path d="M72 50 L60 18 L100 38 Z" fill="#ff7eb0" {...line} />
      <path d="M170 38 L208 16 L198 54 Z" fill="#ff7eb0" {...line} />
      <rect x="98" y="46" width="56" height="10" rx="5" fill={INK} />
      <ellipse cx="200" cy="118" rx="26" ry="20" fill="#ff7eb0" {...line} />
      <ellipse cx="192" cy="118" rx="4" ry="6" fill={INK} />
      <ellipse cx="208" cy="118" rx="4" ry="6" fill={INK} />
      <Eyes left={134} right={172} y={92} />
      <ellipse cx="120" cy="116" rx="11" ry="7" fill="#ff7eb0" opacity="0.8" />
      <path d={full ? "M150 134 q14 16 28 0" : "M150 138 q14 9 28 0"} fill="none" {...line} />
    </motion.svg>
  );
}

export function Coin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      <circle cx="22" cy="22" r="18" fill="#ffd45e" {...line} />
      <text x="22" y="29" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK} fontFamily="sans-serif">
        Rp
      </text>
    </svg>
  );
}

export function Heart({ className, fill = "#ff7eb0" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path d="M24 40 L6 22 C-3 10 14 -3 24 11 C34 -3 51 10 42 22 Z" fill={fill} {...line} />
    </svg>
  );
}

export function Flower({ className, fill = "#fff" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="30" cy="14" rx="10" ry="13" fill={fill} {...line} strokeWidth={3} transform={`rotate(${r} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="8" fill="#ffd45e" {...line} strokeWidth={3} />
    </svg>
  );
}

export function Ring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" className={className} aria-hidden>
      <circle cx="30" cy="44" r="20" fill="none" stroke={INK} strokeWidth="13" />
      <circle cx="30" cy="44" r="20" fill="none" stroke="#ffd45e" strokeWidth="7" />
      <path d="M30 26 L18 14 L24 5 L36 5 L42 14 Z" fill="#8ed6ff" {...line} strokeWidth={3} />
    </svg>
  );
}

export function Sparkle({ className, fill = "#ffd45e" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill={fill} {...line} strokeWidth={3} />
    </svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden>
      <path d="M26 54 C6 54 4 28 24 28 C26 10 54 6 62 22 C76 10 98 20 94 34 C114 34 114 54 96 54 Z" fill="#fff" {...line} />
    </svg>
  );
}

/** Amplop: bagian belakang dan tutupnya digambar terpisah supaya isi bisa muncul dari dalam. */
export function EnvelopeFront({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 190" className={className} aria-hidden>
      <path d="M12 12 L200 118 L388 12 L388 164 Q388 178 374 178 L26 178 Q12 178 12 164 Z" fill="#ff7eb0" {...line} strokeWidth={5} />
      <path d="M14 172 L140 84 M386 172 L260 84" fill="none" {...line} strokeWidth={4} />
      <g transform="translate(176 112)">
        <path d="M24 44 L4 24 C-6 10 14 -4 24 12 C34 -4 54 10 44 24 Z" fill="#fff" {...line} />
      </g>
    </svg>
  );
}
