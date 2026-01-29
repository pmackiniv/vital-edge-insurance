"use client";

import { useEffect, useState } from "react";

type DayPhase = "sunrise" | "day" | "sunset" | "night";

function getDayPhase(date: Date) {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false,
  }).format(date);
  const h = Number(hour);

  if (h >= 5 && h <= 8) return "sunrise";
  if (h >= 9 && h <= 16) return "day";
  if (h >= 17 && h <= 19) return "sunset";
  return "night";
}

export function BackgroundLayers() {
  const [phase, setPhase] = useState<DayPhase>(() => getDayPhase(new Date()));

  useEffect(() => {
    const update = () => setPhase(getDayPhase(new Date()));
    const interval = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div aria-hidden className="vei-bg" data-phase={phase}>
      <div className="vei-bg-layer vei-bg-daytona" />
      <div className="vei-bg-layer vei-bg-tampa" />
      <div className="vei-bg-layer vei-bg-night" />
      <div className="vei-bg-overlay" />
      <div className="vei-tide" />
    </div>
  );
}
