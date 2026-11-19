import type { Metadata } from "next";

import HomePageClient from "./HomePageClient";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medicare & Health Insurance in Jacksonville | Vital Edge Insurance",
  description: "Medicare and health insurance guidance with Patrick Mackin IV. Serving Jacksonville, St. Johns County, Nocatee and 12 licensed states. Book a call or compare available Medicare plans online.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
