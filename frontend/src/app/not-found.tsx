import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="font-display text-7xl italic text-brand-500">404</p>
      <h1 className="mt-6 text-4xl font-bold">We couldn’t find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">The page may have moved, or the listing may no longer be published.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" arrow>
          Go to the homepage
        </ButtonLink>
        <ButtonLink href="/residential-properties/" variant="secondary">
          Browse properties
        </ButtonLink>
      </div>
    </Container>
  );
}
