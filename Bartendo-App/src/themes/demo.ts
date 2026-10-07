import type { VenueTheme } from "./types";

/** Made-up demo venues from the prototype. Real venues store their theme in the database. */
export const demoThemes: Record<string, { name: string; tagline: string; theme: VenueTheme }> = {
  "casa-agave": {
    name: "Casa Agave",
    tagline: "Tequila, mezcal, and a patio that stays open late.",
    theme: {
      displayFont: "'DM Serif Display', Georgia, serif",
      bodyFont: "'Work Sans', system-ui, sans-serif",
      colors: { background: "#17285A", surface: "#21356E", text: "#FBF1DC", muted: "#B9C2DE", line: "#34498A",
        accent: "#F2B632", onAccent: "#17285A", ticket: "#FBF1DC", ticketInk: "#17285A" },
      radius: "6px",
      signature: "papel-picado",
    },
  },
  "rusty-nail": {
    name: "The Rusty Nail",
    tagline: "Cold beer, loud jukebox, no dress code.",
    theme: {
      displayFont: "'Permanent Marker', cursive",
      bodyFont: "'Archivo', system-ui, sans-serif",
      colors: { background: "#E8DCC4", surface: "#F3EAD6", text: "#1F1A17", muted: "#6B5E50", line: "#CDBE9F",
        accent: "#C8201E", onAccent: "#FFF3E0", ticket: "#C8201E", ticketInk: "#FFF3E0" },
      radius: "2px",
    },
  },
  "nineteen-up": {
    name: "Nineteen Up",
    tagline: "Nineteen floors up. Cocktails until the skyline goes dark.",
    theme: {
      displayFont: "'Italiana', Georgia, serif",
      bodyFont: "'Jost', system-ui, sans-serif",
      colors: { background: "#231D44", surface: "rgba(255,255,255,.08)", text: "#F6EEF2", muted: "#C9BCD6",
        line: "rgba(255,255,255,.16)", accent: "#F5C28B", onAccent: "#231D44", ticket: "rgba(255,248,240,.95)", ticketInk: "#231D44" },
      radius: "22px",
      backgroundImage: "linear-gradient(172deg,#1E1A3F 0%,#4A3268 55%,#B8697A 100%)",
      signature: "skyline",
    },
  },
};
