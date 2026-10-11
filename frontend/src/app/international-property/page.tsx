import type { Metadata } from "next";

import { ServiceLayout } from "@/components/content/ServiceLayout";
import { CheckList } from "@/components/content/Steps";
import { Notice } from "@/components/content/States";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getMarkets, getServiceContent, getSiteSettings } from "@/lib/api";
import { budgetFields, PROPERTY_CATEGORY_OPTIONS } from "@/lib/formOptions";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cms = (await getServiceContent())["international-property"];
  return pageMetadata({
    title: cms?.seo_title || "International Property Sales and Investment",
    description:
      cms?.meta_description ||
      "International property enquiries for Nigerians abroad and international clients: residential, commercial and cross-border investment interests with Nexgate Properties.",
    path: "/international-property/",
  });
}

export default async function InternationalPage() {
  const [cmsAll, settings, markets] = await Promise.all([getServiceContent(), getSiteSettings(), getMarkets()]);
  const marketList = markets.ok ? markets.data : [];
  return (
    <ServiceLayout
      cms={cmsAll["international-property"]}
      settings={settings}
      path="/international-property/"
      eyebrow="International property"
      title="Property beyond *borders.*"
      intro="International residential and commercial property enquiries, and cross-border investment interests, for clients in Nigeria and abroad."
      overviewTitle="For Nigerians abroad and *international clients.*"
      overview={
        <>
          <p>
            Many of our clients live in one country and invest in another. We handle international residential and commercial property enquiries
            and cross-border investment interests, whether you are in Nigeria looking abroad or abroad looking at Nigeria.
          </p>
          <p>Nexgate Group has contact points in Lagos, Nigeria and New York, USA.</p>
        </>
      }
      offeringsTitle="International *enquiries we handle.*"
      offerings={[
        { icon: "home", title: "International residential", body: "Enquiries about residential property in international markets." },
        { icon: "building", title: "International commercial", body: "Enquiries about commercial property in international markets." },
        { icon: "chart", title: "Cross-border investment", body: "Conversations about property investment interests that cross borders." },
        { icon: "globe", title: "Diaspora clients", body: "Support for Nigerians living abroad who want to buy or invest in property." },
      ]}
      extra={
        <Section labelledBy="xborder-title">
          <Container className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading id="xborder-title" eyebrow="Cross-border considerations" title="Things to plan for *early.*" />
              <div data-reveal="" className="mt-8">
                {marketList.length > 0 ? (
                  <>
                    <p className="font-semibold">Markets we currently discuss</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {marketList.map((m) => (
                        <li key={m.name} className="rounded-full bg-paper px-4 py-2 text-sm font-semibold ring-1 ring-line" title={m.note || undefined}>
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Notice>Tell us which country or market interests you, and we will let you know how we can help.</Notice>
                )}
              </div>
            </div>
            <div data-reveal="" className="rounded-card bg-paper p-8 ring-1 ring-line">
              <CheckList
                items={[
                  "Rules on foreign ownership of property in the country concerned",
                  "Currency exchange and how funds are transferred",
                  "Taxes and fees in both countries",
                  "Managing and inspecting the property from a distance",
                  "Independent legal advice in the country where the property is located",
                ]}
              />
            </div>
          </Container>
        </Section>
      }
      process={[
        { title: "Send your enquiry", body: "Tell us where you are based, the market that interests you and what you are looking for." },
        { title: "Remote consultation", body: "We arrange a call or video call across time zones." },
        { title: "Explore options", body: "We discuss the opportunities and cross-border considerations relevant to you." },
        { title: "Next steps", body: "We agree how to proceed, including any viewings, documents or introductions." },
      ]}
      form={{
        category: "international",
        title: "Make an international *enquiry.*",
        intro: "We’ll respond with options and arrange a call that suits your time zone.",
        fields: [
          { name: "client_location", label: "Where are you based?", type: "text", placeholder: "Country", half: true, required: true },
          { name: "country_of_interest", label: "Country or market of interest", type: "text", placeholder: "e.g. Nigeria", half: true },
          { name: "property_category", label: "Property interest", type: "select", options: PROPERTY_CATEGORY_OPTIONS, half: true },
          {
            name: "investment_focus",
            label: "Purpose",
            type: "select",
            options: [
              { value: "own-use", label: "To live in or use" },
              { value: "investment", label: "Investment" },
              { value: "both", label: "Both" },
            ],
            half: true,
          },
          ...budgetFields,
        ],
        submitLabel: "Send international enquiry",
      }}
      cta={{ title: "Wherever you are, *let’s talk property.*", intro: "Book a remote consultation with our team." }}
    />
  );
}
