import { permanentRedirect } from "next/navigation";

export default function LegacyMedigapRoute() {
  permanentRedirect("/medicare/medigap-request");
}
