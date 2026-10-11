import type { ExtraField } from "@/components/forms/EnquiryForm";

export const CURRENCY_OPTIONS = [
  { value: "NGN", label: "Nigerian naira (₦)" },
  { value: "USD", label: "US dollar ($)" },
  { value: "GBP", label: "British pound (£)" },
  { value: "EUR", label: "Euro (€)" },
];

export const budgetFields: ExtraField[] = [
  { name: "budget", label: "Budget (approximate)", type: "text", placeholder: "e.g. 150,000,000", half: true },
  { name: "budget_currency", label: "Currency", type: "select", options: CURRENCY_OPTIONS, half: true },
];

export const PROPERTY_CATEGORY_OPTIONS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "both", label: "Both / not sure" },
];

export const SERVICE_OPTIONS = [
  { value: "properties-for-sale", label: "Buying residential or commercial property" },
  { value: "property-development", label: "Property development and new projects" },
  { value: "real-estate-investment", label: "Real estate investment" },
  { value: "property-facility-management", label: "Property and facility management" },
  { value: "real-estate-advisory", label: "Real estate advisory and consultancy" },
  { value: "international-property", label: "International property" },
  { value: "sell-or-partner", label: "Selling or partnering with us" },
];
