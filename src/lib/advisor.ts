import { adatLabel } from "./templates";
import type { AppState } from "./types";

// Jawaban contoh untuk prototipe. Nanti diganti panggilan Claude API dengan konteks profil pernikahan.

const SESERAHAN: Record<string, string[]> = {
  jawa: ["Seperangkat busana dan kain batik", "Perhiasan", "Alat salat / perlengkapan ibadah", "Kosmetik dan perawatan", "Jajanan pasar (wajik, jadah, jenang)", "Pisang raja satu tangkep", "Sirih ayu (suruh ayu)"],
  sunda: ["Busana dan kain", "Perhiasan", "Kosmetik", "Perlengkapan ibadah", "Kue tradisional (wajit, ranginang)", "Sirih pinang"],
  minang: ["Kain songket", "Perhiasan emas", "Kue bolu dan kue tradisional", "Sirih dalam carano", "Perlengkapan ibadah"],
  default: ["Busana dan kain", "Perhiasan", "Perlengkapan ibadah", "Kosmetik dan perawatan", "Sepatu dan tas", "Kue atau buah"],
};

export function advisorAnswer(question: string, state: AppState): { text: string; suggestions?: string[] } {
  const q = question.toLowerCase();
  const adat = state.wedding.adat;
  const name = adatLabel(adat);

  if (q.includes("seserahan") || q.includes("hantaran")) {
    const items = SESERAHAN[adat] ?? SESERAHAN.default;
    return {
      text: `Untuk adat ${name}, seserahan biasanya berisi barang kebutuhan mempelai wanita dan simbol harapan. Jumlah kotak umumnya ganjil (5, 7, atau 9). Berikut usulan isi yang bisa Anda sesuaikan dengan anggaran:`,
      suggestions: items,
    };
  }

  if (q.includes("urutan") || q.includes("prosesi") || q.includes("tahapan")) {
    if (adat === "jawa") {
      return {
        text: "Urutan umum pernikahan adat Jawa (gaya Solo/Yogya):\n\n1. Pasang tarub dan bleketepe\n2. Siraman (pagi, sehari sebelum akad)\n3. Dodol dawet\n4. Midodareni (malam sebelum akad)\n5. Akad nikah\n6. Panggih: balangan gantal, ngidak tigan, sindur binayang, timbang, kacar-kucur, dulangan\n7. Sungkeman\n8. Resepsi\n\nUrutan detail bisa berbeda antara gaya Solo dan Yogya, jadi pastikan dengan pemandu adat (pemaes) Anda.",
      };
    }
    return {
      text: `Urutan prosesi adat ${name} cukup beragam antar daerah dan keluarga. Secara umum: penjajakan dan lamaran, prosesi pra-nikah (malam sebelum acara), akad/pemberkatan, prosesi adat setelahnya, lalu resepsi. Sebaiknya konfirmasi urutan detail dengan sesepuh keluarga atau pemandu adat.`,
    };
  }

  if (q.includes("katering") || q.includes("persen") || q.includes("anggaran")) {
    return {
      text: "Patokan pembagian anggaran yang umum dipakai:\n\n• Katering 30%\n• Venue 20%\n• Dekorasi 10%\n• Busana & MUA 10%\n• Dokumentasi 8%\n• Seserahan & mahar 7%\n• Lainnya 15%\n\nUntuk katering, hitung dari jumlah tamu × 2 porsi (tamu sering datang berpasangan) lalu tambah cadangan 10%.",
    };
  }

  if (q.includes("venue") || q.includes("gedung") || q.includes("booking")) {
    return {
      text: "Venue sebaiknya dipesan 9–12 bulan sebelum hari H, terutama untuk tanggal favorit (bulan Syawal, Dzulhijjah, atau akhir pekan panjang). Tanyakan juga: jam pakai, biaya overtime, vendor wajib (in-house), dan kebijakan pembatalan.",
    };
  }

  return {
    text: `Pertanyaan yang bagus. Untuk pernikahan adat ${name} di ${state.wedding.city}, saya sarankan memastikan dulu kesepakatan kedua keluarga soal tanggal, jumlah tamu, dan pembagian biaya. Coba tanyakan hal yang lebih spesifik, misalnya urutan prosesi, isi seserahan, atau pembagian anggaran.`,
  };
}

export const SUGGESTED_QUESTIONS = [
  "Bagaimana urutan prosesi pernikahan adat saya?",
  "Apa saja isi seserahan yang umum?",
  "Berapa persen anggaran untuk katering?",
  "Kapan sebaiknya booking gedung?",
];
