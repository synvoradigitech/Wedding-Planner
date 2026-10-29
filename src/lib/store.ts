"use client";

import { useSyncExternalStore } from "react";
import { uid } from "./format";
import { createDemoState } from "./seed";
import type { AppState } from "./types";

// Prototipe: semua data disimpan di localStorage browser. Nanti diganti backend (Supabase).
const KEY = "wedding-planner:v1";

let current: AppState | null = null;
const listeners = new Set<() => void>();

function read(): AppState {
  if (current) return current;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) current = JSON.parse(raw) as AppState;
  } catch {
    // localStorage tidak tersedia atau rusak: pakai data contoh.
  }
  current ??= createDemoState();
  return current;
}

function write(next: AppState) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Abaikan: data tetap ada di memori selama tab terbuka.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Sinkron antar tab: RSVP dari halaman undangan langsung muncul di dashboard.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    current = e.newValue ? (JSON.parse(e.newValue) as AppState) : null;
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStoreState() {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function updateState(fn: (s: AppState) => AppState) {
  write(fn(read()));
}

export function replaceState(next: AppState) {
  write(next);
}

export function resetDemo() {
  write(createDemoState());
}

/** Tambahkan entri riwayat aktivitas (maks. 30 terakhir). */
export function withActivity(s: AppState, text: string): AppState {
  return { ...s, activity: [{ id: uid(), text, at: new Date().toISOString() }, ...s.activity].slice(0, 30) };
}
