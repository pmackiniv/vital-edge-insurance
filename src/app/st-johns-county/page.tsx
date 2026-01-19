import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">St. Johns County</h1>
        <p className="text-black/70">
          Insurance guidance for St. Johns County clients, including St. Augustine and nearby communities. Our insurance
          guidance focuses on education, eligibility timing, and practical next steps.
        </p>
        <p className="text-black/70">
          Reach out for insurance guidance that is clear, local, and centered on your needs.
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
