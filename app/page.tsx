import Invitation from "@/components/Invitation";
import { supabase } from "@/lib/supabase";

type Props = { searchParams: Promise<{ to?: string }> };

export default async function Page({ searchParams }: Props) {
  const { to } = await searchParams;
  const guest = (to ?? "").trim().slice(0, 60) || "Tamu Undangan";

  const { data } = await supabase
    .from("ucapan")
    .select("id, nama, pesan")
    .order("created_at", { ascending: false })
    .limit(50);

  return <Invitation guest={guest} ucapan={data ?? []} />;
}
