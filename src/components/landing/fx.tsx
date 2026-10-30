"use client";

import { animate, AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

/* ---------- Konfeti ---------- */

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  size: number;
  shape: "heart" | "dot" | "star";
  color: string;
}

const COLORS = ["#ff7eb0", "#ffd45e", "#7be3c4", "#c8b6ff", "#8ed6ff"];
const SHAPES: Particle["shape"][] = ["heart", "dot", "star"];

let particles: Particle[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function emit(next: Particle[]) {
  particles = next;
  listeners.forEach((l) => l());
}

/** Lontarkan konfeti dari satu titik di layar. */
export function burstAt(x: number, y: number, count = 16) {
  const created = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 130;
    return {
      id: nextId++,
      x,
      y,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 50,
      rotate: Math.random() * 360 - 180,
      size: 12 + Math.random() * 14,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });
  emit([...particles, ...created]);
}

/** Konfeti dari tengah elemen yang diklik. */
export function burstFrom(el: Element, count?: number) {
  const r = el.getBoundingClientRect();
  burstAt(r.left + r.width / 2, r.top + r.height / 2, count);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const empty: Particle[] = [];

export function ConfettiLayer() {
  const items = useSyncExternalStore(subscribe, () => particles, () => empty);
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.dx, y: [0, p.dy, p.dy + 140], scale: [0, 1.15, 0.9], rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          onAnimationComplete={() => emit(particles.filter((x) => x.id !== p.id))}
        >
          <ParticleShape shape={p.shape} color={p.color} />
        </motion.div>
      ))}
    </div>
  );
}

function ParticleShape({ shape, color }: { shape: Particle["shape"]; color: string }) {
  if (shape === "dot") return <div className="h-full w-full rounded-full" style={{ background: color }} />;
  const d = shape === "heart" ? "M12 21 L3 12 C-2 6 7 -1 12 6 C17 -1 26 6 21 12 Z" : "M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z";
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d={d} fill={color} />
    </svg>
  );
}

/* ---------- Muncul saat di-scroll ---------- */

export function Reveal({ children, delay = 0, className, rotate = 0 }: { children: ReactNode; delay?: number; className?: string; rotate?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 46, scale: 0.92, rotate: rotate - 3 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 170, damping: 14, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Judul yang katanya meloncat satu per satu. */
export function PopWords({ text, className, delay = 0, once = false }: { text: string; className?: string; delay?: number; once?: boolean }) {
  const words = text.split(" ");
  const shared = { type: "spring" as const, stiffness: 300, damping: 13 };
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block whitespace-pre">
          <motion.span
            className="inline-block"
            initial={{ y: 34, scale: 0.5, opacity: 0, rotate: i % 2 ? 7 : -7 }}
            {...(once ? { animate: { y: 0, scale: 1, opacity: 1, rotate: 0 } } : { whileInView: { y: 0, scale: 1, opacity: 1, rotate: 0 }, viewport: { once: true, amount: 0.5 } })}
            transition={{ ...shared, delay: delay + i * 0.07 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Melayang naik turun tanpa henti. */
export function Floaty({ children, className, duration = 3.5, delay = 0, distance = 12, spin = 6 }: { children: ReactNode; className?: string; duration?: number; delay?: number; distance?: number; spin?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0], rotate: [-spin, spin, -spin] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}

/** Pita berjalan. */
export function Marquee({ items, className, tilt = -1.5 }: { items: ReactNode[]; className?: string; tilt?: number }) {
  return (
    <div className={className} style={{ transform: `rotate(${tilt}deg) scale(1.03)` }}>
      <motion.div className="flex w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <div key={i} className="flex shrink-0 items-center gap-8">
                {item}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Angka yang berjalan menuju nilainya. */
export function CountUp({ to, format = (n) => String(Math.round(n)), className, duration = 1.1 }: { to: number; format?: (n: number) => string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const value = useMotionValue(0);
  const [text, setText] = useState(format(0));
  useMotionValueEvent(value, "change", (v) => setText(format(v)));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, value, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

export { AnimatePresence, motion };

/** Tombol stiker yang memantul saat disentuh. */
export const bounce = {
  whileHover: { y: -3, rotate: -1.5, scale: 1.04 },
  whileTap: { y: 2, scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 14 },
} as const;
