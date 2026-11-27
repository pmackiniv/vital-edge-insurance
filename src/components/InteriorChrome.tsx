"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function InteriorChrome({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
