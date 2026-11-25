import Invitation from "@/components/Invitation";

type Props = { searchParams: Promise<{ to?: string }> };

export default async function Page({ searchParams }: Props) {
  const { to } = await searchParams;
  const guest = (to ?? "").trim().slice(0, 60) || "Tamu Undangan";

  return <Invitation guest={guest} />;
}
