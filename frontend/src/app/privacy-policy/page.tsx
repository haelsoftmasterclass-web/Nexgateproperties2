import type { Metadata } from "next";

import { legalMeta, LegalPageView } from "@/components/content/LegalPageView";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await legalMeta("privacy-policy");
  return pageMetadata({
    title: page?.seo_title || "Privacy Policy",
    description: page?.meta_description || "How Nexgate Properties collects, uses and protects personal information submitted through this website.",
    path: "/privacy-policy/",
    noindex: !page?.legal_review_complete,
  });
}

export default function PrivacyPage() {
  return <LegalPageView kind="privacy-policy" fallbackTitle="Privacy Policy" path="/privacy-policy/" />;
}
