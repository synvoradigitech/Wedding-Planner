"use client";

import { Crown, Lock, Pencil, Plus, Receipt, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/app-shell";
import { iconFor } from "@/components/icons";
import { PremiumModal } from "@/components/premium-modal";
import {
  Badge,
  Button,
  Card,
  CheckButton,
  Field,
  HeroCard,
  IconTile,
  Modal,
  Progress,
  ProgressRing,
  SectionLabel,
  cn,
  inputClass,
} from "@/components/ui";
import { daysBetween, formatDate, rupiah, rupiahShort, todayISO, uid } from "@/lib/format";
import { budgetSummary, itemSpent, upcomingPayments } from "@/lib/selectors";
import { updateState, withActivity } from "@/lib/store";
import type { BudgetItem } from "@/lib/types";

function togglePaid(itemId: string, paymentId: string) {
  updateState((s) => {
    const item = s.budget.find((b) => b.id === itemId)!;
    const payment = item.payments.find((p) => p.id === paymentId)!;
    const next = {
      ...s,
      budget: s.budget.map((b) => (b.id === itemId ? { ...b, payments: b.payments.map((p) => (p.id === paymentId ? { ...p, paid: !p.paid } : p)) } : b)),
    };
    return payment.paid ? next : withActivity(next, `${payment.label} ${item.vendorName ?? item.category} ditandai lunas`);
  });
}

export default function AnggaranPage() {
  const state = useApp();
  const today = todayISO();
  const summary = budgetSummary(state);
  const payments = upcomingPayments(state, 30, today);
  const usedPct = summary.total ? (summary.spent / summary.total) * 100 : 0;
  const [detail, setDetail] = useState<string | null>(null);
  const [expenseFor, setExpenseFor] = useState<string | null>(null);
  const [editing, setEditing] = useState<BudgetItem | "new" | null>(null);
  const [paymentFor, setPaymentFor] = useState<string | null>(null);
  const [upsell, setUpsell] = useState(false);
  const premium = state.wedding.plan === "premium";
  const detailItem = state.budget.find((b) => b.id === detail) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-3xl">Anggaran</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing("new")} aria-label="Tambah pos anggaran">
            <Plus size={18} /> <span className="hidden sm:inline">Pos</span>
          </Button>
          <Button onClick={() => setExpenseFor(state.budget[0]?.id ?? null)} aria-label="Catat pengeluaran">
            <Receipt size={18} /> <span className="hidden sm:inline">Catat pengeluaran</span>
          </Button>
        </div>
      </div>

      <HeroCard>
        <div className="flex items-center gap-5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white/80">Sisa anggaran</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight">{rupiahShort(summary.remaining)}</p>
            <p className="text-sm text-white/80">dari total {rupiahShort(summary.total)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Terpakai {rupiahShort(summary.spent)}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">Belum dibayar {rupiahShort(summary.unpaid)}</span>
            </div>
          </div>
          <ProgressRing value={usedPct} size={96}>
            <span className="text-lg font-extrabold">{Math.round(usedPct)}%</span>
            <span className="text-[10px] text-white/80">terpakai</span>
          </ProgressRing>
        </div>
      </HeroCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <SectionLabel>Pos anggaran</SectionLabel>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {state.budget.map((b) => {
              const spent = itemSpent(b);
              const over = spent > b.allocated;
              const { icon: Icon, tone } = iconFor(b.category);
              return (
                <button key={b.id} onClick={() => setDetail(b.id)} className="rounded-3xl bg-paper p-4 text-left sticker-sm transition hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <IconTile tone={over ? "danger" : tone}>
                      <Icon size={20} />
                    </IconTile>
                    <span className={cn("text-xs font-bold", over ? "text-danger" : "text-muted")}>{Math.round((spent / Math.max(b.allocated, 1)) * 100)}%</span>
                  </div>
                  <p className="mt-3 truncate text-sm font-bold">{b.category}</p>
                  <p className="truncate text-[11px] text-muted">{b.vendorName ?? "Belum ada vendor"}</p>
                  <Progress value={(spent / Math.max(b.allocated, 1)) * 100} tone={over ? "danger" : tone} className="mt-3" />
                  <p className="mt-1.5 text-[11px] text-muted tabular-nums">
                    <span className="font-semibold text-ink">{rupiahShort(spent)}</span> / {rupiahShort(b.allocated)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="min-w-0 space-y-6">
          <section>
            <SectionLabel>Jatuh tempo 30 hari</SectionLabel>
            <div className="space-y-2.5">
              {payments.length === 0 && <Card className="p-5 text-center text-sm text-muted">Aman, tidak ada tagihan dekat.</Card>}
              {payments.map((p) => {
                const days = daysBetween(today, p.dueDate);
                return (
                  <Card key={p.id} className="flex items-center gap-3 p-3 pr-4">
                    <IconTile tone="gold">
                      <Wallet size={19} />
                    </IconTile>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.item.vendorName ?? p.item.category}</p>
                      <p className={cn("text-xs", days < 0 ? "text-danger" : "text-muted")}>
                        {p.label} · {days < 0 ? `lewat ${-days} hari` : `${days} hari lagi`}
                      </p>
                    </div>
                    <p className="text-sm font-bold tabular-nums">{rupiahShort(p.amount)}</p>
                    <CheckButton checked={p.paid} onClick={() => togglePaid(p.item.id, p.id)} label="Tandai lunas" />
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <SectionLabel>Terpakai per kategori</SectionLabel>
            <Card className="relative overflow-hidden p-5">
              <div className={cn("space-y-3", !premium && "pointer-events-none blur-[4px] select-none")} aria-hidden={!premium}>
                {state.budget.map((b) => {
                  const spent = itemSpent(b);
                  return (
                    <div key={b.id} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-xs">
                      <span className="truncate text-muted">{b.category}</span>
                      <Progress value={(spent / Math.max(b.allocated, 1)) * 100} tone={spent > b.allocated ? "danger" : "primary"} />
                      <span className="text-right font-semibold tabular-nums">{Math.round((spent / Math.max(b.allocated, 1)) * 100)}%</span>
                    </div>
                  );
                })}
              </div>
              {!premium && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper/50 text-center">
                  <IconTile tone="gold">
                    <Lock size={18} />
                  </IconTile>
                  <p className="max-w-[14rem] text-sm font-semibold">Grafik rinci per kategori ada di Premium</p>
                  <Button variant="gold" size="sm" onClick={() => setUpsell(true)}>
                    <Crown size={14} /> Lihat Premium
                  </Button>
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>

      {detailItem && (
        <ItemDetail
          item={detailItem}
          onClose={() => setDetail(null)}
          onAddPayment={() => setPaymentFor(detailItem.id)}
          onAddExpense={() => setExpenseFor(detailItem.id)}
          onEdit={() => {
            setDetail(null);
            setEditing(detailItem);
          }}
        />
      )}
      <ExpenseModal itemId={expenseFor} onClose={() => setExpenseFor(null)} />
      <PaymentModal itemId={paymentFor} onClose={() => setPaymentFor(null)} />
      {editing && <ItemForm key={editing === "new" ? "new" : editing.id} existing={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      <PremiumModal open={upsell} onClose={() => setUpsell(false)} reason="Grafik anggaran rinci adalah fitur Premium." />
    </div>
  );
}

function ItemDetail({
  item,
  onClose,
  onAddPayment,
  onAddExpense,
  onEdit,
}: {
  item: BudgetItem;
  onClose: () => void;
  onAddPayment: () => void;
  onAddExpense: () => void;
  onEdit: () => void;
}) {
  const today = todayISO();
  const spent = itemSpent(item);
  const { icon: Icon, tone } = iconFor(item.category);

  function removeExpense(expenseId: string) {
    updateState((s) => ({
      ...s,
      budget: s.budget.map((b) => (b.id === item.id ? { ...b, expenses: b.expenses.filter((e) => e.id !== expenseId) } : b)),
    }));
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={item.category}
      footer={
        <Button variant="secondary" onClick={onEdit}>
          <Pencil size={14} /> Ubah pos & vendor
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-3xl bg-ivory p-4">
          <IconTile tone={tone} size="lg">
            <Icon size={24} />
          </IconTile>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{item.vendorName ?? "Belum ada vendor"}</p>
            <p className="text-xs text-muted">{item.vendorContact ?? "Kontak belum diisi"}</p>
            <Progress value={(spent / Math.max(item.allocated, 1)) * 100} tone={spent > item.allocated ? "danger" : tone} className="mt-2" />
            <p className="mt-1 text-xs text-muted tabular-nums">
              {rupiah(spent)} dari {rupiah(item.allocated)}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted">Jadwal pembayaran</h3>
            <Button size="sm" variant="ghost" onClick={onAddPayment}>
              <Plus size={14} /> Tambah
            </Button>
          </div>
          {item.payments.length === 0 ? (
            <p className="text-sm text-muted">Belum ada DP atau cicilan.</p>
          ) : (
            <ul className="space-y-2">
              {item.payments.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-ivory px-3 py-2.5">
                  <CheckButton checked={p.paid} onClick={() => togglePaid(item.id, p.id)} label={`${p.label} lunas`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-muted">{formatDate(p.dueDate)}</p>
                  </div>
                  {p.paid ? <Badge tone="sage">Lunas</Badge> : p.dueDate < today ? <Badge tone="danger">Lewat</Badge> : null}
                  <span className="text-sm font-bold tabular-nums">{rupiahShort(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted">Pengeluaran kecil</h3>
            <Button size="sm" variant="ghost" onClick={onAddExpense}>
              <Plus size={14} /> Tambah
            </Button>
          </div>
          {item.expenses.length === 0 ? (
            <p className="text-sm text-muted">Belum ada pengeluaran.</p>
          ) : (
            <ul className="space-y-2">
              {item.expenses.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-ivory px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.note}</p>
                    <p className="text-xs text-muted">{formatDate(e.date)}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{rupiahShort(e.amount)}</span>
                  <button onClick={() => removeExpense(e.id)} className="rounded-full p-1.5 text-muted hover:bg-danger-soft hover:text-danger" aria-label={`Hapus ${e.note}`}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

function ExpenseModal({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
  const state = useApp();
  const [category, setCategory] = useState(itemId ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());
  const [lastItemId, setLastItemId] = useState(itemId);
  if (itemId !== lastItemId) {
    setLastItemId(itemId);
    if (itemId) setCategory(itemId);
  }

  function save() {
    const value = Number(amount.replace(/\D/g, ""));
    if (!value || !note.trim()) return;
    updateState((s) => {
      const item = s.budget.find((b) => b.id === category)!;
      return withActivity(
        {
          ...s,
          budget: s.budget.map((b) => (b.id === category ? { ...b, expenses: [...b.expenses, { id: uid(), amount: value, date, note: note.trim() }] } : b)),
        },
        `${s.members[0].name.split(" ")[0]} mencatat pengeluaran ${note.trim()} (${item.category})`,
      );
    });
    setAmount("");
    setNote("");
    onClose();
  }

  return (
    <Modal
      open={itemId !== null}
      onClose={onClose}
      title="Catat pengeluaran"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={save}>Simpan</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Keterangan">
          <input autoFocus value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mis. Kotak hantaran" className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nominal (Rp)">
            <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="250000" className={inputClass} />
          </Field>
          <Field label="Tanggal">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Pos anggaran" hint="Pengeluaran otomatis mengurangi sisa pos ini.">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {state.budget.map((b) => (
              <option key={b.id} value={b.id}>
                {b.category}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function PaymentModal({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
  const [label, setLabel] = useState("DP");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState(todayISO());

  function save() {
    const value = Number(amount.replace(/\D/g, ""));
    if (!value || !itemId) return;
    updateState((s) => ({
      ...s,
      budget: s.budget.map((b) => (b.id === itemId ? { ...b, payments: [...b.payments, { id: uid(), label, amount: value, dueDate: due, paid: false }] } : b)),
    }));
    setAmount("");
    onClose();
  }

  return (
    <Modal
      open={itemId !== null}
      onClose={onClose}
      title="Tambah jadwal pembayaran"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={save}>Simpan</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Jenis">
          <select value={label} onChange={(e) => setLabel(e.target.value)} className={inputClass}>
            <option>DP</option>
            <option>Cicilan 1</option>
            <option>Cicilan 2</option>
            <option>Pelunasan</option>
          </select>
        </Field>
        <Field label="Nominal (Rp)">
          <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Jatuh tempo">
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={inputClass} />
        </Field>
      </div>
    </Modal>
  );
}

function ItemForm({ existing, onClose }: { existing: BudgetItem | null; onClose: () => void }) {
  const [category, setCategory] = useState(existing?.category ?? "");
  const [allocated, setAllocated] = useState(existing ? String(existing.allocated) : "");
  const [vendor, setVendor] = useState(existing?.vendorName ?? "");
  const [contact, setContact] = useState(existing?.vendorContact ?? "");

  function save() {
    if (!category.trim()) return;
    const fields = {
      category: category.trim(),
      allocated: Number(allocated.replace(/\D/g, "")) || 0,
      vendorName: vendor.trim() || undefined,
      vendorContact: contact.trim() || undefined,
    };
    updateState((s) => ({
      ...s,
      budget: existing
        ? s.budget.map((b) => (b.id === existing.id ? { ...b, ...fields } : b))
        : [...s.budget, { id: uid(), payments: [], expenses: [], ...fields }],
    }));
    onClose();
  }

  function remove() {
    if (!existing) return;
    updateState((s) => ({ ...s, budget: s.budget.filter((b) => b.id !== existing.id) }));
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? `Ubah ${existing.category}` : "Pos anggaran baru"}
      footer={
        <>
          {existing && (
            <Button variant="danger" onClick={remove} className="mr-auto">
              Hapus pos
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={save}>Simpan</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori">
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Alokasi (Rp)">
            <input inputMode="numeric" value={allocated} onChange={(e) => setAllocated(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Nama vendor">
          <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Opsional" className={inputClass} />
        </Field>
        <Field label="Kontak vendor">
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="No. WhatsApp atau Instagram" className={inputClass} />
        </Field>
      </div>
    </Modal>
  );
}
