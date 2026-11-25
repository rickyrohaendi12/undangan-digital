"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

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
  if (!nama || !pesan)
    return { ok: false, error: "Nama dan ucapan wajib diisi." };

  const { error } = await supabase
    .from("ucapan")
    .insert({ nama, pesan });

  if (error) return { ok: false, error: "Gagal mengirim. Silakan coba lagi." };

  revalidatePath("/");
  return { ok: true };
}
