import { addDays, daysBetween, titleCase, todayISO } from "./format";
import type { AppState, BudgetItem, Task, Wedding } from "./types";

export function taskDue(task: Task, wedding: Wedding): string | null {
  if (task.dueDate) return task.dueDate;
  if (task.offsetDays !== null && wedding.date) return addDays(wedding.date, -task.offsetDays);
  return null;
}

/** H-n relatif ke hari pernikahan, untuk label dan pengelompokan fase. */
export function taskDaysBefore(task: Task, wedding: Wedding): number {
  if (task.offsetDays !== null) return task.offsetDays;
  if (task.dueDate && wedding.date) return daysBetween(task.dueDate, wedding.date);
  return 0;
}

export function isOverdue(task: Task, wedding: Wedding, today = todayISO()) {
  const due = taskDue(task, wedding);
  return !task.done && due !== null && due < today;
}

export function hLabel(days: number) {
  if (days === 0) return "Hari H";
  return days > 0 ? `H-${days}` : `H+${-days}`;
}

export function itemSpent(item: BudgetItem) {
  return (
    item.payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0) +
    item.expenses.reduce((s, e) => s + e.amount, 0)
  );
}

export function itemCommitted(item: BudgetItem) {
  return item.payments.reduce((s, p) => s + p.amount, 0) + item.expenses.reduce((s, e) => s + e.amount, 0);
}

export function budgetSummary(state: AppState) {
  const allocated = state.budget.reduce((s, b) => s + b.allocated, 0);
  const spent = state.budget.reduce((s, b) => s + itemSpent(b), 0);
  const committed = state.budget.reduce((s, b) => s + itemCommitted(b), 0);
  return {
    total: state.wedding.totalBudget,
    allocated,
    spent,
    unpaid: committed - spent,
    remaining: state.wedding.totalBudget - spent,
  };
}

export function upcomingPayments(state: AppState, withinDays = 30, today = todayISO()) {
  const limit = addDays(today, withinDays);
  return state.budget
    .flatMap((b) => b.payments.filter((p) => !p.paid && p.dueDate <= limit).map((p) => ({ ...p, item: b })))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function guestSummary(state: AppState) {
  const g = state.guests;
  return {
    invitations: g.length,
    pax: g.reduce((s, x) => s + x.pax, 0),
    attending: g.filter((x) => x.rsvp.status === "hadir").reduce((s, x) => s + x.rsvp.count, 0),
    attendingInvites: g.filter((x) => x.rsvp.status === "hadir").length,
    declined: g.filter((x) => x.rsvp.status === "tidak").length,
    pending: g.filter((x) => x.rsvp.status === "pending").length,
  };
}

export function coupleName(w: Wedding) {
  return `${titleCase(w.brideName)} & ${titleCase(w.groomName)}`;
}

/** Tautan undangan publik; dengan tamu menjadi tautan personal (?to=). Hanya di browser. */
export function inviteUrl(state: AppState, guest?: { slug: string }) {
  const base = `${window.location.origin}/u/${state.wedding.slug}`;
  return guest ? `${base}?to=${guest.slug}` : base;
}

export function memberName(state: AppState, id: string | null) {
  if (!id) return null;
  return state.members.find((m) => m.id === id)?.name ?? null;
}
