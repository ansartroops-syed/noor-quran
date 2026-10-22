"use client";

import { useState, useEffect } from "react";

export type ReadingThemeId = "mushaf" | "white" | "sepia" | "mint" | "night";

export interface ReadingTheme {
  id: ReadingThemeId;
  label: string;
  arabicLabel: string;
  desc: string;
  /** Small dot colour shown in the picker */
  dot: string;
  /** CSS variables applied to the reading surface wrapper */
  vars: Record<string, string>;
}

export const READING_THEMES: ReadingTheme[] = [
  {
    id: "mushaf",
    label: "Mushaf Cream",
    arabicLabel: "مصحف كريمي",
    desc: "Classic cream paper like a printed Mushaf. Default.",
    dot: "#f3e8cf",
    vars: {
      "--rp-page": "#faf4e4",
      "--rp-page2": "#f1e5c9",
      "--rp-ink": "#2e2318",
      "--rp-muted": "#7a6a55",
      "--rp-accent": "#9a6b1f",
      "--rp-bis": "#8a5f14",
      "--rp-badge-bd": "#b98a2f",
      "--rp-badge-tx": "#8a5f14",
      "--rp-card": "#fffdf6",
      "--rp-card-bd": "#e0d1a8",
      "--rp-active": "rgba(185, 138, 47, 0.22)",
      "--rp-active-tx": "#5c3f0c",
      "--rp-note-bg": "#f4ead2",
      "--rp-note-bd": "#ddc891",
      "--rp-divider": "#e0d1a8",
    },
  },
  {
    id: "white",
    label: "White Day",
    arabicLabel: "نهار أبيض",
    desc: "Bright white page, maximum contrast.",
    dot: "#ffffff",
    vars: {
      "--rp-page": "#ffffff",
      "--rp-page2": "#eef2f1",
      "--rp-ink": "#111827",
      "--rp-muted": "#6b7280",
      "--rp-accent": "#047857",
      "--rp-bis": "#065f46",
      "--rp-badge-bd": "#047857",
      "--rp-badge-tx": "#065f46",
      "--rp-card": "#f8fafc",
      "--rp-card-bd": "#dfe5e7",
      "--rp-active": "rgba(4, 120, 87, 0.14)",
      "--rp-active-tx": "#064e3b",
      "--rp-note-bg": "#eff8f3",
      "--rp-note-bd": "#b7dfc4",
      "--rp-divider": "#dfe5e7",
    },
  },
  {
    id: "sepia",
    label: "Sepia",
    arabicLabel: "بني دافئ",
    desc: "Warm sepia paper, gentle on the eyes.",
    dot: "#e6d3ac",
    vars: {
      "--rp-page": "#f0e2c4",
      "--rp-page2": "#e3cfa3",
      "--rp-ink": "#46341f",
      "--rp-muted": "#8a7355",
      "--rp-accent": "#8a5a12",
      "--rp-bis": "#7a4d0e",
      "--rp-badge-bd": "#8a5a12",
      "--rp-badge-tx": "#7a4d0e",
      "--rp-card": "#f8efdb",
      "--rp-card-bd": "#d3ba84",
      "--rp-active": "rgba(138, 90, 18, 0.2)",
      "--rp-active-tx": "#5c3a08",
      "--rp-note-bg": "#e9d8b4",
      "--rp-note-bd": "#cba96f",
      "--rp-divider": "#d3ba84",
    },
  },
  {
    id: "mint",
    label: "Mint Light",
    arabicLabel: "أخضر فاتح",
    desc: "Soft green-tinted light page.",
    dot: "#dcefe2",
    vars: {
      "--rp-page": "#edf6ef",
      "--rp-page2": "#d9ecdf",
      "--rp-ink": "#12372a",
      "--rp-muted": "#4f6f63",
      "--rp-accent": "#0e7a55",
      "--rp-bis": "#0b5f43",
      "--rp-badge-bd": "#0e7a55",
      "--rp-badge-tx": "#0b5f43",
      "--rp-card": "#f7fcf8",
      "--rp-card-bd": "#bfe0cb",
      "--rp-active": "rgba(14, 122, 85, 0.16)",
      "--rp-active-tx": "#0a4330",
      "--rp-note-bg": "#e0f1e6",
      "--rp-note-bd": "#aed8bd",
      "--rp-divider": "#bfe0cb",
    },
  },
  {
    id: "night",
    label: "Night Dark",
    arabicLabel: "ليلي داكن",
    desc: "Dark emerald page for night reading.",
    dot: "#0a1f18",
    vars: {
      "--rp-page": "#0a1f18",
      "--rp-page2": "#041a14",
      "--rp-ink": "#ecfdf5",
      "--rp-muted": "#94a3b8",
      "--rp-accent": "#fcd34d",
      "--rp-bis": "#fcd34d",
      "--rp-badge-bd": "rgba(52, 211, 153, 0.55)",
      "--rp-badge-tx": "#6ee7b7",
      "--rp-card": "#06241c",
      "--rp-card-bd": "rgba(16, 122, 87, 0.5)",
      "--rp-active": "rgba(245, 158, 11, 0.25)",
      "--rp-active-tx": "#fde68a",
      "--rp-note-bg": "#062a21",
      "--rp-note-bd": "rgba(16, 122, 87, 0.6)",
      "--rp-divider": "rgba(16, 122, 87, 0.45)",
    },
  },
];

/** Default reading theme — light Mushaf paper, NEVER dark. */
export const DEFAULT_READING_THEME: ReadingThemeId = "mushaf";

export const READING_THEME_KEY = "noor-quran-reading-theme";
export const READING_THEME_EVENT = "noor-quran:reading-theme";

function isThemeId(v: unknown): v is ReadingThemeId {
  return v === "mushaf" || v === "white" || v === "sepia" || v === "mint" || v === "night";
}

export function getReadingTheme(id: string): ReadingTheme {
  return READING_THEMES.find((t) => t.id === id) ?? READING_THEMES[0];
}

export function readStoredTheme(): ReadingThemeId {
  if (typeof window === "undefined") return DEFAULT_READING_THEME;
  try {
    const v = window.localStorage.getItem(READING_THEME_KEY);
    if (isThemeId(v)) return v;
  } catch {
    // ignore
  }
  return DEFAULT_READING_THEME;
}

export function storeTheme(id: ReadingThemeId) {
  try {
    window.localStorage.setItem(READING_THEME_KEY, id);
  } catch {
    // ignore
  }
  try {
    window.dispatchEvent(new CustomEvent(READING_THEME_EVENT, { detail: id }));
  } catch {
    // ignore
  }
}

/** Shared hook — both reader tabs stay in sync through localStorage + event. */
export function useReadingTheme() {
  const [themeId, setThemeId] = useState<ReadingThemeId>(() => readStoredTheme());

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      if (isThemeId(id)) setThemeId(id);
    };
    window.addEventListener(READING_THEME_EVENT, handler);
    return () => window.removeEventListener(READING_THEME_EVENT, handler);
  }, []);

  const setTheme = (id: ReadingThemeId) => {
    setThemeId(id);
    storeTheme(id);
  };

  return { themeId, theme: getReadingTheme(themeId), setTheme };
}
