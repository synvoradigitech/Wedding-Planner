import type { Metadata } from "next";
import { PublicInvitation } from "./public-invitation";

export const metadata: Metadata = { title: "Undangan Pernikahan" };

export default async function InvitationPage(props: PageProps<"/u/[slug]">) {
  const { slug } = await props.params;
  const { to } = await props.searchParams;
  return <PublicInvitation slug={slug} guestSlug={typeof to === "string" ? to : null} />;
}
