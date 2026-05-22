export type FleetCategory =
  | "heavy-machinery"
  | "commercial-vehicles"
  | "landscaping-mowers"
  | "handheld-tools";

export type FleetAvailability = "available" | "booked" | "maintenance";

export interface FleetRates {
  indicator: string;
  basis: string;
  operatorCostIncluded: boolean;
}

export interface FleetItem {
  id: string;
  slug: string;
  title: string;
  category: FleetCategory;
  shortDescription: string;
  longDescription: string;
  primaryImage: string;
  galleryImages: string[];
  rates: FleetRates;
  specifications: Record<string, string>;
  availability: FleetAvailability;
  metaTitle: string;
  metaDescription: string;
}
