import type { Metadata } from "next";

import { ContactAside } from "@/components/content/ContactAside";
import { PageHero } from "@/components/content/PageHero";
import { Notice } from "@/components/content/States";
import { Steps } from "@/components/content/Steps";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Container, Section } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/api";
import { budgetFields, SERVICE_OPTIONS } from "@/lib/formOptions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book a Consultation",
  description:
    "Request a consultation with Nexgate Properties about buying, developing, investing in, managing or selling property, in Nigeria or internationally.",
  path: "/book-a-consultation/",
});

export default async function ConsultationPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title="Book a *consultation.*"
        eyebrow="Speak to our team"
        intro="Tell us what you’d like to discuss and when suits you. We’ll contact you to confirm a time."
        crumbs={[{ name: "Book a consultation", href: "/book-a-consultation/" }]}
      />
      <Section className="!pt-14">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <EnquiryForm
              category="consultation"
              title="Consultation request"
              intro="Fields marked * are required."
              fields={[
                { name: "service", label: "What would you like to discuss?", type: "select", options: SERVICE_OPTIONS, required: true },
                { name: "preferred_location", label: "Preferred property location", type: "text", placeholder: "City, state or country", half: true },
                { name: "preferred_date", label: "Preferred date", type: "date", half: true, help: "We’ll confirm availability with you." },
                ...budgetFields,
              ]}
              showContactMethod
              messagePlaceholder="Anything you would like us to know before we speak"
              submitLabel="Request consultation"
              successTitle="Thank you. Your consultation request has been received."
              successMessage="This is a request, not a confirmed appointment. A member of our team will contact you to confirm the date, time and format."
              notice="Submitting this form sends a consultation request. Your appointment is confirmed only when our team contacts you."
            />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-card bg-paper p-6 ring-1 ring-line sm:p-8">
              <h2 className="text-lg font-bold">What to expect</h2>
              <div className="mt-6 [&_ol]:!grid-cols-1 [&_li]:!p-5">
                <Steps
                  steps={[
                    { title: "We review your request", body: "We check the details and who is best placed to help." },
                    { title: "We confirm a time", body: "We contact you to agree the date, time and format." },
                    { title: "We talk", body: "By phone, video call or in person." },
                  ]}
                />
              </div>
            </div>
            <ContactAside settings={settings} />
            <Notice>Please don’t include sensitive financial information, such as bank details, in this form.</Notice>
          </aside>
        </Container>
      </Section>
    </>
  );
}
