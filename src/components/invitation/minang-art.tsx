import { useId } from "react";

/** Rumah Gadang berwarna emas dengan atap gonjong. Digambar sendiri untuk tema Minang. */
export function RumahGadang({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 128" className={className} role="img" aria-label="Ilustrasi Rumah Gadang">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.45" stopColor="#f4c23e" />
          <stop offset="1" stopColor="#c98a12" />
        </linearGradient>
      </defs>
      <path
        d="M6 8 C13 36 25 50 38 54 C48 49 57 30 62 2 C68 29 80 47 93 51 L120 26 L147 51 C160 47 172 29 178 2 C183 30 192 49 202 54 C215 50 227 36 234 8 C235 42 228 62 214 76 L26 76 C12 62 5 42 6 8 Z"
        fill={`url(#${id}-gold)`}
      />
      <path d="M120 34 L139 53 L101 53 Z" fill="#5a0f28" opacity="0.55" />
      <path d="M26 76 H214 L206 84 H34 Z" fill="#b57a0e" />
      <rect x="34" y="84" width="172" height="28" fill={`url(#${id}-gold)`} />
      {[46, 68, 90, 138, 160, 182].map((x) => (
        <path key={x} d={`M${x} 110 V95 a6 6 0 0 1 12 0 V110 Z`} fill="#5a0f28" />
      ))}
      <path d="M112 112 V92 a8 8 0 0 1 16 0 V112 Z" fill="#5a0f28" />
      <rect x="28" y="112" width="184" height="5" rx="2" fill="#b57a0e" />
      <path d="M104 117 H136 L142 126 H98 Z" fill={`url(#${id}-gold)`} />
    </svg>
  );
}

/** Bunga kembang sepatu bergaya cat air. */
export function Hibiscus({ className, hue = "pink" }: { className?: string; hue?: "pink" | "cream" }) {
  const id = useId();
  const [inner, outer] = hue === "pink" ? ["#b8446c", "#f7c9d6"] : ["#e7a94c", "#fff3da"];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-petal`} cx="0.5" cy="0.95" r="0.95">
          <stop offset="0" stopColor={inner} />
          <stop offset="0.55" stopColor={outer} />
          <stop offset="1" stopColor="#fff" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((r) => (
        <path
          key={r}
          d="M50 50 C30 40 24 18 38 8 C44 3 56 3 62 8 C76 18 70 40 50 50 Z"
          fill={`url(#${id}-petal)`}
          stroke={inner}
          strokeOpacity="0.28"
          transform={`rotate(${r} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill={inner} />
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <circle key={r} cx="50" cy="39" r="2.2" fill="#ffd97a" transform={`rotate(${r} 50 50)`} />
      ))}
    </svg>
  );
}

export function Leaf({ className, tone = "#3f7a5d" }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden>
      <path d="M30 118 C2 90 2 34 30 2 C58 34 58 90 30 118 Z" fill={tone} />
      <path d="M30 116 V8" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
      {[30, 48, 66, 84].map((y) => (
        <path key={y} d={`M30 ${y + 14} L14 ${y} M30 ${y + 14} L46 ${y}`} stroke="#fff" strokeOpacity="0.28" fill="none" />
      ))}
    </svg>
  );
}

export function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 24" className={className} aria-hidden>
      <path d="M10 23 C0 16 0 6 10 1 C20 6 20 16 10 23 Z" fill="#f7c9d6" stroke="#b8446c" strokeOpacity="0.3" />
    </svg>
  );
}

/** Bingkai oval emas berukir untuk foto mempelai. */
export function GoldFrame({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 250" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset="0.5" stopColor="#e9b52a" />
          <stop offset="1" stopColor="#a86f0a" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id}-g)`}>
        <ellipse cx="100" cy="125" rx="84" ry="110" strokeWidth="9" />
        <ellipse cx="100" cy="125" rx="93" ry="119" strokeWidth="2" />
        <ellipse cx="100" cy="125" rx="75" ry="101" strokeWidth="2" />
        <ellipse cx="100" cy="125" rx="84" ry="110" strokeWidth="4" strokeDasharray="1 11" strokeLinecap="round" stroke="#fff4c7" />
      </g>
      <g fill={`url(#${id}-g)`}>
        <path d="M100 0 C108 9 120 11 130 7 C126 17 114 24 100 24 C86 24 74 17 70 7 C80 11 92 9 100 0 Z" />
        <path d="M100 250 C92 241 80 239 70 243 C74 233 86 226 100 226 C114 226 126 233 130 243 C120 239 108 241 100 250 Z" />
        <circle cx="4" cy="125" r="5" />
        <circle cx="196" cy="125" r="5" />
      </g>
    </svg>
  );
}

/** Pembatas emas kecil di antara judul dan isi. */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 16" className={className} aria-hidden>
      <path d="M2 8 H62 M98 8 H158" stroke="#e9b52a" strokeWidth="1.5" />
      <path d="M80 1 L88 8 L80 15 L72 8 Z" fill="#e9b52a" />
      <circle cx="66" cy="8" r="2" fill="#e9b52a" />
      <circle cx="94" cy="8" r="2" fill="#e9b52a" />
    </svg>
  );
}
