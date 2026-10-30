import { useId, type CSSProperties } from "react";

/* Semua ilustrasi tema Minang digambar sendiri dengan SVG, bukan aset pihak lain. */

const f = (n: number) => n.toFixed(1);

/* ---------- Rumah Gadang ---------- */

const ROOF =
  "M4 10 C10 34 18 47 28 52 C35 47 39 34 42 14 C46 34 52 46 61 50 C68 45 73 28 77 4 C81 28 88 45 97 49 C104 44 107 36 110 30 L120 20 L130 30 C133 36 136 44 143 49 C152 45 159 28 163 4 C167 28 172 45 179 50 C188 46 194 34 198 14 C201 34 205 47 212 52 C222 47 230 34 236 10 C237 42 231 62 216 76 L24 76 C9 62 3 42 4 10 Z";

/** Rumah Gadang berwarna emas: tujuh gonjong dan jajaran jendela lengkung. */
export function RumahGadang({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 124" className={className} role="img" aria-label="Ilustrasi Rumah Gadang">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe48a" />
          <stop offset="0.5" stopColor="#efb521" />
          <stop offset="1" stopColor="#c6860e" />
        </linearGradient>
      </defs>
      <path d={ROOF} fill={`url(#${id}-g)`} />
      <path d="M120 26 L134 42 L120 62 L106 42 Z" fill="#5a0f28" opacity="0.5" />
      <path d="M120 20 V62" stroke="#ffe48a" strokeWidth="1.5" />
      <path d="M24 76 H216 L208 83 H32 Z" fill="#a8700a" />
      <rect x="32" y="83" width="176" height="29" fill={`url(#${id}-g)`} />
      {[38, 50, 62, 74, 86, 144, 156, 168, 180, 192].map((x) => (
        <path key={x} d={`M${x} 108 V94 a4 4 0 0 1 8 0 V108 Z`} fill="#5a0f28" />
      ))}
      <path d="M110 112 V92 a10 10 0 0 1 20 0 V112 Z" fill="#5a0f28" />
      <rect x="26" y="112" width="188" height="4" fill="#a8700a" />
      <path d="M106 116 H134 L140 124 H100 Z" fill={`url(#${id}-g)`} />
    </svg>
  );
}

/* ---------- Adegan 1: gunung dan burung ---------- */

