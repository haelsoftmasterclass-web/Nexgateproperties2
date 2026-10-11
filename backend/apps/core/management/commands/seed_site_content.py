"""Creates the initial, editable site content.

Safe to run more than once: existing records are left untouched unless --reset-faqs is given.
Nothing here is a property listing, project, testimonial or other unverified business fact.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.core.models import FAQ, AffiliateBrand, FAQCategory, LegalPage, Office, PhoneNumber, SiteSettings
from apps.insights.models import Article, ArticleCategory

PHONES = [
    ("Nigeria", "+2347017461957", "+234 701 746 1957"),
    ("Nigeria", "+2349120999494", "+234 912 099 9494"),
    ("Nigeria", "+2348140122233", "+234 814 012 2233"),
    ("United States", "+19295076825", "+1 929-507-6825"),
]

FAQS = {
    ("General", "general"): [
        ("What does Nexgate Properties do?",
         "Nexgate Properties is the real estate business of Nexgate Group. We help clients find residential and commercial property, take part in development projects, explore investment opportunities, arrange property and facility management, get real estate advice, and pursue international property interests."),
        ("How is Nexgate Properties related to Nexgate Group?",
         "Nexgate Properties is a business unit of Nexgate Group. Other group businesses include Nexgate Construction and Valdo Interiors."),
    ],
    ("Residential property", "residential"): [
        ("How do I enquire about a residential property?",
         "Open the property's page and use the enquiry form, or contact our team directly. Tell us your preferred location, budget and timeline so we can respond with relevant options."),
    ],
    ("Commercial property", "commercial"): [
        ("Do you handle commercial property such as offices and retail space?",
         "Yes. Browse our commercial listings or send us your requirements, including the type of space, location and size you need."),
    ],
    ("Property inspections", "inspections"): [
        ("Can I arrange to view a property?",
         "Yes. Request a viewing from the property's page. A member of our team will contact you to confirm a suitable date and time. A viewing request is not confirmed until our team confirms it."),
    ],
    ("Property purchases", "purchases"): [
        ("What should I check before buying a property?",
         "Confirm the title and ownership documents, the property's condition, all costs involved, and the terms of the transaction. We recommend that buyers obtain independent legal advice before committing to a purchase."),
        ("Are the prices on the website final?",
         "Listed prices are indicative and may change. Availability and the final terms of any transaction are confirmed in writing by our team."),
    ],
    ("Investment enquiries", "investment"): [
        ("Do you guarantee returns on property investments?",
         "No. Property values and rental income can go down as well as up. We do not guarantee returns, capital appreciation or rental yields. We will discuss your goals and the considerations involved, and we recommend independent financial advice."),
    ],
    ("Development projects", "development"): [
        ("How can I find out about new developments?",
         "See our Projects page for published developments and their current status, or contact us to register your interest."),
    ],
    ("Property management", "management"): [
        ("Can you manage my property?",
         "Send us a property management enquiry with details of your property. We will discuss your needs and the scope of services available."),
    ],
    ("International property", "international"): [
        ("Can I enquire from outside Nigeria?",
         "Yes. We welcome enquiries from Nigerians abroad and international clients. Use the international property enquiry form and tell us where you are based and which market interests you."),
    ],
    ("Consultations", "consultations"): [
        ("How do I book a consultation?",
         "Use the Book a Consultation page to send a request with your preferred date and method. Our team will contact you to confirm the appointment."),
    ],
    ("Property submissions and partnerships", "submissions"): [
        ("Can I list my property with you?",
         "You can submit your property for review on the Sell or Partner With Us page. Submissions are reviewed by our team and acceptance is not guaranteed."),
    ],
}

PRIVACY_BODY = """## About this policy
This draft privacy policy explains how Nexgate Properties collects and uses personal information through this website. It must be reviewed by a qualified legal adviser before publication.

## Data we collect
[To be confirmed] Information you submit through our forms, such as your name, email address, phone number and enquiry details, and technical information such as your IP address and browser type.

## Why we process your data
[To be confirmed] To respond to your enquiries, arrange consultations and viewings, manage our client relationships and improve our website.

## Lawful grounds
[To be confirmed with legal counsel, including obligations under the Nigeria Data Protection Act 2023 and any other applicable law.]

## Sharing your data
[To be confirmed] We do not sell personal data. We may share it with Nexgate Group companies and service providers who help us operate, where necessary.

## International transfers
[To be confirmed]

## Security and retention
[To be confirmed]

## Your rights
[To be confirmed]

## Cookies and analytics
[To be confirmed once the analytics and tracking setup is final.]

## Contact us
[To be confirmed]

