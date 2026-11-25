"use client";

import { useRef, useState, useTransition } from "react";
import { kirimUcapan } from "@/app/actions";

export type Ucapan = {
  id: number;
  nama: string;
  pesan: string;
};

export default function GuestBook({
  items,
  defaultName,
}: {
  items: Ucapan[];
  defaultName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [info, setInfo] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await kirimUcapan(fd);
      if (r.ok) {
        formRef.current?.reset();
        setInfo("Terima kasih atas ucapan dan doanya.");
      } else {
        setInfo(r.error ?? "Gagal mengirim.");
      }
    });
  }

  return (
    <>
      <form ref={formRef} className="rsvp" onSubmit={onSubmit}>
        <input
          name="nama"
          placeholder="Nama Anda"
          maxLength={60}
          required
          defaultValue={defaultName === "Tamu Undangan" ? "" : defaultName}
        />
        <textarea
          name="pesan"
          placeholder="Tulis ucapan dan doa"
          maxLength={500}
          rows={4}
          required
        />
        {/* jebakan bot */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px" }}
        />
        <button className="btn" disabled={pending}>
          {pending ? "Mengirim..." : "Kirim ucapan"}
        </button>
        {info && (
          <p role="status" className="lead">
            {info}
          </p>
        )}
      </form>

      <ul className="wishes">
        {items.map((u) => (
          <li key={u.id}>
            <strong>{u.nama}</strong>
            <p>{u.pesan}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
