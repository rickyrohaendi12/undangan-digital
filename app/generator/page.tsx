"use client";

import { useState } from "react";
import { config } from "@/lib/config";

type Row = { nama: string; wa: string; link: string };

// "Budi Santoso" atau "Budi Santoso, 08123456789"
function parse(text: string, origin: string): Row[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [nama, nomor = ""] = line.split(/[,\t]/).map((s) => s.trim());
      let wa = nomor.replace(/\D/g, "");
      if (wa.startsWith("0")) wa = "62" + wa.slice(1);
      return { nama, wa, link: `${origin}/?to=${encodeURIComponent(nama)}` };
    });
}

export default function Generator() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [copied, setCopied] = useState("");

  const generate = () => setRows(parse(text, window.location.origin));

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  const pesan = (r: Row) =>
    `Kepada Yth. ${r.nama},\n\nDengan penuh syukur, kami ${config.groom.short} & ${config.bride.short} mengundang Anda ke pernikahan kami. Detail lengkap ada di tautan berikut:\n${r.link}\n\nMerupakan kehormatan bagi kami jika Anda berkenan hadir.`;

  const kirim = (r: Row) =>
    window.open(`https://wa.me/${r.wa}?text=${encodeURIComponent(pesan(r))}`, "_blank", "noopener");

  return (
    <main className="gen">
      <h1>Generator link undangan</h1>
      <p className="hint">
        Tulis satu tamu per baris. Nomor WhatsApp boleh ditambahkan setelah koma, misalnya:
        <br />
        <code>Budi Santoso, 081234567890</code>
      </p>
      <textarea
        aria-label="Daftar tamu"
        placeholder={"Budi Santoso, 081234567890\nSiti Aminah\nKeluarga Bapak Rahmat"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="row">
        <button className="btn" onClick={generate}>Buat link</button>
        {rows.length > 0 && (
          <button
            className="btn"
            onClick={() => copy("all", rows.map((r) => `${r.nama}: ${r.link}`).join("\n"))}
          >
            {copied === "all" ? "Tersalin" : "Salin semua"}
          </button>
        )}
      </div>

      <ul>
        {rows.map((r, i) => (
          <li key={i}>
            <strong>{r.nama}</strong>
            <code>{r.link}</code>
            <div className="row">
              <button className="btn sm" onClick={() => copy(String(i), r.link)}>
                {copied === String(i) ? "Tersalin" : "Salin link"}
              </button>
              <button className="btn sm" onClick={() => kirim(r)}>
                {r.wa ? "Kirim ke WhatsApp" : "Kirim via WhatsApp"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
