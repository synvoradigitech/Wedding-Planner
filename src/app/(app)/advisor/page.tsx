"use client";

import { ArrowUp, BookOpen, Building2, Check, Gift, PiggyBank, Plus, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useApp } from "@/components/app-shell";
import { PremiumModal } from "@/components/premium-modal";
import { Badge, cn } from "@/components/ui";
import { advisorAnswer } from "@/lib/advisor";
import { ADVISOR_QUOTA } from "@/lib/brand";
import { uid } from "@/lib/format";
import { updateState } from "@/lib/store";
import { adatLabel } from "@/lib/templates";

const QUICK = [
  { icon: BookOpen, label: "Urutan prosesi", q: "Bagaimana urutan prosesi pernikahan adat saya?" },
  { icon: Gift, label: "Isi seserahan", q: "Apa saja isi seserahan yang umum?" },
  { icon: PiggyBank, label: "Bagi anggaran", q: "Berapa persen anggaran untuk katering?" },
  { icon: Building2, label: "Booking gedung", q: "Kapan sebaiknya booking gedung?" },
];

export default function AdvisorPage() {
  const state = useApp();
  const quota = ADVISOR_QUOTA[state.wedding.plan];
  const left = Math.max(0, quota - state.advisor.used);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [upsell, setUpsell] = useState(false);
  const [added, setAdded] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = state.advisor.messages;
  const firstName = state.members[0].name.split(" ")[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking]);

  function ask(question: string) {
    if (!question.trim() || thinking) return;
    if (left === 0) {
      setUpsell(true);
      return;
    }
    setInput("");
    updateState((s) => ({
      ...s,
      advisor: { used: s.advisor.used + 1, messages: [...s.advisor.messages, { id: uid(), role: "user", text: question.trim() }] },
    }));
    setThinking(true);
    setTimeout(() => {
      updateState((s) => {
        const answer = advisorAnswer(question, s);
        return { ...s, advisor: { ...s.advisor, messages: [...s.advisor.messages, { id: uid(), role: "assistant", ...answer }] } };
      });
      setThinking(false);
    }, 900);
  }

  function addToChecklist(item: string) {
    updateState((s) => ({
      ...s,
      tasks: [...s.tasks, { id: uid(), title: `Siapkan seserahan: ${item}`, offsetDays: 30, dueDate: null, done: false, pic: null, source: "manual" }],
    }));
    setAdded((a) => [...a, item]);
  }

  function clearChat() {
    updateState((s) => ({ ...s, advisor: { ...s.advisor, messages: [] } }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100svh-11rem)] max-w-2xl flex-col lg:min-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg">AI Advisor</h1>
        <div className="flex items-center gap-2">
          <Badge tone={left > 0 ? "primary" : "danger"}>{left}/{quota} tersisa</Badge>
          {messages.length > 0 && (
            <button onClick={clearChat} className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-muted sticker-sm hover:text-primary" aria-label="Mulai percakapan baru">
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <h2 className="font-display max-w-sm text-[1.7rem] leading-tight">
            Halo, {firstName}! <span className="text-brand">AI Advisor</span> siap membantu persiapanmu.
          </h2>
          <div className="orb my-10 h-48 w-48 sm:h-56 sm:w-56" />
          <p className="max-w-xs text-sm text-muted">Tanya apa saja soal adat {adatLabel(state.wedding.adat)}, seserahan, etika, atau anggaran.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3 py-5">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-brand px-4 py-2.5 text-sm text-white shadow-pop">{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="flex items-end gap-2">
                <div className="orb h-8 w-8 shrink-0 [animation:none]" />
                <div className="max-w-[85%] rounded-3xl rounded-bl-lg bg-paper px-4 py-3 text-sm whitespace-pre-line sticker-sm">
                  {m.text}
                  {m.suggestions && (
                    <ul className="mt-3 space-y-1.5">
                      {m.suggestions.map((s) => (
                        <li key={s} className="flex items-center justify-between gap-3 rounded-2xl bg-ivory px-3 py-2">
                          <span>{s}</span>
                          <button
                            onClick={() => addToChecklist(s)}
                            disabled={added.includes(s)}
                            className="flex shrink-0 items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-primary sticker-sm disabled:text-sage"
                          >
                            {added.includes(s) ? <Check size={12} /> : <Plus size={12} />}
                            {added.includes(s) ? "Ditambahkan" : "Checklist"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ),
          )}
          {thinking && (
            <div className="flex items-end gap-2">
              <div className="orb h-8 w-8 shrink-0" />
              <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-paper px-4 py-3.5 sticker-sm">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-blush" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="sticky bottom-24 space-y-3 pt-2 lg:bottom-6">
        <div className={cn("grid grid-cols-2 gap-2", messages.length > 0 && "hidden sm:grid sm:grid-cols-4")}>
          {QUICK.map(({ icon: Icon, label, q }) => (
            <button
              key={label}
              onClick={() => ask(q)}
              className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-2.5 text-left text-xs font-semibold sticker-sm transition hover:text-primary"
            >
              <Icon size={16} className="shrink-0 text-primary" /> {label}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 rounded-full bg-paper p-1.5 pl-2 sticker-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-muted">
            <Plus size={18} />
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya AI Advisor…"
            className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted/70 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-pop transition disabled:opacity-40 disabled:shadow-none"
            aria-label="Kirim"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <PremiumModal open={upsell} onClose={() => setUpsell(false)} reason="Kuota pertanyaan paket Starter sudah habis." />
    </div>
  );
}
