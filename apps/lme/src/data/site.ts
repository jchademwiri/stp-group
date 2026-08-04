export const LME = {
  name: "Livhu and Musa Enterprise",
  shortName: "LME",
  url: "https://livhuandmusa.co.za",
  description:
    "CIDB-registered construction and civil engineering contractor (CE, GB, EP) based in Centurion, Gauteng. Residential and commercial projects since 2014.",
  foundingYear: 2014,
  employees: "10+",
  tagline: "Reliable Construction & Civil Engineering - Since 2014",
  phone: "012 880 1893",
  phoneTel: "+27128801893",
  email: "info@livhuandmusa.co.za",
  address: {
    street: "3138B Crane Street, Thatchfield Hills",
    suburb: "Rua-Vista X13",
    city: "Centurion",
    province: "Gauteng",
    postal: "0157",
    full: "3138B Crane Street, Thatchfield Hills, Rua-Vista X13, Centurion, Gauteng, 0157",
  },
  region: "Centurion & Gauteng",
  serviceArea: "Gauteng & beyond",
  cidb: {
    grades: [
      { code: "CE", name: "Civil Engineering" },
      { code: "GB", name: "General Building" },
      { code: "EP", name: "Electrical Engineering" },
    ],
  },
  sarsStatus: "Compliant",
  responseTime: "within 24 hours",
  businessHours: {
    weekdays: "Mon–Fri 07:30–16:30",
  },
  geo: {
    latitude: -25.8606,
    longitude: 28.1566,
  },
  mapsUrl: "https://maps.google.com/?q=3138B+Crane+Street+Thatchfield+Hills+Centurion+Gauteng",
  priceRange: "$$",
  // Theme colors derived from LME logo (blue/teal)
  theme: {
    primary: "#0898c8",      // Teal-blue from logo
    primaryDark: "#0a6a8a",  // Darker teal
    primaryLight: "#e0f5fe", // Very light teal for backgrounds
    accent: "#f59e0b",       // Amber accent for CTAs (compliments blue)
    accentHover: "#d97706",  // Darker amber
  },
  // Values
  values: [
    {
      title: "10+ Years Experience",
      text: "Established 2014 with over 10 employees - we bring proven expertise to every project.",
      icon: "clock",
    },
    {
      title: "CIDB Registered",
      text: "Graded CE, GB, EP - fully compliant for public and private sector tenders.",
      icon: "shield",
    },
    {
      title: "Public Sector Track Record",
      text: "Preferred supplier status with municipal clients, backed by the same capability for water, sanitation, electrical, and construction work in the private sector.",
      icon: "building",
    },
    {
      title: "Core Values",
      text: "Excellence, Partnership, Sustainability, Integrity - these guide every project we deliver.",
      icon: "heart",
    },
  ],
  // Services
  services: [
    {
      title: "Civil Engineering (CE)",
      description: "Design, construction, and maintenance of infrastructure including roads, earthworks, and structural projects.",
      icon: "roads",
    },
    {
      title: "General Building (GB)",
      description: "Residential and commercial construction - new builds, renovations, alterations, and maintenance.",
      icon: "building",
    },
    {
      title: "Electrical Engineering (EP)",
      description: "Electrical installations, cabling, and infrastructure for municipal and private-sector projects.",
      icon: "bolt",
    },
  ],
  // Active contracts / credibility — ref/department set only where backed by a signed appointment letter
  contracts: [
    {
      title: "Corporate hire of general construction & refuse removal vehicles",
      ref: "SS 01-2023/24",
      department: "Corporate Fleet Management",
    },
    {
      title: "Corporate hire of general construction machines & equipment",
      ref: "SS 02-2023/24",
      department: "Corporate Fleet Management",
    },
    {
      title: "Hire of mobile drinking water tankers (10,000–15,000L) for informal settlements",
      ref: "HHS 10-2023/24",
      department: "Human Settlements",
    },
    {
      title: "Supply, delivery & off-loading of electrical cables, wire & conductors",
      ref: "EED 05-2023/24",
      department: "Energy and Electricity",
    },
    { title: "Supply, delivery & offloading of manhole covers (Water & Sanitation)" },
    { title: "Supply & delivery of emergency services rope rescue equipment" },
    { title: "Supply & delivery of HAZMAT equipment" },
  ],
  // Equipment fleet highlights
  fleet: [
    "8-ton trucks",
    "1,000L water tankers",
    "LDV bakkies",
    "Excavator",
    "Tipper trucks",
    "TLB",
    "Tractor",
    "Lowbed trucks",
    "Stump grinding machines",
    "Graders",
    "Brush cutters",
    "Ride-on mowers",
    "Chainsaws",
    "Pole pruners",
    "Leaf blowers",
  ],
} as const;

export function formatBusinessHours(): string {
  return LME.businessHours.weekdays;
}

export function absoluteUrl(path: string, site?: URL | string): string {
  const base = site ? String(site).replace(/\/$/, "") : LME.url;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

