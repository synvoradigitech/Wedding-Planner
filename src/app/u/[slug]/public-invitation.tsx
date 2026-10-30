"use client";

import { LoaderCircle } from "lucide-react";
import { InvitationView, type RsvpInput } from "@/components/invitation-view";
import { slugify, uid } from "@/lib/format";
import { updateState, useStoreState, withActivity } from "@/lib/store";

export function PublicInvitation({ slug, guestSlug }: { slug: string; guestSlug: string | null }) {
  const state = useStoreState();

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (state.wedding.slug !== slug || !state.invitation.published || state.wedding.plan !== "premium") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-3xl">Undangan belum tersedia</p>
        <p className="mt-2 max-w-sm text-sm text-muted">Undangan ini belum diterbitkan atau tautannya salah. Silakan hubungi pengirim undangan.</p>
      </div>
    );
  }

  const guest = guestSlug ? (state.guests.find((g) => g.slug === guestSlug) ?? null) : null;

  function handleRsvp(input: RsvpInput) {
    updateState((s) => {
      const status = input.attending ? ("hadir" as const) : ("tidak" as const);
      const rsvp = { status, count: input.count, at: new Date().toISOString() };
      const existing = guest ?? s.guests.find((g) => g.name.toLowerCase() === input.name.toLowerCase());
      const guests = existing
        ? s.guests.map((g) => (g.id === existing.id ? { ...g, rsvp } : g))
        : [
            ...s.guests,
            {
              id: uid(),
              name: input.name,
              phone: "",
              group: "Dari tautan umum",
              pax: Math.max(1, input.count),
              category: "Reguler" as const,
              eventIds: s.events.map((e) => e.id),
              slug: `${slugify(input.name)}-${uid().slice(0, 3)}`,
              rsvp,
            },
          ];
      const wishes = input.message ? [{ id: uid(), name: input.name, message: input.message, at: new Date().toISOString() }, ...s.wishes] : s.wishes;
      return withActivity(
        { ...s, guests, wishes },
        input.attending ? `${input.name} mengonfirmasi hadir (${input.count} orang)` : `${input.name} berhalangan hadir`,
      );
    });
  }

  return (
    <div className={state.invitation.template === "minang" ? "min-h-screen" : "mx-auto min-h-screen max-w-xl shadow-sm"}>
      <InvitationView state={state} guest={guest} mode="live" onRsvp={handleRsvp} />
    </div>
  );
}
