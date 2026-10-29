"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { NAV } from "@/components/app-shell";
import { Card, IconTile, PageHeader, type Tone } from "@/components/ui";

const ITEMS: { href: string; tone: Tone; desc: string }[] = [
  { href: "/anggaran", tone: "gold", desc: "Pos anggaran, vendor, cicilan" },
  { href: "/undangan", tone: "primary", desc: "Desain, terbitkan, RSVP" },
  { href: "/rundown", tone: "sky", desc: "Susunan acara per sesi" },
  { href: "/advisor", tone: "violet", desc: "Tanya adat dan seserahan" },
  { href: "/pengaturan", tone: "neutral", desc: "Profil, kolaborator, paket" },
];

export default function LainnyaPage() {
  return (
    <>
      <PageHeader title="Lainnya" />
      <div className="space-y-3">
        {ITEMS.map(({ href, tone, desc }) => {
          const nav = NAV.find((n) => n.href === href)!;
          const Icon = nav.icon;
          return (
            <Link key={href} href={href} className="block">
              <Card className="flex items-center gap-4 p-4">
                <IconTile tone={tone}>
                  <Icon size={20} />
                </IconTile>
                <div className="flex-1">
                  <p className="font-semibold">{nav.label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
