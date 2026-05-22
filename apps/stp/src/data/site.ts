export const SITE = {
  name: "Sithembe",
  legalName: "Sithembe Plant Hire",
  url: "https://sithembe.co.za",
  phone: "012 880 3155",
  phoneTel: "+27128803155",
  whatsapp: "27128803155",
  email: "admin@sithembe.co.za",
  region: "Pretoria & Gauteng",
  responseTime: "within 2 hours during business hours",
  businessHours: "Mon-Fri 07:00-17:00"
  // Sat 08:00-13:00, Sun 08:00-12:00
} as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Sithembe Team, I am looking to inquire about your plant hire options. Please assist with availability and rates.";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function equipmentWhatsappMessage(title: string, slug: string): string {
  return `Hi Sithembe, I'd like to check availability for the ${title} (ref: ${slug}).`;
}
