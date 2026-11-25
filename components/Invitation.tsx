"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { config } from "@/lib/config";

const CHORDS = [
  [261.63, 329.63, 392.0, 523.25], // C
  [196.0, 246.94, 293.66, 392.0], //  G
  [220.0, 261.63, 329.63, 440.0], //  Am
  [174.61, 220.0, 261.63, 349.23], // F
];
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 1];

type Synth = {
  ctx: AudioContext;
  master: GainNode;
  timer: number | null;
  step: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function Invitation({
  guest,
}: {
  guest: string;
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [petals, setPetals] = useState<CSSProperties[]>([]);
  const [left, setLeft] = useState<number | null>(null);
  const [rsvp, setRsvp] = useState({
    name: guest === "Tamu Undangan" ? "" : guest,
    status: "Hadir",
    pax: 1,
  });

  const synth = useRef<Synth | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  /* ---------- Musik ---------- */
  function note(s: Synth, f: number, dur: number) {
    const t = s.ctx.currentTime + 0.02;
    const o = s.ctx.createOscillator();
    const g = s.ctx.createGain();
    o.type = "triangle";
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g);
    g.connect(s.master);
    o.start(t);
    o.stop(t + dur + 0.1);
  }

  function startMusic() {
    if (config.musicFile) {
      if (!audio.current) {
        audio.current = new Audio(config.musicFile);
        audio.current.loop = true;
      }
      audio.current.play().catch(() => {});
      setPlaying(true);
      return;
    }
    if (!synth.current) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      const delay = ctx.createDelay(1);
      delay.delayTime.value = 0.38;
      const fb = ctx.createGain();
      fb.gain.value = 0.42;
      const wet = ctx.createGain();
      wet.gain.value = 0.5;
      master.connect(ctx.destination);
      master.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(ctx.destination);
      synth.current = { ctx, master, timer: null, step: 0 };
    }
    const s = synth.current;
    if (s.ctx.state === "suspended") s.ctx.resume();
    if (s.timer === null) {
      s.timer = window.setInterval(() => {
        const chord = CHORDS[Math.floor(s.step / 8) % 4];
        const i = s.step % 8;
        note(s, chord[PATTERN[i]], 2.2);
        if (i === 0) note(s, chord[0] / 2, 3.5);
        s.step++;
      }, 620);
    }
    setPlaying(true);
  }

  function stopMusic() {
    if (audio.current) audio.current.pause();
    const s = synth.current;
    if (s && s.timer !== null) {
      clearInterval(s.timer);
      s.timer = null;
    }
    setPlaying(false);
  }

  useEffect(() => () => stopMusic(), []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Buka undangan ---------- */
  function openInvitation() {
    setOpen(true);
    startMusic();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPetals(
        Array.from({ length: 14 }, () => ({
          left: `${Math.random() * 100}vw`,
          animationDuration: `${9 + Math.random() * 9}s`,
          animationDelay: `${Math.random() * 8}s`,
          opacity: 0.3 + Math.random() * 0.4,
          ["--dx" as string]: `${Math.random() * 120 - 60}px`,
        })),
      );
    }
  }

  useEffect(() => {
    document.body.classList.toggle("lock", !open);
    return () => document.body.classList.remove("lock");
  }, [open]);

  /* ---------- Hitung mundur ---------- */
  useEffect(() => {
    const target = new Date(config.date).getTime();
    const tick = () =>
      setLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ---------- Muncul saat scroll ---------- */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ---------- RSVP ---------- */
  function sendRsvp() {
    const n = rsvp.name.trim() || guest;
    const msg = `Halo, saya ${n}. Konfirmasi: ${rsvp.status} (${rsvp.pax} orang). Selamat untuk ${config.groom.short} & ${config.bride.short}!`;
    window.open(
      `https://wa.me/${config.waNumber}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener",
    );
  }

  const L = left ?? 0;
  const { groom, bride } = config;

  return (
    <>
      <div id="cover" className={open ? "open" : ""}>
        <svg viewBox="0 0 150 80" aria-hidden="true">
          <circle className="ring" cx="55" cy="45" r="30" />
          <circle className="ring b" cx="95" cy="45" r="30" />
          <path className="gem" d="M55 9 l6 8 -6 8 -6 -8z" />
        </svg>
        <h1 className="cv-names">
          {groom.short}
          <span>&amp;</span>
          {bride.short}
        </h1>
        <p className="cv-guest">
          Kepada Yth.<strong>{guest}</strong>
        </p>
        <button className="btn" id="openBtn" onClick={openInvitation}>
          Buka Undangan
        </button>
      </div>

      <button
        id="music"
        className={`${open ? "show" : ""} ${playing ? "on" : ""}`}
        onClick={() => (playing ? stopMusic() : startMusic())}
        aria-label="Putar atau jeda musik"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M9 18V6l11-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="17.5" cy="16" r="2.5" />
        </svg>
      </button>

      {petals.map((style, i) => (
        <i key={i} className="petal" style={style} />
      ))}

      <main>
        <section id="hero">
          <p className="script" style={{ fontSize: 26 }}>
            Kami akan menikah
          </p>
          <h1 style={{ marginTop: 18 }}>
            {groom.short}
            <em>dan</em>
            {bride.short}
          </h1>
          <p className="date">{config.dateLabel}</p>
          <p className="lead">
            Dengan penuh syukur, kami mengundang Anda untuk hadir dan memberi
            doa restu di hari bahagia kami.
          </p>
        </section>

        <section className="rv">
          <h2 className="title">Mempelai</h2>
          <div className="couple">
            {[groom, bride].map((p) => (
              <div key={p.full}>
                <div className="arch">{p.short[0]}</div>
                <h3>{p.full}</h3>
                <p>{p.parents}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="count" className="rv">
          <h2 className="title">Menuju hari bahagia</h2>
          <div className="cd">
            <div>
              <b>{pad(Math.floor(L / 86400))}</b>
              <small>hari</small>
            </div>
            <div>
              <b>{pad(Math.floor((L % 86400) / 3600))}</b>
              <small>jam</small>
            </div>
            <div>
              <b>{pad(Math.floor((L % 3600) / 60))}</b>
              <small>menit</small>
            </div>
            <div>
              <b>{pad(L % 60)}</b>
              <small>detik</small>
            </div>
          </div>
        </section>

        <section className="rv">
          <h2 className="title">Acara</h2>
          <div className="events">
            {config.events.map((ev) => (
              <div className="ev" key={ev.title}>
                <h3>{ev.title}</h3>
                <div className="t">{ev.time}</div>
                <p>
                  {ev.place}
                  <br />
                  {ev.address}
                </p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 36 }}>
            <a
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
              href={config.mapsUrl}
            >
              Lihat lokasi
            </a>
          </p>
        </section>

        <section className="rv">
          <h2 className="title">Konfirmasi kehadiran</h2>
          <p className="lead">
            Mohon konfirmasi agar kami bisa menyiapkan tempat terbaik untuk
            Anda.
          </p>
          <div className="rsvp">
            <input
              placeholder="Nama Anda"
              aria-label="Nama Anda"
              value={rsvp.name}
              onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
            />
            <select
              aria-label="Status kehadiran"
              value={rsvp.status}
              onChange={(e) => setRsvp({ ...rsvp, status: e.target.value })}
            >
              <option>Hadir</option>
              <option>Tidak hadir</option>
              <option>Masih ragu</option>
            </select>
            <input
              type="number"
              min={1}
              max={10}
              aria-label="Jumlah tamu"
              value={rsvp.pax}
              onChange={(e) =>
                setRsvp({
                  ...rsvp,
                  pax: Math.max(1, Number(e.target.value) || 1),
                })
              }
            />
            <button className="btn" onClick={sendRsvp}>
              Kirim via WhatsApp
            </button>
          </div>
        </section>

        <footer className="rv">
          <span className="script">Terima kasih</span>
          Kehadiran dan doa Anda adalah hadiah terindah bagi kami.
          <br />
          {groom.short} &amp; {bride.short}
        </footer>
      </main>
    </>
  );
}
