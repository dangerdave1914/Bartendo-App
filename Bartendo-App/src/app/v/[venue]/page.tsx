import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { demoThemes } from "@/themes/demo";

/** Patron entry point: a venue's themed app. Menu, checkout and ticket screens get ported from the prototype. */
export default function VenuePage({ params }: { params: { venue: string } }) {
  const v = demoThemes[params.venue];
  if (!v) notFound();
  const c = v.theme.colors;
  const style: CSSProperties = {
    minHeight: "100dvh",
    padding: "1.5rem 1.25rem",
    background: c.background,
    backgroundImage: v.theme.backgroundImage,
    color: c.text,
    fontFamily: v.theme.bodyFont,
  };
  return (
    <main style={style}>
      <h1 style={{ fontFamily: v.theme.displayFont, fontWeight: 400, fontSize: "3rem", margin: 0 }}>{v.name}</h1>
      <p style={{ color: c.muted }}>{v.tagline}</p>
      <p style={{ color: c.muted }}>Check-in, menu, checkout and claim ticket go here.</p>
    </main>
  );
}
