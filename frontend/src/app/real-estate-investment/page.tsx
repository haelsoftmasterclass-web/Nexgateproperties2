import type { Metadata } from "next";

import { RiskNotice, ServiceLayout } from "@/components/content/ServiceLayout";
import { CheckList } from "@/components/content/Steps";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getServiceContent, getSiteSettings } from "@/lib/api";
import { budgetFields, PROPERTY_CATEGORY_OPTIONS } from "@/lib/formOptions";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cms = (await getServiceContent())["real-estate-investment"];
  return pageMetadata({
    title: cms?.seo_title || "Real Estate Investment Opportunities",
    description:
      cms?.meta_description ||
      "Discuss residential, commercial and development real estate investment opportunities with Nexgate Properties. Book an investor consultation.",
    path: "/real-estate-investment/",
  });
}

export default async function InvestmentPage() {
  const [cmsAll, settings] = await Promise.all([getServiceContent(), getSiteSettings()]);
  return (
    <ServiceLayout
      cms={cmsAll["real-estate-investment"]}
      settings={settings}
      path="/real-estate-investment/"
      eyebrow="Real estate investment"
      title="Invest in property *with clarity.*"
      intro="Explore residential, commercial and development investment opportunities, and talk through your goals with our team."
      overviewTitle="Informed conversations about *property investment.*"
      overview={
        <>
          <p>
            Property can play a part in many investment plans. We help investors explore residential and commercial opportunities, and development
            opportunities where they are available, with clear information about each one.
          </p>
          <p>
            Every investor’s circumstances are different. We start with your goals and timeframe, then discuss the opportunities and considerations
            relevant to you. We do not provide regulated financial advice and we recommend independent professional advice before you invest.
          </p>
        </>
      }
      offeringsTitle="Investment *enquiries we handle.*"
      offerings={[
        { icon: "home", title: "Residential investment", body: "Residential properties that may suit buy-to-hold or other residential investment plans." },
        { icon: "building", title: "Commercial investment", body: "Commercial property opportunities, from individual units to whole buildings." },
        { icon: "layers", title: "Development investment", body: "Development opportunities where investment is available, with the project’s status and structure explained." },
        { icon: "compass", title: "Investor consultations", body: "A conversation about your goals, budget, timeframe and preferred locations." },
        { icon: "globe", title: "Cross-border investors", body: "Support for Nigerians abroad and international investors interested in property." },
        { icon: "shield", title: "Due diligence support", body: "Guidance on the information and checks to request before making an investment decision." },
      ]}
      extra={
        <Section labelledBy="eval-title">
          <Container className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              id="eval-title"
              eyebrow="Before you invest"
              title="Questions worth *asking first.*"
              intro="These considerations apply to most property investments. Your own advisers can help you weigh them for your situation."
            />
            <div data-reveal="" className="rounded-card bg-paper p-8 ring-1 ring-line">
              <CheckList
                items={[
                  "Title, ownership and the documents available for the property",
                  "All costs, including fees, taxes, maintenance and service charges",
                  "Location, demand and access, now and in the future",
                  "Your investment horizon and how easily you could sell",
                  "For developments: the project’s status, timeline and who is responsible for delivery",
                  "Currency and cross-border considerations if you invest from abroad",
                ]}
              />
            </div>
          </Container>
        </Section>
      }
      process={[
        { title: "Tell us your goals", body: "Share your budget, preferred property type, location and timeframe." },
        { title: "Consultation", body: "We discuss your goals and the opportunities that may be relevant." },
        { title: "Review opportunities", body: "We provide the confirmed information available for each opportunity you want to consider." },
        { title: "Your decision", body: "You decide, with your own independent advice, whether and how to proceed." },
      ]}
      disclosure={
        <RiskNotice>
          <strong>Risk disclosure:</strong> property values and rental income can fall as well as rise, and you may get back less than you invest.
          Nexgate Properties does not guarantee returns, capital appreciation, rental yields or the performance of any investment, and nothing on
          this website is financial, legal or tax advice. Please seek independent professional advice before investing.
        </RiskNotice>
      }
      form={{
        category: "investment",
        title: "Discuss your *investment goals.*",
        intro: "Tell us what you are looking for and we’ll arrange a conversation.",
        fields: [
          { name: "property_category", label: "Investment interest", type: "select", options: PROPERTY_CATEGORY_OPTIONS, half: true },
          {
            name: "investment_horizon",
            label: "Investment horizon",
            type: "select",
            options: [
              { value: "under-2-years", label: "Under 2 years" },
              { value: "2-5-years", label: "2 to 5 years" },
              { value: "5-plus-years", label: "More than 5 years" },
              { value: "not-sure", label: "Not sure yet" },
            ],
            half: true,
          },
          ...budgetFields,
          { name: "preferred_location", label: "Preferred location", type: "text", placeholder: "City, state or country" },
        ],
        submitLabel: "Request investor consultation",
      }}
      cta={{ title: "Let’s talk about *your investment goals.*", intro: "Book a consultation with our team to explore residential, commercial or development opportunities." }}
    />
  );
}
