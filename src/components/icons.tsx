import {
  Building2,
  Camera,
  Clock,
  Flower2,
  Gem,
  Gift,
  Handshake,
  Heart,
  Landmark,
  ListChecks,
  Mail,
  Music,
  Receipt,
  Shirt,
  Sparkles,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "./ui";

type IconMatch = { icon: LucideIcon; tone: Tone };

const RULES: [RegExp, IconMatch][] = [
  [/venue|gedung|pendopo/i, { icon: Building2, tone: "sky" }],
  [/katering|catering|food/i, { icon: UtensilsCrossed, tone: "gold" }],
  [/foto|video|dokumentasi/i, { icon: Camera, tone: "violet" }],
  [/mua|busana|fitting|seragam|kain|ulos/i, { icon: Shirt, tone: "primary" }],
  [/cincin|perhiasan|mahar/i, { icon: Gem, tone: "violet" }],
  [/seserahan|hantaran|roti buaya|souvenir/i, { icon: Gift, tone: "gold" }],
  [/undangan|ucapan/i, { icon: Mail, tone: "primary" }],
  [/kua|gereja|paroki|vihara|klenteng|dukcapil|bimwin|kursus|katekisasi|pemberkatan/i, { icon: Landmark, tone: "sky" }],
  [/tamu|rsvp/i, { icon: Users, tone: "sage" }],
  [/rundown|gladi|mc\b/i, { icon: Clock, tone: "sky" }],
  [/dekorasi|bunga/i, { icon: Flower2, tone: "sage" }],
  [/hiburan|playlist|musik/i, { icon: Music, tone: "violet" }],
  [/lamar|maminang|marhusip|marhata|mappettu|mammanu|neundeun|ngelamar|weton|dewasa ayu|hari baik/i, { icon: Handshake, tone: "gold" }],
  [/siraman|midodareni|bainai|pacar|mappacci|ngeuyeuk|saweran/i, { icon: Sparkles, tone: "primary" }],
  [/vendor|pelunasan|amplop|anggaran|lain/i, { icon: Receipt, tone: "gold" }],
  [/konsep/i, { icon: Heart, tone: "primary" }],
];

/** Ikon dan warna tile untuk judul tugas atau kategori anggaran. */
export function iconFor(text: string): IconMatch {
  return RULES.find(([re]) => re.test(text))?.[1] ?? { icon: ListChecks, tone: "primary" };
}
