import { Container } from "@/components/Container";
import { ExternalLinks } from "@/components/ExternalLinks";

export default function EnrollPage() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Enrollment links</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Use the secure enrollment partners below. You will be redirected to a third-party site to continue.
        </p>
        <div className="mt-4 space-y-2 text-sm text-black/70">
          <p>You are leaving Vital Edge Insurance and going to a third-party website.</p>
          <p>Not connected with or endorsed by the U.S. government or the federal Medicare program.</p>
          <p>
            We do not offer every plan available in your area. Any information we provide is limited to plans we offer in
            your area.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ExternalLinks />
      </div>
    </Container>
  );
}
