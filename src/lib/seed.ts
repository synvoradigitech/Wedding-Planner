import { addDays, slugify, titleCase, uid } from "./format";
import {
  BUDGET_CATEGORIES,
  RUNDOWN_TEMPLATES,
  buildTaskTemplates,
  mainCeremonyName,
} from "./templates";
import type { AdatId, AgamaId, AppState, Guest, Task, WeddingEvent } from "./types";

export interface OnboardingInput {
  brideName: string;
  groomName: string;
  date: string | null;
  city: string;
  adat: AdatId;
  agama: AgamaId;
  guestEstimate: number;
  totalBudget: number;
  ownerName: string;
  ownerEmail: string;
}

function buildTasks(adat: AdatId, agama: AgamaId): Task[] {
  return buildTaskTemplates(adat, agama).map(([offsetDays, title]) => ({
    id: uid(),
    title,
    offsetDays,
    dueDate: null,
    done: false,
    pic: null,
    source: "template",
  }));
}

function buildEvents(input: OnboardingInput): WeddingEvent[] {
  const main = mainCeremonyName(input.agama);
  const withRundown = (name: string) =>
    (RUNDOWN_TEMPLATES[name] ?? []).map((r) => ({ ...r, id: uid() }));
  return [
    {
      id: uid(),
      name: main,
      date: input.date,
      start: "08:00",
      end: "10:00",
      venue: "",
      address: input.city,
      mapsUrl: "",
      rundown: withRundown(main),
    },
    {
      id: uid(),
      name: "Resepsi",
      date: input.date,
      start: "11:00",
      end: "13:30",
      venue: "",
      address: input.city,
      mapsUrl: "",
      rundown: withRundown("Resepsi"),
    },
  ];
}

export function createFreshState(input: OnboardingInput): AppState {
  return {
    version: 1,
    wedding: {
      brideName: titleCase(input.brideName.trim()),
      groomName: titleCase(input.groomName.trim()),
      date: input.date,
      city: input.city,
      adat: input.adat,
      agama: input.agama,
      guestEstimate: input.guestEstimate,
      totalBudget: input.totalBudget,
      plan: "starter",
      slug: slugify(`${input.brideName}-${input.groomName}`) || "undangan",
    },
    tasks: buildTasks(input.adat, input.agama),
    budget: BUDGET_CATEGORIES.map(([category, percent]) => ({
      id: uid(),
      category,
      allocated: Math.round((input.totalBudget * percent) / 100 / 100_000) * 100_000,
      payments: [],
      expenses: [],
    })),
    guests: [],
    events: buildEvents(input),
    invitation: {
      template: "melati",
      opening:
        "Dengan memohon rahmat dan ridha Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.",
      quote:
        "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya.",
      quoteSource: "QS. Ar-Rum: 21",
      closing: "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      music: true,
      published: false,
    },
    wishes: [],
    members: [
      {
        id: "owner",
        name: titleCase(input.ownerName.trim()),
        email: input.ownerEmail,
        role: "owner",
        modules: ["checklist", "anggaran", "tamu", "undangan", "rundown"],
      },
    ],
    advisor: { messages: [], used: 0 },
    activity: [{ id: uid(), text: `${input.ownerName} membuat rencana pernikahan`, at: new Date().toISOString() }],
  };
}

const DEMO_GUESTS: [name: string, group: string, pax: number, status: Guest["rsvp"]["status"], count: number, vip?: boolean][] = [
  ["Bapak Hendra Wijaya", "Keluarga mempelai wanita", 2, "hadir", 2, true],
  ["Ibu Ratna Sari", "Keluarga mempelai wanita", 2, "hadir", 2, true],
  ["Pakde Sutrisno", "Keluarga mempelai wanita", 4, "pending", 0, true],
  ["Bulik Endang", "Keluarga mempelai wanita", 3, "hadir", 3],
  ["Bapak Agus Santoso", "Keluarga mempelai pria", 2, "hadir", 2, true],
  ["Om Dimas Prasetyo", "Keluarga mempelai pria", 4, "tidak", 0],
  ["Tante Wulan", "Keluarga mempelai pria", 2, "pending", 0],
  ["Nadia Putri", "Teman kuliah", 1, "hadir", 1],
  ["Fajar Nugroho", "Teman kuliah", 2, "hadir", 2],
  ["Citra Lestari", "Teman kuliah", 1, "pending", 0],
  ["Bima Aditya", "Teman kantor", 2, "hadir", 1],
  ["Sekar Ayuningtyas", "Teman kantor", 1, "tidak", 0],
  ["Yoga Pratama", "Teman kantor", 2, "pending", 0],
  ["Ibu Marni (RT 04)", "Tetangga", 2, "hadir", 2],
  ["Bapak Slamet (RT 04)", "Tetangga", 2, "pending", 0],
  ["Rizky & Anisa", "Teman kuliah", 2, "hadir", 2],
];

