export interface LmeServiceDetail {
  code: "1CE" | "1GB" | "1EP";
  title: string;
  expandedDescription: string;
  projectTypes: string[];
}

export const lmeServiceDetails: LmeServiceDetail[] = [
  {
    code: "1CE",
    title: "Civil Engineering",
    expandedDescription:
      "LME's Civil Engineering division delivers infrastructure solutions for municipal and private-sector clients across Gauteng. Our experienced teams handle the full project lifecycle — from site preparation and earthworks through to final handover — ensuring compliance with CIDB grade 1CE requirements and all relevant SANS standards. We work closely with City of Tshwane and surrounding municipalities to deliver roads, drainage, and bulk earthworks projects on time and within budget.",
    projectTypes: [
      "Road construction & resurfacing",
      "Earthworks & excavation",
      "Stormwater drainage",
      "Infrastructure maintenance",
    ],
  },
  {
    code: "1GB",
    title: "General Building",
    expandedDescription:
      "Our General Building capability covers residential and commercial construction projects of all scales. Graded 1GB with the CIDB, LME has the capacity to take on new builds, renovations, alterations, and ongoing maintenance contracts. Whether you need a municipal facility refurbished or a commercial space extended, our teams bring the same quality workmanship and rigorous site management to every engagement.",
    projectTypes: [
      "Residential & commercial construction",
      "Renovations & refurbishments",
      "Building maintenance",
      "Site preparation",
    ],
  },
  {
    code: "1EP",
    title: "Electrical Engineering",
    expandedDescription:
      "LME's Electrical Engineering division provides end-to-end electrical services for public and private-sector infrastructure. Registered 1EP with the CIDB and SARS-compliant, we handle everything from cable supply and installation through to full electrical infrastructure maintenance programmes. Our technicians are experienced with municipal-grade specifications, ensuring all work meets regulatory requirements and passes compliance certification.",
    projectTypes: [
      "Electrical installation & wiring",
      "Cable supply & installation",
      "Electrical infrastructure maintenance",
      "Compliance & testing",
    ],
  },
];
