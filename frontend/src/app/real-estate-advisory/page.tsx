import type { Metadata } from "next";

import { ServiceLayout } from "@/components/content/ServiceLayout";
import { Notice } from "@/components/content/States";
import { getServiceContent, getSiteSettings } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cms = (await getServiceContent())["real-estate-advisory"];
  return pageMetadata({
    title: cms?.seo_title || "Real Estate Advisory and Consultancy",
    description:
      cms?.meta_description ||
      "Real estate advisory and consultancy from Nexgate Properties: property acquisition, planning, development consultations and commercial property requirements.",
    path: "/real-estate-advisory/",
  });
}

export default async function AdvisoryPage() {
  const [cmsAll, settings] = await Promise.all([getServiceContent(), getSiteSettings()]);
  return (
    <ServiceLayout
      cms={cmsAll["real-estate-advisory"]}
      settings={settings}
      path="/real-estate-advisory/"
      eyebrow="Advisory & consultancy"
      title="Property decisions, *well considered.*"
      intro="Practical consultations on acquisitions, real estate planning, developments and commercial property requirements."
      overviewTitle="A clear view before *you commit.*"
      overview={
        <>
          <p>
            Whether you are acquiring a property, planning a development or looking for commercial space, a conversation with an experienced team
            can help you understand your options and the questions to ask.
          </p>
          <p>
            Our consultations focus on real estate matters. Where you need legal, tax, valuation or financial advice, we will recommend that you
            speak to an appropriately qualified professional.
          </p>
        </>
      }
      offeringsTitle="Topics we *can discuss.*"
      offerings={[
        { icon: "home", title: "Property acquisition", body: "Talk through what to look for, the process and the checks to make before you buy." },
        { icon: "compass", title: "Real estate planning", body: "Plan property decisions around your goals, budget and timeframe." },
        { icon: "layers", title: "Development consultations", body: "Discuss development ideas, requirements and how a project might be approached." },
        { icon: "building", title: "Commercial requirements", body: "Define the space, location and specifications your business needs." },
        { icon: "chart", title: "Market considerations", body: "Discuss the location and market factors relevant to your decision." },
        { icon: "globe", title: "Cross-border questions", body: "Considerations for clients buying or investing from outside the country." },
      ]}
      process={[
        { title: "Send your question", body: "Tell us what you are considering and what you would like to discuss." },
        { title: "Book a consultation", body: "We arrange a call, video call or meeting at a time that suits you." },
        { title: "Consultation", body: "We talk through your situation, options and the questions to consider." },
        { title: "Next steps", body: "We agree any follow-up, and point you to other professionals where needed." },
      ]}
      disclosure={
        <Notice>
          Our consultations do not constitute legal, tax, valuation or regulated financial advice. Please consult an appropriately qualified
          professional for advice in those areas.
        </Notice>
      }
      form={{
        category: "advisory",
        title: "Request a *consultation.*",
        intro: "Tell us what you’d like to discuss.",
        fields: [
          {
            name: "advisory_topic",
            label: "Topic",
            type: "select",
            options: [
              { value: "acquisition", label: "Property acquisition" },
              { value: "planning", label: "Real estate planning" },
              { value: "development", label: "Development consultation" },
              { value: "commercial", label: "Commercial property requirements" },
              { value: "other", label: "Something else" },
            ],
          },
        ],
        messageRequired: true,
        submitLabel: "Request a consultation",
      }}
      cta={{ title: "Get a clear view of *your options.*", intro: "Book a consultation with our team to talk through your property plans." }}
    />
  );
}
