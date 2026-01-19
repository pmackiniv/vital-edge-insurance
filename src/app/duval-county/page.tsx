import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Duval County</h1>
        <p className="text-black/70">
          Local insurance guidance for Duval County residents. We provide insurance guidance that focuses on clarity,
          timelines, and next steps for ACA, Medicare education, and small business options.
        </p>
        <p className="text-black/70">
          If you need insurance guidance in Jacksonville or the surrounding area, we are here to help with a clear,
          client-first process.
        </p>
        <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/70">
          <div className="font-semibold text-black">{site.legalName}</div>
          <div>{site.address.addressLocality}, {site.address.addressRegion}</div>
          <div>{site.phoneDisplay}</div>
        </div>
      </div>
    </Container>
  );
}
