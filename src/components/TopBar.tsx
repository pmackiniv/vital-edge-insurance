import { site } from "@/lib/site";
import { Container } from "@/components/Container";

export function TopBar() {
  return (
    <div className="border-b border-black/5 bg-white">
      <Container>
        <div className="flex items-center justify-between gap-2 py-1.5 text-sm text-black/70 max-[390px]:text-xs">
          <span className="hidden font-semibold text-black sm:inline">Vital Edge Insurance</span>
          <div className="flex items-center gap-2">
            <a className="font-semibold hover:text-black" href={`tel:${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
            <span className="hidden text-black/30 md:inline">•</span>
            <a className="hidden hover:text-black md:inline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
