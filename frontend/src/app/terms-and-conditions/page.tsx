import type { Metadata } from "next";

import { legalMeta, LegalPageView } from "@/components/content/LegalPageView";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await legalMeta("terms-and-conditions");
  return pageMetadata({
    title: page?.seo_title || "Terms and Conditions",
    description: page?.meta_description || "The terms that govern use of the Nexgate Properties website, listings and enquiries.",
    path: "/terms-and-conditions/",
    noindex: !page?.legal_review_complete,
  });
}

export default function TermsPage() {
  return <LegalPageView kind="terms-and-conditions" fallbackTitle="Terms and Conditions" path="/terms-and-conditions/" />;
}
