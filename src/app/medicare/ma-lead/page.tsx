import { permanentRedirect } from "next/navigation";

export default function LegacyMedicareAdvantageRoute() {
  permanentRedirect("/medicare/medicare-advantage-request");
}