export function MountainScene({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 432 860" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#aab6e4" />
          <stop offset="0.6" stopColor="#e6e9f6" />
        </linearGradient>
        <filter id={`${id}-paint`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="12" />
        </filter>
      </defs>
      <rect width="432" height="860" fill={`url(#${id}-sky)`} />
      <g filter={`url(#${id}-paint)`}>
      <g fill="#fff">
        <path d="M-20 60 Q30 10 70 50 Q110 20 130 70 Q170 80 130 110 L-20 120 Z" />
        <path d="M250 120 Q300 60 350 110 Q400 80 450 130 L450 220 Q340 200 260 190 Q210 160 250 120 Z" opacity="0.9" />
        <path d="M-20 250 Q40 210 90 250 Q140 240 160 290 L-20 320 Z" opacity="0.85" />
      </g>
      <path d="M216 190 C260 230 330 330 470 450 V690 H-40 V440 C70 360 170 230 216 190 Z" fill="#183a6b" />
      <path d="M216 190 C228 230 262 300 300 350 C280 300 268 240 262 232 C246 218 230 200 216 190 Z" fill="#d6c95a" />
      <path d="M250 225 C290 280 340 340 390 390 C360 340 320 280 286 258 Z" fill="#a9b84a" />
      <path d="M300 262 C340 310 400 380 470 430 V380 C420 340 360 280 322 258 Z" fill="#e0d268" />
      <path d="M216 190 C190 240 150 300 110 345 C145 320 190 280 214 240 Z" fill="#2c5b8a" />
      <path d="M180 260 C150 320 90 390 20 440 C80 420 150 370 192 310 Z" fill="#23507f" />
      <path d="M230 300 C240 360 300 420 370 470 C330 420 280 360 268 310 Z" fill="#e0d268" opacity="0.75" />
      <path d="M150 360 C130 410 80 450 30 480 C90 470 140 440 170 400 Z" fill="#3a6f8f" />
      <path d="M270 400 C300 430 350 470 420 500 C370 460 320 420 300 396 Z" fill="#8fa949" />
      <path d="M-40 500 C60 450 120 480 190 510 C270 470 360 470 470 520 V720 H-40 Z" fill="#2c6a55" />
      <path d="M60 520 C110 500 170 520 220 560 C160 556 100 560 40 570 Z" fill="#b9c75b" />
      <path d="M240 520 C300 500 380 520 440 570 C380 560 310 560 250 556 Z" fill="#a6bb52" />
      {[...Array(26).keys()].map((i) => {
        const x = -20 + (i * 37) % 480;
        const y = 560 + ((i * 53) % 90);
        return <ellipse key={i} cx={x} cy={y} rx={14 + (i % 4) * 5} ry={9 + (i % 3) * 4} fill={i % 3 ? "#143f3a" : "#1f5a48"} />;
      })}
      <path d="M-20 660 C100 640 300 640 460 660 V720 H-20 Z" fill="#7fae62" />
      <rect y="700" width="432" height="160" fill="#a59a8c" />
      {[...Array(40).keys()].map((i) => {
        const x = -20 + (i % 8) * 62 + (i % 3) * 8;
        const y = 712 + Math.floor(i / 8) * 30;
        const colors = ["#b5402f", "#c9663a", "#8e2f2b", "#d98a52", "#a84a35"];
        return <path key={i} d={`M${x} ${y + 22} L${x + 12} ${y} H${x + 46} L${x + 58} ${y + 22} Z`} fill={colors[i % colors.length]} />;
      })}
      </g>
    </svg>
  );
}

/* ---------- Adegan 2: lukisan Rumah Gadang ---------- */

export function LandscapeScene({ className, painted = true }: { className?: string; painted?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 432 860" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4b8c8" />
          <stop offset="0.45" stopColor="#f3efe9" />
        </linearGradient>
        <linearGradient id={`${id}-field`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4c97a" />
          <stop offset="1" stopColor="#4f7a44" />
        </linearGradient>
        {painted && (
          <filter id={`${id}-paint`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>
        )}
      </defs>
      <rect width="432" height="860" fill={`url(#${id}-sky)`} />
      <g filter={painted ? `url(#${id}-paint)` : undefined}>
        <g fill="#fff">
          <path d="M-20 170 Q40 90 110 150 Q170 90 230 150 Q300 110 340 170 Q430 160 450 230 L450 330 H-20 Z" />
          <path d="M260 70 Q310 30 360 70 Q420 60 450 110 L450 150 Q340 130 270 120 Z" opacity="0.8" />
        </g>
        <path d="M-20 330 Q90 300 190 330 Q290 240 450 220 V430 H-20 Z" fill="#26406e" />
        <path d="M-20 350 Q60 330 150 380 L-20 420 Z" fill="#9db0cf" />
        <path d="M-20 420 Q120 390 260 410 Q360 390 450 400 V860 H-20 Z" fill={`url(#${id}-field)`} />
        {/* Rumah */}
        <g transform="translate(40 280) scale(1.45)">
          <path d={ROOF} fill="#6d3a2b" />
          <path d="M77 4 C81 28 88 45 97 49 L70 49 C74 34 76 18 77 4 Z M163 4 C167 28 172 45 179 50 L150 49 C156 34 160 18 163 4 Z" fill="#94543d" />
          <path d="M120 22 L142 50 H98 Z" fill="#a8664a" />
          <path d="M24 76 H216 L206 86 H34 Z" fill="#3c1f18" />
          <rect x="34" y="86" width="172" height="34" fill="#8a5a3c" />
          {[46, 70, 94, 134, 158, 182].map((x) => (
            <rect key={x} x={x} y="93" width="12" height="20" fill="#3c1f18" />
          ))}
          <rect x="112" y="92" width="16" height="28" fill="#2c1610" />
          <path d="M26 120 H214 V132 H26 Z" fill="#b39a7a" />
          <path d="M100 120 H140 L150 138 H90 Z" fill="#8f7558" />
        </g>
        <path d="M0 520 Q130 500 240 540 Q200 620 300 700 Q160 620 80 620 Q30 560 0 520 Z" fill="#dcd38a" opacity="0.6" />
        {[...Array(14).keys()].map((i) => {
          const x = -10 + (i * 67) % 450;
          const y = 640 + ((i * 41) % 170);
          return <ellipse key={i} cx={x} cy={y} rx={34 + (i % 3) * 14} ry={22 + (i % 2) * 12} fill={i % 3 === 0 ? "#6f8f49" : i % 3 === 1 ? "#3f6a42" : "#8aa356"} />;
        })}
        <ellipse cx="60" cy="700" rx="90" ry="64" fill="#dca52f" />
        <ellipse cx="30" cy="660" rx="56" ry="38" fill="#e8bd4a" />
        <ellipse cx="120" cy="760" rx="80" ry="46" fill="#c58f2a" />
        <ellipse cx="395" cy="420" rx="46" ry="62" fill="#a7a848" />
        <rect x="390" y="460" width="8" height="50" fill="#5c432c" />
      </g>
    </svg>
  );
}

/* ---------- Ukiran pemandangan (panel kiri dan bawah sampul) ---------- */

function palmPath(cx: number, cy: number, h: number) {
  let d = `M${f(cx)} ${f(cy)} Q${f(cx + h * 0.09)} ${f(cy - h * 0.5)} ${f(cx + h * 0.03)} ${f(cy - h)}`;
  const top = { x: cx + h * 0.03, y: cy - h };
  for (let s = 0; s < 11; s++) {
    const a = -Math.PI * 0.98 + (s / 10) * Math.PI * 0.96;
    const len = h * (0.5 + 0.09 * Math.sin(s * 2.1));
    const dx = Math.cos(a) * len;
    const dy = Math.sin(a) * len * 0.62;
    for (let t = 0; t <= 22; t++) {
      const p = t / 22;
      const droop = p * p * len * 0.42;
      const x = top.x + dx * p;
      const y = top.y + dy * p + droop;
      const leaf = (1 - p) * len * 0.16 + 3;
      d += ` M${f(x)} ${f(y)} l${f(-Math.sin(a) * leaf * 0.5 + dx * 0.02)} ${f(leaf)}`;
      d += ` M${f(x)} ${f(y)} l${f(Math.sin(a) * leaf * 0.5 + dx * 0.02)} ${f(leaf * 0.72)}`;
    }
  }
  return d;
}

function frondPath(x0: number, y0: number, length: number, angle: number) {
  let d = "";
  for (let t = 0; t <= 34; t++) {
    const p = t / 34;
    const curve = angle + p * 0.7;
    const x = x0 + Math.cos(curve) * length * p;
    const y = y0 + Math.sin(curve) * length * p;
    const leaf = Math.sin(p * Math.PI) * length * 0.26 + 3;
    d += ` M${f(x)} ${f(y)} l${f(Math.cos(curve + 0.9) * leaf)} ${f(Math.sin(curve + 0.9) * leaf)}`;
    d += ` M${f(x)} ${f(y)} l${f(Math.cos(curve - 0.9) * leaf)} ${f(Math.sin(curve - 0.9) * leaf)}`;
  }
  return d;
}

function fieldPath() {
  let d = "";
  for (let row = 0; row < 15; row++) {
    const y = 560 + row * row * 1.15 + row * 6;
    const size = 3 + row * 0.9;
    for (let x = -20; x < 1220; x += 5 + row * 1.5) {
      const wob = Math.sin(x * 0.7 + row) * 2;
      d += ` M${f(x)} ${f(y + wob)} l${f(wob * 0.4)} ${f(-size)}`;
    }
  }
  return d;
}

function hatch(x0: number, x1: number, y0: number, y1: number, gap: number) {
  let d = "";
  for (let x = x0; x <= x1; x += gap) d += ` M${x} ${y0} L${x} ${y1}`;
  return d;
}

const PALMS = [palmPath(150, 560, 400), palmPath(960, 500, 290), palmPath(1080, 560, 360), palmPath(280, 530, 230), palmPath(860, 510, 200)].join(" ");
const FRONDS = [frondPath(-30, 620, 520, -0.7), frondPath(-10, 790, 560, -0.45), frondPath(1230, 800, 420, -2.6), frondPath(1240, 640, 340, -2.9)].join(" ");
const FIELD = fieldPath();

/** Pemandangan bergaya ukiran. Warnanya mengikuti `currentColor`. */
export function EngravedScene({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <clipPath id={`${id}-roof`}>
          <path d={ROOF} />
        </clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M300 430 Q460 330 600 380 Q760 300 930 420" strokeWidth="1.5" opacity="0.6" />
        <path d={PALMS} strokeWidth="1.5" />
        <g transform="translate(400 300) scale(2.1)" strokeWidth="0.9">
          <path d={ROOF} />
          <g clipPath={`url(#${id}-roof)`}>
            <path d={hatch(0, 240, 0, 80, 3)} />
          </g>
          <path d="M24 76 H216 L206 86 H34 Z M34 86 V122 H206 V86 M26 122 H214" />
          <path d={hatch(34, 206, 86, 122, 5)} opacity="0.45" />
          {[46, 70, 94, 134, 158, 182].map((x) => (
            <rect key={x} x={x} y="92" width="12" height="20" fill="currentColor" />
          ))}
          <rect x="112" y="92" width="16" height="30" fill="currentColor" />
          <path d="M100 122 L92 138 H148 L140 122" />
          <path d="M36 122 V138 M60 122 V138 M84 122 V138 M156 122 V138 M180 122 V138 M204 122 V138" />
        </g>
        <path d={FIELD} strokeWidth="1.1" />
        <path d={FRONDS} strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/* ---------- Gerbang batu berukir ---------- */

export function StoneArch({ className }: { className?: string }) {
  const id = useId();
  const stone = "#f6e7eb";
  const carve = "#a95c76";
  const pillar = (x: number) => (
    <g>
      <rect x={x} y="330" width="38" height="1500" fill={stone} />
      {[6, 13, 20, 27, 34].map((o) => (
        <path key={o} d={`M${x + o} 372 V1830`} stroke={carve} strokeWidth="1.6" opacity="0.65" />
      ))}
      <path d={`M${x - 5} 250 H${x + 43} L${x + 38} 278 Q${x + 19} 296 ${x} 278 Z`} fill={stone} stroke={carve} strokeWidth="1.5" />
      <path d={`M${x} 278 Q${x + 19} 300 ${x + 38} 278 L${x + 36} 340 Q${x + 19} 360 ${x + 2} 340 Z`} fill={stone} stroke={carve} strokeWidth="1.5" />
      <path d={`M${x + 6} 296 q13 -12 26 0 M${x + 6} 312 q13 -12 26 0 M${x + 8} 328 q11 -10 22 0`} fill="none" stroke={carve} strokeWidth="1.8" />
      <circle cx={x + 8} cy="284" r="4" fill="none" stroke={carve} strokeWidth="1.5" />
      <circle cx={x + 30} cy="284" r="4" fill="none" stroke={carve} strokeWidth="1.5" />
      <rect x={x - 5} y="244" width="48" height="8" fill={stone} stroke={carve} strokeWidth="1.5" />
      <rect x={x - 2} y="356" width="42" height="10" fill={stone} stroke={carve} strokeWidth="1.5" />
    </g>
  );
  return (
    <svg viewBox="0 0 432 1830" preserveAspectRatio="xMidYMin meet" className={className} aria-hidden>
      <defs>
        <pattern id={`${id}-carve`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="none" stroke={carve} strokeWidth="1.1" />
          <circle cx="8" cy="8" r="1.8" fill={carve} />
        </pattern>
      </defs>
      <path fillRule="evenodd" d="M0 0 H432 V250 H392 C386 104 306 42 216 42 C126 42 46 104 40 250 H0 Z" fill={stone} />
      <path fillRule="evenodd" d="M0 0 H432 V250 H392 C386 104 306 42 216 42 C126 42 46 104 40 250 H0 Z" fill={`url(#${id}-carve)`} opacity="0.55" />
      <g fill="none" stroke={carve}>
        <path d="M14 250 C20 80 118 6 216 6 C314 6 412 80 418 250" strokeWidth="2" />
        <path d="M26 250 C32 92 124 18 216 18 C308 18 400 92 406 250" strokeWidth="1.2" />
        <path d="M24 250 C30 92 122 22 216 22 C310 22 402 92 408 250" strokeWidth="7" strokeDasharray="2 7" stroke={carve} />
        <path d="M34 250 C40 102 126 34 216 34 C306 34 392 102 398 250" strokeWidth="2" />
        <path d="M40 250 C46 104 126 42 216 42 C306 42 386 104 392 250" strokeWidth="3" />
      </g>
      {pillar(0)}
      {pillar(394)}
    </svg>
  );
}

/* ---------- Bunga dan daun bergaya ukiran ---------- */

export function Lily({ className }: { className?: string }) {
  const id = useId();
  const petal = "M50 50 C36 40 30 18 50 0 C70 18 64 40 50 50 Z";
  const lines = [-10, -6, -2, 2, 6, 10];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dfe9" />
          <stop offset="1" stopColor="#c678a2" />
        </linearGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <g key={r} transform={`rotate(${r} 50 50)`}>
          <path d={petal} fill={`url(#${id}-p)`} stroke="#8e4a70" strokeWidth="0.7" />
          {lines.map((o) => (
            <path key={o} d={`M50 46 Q${50 + o} 26 ${50 + o * 0.4} ${8 + Math.abs(o)}`} fill="none" stroke="#8e4a70" strokeWidth="0.35" opacity="0.7" />
          ))}
        </g>
      ))}
      {[20, 80, 140, 200, 260, 320].map((r) => (
        <g key={r} transform={`rotate(${r} 50 50)`}>
          <path d="M50 50 L50 34" stroke="#fbeef4" strokeWidth="0.9" />
          <ellipse cx="50" cy="33" rx="1.6" ry="2.6" fill="#7b3b5f" />
        </g>
      ))}
      <circle cx="50" cy="50" r="3" fill="#9a5a7f" />
    </svg>
  );
}

export function Leaf({ className, tone = "#dfe7df", vein = "#3f5f50" }: { className?: string; tone?: string; vein?: string }) {
  return (
    <svg viewBox="0 0 60 130" className={className} aria-hidden>
      <path d="M30 128 C4 96 0 40 30 2 C60 40 56 96 30 128 Z" fill={tone} stroke={vein} strokeWidth="1" />
      <path d="M30 124 V8" stroke={vein} strokeWidth="1.2" fill="none" />
      {[...Array(13).keys()].map((i) => {
        const y = 22 + i * 7.6;
        const w = Math.sin(((i + 1) / 14) * Math.PI) * 22 + 3;
        return <path key={i} d={`M30 ${y + 9} Q${30 - w * 0.6} ${y + 5} ${30 - w} ${y} M30 ${y + 9} Q${30 + w * 0.6} ${y + 5} ${30 + w} ${y}`} stroke={vein} strokeWidth="0.6" fill="none" />;
      })}
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

export function ScrollMouse({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 50 72" style={style} className="h-14 w-10" aria-hidden>
      <rect x="4" y="3" width="42" height="66" rx="21" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M25 18 V42 M15 32 L25 42 L35 32" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Awan cat air untuk latar. */
export function Wash({ className, color = "#ecd0d6" }: { className?: string; color?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <filter id={`${id}-w`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="60" />
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g filter={`url(#${id}-w)`} fill={color}>
        <ellipse cx="90" cy="70" rx="130" ry="80" opacity="0.8" />
        <ellipse cx="310" cy="210" rx="130" ry="90" opacity="0.65" />
        <ellipse cx="210" cy="130" rx="90" ry="60" opacity="0.5" />
      </g>
    </svg>
  );
}