/** Data contoh: Ayu & Raka, adat Jawa, Islam, Yogyakarta. */
export function createDemoState(): AppState {
  const date = "2027-05-15";
  const state = createFreshState({
    brideName: "Ayu",
    groomName: "Raka",
    date,
    city: "Yogyakarta",
    adat: "jawa",
    agama: "islam",
    guestEstimate: 400,
    totalBudget: 150_000_000,
    ownerName: "Ayu Larasati",
    ownerEmail: "ayu@contoh.id",
  });

  state.members.push(
    { id: "raka", name: "Raka Pradipta", email: "raka@contoh.id", role: "editor", modules: ["checklist", "anggaran", "tamu", "undangan", "rundown"] },
    { id: "ibu", name: "Ibu Sri Wahyuni", email: "sri@contoh.id", role: "editor", modules: ["checklist", "tamu"] },
  );

  // Tugas yang tenggatnya sudah lewat dianggap selesai, kecuali dekorasi (masih terlambat).
  const pics = ["owner", "raka", "ibu"];
  state.tasks = state.tasks.map((t, i) => ({
    ...t,
    done: (t.offsetDays ?? 0) >= 204 && !t.title.includes("dekorasi") ? true : t.title.includes("cincin"),
    pic: pics[i % pics.length],
  }));
  state.tasks.push({
    id: uid(),
    title: "Cari referensi playlist untuk resepsi",
    offsetDays: null,
    dueDate: "2026-11-20",
    done: false,
    pic: "raka",
    source: "manual",
  });

  const vendorData: Record<string, { allocated: number; vendor?: string; contact?: string; payments?: [string, number, string, boolean][]; expenses?: [number, string, string][] }> = {
    Venue: { allocated: 30_000_000, vendor: "Pendopo Ndalem Sekar", contact: "0812-2701-4455", payments: [["DP", 10_000_000, "2026-08-10", true], ["Cicilan 1", 10_000_000, "2026-11-15", false], ["Pelunasan", 10_000_000, "2027-04-15", false]] },
    Katering: { allocated: 45_000_000, vendor: "Dapur Mbok Sri", contact: "0813-9022-1188", payments: [["DP", 15_000_000, "2026-09-01", true], ["Cicilan 1", 15_000_000, "2027-01-10", false], ["Pelunasan", 15_000_000, "2027-05-01", false]] },
    Dekorasi: { allocated: 15_000_000 },
    "Busana & MUA": { allocated: 15_000_000, vendor: "Sanggar Paes Ayu", contact: "0857-4100-2233", payments: [["DP", 5_000_000, "2026-09-20", true], ["Pelunasan", 10_000_000, "2027-05-01", false]] },
    Dokumentasi: { allocated: 12_000_000, vendor: "Lensa Rasa Studio", contact: "0811-2600-7788", payments: [["DP", 4_000_000, "2026-08-25", true], ["Pelunasan", 8_000_000, "2026-11-05", false]] },
    "Seserahan & mahar": { allocated: 10_000_000, expenses: [[1_250_000, "2026-10-05", "Set skincare seserahan"], [850_000, "2026-10-12", "Kotak hantaran (6 buah)"], [2_100_000, "2026-10-18", "Kain batik tulis"]] },
    Cincin: { allocated: 6_000_000, vendor: "Toko Emas Kencana", expenses: [[5_400_000, "2026-10-02", "Sepasang cincin emas 18K"]] },
    "Undangan & souvenir": { allocated: 6_000_000 },
    Hiburan: { allocated: 6_000_000 },
    "Lain-lain": { allocated: 5_000_000, expenses: [[350_000, "2026-09-14", "Materai dan fotokopi berkas KUA"]] },
  };

  state.budget = state.budget.map((b) => {
    const v = vendorData[b.category];
    if (!v) return b;
    return {
      ...b,
      allocated: v.allocated,
      vendorName: v.vendor,
      vendorContact: v.contact,
      payments: (v.payments ?? []).map(([label, amount, dueDate, paid]) => ({ id: uid(), label, amount, dueDate, paid })),
      expenses: (v.expenses ?? []).map(([amount, d, note]) => ({ id: uid(), amount, date: d, note })),
    };
  });

  // Acara: siraman sehari sebelum, akad dan resepsi di hari H.
  const venue = "Pendopo Ndalem Sekar";
  const address = "Jl. Prawirotaman No. 12, Mergangsan, Yogyakarta";
  const mapsUrl = "https://maps.google.com/?q=Prawirotaman+Yogyakarta";
  state.events = state.events.map((e) => ({ ...e, venue, address, mapsUrl }));
  state.events[1] = { ...state.events[1], start: "10:30", end: "13:30" };
  state.events.unshift({
    id: uid(),
    name: "Siraman",
    date: addDays(date, -1),
    start: "09:00",
    end: "10:30",
    venue: "Kediaman keluarga Ayu",
    address: "Jl. Kaliurang Km 7, Sleman",
    mapsUrl: "https://maps.google.com/?q=Kaliurang+Sleman",
    rundown: RUNDOWN_TEMPLATES.Siraman.map((r) => ({ ...r, id: uid() })),
  });

  const allEventIds = state.events.slice(1).map((e) => e.id);
  const familyEventIds = state.events.map((e) => e.id);
  state.guests = DEMO_GUESTS.map(([name, group, pax, status, count, vip], i) => ({
    id: uid(),
    name,
    phone: `08${(1234567890 + i * 7919).toString().slice(0, 10)}`,
    group,
    pax,
    category: vip ? "VIP" : "Reguler",
    eventIds: group.startsWith("Keluarga") ? familyEventIds : allEventIds,
    slug: slugify(name),
    rsvp: { status, count, at: status === "pending" ? undefined : "2026-10-20T09:00:00.000Z" },
  }));

  state.wishes = [
    { id: uid(), name: "Nadia Putri", message: "Selamat Ayu & Raka! Semoga jadi keluarga yang sakinah, mawaddah, warahmah.", at: "2026-10-21T08:12:00.000Z" },
    { id: uid(), name: "Fajar Nugroho", message: "Akhirnya! Ditunggu di Jogja ya, semoga lancar sampai hari H.", at: "2026-10-20T14:40:00.000Z" },
    { id: uid(), name: "Ibu Marni (RT 04)", message: "Mugi-mugi pinaringan berkah lan rukun salaminipun.", at: "2026-10-19T10:05:00.000Z" },
  ];

  state.invitation.brideParents = "Putri dari Bapak Hendra Wijaya & Ibu Ratna Sari";
  state.invitation.groomParents = "Putra dari Bapak Agus Santoso & Ibu Wulan Dewi";
  state.invitation.story = [
    { id: uid(), title: "Pertama bertemu", date: "Maret 2022", text: "Berawal dari acara kampus di Yogyakarta, obrolan singkat itu ternyata berlanjut sampai larut malam." },
    { id: uid(), title: "Mulai bersama", date: "Agustus 2023", text: "Setelah setahun lebih berteman, kami memutuskan untuk melangkah bersama." },
    { id: uid(), title: "Lamaran", date: "September 2026", text: "Disaksikan kedua keluarga, kami sepakat melanjutkan ke jenjang pernikahan." },
  ];
  state.invitation.gift = { bank: "BCA", number: "1234567890", holder: "Ayu Larasati" };

  state.advisor.used = 2;
  state.activity = [
    { id: uid(), text: "Nadia Putri mengonfirmasi hadir (1 orang)", at: "2026-10-21T08:12:00.000Z" },
    { id: uid(), text: "Ibu Sri Wahyuni menambahkan 4 tamu keluarga", at: "2026-10-20T19:30:00.000Z" },
    { id: uid(), text: "Raka mencatat pengeluaran Kain batik tulis", at: "2026-10-18T16:00:00.000Z" },
    { id: uid(), text: "Ayu menandai \"Pesan cincin kawin\" selesai", at: "2026-10-02T11:20:00.000Z" },
  ];
  return state;
}
