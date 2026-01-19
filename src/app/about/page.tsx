import { Container } from "@/components/Container";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-black/70">
          Vital Edge Insurance provides independent insurance guidance for individuals, families, and small businesses
          across Jacksonville and nearby counties.
        </p>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">Not affiliated</h2>
          <p className="mt-2 text-sm leading-6 text-black/70">
            Vital Edge Insurance is an independent insurance guidance business and is not affiliated with any similarly
            named healthcare clinic.
          </p>
        </div>
      </div>
    </Container>
  );
}
