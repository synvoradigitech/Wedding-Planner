import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prototipe menyimpan data di localStorage (dirender di browser), jadi Cache Components belum dipakai.
  // Aktifkan lagi saat data pindah ke backend.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
