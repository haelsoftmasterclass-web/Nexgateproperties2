import type { Metadata } from "next";

import { ServiceLayout } from "@/components/content/ServiceLayout";
import { Notice } from "@/components/content/States";
import { CheckList } from "@/components/content/Steps";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getServiceContent, getSiteSettings } from "@/lib/api";
import { PROPERTY_CATEGORY_OPTIONS } from "@/lib/formOptions";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cms = (await getServiceContent())["property-facility-management"];
  return pageMetadata({
    title: cms?.seo_title || "Property and Facility Management",
    description:
      cms?.meta_description ||
      "Request property and facility management from Nexgate Properties for residential and commercial properties. Ask for a management proposal.",
    path: "/property-facility-management/",
  });
}

export default async function ManagementPage() {
  const [cmsAll, settings] = await Promise.all([getServiceContent(), getSiteSettings()]);
  return (
    <ServiceLayout
      cms={cmsAll["property-facility-management"]}
      settings={settings}
      path="/property-facility-management/"
      eyebrow="Property & facility management"
      title="Well-run properties, *well looked after.*"
      intro="Property and facility management support for owners of residential and commercial property."
      overviewTitle="Management that protects *your property.*"
      overview={
        <>
          <p>
            Owning property brings day-to-day responsibilities. Our property and facility management service helps owners keep buildings well run,
            with operational and maintenance coordination where offered.
          </p>
          <p>Every property is different, so we start by understanding yours and then propose the scope of support that fits it.</p>
        </>
      }
      offeringsTitle="Areas of *management support.*"
      offerings={[
        { icon: "key", title: "Property management", body: "Support for owners in managing residential and commercial property." },
        { icon: "building", title: "Facility management", body: "Coordination of the services that keep a building and its facilities running." },
        { icon: "layers", title: "Maintenance coordination", body: "Coordinating maintenance and operational work, where offered as part of the agreed scope." },
        { icon: "compass", title: "Management proposals", body: "A proposal setting out the services, scope and terms suggested for your property." },
      ]}
      extra={
        <Section labelledBy="clients-title">
          <Container className="grid gap-12 lg:grid-cols-2">
            <SectionHeading id="clients-title" eyebrow="Who it’s for" title="Owners who want *peace of mind.*" />
            <div data-reveal="" className="space-y-6">
              <CheckList
                items={[
                  "Owners of residential homes and apartment buildings",
                  "Owners of commercial buildings, offices and retail space",
                  "Property owners living outside Nigeria",
                  "Developers handing over completed projects",
                ]}
              />
              <Notice>The services available for a particular property are confirmed in the management proposal agreed with you.</Notice>
            </div>
          </Container>
        </Section>
      }
      process={[
        { title: "Tell us about your property", body: "Share the property type, location, size and the support you need." },
        { title: "Assessment", body: "We discuss your property and objectives, and arrange an inspection where needed." },
        { title: "Proposal", body: "We send a management proposal setting out the suggested scope and terms." },
        { title: "Agreement and handover", body: "Management begins once the agreement is signed and the handover is complete." },
      ]}
      form={{
        category: "management",
        title: "Request a *management proposal.*",
        intro: "Tell us about your property and the support you need.",
        fields: [
          { name: "property_category", label: "Property type", type: "select", options: PROPERTY_CATEGORY_OPTIONS, half: true },
          { name: "number_of_units", label: "Number of units", type: "number", half: true, placeholder: "e.g. 12" },
          { name: "property_address", label: "Property location", type: "text", placeholder: "Area, city" },
          {
            name: "management_scope",
            label: "Support needed",
            type: "select",
            options: [
              { value: "property-management", label: "Property management" },
              { value: "facility-management", label: "Facility management" },
              { value: "maintenance", label: "Maintenance coordination" },
              { value: "not-sure", label: "Not sure, I’d like advice" },
            ],
          },
        ],
        submitLabel: "Request a proposal",
      }}
      cta={{ title: "Let us help *manage your property.*", intro: "Request a consultation to discuss the management support your property needs." }}
    />
  );
}
