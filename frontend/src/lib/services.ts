export type ServiceKey =
  | "properties-for-sale"
  | "property-development"
  | "real-estate-investment"
  | "property-facility-management"
  | "real-estate-advisory"
  | "international-property";

export type Service = {
  key: ServiceKey;
  number: string;
  title: string;
  navLabel: string;
  href: string;
  short: string;
  summary: string;
  points: string[];
  cta: string;
};

/** The six confirmed services. Default copy; editable per service in the admin (Service content). */
export const SERVICES: Service[] = [
  {
    key: "properties-for-sale",
    number: "01",
    title: "Residential and Commercial Properties for Sale",
    navLabel: "Properties for Sale",
    href: "/residential-properties/",
    short: "Homes, offices and commercial space, presented with clear information.",
    summary:
      "Search residential and commercial property opportunities, review the details that matter, and speak to our team about viewings and next steps.",
    points: ["Residential property opportunities", "Commercial property opportunities", "Property search and discovery", "Enquiry and viewing support"],
    cta: "Browse properties",
  },
  {
    key: "property-development",
    number: "02",
    title: "Property Development and New Projects",
    navLabel: "Property Development",
    href: "/property-development/",
    short: "Residential and commercial developments, from early interest to partnership.",
    summary:
      "Explore new residential and commercial developments, register interest in upcoming projects, and discuss development partnerships with our team.",
    points: ["Residential development projects", "Commercial development projects", "New property developments", "Development partnerships"],
    cta: "Explore development",
  },
  {
    key: "real-estate-investment",
    number: "03",
    title: "Real Estate Investment Opportunities",
    navLabel: "Real Estate Investment",
    href: "/real-estate-investment/",
    short: "Consultations for investors considering residential, commercial or development property.",
    summary:
      "Discuss residential, commercial and development investment opportunities with our team, and talk through the considerations behind each decision.",
    points: ["Investment property enquiries", "Residential and commercial opportunities", "Development investment enquiries", "Investor consultations"],
    cta: "Discuss investment",
  },
  {
    key: "property-facility-management",
    number: "04",
    title: "Property and Facility Management",
    navLabel: "Property & Facility Management",
    href: "/property-facility-management/",
    short: "Management support that keeps properties well run and well maintained.",
    summary:
      "Request property and facility management support, including operational and maintenance coordination where offered, with a proposal shaped around your property.",
    points: ["Property management", "Facility management", "Maintenance coordination", "Management proposals"],
    cta: "Request a proposal",
  },
  {
    key: "real-estate-advisory",
    number: "05",
    title: "Real Estate Advisory and Consultancy",
    navLabel: "Advisory & Consultancy",
    href: "/real-estate-advisory/",
    short: "Practical guidance for acquisitions, planning and commercial requirements.",
    summary:
      "Talk to our team about property acquisition, real estate planning, development-related questions and commercial property requirements.",
    points: ["Property acquisition discussions", "Real estate planning", "Development consultations", "Commercial property advisory"],
    cta: "Request a consultation",
  },
  {
    key: "international-property",
    number: "06",
    title: "International Property Sales or Investment",
    navLabel: "International Property",
    href: "/international-property/",
    short: "Support for Nigerians abroad and international clients with cross-border interests.",
    summary:
      "Enquire about international residential and commercial property, and cross-border investment interests, whether you are in Nigeria or abroad.",
    points: ["International residential enquiries", "International commercial enquiries", "Cross-border investment interests", "Nigerian diaspora and international clients"],
    cta: "Make an international enquiry",
  },
];

export const serviceByKey = (key: string) => SERVICES.find((s) => s.key === key);
