"use client";

import { CircleAlert, ListChecks, Plus } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/app-shell";
import { iconFor } from "@/components/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CheckButton,
  EmptyState,
  Field,
  HeroCard,
  IconTile,
  Modal,
  ProgressRing,
  SectionLabel,
  Segmented,
  cn,
  inputClass,
} from "@/components/ui";
import { formatDate, todayISO, uid } from "@/lib/format";
import { hLabel, isOverdue, taskDaysBefore, taskDue } from "@/lib/selectors";
import { updateState, withActivity } from "@/lib/store";
import { PHASES, adatLabel, agamaLabel, phaseFor } from "@/lib/templates";
import type { Task } from "@/lib/types";

type Filter = "semua" | "belum" | "terlambat" | "selesai";

export default function ChecklistPage() {
  const state = useApp();
  const { wedding } = state;
  const today = todayISO();
  const [filter, setFilter] = useState<Filter>("belum");
  const [pic, setPic] = useState<string>("semua");
  const [editing, setEditing] = useState<Task | "new" | null>(null);

  const done = state.tasks.filter((t) => t.done).length;
  const pct = state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0;
  const overdueCount = state.tasks.filter((t) => isOverdue(t, wedding, today)).length;
  const thisMonth = state.tasks.filter((t) => {
    const due = taskDue(t, wedding);
    return !t.done && due !== null && due >= today && due <= today.slice(0, 8) + "31";
  }).length;

  const visible = state.tasks
    .filter((t) => {
      if (filter === "belum" && t.done) return false;
      if (filter === "selesai" && !t.done) return false;
      if (filter === "terlambat" && !isOverdue(t, wedding, today)) return false;
      if (pic !== "semua" && t.pic !== pic) return false;
      return true;
    })
    .sort((a, b) => taskDaysBefore(b, wedding) - taskDaysBefore(a, wedding));

  const groups = PHASES.map((p) => ({
    label: p.label,
    tasks: visible.filter((t) => phaseFor(taskDaysBefore(t, wedding)) === p.label),
  })).filter((g) => g.tasks.length > 0);

  function toggle(task: Task) {
    updateState((s) => {
      const next = { ...s, tasks: s.tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)) };
      return task.done ? next : withActivity(next, `${s.members[0].name.split(" ")[0]} menandai "${task.title}" selesai`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Checklist</h1>
          <p className="text-xs text-muted">
            Adat {adatLabel(wedding.adat)} · {agamaLabel(wedding.agama)}
          </p>
        </div>
        <Button onClick={() => setEditing("new")} aria-label="Tambah tugas">
          <Plus size={18} /> <span className="hidden sm:inline">Tambah tugas</span>
        </Button>
      </div>

      <HeroCard>
        <div className="flex items-center gap-5">
          <ProgressRing value={pct}>
            <span className="text-xl font-extrabold">{pct}%</span>
          </ProgressRing>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/80">Progres checklist</p>
            <p className="text-2xl font-extrabold">
              {done}
              <span className="text-base font-semibold text-white/80"> / {state.tasks.length} tugas</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {thisMonth > 0 && <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{thisMonth} jatuh tempo bulan ini</span>}
              {overdueCount > 0 && (
                <button onClick={() => setFilter("terlambat")} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                  <CircleAlert size={13} /> {overdueCount} terlambat
                </button>
              )}
            </div>
          </div>
        </div>
      </HeroCard>

      <div className="space-y-3">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "belum", label: "Belum" },
            { value: "terlambat", label: `Terlambat${overdueCount ? ` (${overdueCount})` : ""}` },
            { value: "selesai", label: "Selesai" },
            { value: "semua", label: "Semua" },
          ]}
        />
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[{ id: "semua", name: "Semua orang" }, ...state.members].map((m, i) => (
            <button
              key={m.id}
              onClick={() => setPic(m.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-xs font-semibold transition",
                pic === m.id ? "bg-ink text-white" : "bg-paper text-muted sticker-sm",
                m.id === "semua" && "pl-3.5",
              )}
            >
              {m.id !== "semua" && <Avatar name={m.name} index={i - 1} size="sm" />}
              {m.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 && (
        <Card>
          <EmptyState icon={<ListChecks size={24} />} title="Tidak ada tugas di sini">
            {filter === "terlambat" ? "Mantap, semua tugas tepat waktu." : "Coba filter lain atau tambah tugas baru."}
          </EmptyState>
        </Card>
      )}

      {groups.map((g) => (
        <section key={g.label}>
          <SectionLabel>{g.label}</SectionLabel>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {g.tasks.map((t) => {
              const late = isOverdue(t, wedding, today);
              const memberIndex = state.members.findIndex((m) => m.id === t.pic);
              const { icon: Icon, tone } = iconFor(t.title);
              return (
                <Card key={t.id} className={cn("flex items-center gap-3 p-3 pr-4 transition", t.done && "opacity-60")}>
                  <IconTile tone={late ? "danger" : tone}>
                    <Icon size={19} />
                  </IconTile>
                  <button onClick={() => setEditing(t)} className="min-w-0 flex-1 text-left">
                    <p className={cn("truncate text-sm font-semibold", t.done && "line-through")}>{t.title}</p>
                    <p className={cn("mt-0.5 flex items-center gap-1.5 text-xs", late ? "font-medium text-danger" : "text-muted")}>
                      <span className={cn("rounded-full px-1.5 font-bold", late ? "bg-danger-soft" : "bg-primary-soft text-primary")}>
                        {hLabel(taskDaysBefore(t, wedding))}
                      </span>
                      {taskDue(t, wedding) && formatDate(taskDue(t, wedding))}
                    </p>
                  </button>
                  {memberIndex >= 0 && <Avatar name={state.members[memberIndex].name} index={memberIndex} size="sm" />}
                  <CheckButton checked={t.done} onClick={() => toggle(t)} label={`Tandai ${t.title}`} />
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      {editing && <TaskModal key={editing === "new" ? "new" : editing.id} task={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function TaskModal({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const state = useApp();
  const [title, setTitle] = useState(task?.title ?? "");
  const [due, setDue] = useState(task ? (taskDue(task, state.wedding) ?? todayISO()) : todayISO());
  const [pic, setPic] = useState(task?.pic ?? "");
  const [note, setNote] = useState(task?.note ?? "");
  const fromTemplate = task?.source === "template";

  function save() {
    if (!title.trim()) return;
    updateState((s) => ({
      ...s,
      tasks: task
        ? s.tasks.map((t) =>
            t.id === task.id
              ? { ...t, title: title.trim(), pic: pic || null, note: note.trim() || undefined, ...(fromTemplate ? {} : { dueDate: due }) }
              : t,
          )
        : [...s.tasks, { id: uid(), title: title.trim(), offsetDays: null, dueDate: due, done: false, pic: pic || null, note: note.trim() || undefined, source: "manual" }],
    }));
    onClose();
  }

  function remove() {
    if (!task) return;
    updateState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== task.id) }));
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={task ? "Detail tugas" : "Tambah tugas"}
      footer={
        <>
          {task && (
            <Button variant="danger" className="mr-auto" onClick={remove}>
              Hapus
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={save} disabled={!title.trim()}>
            Simpan
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nama tugas">
          <input autoFocus={!task} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mis. Survei toko bunga" className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tenggat" hint={fromTemplate ? "Mengikuti tanggal pernikahan" : undefined}>
            <input type="date" value={due} disabled={fromTemplate} onChange={(e) => setDue(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Penanggung jawab">
            <select value={pic} onChange={(e) => setPic(e.target.value)} className={inputClass}>
              <option value="">Tanpa PIC</option>
              {state.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Catatan">
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kontak vendor, hasil survei, dll." className={inputClass} />
        </Field>
        {task && <Badge tone={fromTemplate ? "primary" : "neutral"}>{fromTemplate ? "Dari template adat" : "Tugas manual"}</Badge>}
      </div>
    </Modal>
  );
}
