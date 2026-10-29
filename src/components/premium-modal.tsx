"use client";

import { Check, Crown } from "lucide-react";
import { useState } from "react";
import { PREMIUM_PRICE } from "@/lib/brand";
import { rupiah } from "@/lib/format";
import { updateState, withActivity } from "@/lib/store";
import { Button, Modal } from "./ui";

const BENEFITS = [
  "Terbitkan undangan digital dan terima RSVP",
  "Tautan undangan personal untuk setiap tamu",
  "Grafik anggaran rinci per kategori",
  "Kuota AI Advisor dan saran seserahan lebih besar",
];

export function PremiumModal({ open, onClose, reason }: { open: boolean; onClose: () => void; reason?: string }) {
  const [paying, setPaying] = useState(false);

  function pay() {
    setPaying(true);
    // Simulasi pembayaran. Nanti diganti payment gateway (QRIS, e-wallet, VA).
    setTimeout(() => {
      updateState((s) => withActivity({ ...s, wedding: { ...s.wedding, plan: "premium" } }, "Paket Premium diaktifkan"));
      setPaying(false);
      onClose();
    }, 900);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upgrade ke Premium"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Nanti saja
          </Button>
          <Button variant="gold" onClick={pay} disabled={paying}>
            <Crown size={16} /> {paying ? "Memproses…" : `Bayar ${rupiah(PREMIUM_PRICE)}`}
          </Button>
        </>
      }
    >
      {reason && <p className="mb-4 rounded-xl bg-gold-soft px-3 py-2 text-sm text-gold">{reason}</p>}
      <p className="font-display text-3xl">
        {rupiah(PREMIUM_PRICE)} <span className="font-sans text-sm text-muted">sekali bayar, tanpa langganan</span>
      </p>
      <ul className="mt-4 space-y-2">
        {BENEFITS.map((b) => (
          <li key={b} className="flex gap-2 text-sm">
            <Check size={18} className="shrink-0 text-sage" /> {b}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">Bayar dengan QRIS, e-wallet, virtual account, atau kartu. (Prototipe: pembayaran disimulasikan.)</p>
    </Modal>
  );
}
