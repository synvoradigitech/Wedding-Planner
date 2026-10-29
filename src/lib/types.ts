export type Plan = "starter" | "premium";
export type Role = "owner" | "editor" | "viewer";
export type AdatId = "jawa" | "sunda" | "minang" | "batak" | "bugis" | "betawi" | "nasional";
export type AgamaId = "islam" | "kristen" | "katolik" | "hindu" | "buddha" | "konghucu";
export type ModuleId = "checklist" | "anggaran" | "tamu" | "undangan" | "rundown";

export interface Wedding {
  brideName: string;
  groomName: string;
  /** Tanggal acara utama (YYYY-MM-DD). Null bila belum pasti. */
  date: string | null;
  city: string;
  adat: AdatId;
  agama: AgamaId;
  guestEstimate: number;
  totalBudget: number;
  plan: Plan;
  slug: string;
}

export interface Task {
  id: string;
  title: string;
  /** Hari sebelum acara (H-n). Dipakai tugas dari template. */
  offsetDays: number | null;
  /** Tenggat tetap untuk tugas manual (YYYY-MM-DD). */
  dueDate: string | null;
  done: boolean;
  pic: string | null;
  note?: string;
  source: "template" | "manual";
}

export interface Payment {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  vendorName?: string;
  vendorContact?: string;
  payments: Payment[];
  expenses: Expense[];
}

export type RsvpStatus = "pending" | "hadir" | "tidak";

export interface Guest {
  id: string;
  name: string;
  phone: string;
  group: string;
  pax: number;
  category: "VIP" | "Reguler";
  eventIds: string[];
  slug: string;
  rsvp: { status: RsvpStatus; count: number; at?: string };
}

export interface RundownItem {
  id: string;
  start: string;
  end: string;
  activity: string;
  pic: string;
  location?: string;
  note?: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string | null;
  start: string;
  end: string;
  venue: string;
  address: string;
  mapsUrl: string;
  rundown: RundownItem[];
}

export type InvitationTemplate = "melati" | "sage" | "malam";

export interface Invitation {
  template: InvitationTemplate;
  opening: string;
  quote: string;
  quoteSource: string;
  closing: string;
  music: boolean;
  published: boolean;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  at: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  modules: ModuleId[];
  pending?: boolean;
}

export interface AdvisorMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestions?: string[];
}

export interface ActivityEntry {
  id: string;
  text: string;
  at: string;
}

export interface AppState {
  version: 1;
  wedding: Wedding;
  tasks: Task[];
  budget: BudgetItem[];
  guests: Guest[];
  events: WeddingEvent[];
  invitation: Invitation;
  wishes: Wish[];
  members: Member[];
  advisor: { messages: AdvisorMessage[]; used: number };
  activity: ActivityEntry[];
}
