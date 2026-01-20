import Link from "next/link";
import { Container } from "@/components/Container";

export default function ThankYouPage() {
  return (
    <Container className="py-14">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Thank you</h1>
        <p className="text-black/70">
          We received your request and will follow up shortly with next steps.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}
