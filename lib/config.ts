// ===== SEMUA DATA UNDANGAN DIUBAH DI SINI =====
export const config = {
  groom: { short: "Andi", full: "Andi Pratama", parents: "Putra dari Bapak Hendra & Ibu Ratna" },
  bride: { short: "Sinta", full: "Sinta Maharani", parents: "Putri dari Bapak Wahyu & Ibu Lestari" },

  // Format ISO dengan zona waktu (+07:00 = WIB)
  date: "2027-02-13T08:00:00+07:00",
  dateLabel: "SABTU, 13 FEBRUARI 2027",

  events: [
    { title: "Akad Nikah", time: "Pukul 08.00 WIB", place: "Masjid Agung Bandung", address: "Jl. Dalem Kaum No. 14, Bandung" },
    { title: "Resepsi", time: "Pukul 11.00 WIB", place: "Gedung Sasana Budaya", address: "Jl. Merdeka No. 21, Bandung" },
  ],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Masjid+Agung+Bandung",

  // Nomor WhatsApp penerima RSVP (format internasional, tanpa +)
  waNumber: "6281234567890",

  // Isi dengan "/lagu.mp3" (taruh file di folder public/) untuk memakai lagu sendiri.
  // Biarkan null untuk musik piano bawaan (dibuat lewat Web Audio).
  musicFile: null as string | null,

  siteTitle: "Undangan Pernikahan Andi & Sinta",
  siteDescription: "Kami mengundang Anda untuk hadir di hari bahagia kami.",
};
