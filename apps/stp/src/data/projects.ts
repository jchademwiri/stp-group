export type ProjectCategory = "grass-cutting" | "desludging" | "plant-hire" | "general";

export interface ProjectStat {
  label: string;
  value: string;
}

export interface STPProject {
  title: string;
  client: string;
  description: string;
  category: ProjectCategory;
  stats: ProjectStat[];
  year: string;
  tenderRef?: string;
}

export const stpProjects: STPProject[] = [
  // ── Grass Cutting & Vegetation Management ──
  {
    title: "Msunduzi Municipal Grass Cutting & Vegetation Control",
    client: "Msunduzi Local Municipality (Pietermaritzburg)",
    description:
      "Large-scale grass cutting and vegetation management contract covering municipal roadsides, public open spaces, and designated residential areas across Msunduzi. Industrial tractors, ride-on mowers, and brush cutters deployed for routine maintenance and seasonal clearing.",
    category: "grass-cutting",
    stats: [
      { label: "Contract reference", value: "SCM 20 of 22/23" },
      { label: "Duration", value: "Multi-year" },
      { label: "Scope", value: "Municipal-wide vegetation" },
    ],
    year: "2022-2023",
    tenderRef: "SCM 20 of 22-23",
  },
  {
    title: "Roads & Stormwater Verge Maintenance - ROC 07",
    client: "Municipal Roads Authority",
    description:
      "Roadside vegetation clearing, firebreak establishment, and drainage channel maintenance along major arterial roads. Crews deployed with tractors, flail mowers, and handheld equipment for precision verge management and safety clearance.",
    category: "grass-cutting",
    stats: [
      { label: "Contract reference", value: "ROC 07-2022.23" },
      { label: "Duration", value: "Ongoing contract" },
      { label: "Scope", value: "Road verge maintenance" },
    ],
    year: "2022-2023",
    tenderRef: "ROC 07-2022.23",
  },

  // ── Desludging & Waste Management ──
  {
    title: "Pikitup Waste Management Services",
    client: "Pikitup (City of Johannesburg)",
    description:
      "Comprehensive waste management and collection services contract with Pikitup, Johannesburg's municipal waste management utility. Vacuum tankers and specialised waste handling equipment deployed for scheduled and emergency callouts across designated regions.",
    category: "desludging",
    stats: [
      { label: "Contract reference", value: "PU102-2022" },
      { label: "Year awarded", value: "2022" },
    ],
    year: "2022",
    tenderRef: "PU102-2022",
  },
  {
    title: "Chemical Toilet Hire & Servicing - HS 02",
    client: "Municipal Health & Hygiene Services",
    description:
      "Hiring, servicing, and maintenance of chemical toilets across multiple municipal regions. Regular cleaning, waste extraction, and restocking schedules managed for events, construction sites, and public facilities. Region 2 and Region 5 allocations included.",
    category: "desludging",
    stats: [
      { label: "Contract reference", value: "HS 02-2025.26" },
      { label: "Regions served", value: "Region 2 & 5" },
      { label: "Service", value: "Chemical toilet hire & servicing" },
    ],
    year: "2025-2026",
    tenderRef: "HS 02-2025.26",
  },
  {
    title: "Hygiene & Sanitation Services - HHS 10",
    client: "Municipal Health Services",
    description:
      "Provision of hygiene and sanitation services including portable toilet hire, servicing, and waste management for municipal facilities, public events, and construction sites. Accredited operators with high-capacity vacuum tankers.",
    category: "desludging",
    stats: [
      { label: "Contract reference", value: "HHS 10-2023.24" },
      { label: "Duration", value: "Multi-year" },
      { label: "Services", value: "Hygiene & sanitation" },
    ],
    year: "2023-2024",
    tenderRef: "HHS 10-2023.24",
  },

  // ── Plant Hire & Equipment ──
  {
    title: "Roads & Stormwater Contract - ROC 08",
    client: "Municipal Infrastructure Department",
    description:
      "Plant hire and equipment rental for roads and stormwater infrastructure projects. Dropside trucks, excavators, and heavy machinery deployed with certified operators for road construction, drainage works, and bulk earthmoving.",
    category: "plant-hire",
    stats: [
      { label: "Contract reference", value: "ROC 08-2022.23" },
      { label: "Equipment", value: "Heavy machinery & trucks" },
      { label: "Operator model", value: "Wet hire included" },
    ],
    year: "2022-2023",
    tenderRef: "ROC 08-2022.23",
  },
  {
    title: "Roads & Stormwater Contract - ROC 20",
    client: "Municipal Roads Authority",
    description:
      "Extended plant hire and materials supply contract for municipal roads and stormwater maintenance. Fleet of dropside trucks, utility tractors, and earthmoving equipment deployed for routine maintenance and emergency response.",
    category: "plant-hire",
    stats: [
      { label: "Contract reference", value: "ROC 20-2023.24" },
      { label: "Duration", value: "Annual renewal" },
      { label: "Scope", value: "Roads & stormwater" },
    ],
    year: "2023-2024",
    tenderRef: "ROC 20-2023.24",
  },
  {
    title: "Sanitation Services Equipment - SS 02",
    client: "Municipal Sanitation Department",
    description:
      "Vacuum tanker and equipment hire for municipal sanitation services. High-capacity honey suckers and support vehicles deployed for sewer maintenance, septic emptying, and liquid waste transport across service regions.",
    category: "plant-hire",
    stats: [
      { label: "Contract reference", value: "SS 02-2023.24" },
      { label: "Equipment", value: "Vacuum tankers & support" },
      { label: "Service", value: "Sanitation infrastructure" },
    ],
    year: "2023-2024",
    tenderRef: "SS 02-2023.24",
  },

  // ── General Infrastructure & Electrical ──
  {
    title: "City of Tshwane Electrical Infrastructure",
    client: "City of Tshwane Metropolitan Municipality",
    description:
      "Electrical infrastructure maintenance and plant hire for the City of Tshwane. Equipment and certified operators deployed for substation maintenance, street lighting, and electrical distribution network support.",
    category: "general",
    stats: [
      { label: "Contract reference", value: "EED 11" },
      { label: "Service", value: "Electrical infrastructure" },
    ],
    year: "Current",
    tenderRef: "EED 11",
  },
  {
    title: "Electrical Services - ES 06",
    client: "Municipal Electrical Department",
    description:
      "Electrical services contract providing plant hire, equipment, and operator support for municipal electrical maintenance and construction projects across the service region.",
    category: "general",
    stats: [
      { label: "Contract reference", value: "ES 06-2023.24" },
      { label: "Duration", value: "Annual" },
      { label: "Scope", value: "Electrical services" },
    ],
    year: "2023-2024",
    tenderRef: "ES 06-2023.24",
  },
] as const;

export function getProjectsByCategory(category: ProjectCategory): STPProject[] {
  return stpProjects.filter((p) => p.category === category);
}

export function getFeaturedProjects(limit = 3): STPProject[] {
  return stpProjects.slice(0, limit);
}

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  "grass-cutting": "Grass Cutting & Vegetation",
  desludging: "Desludging & Sanitation",
  "plant-hire": "Plant Hire & Equipment",
  general: "General Infrastructure",
};

const categoryOrder: ProjectCategory[] = [
  "grass-cutting",
  "desludging",
  "plant-hire",
  "general",
];

export function getProjectsGroupedByCategory(): { label: string; projects: STPProject[] }[] {
  return categoryOrder
    .map((category) => ({
      label: projectCategoryLabels[category],
      projects: getProjectsByCategory(category),
    }))
    .filter((group) => group.projects.length > 0);
}
