import { getLegalPage } from "@/lib/api";
import { formatDate } from "@/lib/format";

import { Container } from "../ui/Section";
import { PageHero } from "./PageHero";
import { Prose } from "./Prose";
import { ErrorState, Notice } from "./States";

export async function LegalPageView({ kind, fallbackTitle, path }: { kind: string; fallbackTitle: string; path: string }) {
  const res = await getLegalPage(kind);
  const page = res.ok ? res.data : null;
  return (
    <>
      <PageHero title={page?.title || fallbackTitle} eyebrow="Legal" crumbs={[{ name: page?.title || fallbackTitle, href: path }]} />
      <Container narrow className="py-16">
        {!page && <ErrorState title="This page is not available right now" />}
        {page && (
          <>
            {!page.legal_review_complete && (
              <Notice tone="warning" className="mb-10">
                <strong>Draft pending legal review.</strong> This page has not yet been reviewed and approved, and must not be relied on as a final
                policy.
              </Notice>
            )}
            {page.effective_date && <p className="mb-8 text-sm text-muted">Effective from {formatDate(page.effective_date)}</p>}
            <Prose source={page.body} />
            <p className="mt-14 text-sm text-muted">Last updated {formatDate(page.updated_at)}</p>
          </>
        )}
      </Container>
    </>
  );
}

export async function legalMeta(kind: string) {
  const res = await getLegalPage(kind);
  return res.ok ? res.data : null;
}
