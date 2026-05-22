import type { FleetCategory, FleetItem } from "@/types/fleet";

export const FLEET_CATEGORIES: { id: FleetCategory | "all"; label: string }[] = [
  { id: "all", label: "All Equipment" },
  { id: "heavy-machinery", label: "Heavy Machinery" },
  { id: "commercial-vehicles", label: "Commercial Vehicles" },
  { id: "landscaping-mowers", label: "Landscaping & Mowers" },
  { id: "handheld-tools", label: "Handheld Power Tools" },
];

export const plantFleet: FleetItem[] = [
  {
    id: "dropside-8t",
    slug: "8-ton-dropside-truck",
    title: "8-Ton Dropside Truck",
    category: "commercial-vehicles",
    shortDescription:
      "Robust dropside commercial carrier for bulk material delivery and site logistics.",
    longDescription:
      "Designed to transport large construction volumes and heavy building materials. Fitted with drop-down sides to facilitate effortless manual and mechanical loading.",
    primaryImage: "/images/plant-hire/dropside-truck.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily",
      operatorCostIncluded: true,
    },
    specifications: {
      "Load Capacity": "8,000 kg (8 Tons)",
      "Bed Length": "6.2 Meters",
      "Dropside Height": "450 mm",
      Operator: "Licensed Code 14 driver included (Wet Hire)",
    },
    availability: "available",
    metaTitle: "8-Ton Dropside Truck for Hire | Sithembe",
    metaDescription:
      "Rent our robust 8-ton dropside cargo truck for material hauling and construction deliveries. Daily/weekly rates with certified operators. Request a quote.",
  },
  {
    id: "honey-sucker-10k",
    slug: "septic-tank-truck",
    title: "Septic Tank Truck (Honey Sucker)",
    category: "commercial-vehicles",
    shortDescription:
      "High-suction vacuum tanker for professional wastewater extraction and septic management.",
    longDescription:
      "Equipped with industrial-grade positive displacement vacuum pumps. Engineered to safely remove and transport sludge, septic tank wastewater, and industrial liquids.",
    primaryImage: "/images/plant-hire/septic-tank-truck.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "per load / daily",
      operatorCostIncluded: true,
    },
    specifications: {
      "Tank Capacity": "10,000 Liters",
      "Suction Rate": "High-volume displacement",
      "Hose Reach": "Up to 30 meters",
      Operator: "Accredited utility operator included",
    },
    availability: "available",
    metaTitle: "Septic Tank Vacuum Truck (Honey Sucker) Rental | Sithembe",
    metaDescription:
      "Professional honey sucker / vacuum septic tanker hire. High capacity liquid waste suction for estates, industrial plants, and homes.",
  },
  {
    id: "bobcat-s185",
    slug: "bobcat-loader",
    title: "Bobcat (Skid Steer Loader)",
    category: "heavy-machinery",
    shortDescription:
      "Compact, highly maneuverable skid steer loader for earthmoving and site preparation.",
    longDescription:
      "Perfect for earthmoving, grading, site clearing, and loading tasks in cramped conditions where full-size machinery cannot access.",
    primaryImage: "/images/plant-hire/bobcat.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily / hourly",
      operatorCostIncluded: true,
    },
    specifications: {
      "Operating Capacity": "900 kg",
      "Engine Power": "49 HP",
      "Operating Weight": "2,800 kg",
      Operator: "Certified skid steer operator included",
    },
    availability: "available",
    metaTitle: "Bobcat Skid Steer Loader for Hire | Sithembe",
    metaDescription:
      "Compact bobcat skid loader rental. Perfect for tight construction spaces, landscape clearing, and material moving. Wet & dry hire available.",
  },
  {
    id: "utility-tractor-75",
    slug: "utility-tractor",
    title: "Utility Tractor",
    category: "heavy-machinery",
    shortDescription:
      "Versatile four-wheel-drive tractor for agricultural pulling and heavy plot clearing.",
    longDescription:
      "High-torque utility tractor designed to operate agricultural implements, pull heavy clearing attachments, and handle rough terrains.",
    primaryImage: "/images/plant-hire/utility-tractor.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily",
      operatorCostIncluded: true,
    },
    specifications: {
      "Engine Power": "75 HP",
      "Drive Type": "4WD",
      "Rear Lift Capacity": "2,200 kg",
      Operator: "Tractor specialist driver included",
    },
    availability: "available",
    metaTitle: "Utility Tractor Hire Pretoria & Gauteng | Sithembe",
    metaDescription:
      "Heavy-duty utility tractor hire for site clearing, agricultural towing, and land preparation. Competitive commercial rates.",
  },
  {
    id: "rideon-mower-48",
    slug: "ride-on-mower",
    title: "Ride-on Mower",
    category: "landscaping-mowers",
    shortDescription:
      "High-efficiency commercial lawn tractor for large lawns and sports fields.",
    longDescription:
      "Engineered for fast, clean grass-cutting across municipal parks, institutional grounds, and sports fields. Features a wide cutting deck.",
    primaryImage: "/images/plant-hire/ride-on-mower.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily",
      operatorCostIncluded: false,
    },
    specifications: {
      "Cutting Width": "48 Inches (122 cm)",
      "Engine Power": "22 HP",
      Transmission: "Hydrostatic",
      Operator: "Dry Hire / Operator optional",
    },
    availability: "available",
    metaTitle: "Ride-on Mower Rental for Estate & Parks | Sithembe",
    metaDescription:
      "Efficient commercial-grade ride-on lawn mowers for hire. Best rates for large properties, schools, and corporate grounds.",
  },
  {
    id: "brush-cutter-pro",
    slug: "brush-cutter",
    title: "Commercial Brush Cutter",
    category: "handheld-tools",
    shortDescription:
      "Handheld high-torque weed trimmer for thick weeds and dense roadside grass.",
    longDescription:
      "Professional-grade handheld cutter fitted with steel blade options or heavy nylon lines, perfect for clearing dense vegetation on slopes and site perimeters.",
    primaryImage: "/images/plant-hire/brush-cutter.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily",
      operatorCostIncluded: false,
    },
    specifications: {
      "Engine Capacity": "45.6 cc",
      "Blade Types": "Nylon Line & 3-Tooth Metal Blade",
      Weight: "8.0 kg",
      Operator: "Dry Hire (Requires safety wear guidelines)",
    },
    availability: "available",
    metaTitle: "Commercial Brush Cutter & Weed Eater Hire | Sithembe",
    metaDescription:
      "High-torque petrol brush cutters for hire. Ideal for clearing dense grass, tall weeds, and wild scrub on construction sites.",
  },
  {
    id: "chainsaw-ms382",
    slug: "chainsaw",
    title: "Heavy-Duty Chainsaw",
    category: "handheld-tools",
    shortDescription:
      "High-performance petrol chainsaw for tree felling and branch clearing.",
    longDescription:
      "Heavy-duty chainsaw optimized for felling small to medium trees, cutting thick logs, and site clearing works.",
    primaryImage: "/images/plant-hire/chainsaw.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily",
      operatorCostIncluded: false,
    },
    specifications: {
      "Engine Capacity": "72.2 cc",
      "Guide Bar Length": "50 cm (20 Inches)",
      Safety: "Integrated inertia chain brake",
      Operator: "Dry Hire",
    },
    availability: "available",
    metaTitle: "Petrol Chainsaw Rental for Tree Clearing | Sithembe",
    metaDescription:
      "Professional chainsaws for hire. Heavy-duty wood cutting and branch clearing. Safety instruction and gear guidelines provided.",
  },
  {
    id: "tree-pruner-ht103",
    slug: "tree-pruner",
    title: "Telescopic Pole Tree Pruner",
    category: "handheld-tools",
    shortDescription:
      "Extendable pole saw for trimming high branches safely from the ground.",
    longDescription:
      "Features a telescopic extendable shaft to trim branches at high elevations without requiring ladders, minimizing operator risk.",
    primaryImage: "/images/plant-hire/tree-pruner.webp",
    galleryImages: [],
    rates: {
      indicator: "Contact for Rates",
      basis: "daily",
      operatorCostIncluded: false,
    },
    specifications: {
      "Max Length Reach": "3.9 Meters",
      "Engine Capacity": "31.4 cc",
      Weight: "7.2 kg",
      Operator: "Dry Hire",
    },
    availability: "available",
    metaTitle: "Telescopic Pole Tree Pruner Hire | Sithembe",
    metaDescription:
      "Reach high branches safely with our extension pole pruner rental. Precision tree trimming and garden clearing equipment.",
  },
];

export function getFleetBySlug(slug: string): FleetItem | undefined {
  return plantFleet.find((item) => item.slug === slug);
}

export function imageAlt(title: string): string {
  return `${title} for hire in Pretoria, Gauteng - Sithembe Plant Hire`;
}
