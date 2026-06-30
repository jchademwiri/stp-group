export const SITE = {
  name: "Sithembe",
  legalName: "Sithembe Transportation and Projects (Pty) Ltd",
  tradingName: "Sithembe Plant Hire",
  socialLinks: {
    facebook: "https://www.facebook.com/people/Sithembe-Plant-Hire/61574452205967/",
  },
  url: "https://sithembe.co.za",
  description:
    "Construction and plant hire - dropside trucks, vacuum tankers, bobcats, tractors, mowers and tools with qualified operators in Pretoria and Gauteng.",
  phone: "079 758 1297",
  phoneTel: "+27797581297",
  whatsapp: "27797581297",
  phoneOffice: "012 880 3155",
  phoneOfficeTel: "+27128803155",
  email: "admin@sithembe.co.za",
  region: "Pretoria & Gauteng",
  responseTime: "within 2 hours during business hours",
  businessHours: {
    weekdays: "Mon–Fri 07:00–17:00",
    saturday: "Sat 08:00–13:00",
    sunday: "Sun 08:00–12:00",
  },
  geo: {
    latitude: -25.7479,
    longitude: 28.2293,
  },
  mapsUrl: "https://maps.google.com/?q=Pretoria+Gauteng+South+Africa",
  priceRange: "$$",
} as const;

export function formatBusinessHours(): string {
  const { weekdays, saturday, sunday } = SITE.businessHours;
  return `${weekdays} · ${saturday} · ${sunday}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Sithembe Team, I am looking to inquire about your plant hire options. Please assist with availability and rates.";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function equipmentWhatsappMessage(title: string, slug: string): string {
  return `Hi Sithembe, I'd like to check availability for the ${title} (ref: ${slug}).`;
}

export function absoluteUrl(path: string, site?: URL | string): string {
  const base = site ? String(site).replace(/\/$/, "") : SITE.url;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function breadcrumbSchema(crumbs: BreadcrumbItem[], site?: URL | string) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/", site) },
    ...crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href, site) } : {}),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
