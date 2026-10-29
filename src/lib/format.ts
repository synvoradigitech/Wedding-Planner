const rupiahFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function rupiah(n: number) {
  return rupiahFormat.format(n);
}

/** Rp150 jt, Rp2,5 jt, Rp850 rb */
export function rupiahShort(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}Rp${trim(abs / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${sign}Rp${trim(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}Rp${trim(abs / 1_000)} rb`;
  return `${sign}Rp${abs}`;
}

function trim(n: number) {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

export function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISO(new Date());
}

export function addDays(iso: string, days: number) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function daysBetween(fromISO: string, toISODate: string) {
  return Math.round((parseISO(toISODate).getTime() - parseISO(fromISO).getTime()) / 86_400_000);
}

export function formatDate(iso: string | null, style: "short" | "long" | "weekday" = "short") {
  if (!iso) return "Belum ditentukan";
  const opts: Intl.DateTimeFormatOptions =
    style === "short"
      ? { day: "numeric", month: "short", year: "numeric" }
      : style === "long"
        ? { day: "numeric", month: "long", year: "numeric" }
        : { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  return parseISO(iso).toLocaleDateString("id-ID", opts);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
