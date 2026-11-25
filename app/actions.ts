"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

const STATUS = ["Hadir", "Tidak hadir", "Masih ragu"];

export async function kirimUcapan(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  // Kolom jebakan untuk bot: manusia tidak akan mengisinya
  if (formData.get("website")) return { ok: true };

  const nama = String(formData.get("nama") ?? "")
    .trim()
    .slice(0, 60);
  const pesan = String(formData.get("pesan") ?? "")
    .trim()
    .slice(0, 500);
  const k = String(formData.get("kehadiran") ?? "");

  if (!nama || !pesan)
    return { ok: false, error: "Nama dan ucapan wajib diisi." };

  const { error } = await supabase
    .from("ucapan")
    .insert({ nama, pesan, kehadiran: STATUS.includes(k) ? k : null });

  if (error) return { ok: false, error: "Gagal mengirim. Silakan coba lagi." };

  revalidatePath("/");
  return { ok: true };
}