## Changes to this policy
[To be confirmed]"""

TERMS_BODY = """## About these terms
These draft terms govern use of the Nexgate Properties website. They must be reviewed by a qualified legal adviser before publication.

## Using this website
[To be confirmed]

## Accuracy of property listings
[To be confirmed] Listings are provided for information only and may change without notice.

## Availability and pricing
[To be confirmed] Prices and availability are indicative until confirmed in writing.

## Enquiries and inspections
[To be confirmed]

## Transaction agreements
[To be confirmed] No transaction is binding until a written agreement is signed by all parties.

## Investment disclosures
[To be confirmed] Nothing on this website is financial, legal or tax advice. Property investments carry risk and returns are not guaranteed.

## Intellectual property
[To be confirmed]

## Third-party services
[To be confirmed]

## Limitation of liability
[To be confirmed]

## Dispute resolution
[To be confirmed]

## Applicable law
[To be confirmed]"""

ARTICLE_TOPICS = [
    ("Buying guides", "buying-guides", "A Practical Guide to Buying Property in Nigeria"),
    ("Buying guides", "buying-guides", "Questions to Ask Before Purchasing a Property"),
    ("Ownership", "ownership", "Understanding Property Ownership Costs"),
    ("Market insight", "market-insight", "Residential vs Commercial Real Estate"),
    ("Ownership", "ownership", "What Property Owners Should Know About Property Management"),
    ("Investment", "investment", "Evaluating a Real Estate Investment"),
    ("Investment", "investment", "Considerations for International Property Investment"),
    ("Development", "development", "Understanding the Property Development Process"),
]


class Command(BaseCommand):
    help = "Create the initial editable site settings, FAQs, legal drafts and article drafts."

    def add_arguments(self, parser):
        parser.add_argument("--reset-faqs", action="store_true", help="Replace existing FAQs with the defaults.")

    @transaction.atomic
    def handle(self, *args, **options):
        settings_obj = SiteSettings.load()
        if not settings_obj.primary_email:
            settings_obj.short_description = (
                "Nexgate Properties is the real estate business of Nexgate Group, helping clients buy, develop, "
                "invest in and manage residential and commercial property in Nigeria and internationally."
            )
            settings_obj.primary_email = "nexgategroup@gmail.com"
            settings_obj.contact_details_confirmed = False
            settings_obj.save()
        if not settings_obj.offices.exists():
            Office.objects.create(settings=settings_obj, label="Nigeria office", country="Nigeria",
                                  address="H528 Ikota Complex, VGC, Lekki, Lagos, Nigeria", order=0)
            Office.objects.create(settings=settings_obj, label="United States office", country="United States",
                                  address="39-19 Corporal Stone Street, Bayside, New York, NY 11361, USA", order=1)
        if not settings_obj.phone_numbers.exists():
            for i, (label, e164, display) in enumerate(PHONES):
                PhoneNumber.objects.create(settings=settings_obj, label=label, number_e164=e164, display=display, order=i)
        if not settings_obj.affiliates.exists():
            for i, (name, desc) in enumerate([
                ("Nexgate Group", "Parent company"),
                ("Nexgate Construction", "Construction"),
                ("Valdo Interiors", "Interior design, furniture and interior solutions"),
            ]):
                AffiliateBrand.objects.create(settings=settings_obj, name=name, description=desc, order=i)

        if options["reset_faqs"]:
            FAQ.objects.all().delete()
        if not FAQ.objects.exists():
            for order, ((name, slug), items) in enumerate(FAQS.items()):
                cat, _ = FAQCategory.objects.get_or_create(slug=slug, defaults={"name": name, "order": order})
                for i, (q, a) in enumerate(items):
                    FAQ.objects.create(category=cat, question=q, answer=a, order=i, is_published=True)

        LegalPage.objects.get_or_create(kind=LegalPage.Kind.PRIVACY, defaults={"title": "Privacy Policy", "body": PRIVACY_BODY})
        LegalPage.objects.get_or_create(kind=LegalPage.Kind.TERMS, defaults={"title": "Terms and Conditions", "body": TERMS_BODY})

        for order, (cat_name, cat_slug, title) in enumerate(ARTICLE_TOPICS):
            cat, _ = ArticleCategory.objects.get_or_create(slug=cat_slug, defaults={"name": cat_name, "order": order})
            if not Article.objects.filter(title=title).exists():
                Article.objects.create(
                    title=title,
                    category=cat,
                    body="## Draft\n\nThis article is a proposed topic. Write and review the content before publishing.",
                )

        self.stdout.write(self.style.SUCCESS("Site content seeded. Articles were created as drafts."))
