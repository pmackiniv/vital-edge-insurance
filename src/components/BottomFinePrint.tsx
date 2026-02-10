import { site } from "@/lib/site";

export function BottomFinePrint() {
  return (
    <div className="mt-6 border-t border-black/10 pt-4 text-[12px] leading-relaxed text-black/60">
      <p className="font-semibold text-black/70">
        Licensed Insurance Agency.
      </p>
      <p className="mt-2">
        Not connected with or endorsed by the United States government or the federal Medicare program.
      </p>
      <p className="mt-2">
        We do not offer every plan available in your area. Any information we provide is limited to those plans we do
        offer in your area. Please contact{" "}
        <a className="underline" href="https://www.medicare.gov" target="_blank" rel="noreferrer">
          Medicare.gov
        </a>
        {" "}or 1-800-MEDICARE to get information on all of your options.
      </p>
      <p className="mt-2">
        Medicare has neither reviewed nor endorsed this information. Not affiliated with or endorsed by the United States
        government, the federal Medicare program, Social Security, or Healthcare.gov.
      </p>
      <p className="mt-2">
        Accessibility: We are committed to making our website accessible to everyone. If you have difficulty accessing our
        site, please call us at{" "}
        <a className="underline" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>{" "}
        or email us at{" "}
        <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.
        {" "}We&apos;ll be happy to help.
      </p>
    </div>
  );
}
