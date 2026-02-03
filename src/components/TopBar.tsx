import { site } from "@/lib/site";
import { Container } from "@/components/Container";
import { FACEBOOK, GBP_REVIEWS, INSTAGRAM, externalLinkProps } from "@/lib/externalLinks";

export function TopBar() {
  const linkProps = externalLinkProps();
  return (
    <div className="border-b border-black/5 bg-white">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm text-black/70">
          <span className="font-semibold text-black">Vital Edge Insurance</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/70 hover:text-black"
                href={FACEBOOK}
                aria-label="Facebook"
                {...linkProps}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13.5 9.5h2.7l-.4 3h-2.3V21h-3.1v-8.5H8.4v-3h2.6V7.8c0-2.4 1.4-3.8 3.6-3.8 1 0 2 .1 2 .1v2.5h-1.1c-1.1 0-1.4.7-1.4 1.4v1.5Z"
                  />
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/70 hover:text-black"
                href={INSTAGRAM}
                aria-label="Instagram"
                {...linkProps}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm3 13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8Zm-7-9a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                  />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/70 hover:text-black"
                href={GBP_REVIEWS}
                aria-label="Google Business Profile"
                {...linkProps}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12.2 12.2v2.8h3.9c-.2 1-1.3 2.9-3.9 2.9a4.5 4.5 0 0 1 0-9c1.3 0 2.2.5 2.7 1l1.8-1.7A7 7 0 0 0 5 12a7 7 0 0 0 7.2 7c4.1 0 6.8-2.9 6.8-6.9 0-.5-.1-.8-.1-1.2H12.2Z"
                  />
                </svg>
                <span className="sr-only">Google Business Profile</span>
              </a>
            </div>
            <span className="hidden text-black/30 sm:inline">•</span>
            <a className="hover:text-black" href={`tel:${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
            <span className="hidden text-black/30 sm:inline">•</span>
            <a className="hidden hover:text-black sm:inline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
