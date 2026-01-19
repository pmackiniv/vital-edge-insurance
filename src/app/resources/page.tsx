import { Container } from "@/components/Container";

export default function ResourcesPage() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Resources</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Client education hub with quick primers and checklists. More guides coming soon.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-black">ACA Marketplace</h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>Enrollment window overview</li>
            <li>Income and subsidy basics</li>
            <li>Plan comparison checklist</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-black">Medicare</h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>Getting started timeline</li>
            <li>Parts A, B, C, D snapshot</li>
            <li>Coverage change checklist</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-black">Small Business</h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>ICHRA basics</li>
            <li>Contribution strategy overview</li>
            <li>Employee enrollment steps</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
