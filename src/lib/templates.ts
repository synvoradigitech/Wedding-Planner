import type { AdatId, AgamaId, RundownItem } from "./types";

export const ADAT_OPTIONS: { id: AdatId; label: string; desc: string }[] = [
  { id: "jawa", label: "Jawa", desc: "Siraman, midodareni, panggih" },
  { id: "sunda", label: "Sunda", desc: "Ngeuyeuk seureuh, saweran" },
  { id: "minang", label: "Minang", desc: "Maminang, malam bainai" },
  { id: "batak", label: "Batak", desc: "Marhusip, marhata sinamot" },
  { id: "bugis", label: "Bugis", desc: "Mappettu ada, mappacci" },
  { id: "betawi", label: "Betawi", desc: "Ngelamar, malam pacar" },
  { id: "nasional", label: "Nasional / modern", desc: "Tanpa prosesi adat khusus" },
];

export const AGAMA_OPTIONS: { id: AgamaId; label: string }[] = [
  { id: "islam", label: "Islam" },
  { id: "kristen", label: "Kristen" },
  { id: "katolik", label: "Katolik" },
  { id: "hindu", label: "Hindu" },
  { id: "buddha", label: "Buddha" },
  { id: "konghucu", label: "Konghucu" },
];

export function adatLabel(id: AdatId) {
  return ADAT_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

export function agamaLabel(id: AgamaId) {
  return AGAMA_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

/** Nama acara utama sesuai agama. */
export function mainCeremonyName(agama: AgamaId) {
  if (agama === "islam") return "Akad Nikah";
  if (agama === "kristen" || agama === "katolik") return "Pemberkatan";
  return "Upacara Pernikahan";
}

type TaskTemplate = [offsetDays: number, title: string];

const GENERAL_TASKS: TaskTemplate[] = [
  [365, "Tentukan konsep acara dan perkiraan anggaran"],
  [330, "Susun daftar tamu sementara dari kedua keluarga"],
  [300, "Survei dan booking venue"],
  [270, "Booking katering dan jadwalkan food tasting"],
  [240, "Pilih fotografer dan videografer"],
  [240, "Booking MUA dan busana pengantin"],
  [210, "Pilih vendor dekorasi"],
  [180, "Pesan cincin kawin"],
  [150, "Tentukan seragam keluarga"],
  [120, "Siapkan desain undangan digital"],
  [90, "Finalisasi daftar tamu"],
  [60, "Sebar undangan ke semua tamu"],
  [45, "Fitting busana pertama"],
  [30, "Konfirmasi ulang semua vendor"],
  [21, "Rekap RSVP dan kirim jumlah tamu ke katering"],
  [14, "Susun rundown final bersama MC"],
  [7, "Pelunasan semua vendor"],
  [3, "Gladi resik"],
  [1, "Siapkan amplop untuk petugas dan vendor"],
  [-7, "Kirim ucapan terima kasih ke tamu"],
];

const AGAMA_TASKS: Record<AgamaId, TaskTemplate[]> = {
  islam: [
    [120, "Daftarkan nikah di KUA"],
    [90, "Ikuti bimbingan perkawinan (Bimwin)"],
    [30, "Siapkan mahar dan seperangkat alat salat"],
  ],
  kristen: [
    [180, "Daftar pemberkatan di gereja"],
    [120, "Ikuti katekisasi pranikah"],
    [60, "Daftarkan pernikahan ke Dukcapil"],
  ],
  katolik: [
    [180, "Daftar pemberkatan di paroki"],
    [120, "Ikuti kursus persiapan perkawinan (KPP)"],
    [60, "Daftarkan pernikahan ke Dukcapil"],
  ],
  hindu: [
    [180, "Tentukan dewasa ayu bersama pemuka agama"],
    [60, "Daftarkan pernikahan ke Dukcapil"],
  ],
  buddha: [
    [150, "Daftar pemberkatan di vihara"],
    [60, "Daftarkan pernikahan ke Dukcapil"],
  ],
  konghucu: [
    [150, "Daftar liep gwan di klenteng/MAKIN"],
    [60, "Daftarkan pernikahan ke Dukcapil"],
  ],
};

const ADAT_TASKS: Record<AdatId, TaskTemplate[]> = {
  jawa: [
    [240, "Tentukan hari baik (weton) bersama keluarga"],
    [120, "Lamaran resmi keluarga"],
    [60, "Siapkan perlengkapan siraman"],
    [30, "Siapkan seserahan"],
    [2, "Siraman"],
    [1, "Midodareni"],
  ],
  sunda: [
    [120, "Neundeun omong dan lamaran"],
    [30, "Siapkan seserahan"],
    [3, "Siapkan perlengkapan saweran"],
    [1, "Ngeuyeuk seureuh"],
  ],
  minang: [
    [120, "Maminang dan batimbang tando"],
    [30, "Siapkan hantaran"],
    [1, "Malam bainai"],
  ],
  batak: [
    [150, "Marhusip (pembicaraan awal keluarga)"],
    [120, "Marhata sinamot"],
    [30, "Siapkan ulos untuk keluarga"],
  ],
  bugis: [
    [150, "Mammanu'-manu' (penjajakan keluarga)"],
    [120, "Mappettu ada (penetapan uang panai)"],
    [1, "Mappacci"],
  ],
  betawi: [
    [120, "Ngelamar"],
    [30, "Siapkan roti buaya dan seserahan"],
    [1, "Malam pacar"],
  ],
  nasional: [[120, "Lamaran keluarga"]],
};

export function buildTaskTemplates(adat: AdatId, agama: AgamaId): TaskTemplate[] {
  return [...GENERAL_TASKS, ...AGAMA_TASKS[agama], ...ADAT_TASKS[adat]].sort((a, b) => b[0] - a[0]);
}

export const PHASES = [
  { min: 365, label: "12 bulan atau lebih" },
  { min: 180, label: "6–12 bulan sebelum" },
  { min: 90, label: "3–6 bulan sebelum" },
  { min: 30, label: "1–3 bulan sebelum" },
  { min: 7, label: "Bulan terakhir" },
  { min: 0, label: "Minggu pernikahan" },
  { min: -Infinity, label: "Setelah acara" },
];

export function phaseFor(daysBefore: number) {
  return PHASES.find((p) => daysBefore >= p.min)!.label;
}

/** Kategori anggaran dan persentase alokasi awal. */
export const BUDGET_CATEGORIES: [category: string, percent: number][] = [
  ["Venue", 20],
  ["Katering", 30],
  ["Dekorasi", 10],
  ["Busana & MUA", 10],
  ["Dokumentasi", 8],
  ["Seserahan & mahar", 7],
  ["Cincin", 4],
  ["Undangan & souvenir", 4],
  ["Hiburan", 4],
  ["Lain-lain", 3],
];

export const GUEST_GROUPS = [
  "Keluarga mempelai wanita",
  "Keluarga mempelai pria",
  "Teman kuliah",
  "Teman kantor",
  "Tetangga",
];

type RundownTemplate = Omit<RundownItem, "id">[];

export const RUNDOWN_TEMPLATES: Record<string, RundownTemplate> = {
  "Akad Nikah": [
    { start: "07:30", end: "08:00", activity: "Kedatangan keluarga dan penghulu", pic: "Panitia keluarga" },
    { start: "08:00", end: "08:15", activity: "Pembukaan dan pembacaan ayat suci", pic: "MC" },
    { start: "08:15", end: "08:45", activity: "Ijab kabul", pic: "Penghulu" },
    { start: "08:45", end: "09:00", activity: "Penyerahan mahar dan doa", pic: "MC" },
    { start: "09:00", end: "09:30", activity: "Sungkeman dan foto keluarga", pic: "Fotografer" },
  ],
  Resepsi: [
    { start: "10:30", end: "11:00", activity: "Kirab pengantin masuk", pic: "WO" },
    { start: "11:00", end: "11:15", activity: "Sambutan keluarga", pic: "MC" },
    { start: "11:15", end: "13:00", activity: "Ramah tamah dan salam tamu", pic: "MC" },
    { start: "13:00", end: "13:30", activity: "Foto bersama dan penutup", pic: "Fotografer" },
  ],
  Siraman: [
    { start: "09:00", end: "09:30", activity: "Sungkeman kepada orang tua", pic: "Pemandu adat" },
    { start: "09:30", end: "10:15", activity: "Siraman oleh orang tua dan sesepuh", pic: "Pemandu adat" },
    { start: "10:15", end: "10:30", activity: "Dodol dawet", pic: "Keluarga" },
  ],
  Pemberkatan: [
    { start: "09:00", end: "09:30", activity: "Prosesi masuk", pic: "Panitia gereja" },
    { start: "09:30", end: "10:30", activity: "Ibadah dan pemberkatan nikah", pic: "Pendeta/Pastor" },
    { start: "10:30", end: "11:00", activity: "Penandatanganan dan foto bersama", pic: "Fotografer" },
  ],
};
