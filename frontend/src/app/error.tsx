"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-32 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">Please try again. If the problem continues, contact our team by phone or email.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <ButtonLink href="/contact-us/" variant="secondary">
          Contact us
        </ButtonLink>
      </div>
    </Container>
  );
}
