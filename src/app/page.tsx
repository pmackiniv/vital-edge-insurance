import type { Metadata } from "next";

import HomePageClient from "./HomePageClient";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
