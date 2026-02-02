import { site } from "@/lib/site";
import { Container } from "@/components/Container";

export function TopBar() {
  return (
    <div className="border-b border-black/5 bg-white">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm text-black/70">
          <span className="font-semibold text-black">Vital Edge Insurance</span>
          <div className="flex flex-wrap items-center gap-3">
            <a className="hover:text-black" href={`tel:${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
            <span className="hidden text-black/30 sm:inline">•</span>
            <a className="hover:text-black" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
