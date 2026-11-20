import { site } from "@/lib/site";

export function BottomFinePrint() {
  return (
    <div className="bottom-fine-print mt-6 border-t border-white/20 pt-4 text-white/85">
      <p className="font-semibold text-white">
        Vital Edge Insurance is operated by Patrick Mackin IV, an independent licensed Florida health insurance broker
        (NPN 21729046, FL License #G275791).
      </p>
      <p className="mt-2">
        Not connected with or endorsed by the United States government or the federal Medicare program.
      </p>
      <p className="mt-2">
        We do not offer every plan available in your area. We represent many organizations which offer several products
        in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options. You may
        also contact{" "}
        <a className="text-white underline decoration-white/60 underline-offset-2 hover:decoration-white" href="https://www.medicare.gov" target="_blank" rel="noreferrer">
          Medicare.gov
        </a>
        , 1-800-MEDICARE (TTY users should call 1-877-486-2048), 24 hours a day, 7 days a week, or your local State
        Health Insurance Assistance Program (SHIP) to get information on all of your options. Can&apos;t find the plan
        you&apos;re looking for? Call me!
      </p>
      <p className="mt-2">
        Medicare has neither reviewed nor endorsed this information. Not affiliated with or endorsed by the United States
        government, the federal Medicare program, or Social Security.
      </p>
      <p className="mt-2">
        Accessibility: We are committed to making our website accessible to everyone. If you have difficulty accessing our
        site, call <a className="text-white underline decoration-white/60 underline-offset-2 hover:decoration-white" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a> or email{" "}
        <a className="text-white underline decoration-white/60 underline-offset-2 hover:decoration-white" href={`mailto:${site.email}`}>{site.email}</a>. We&apos;ll be happy to help.
      </p>
    </div>
  );
}
