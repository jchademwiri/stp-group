export const ABOUT = {
  story: {
    headline: "Built on trust, driven by reliability",
    paragraphs: [
      "Sithembe Plant Hire was founded to solve a simple problem: construction sites and property managers in Gauteng needed reliable equipment and skilled operators - without the complexity of dealing with multiple suppliers.",
      "We started with a single dropside truck and a commitment to showing up on time, every time. Today, we operate a diverse fleet of heavy machinery, commercial vehicles, and grounds maintenance equipment, serving contractors, municipalities, estates, and industrial facilities across Pretoria and greater Gauteng.",
      "Our name means 'we are here' in isiZulu - and that's exactly what our clients count on.",
    ],
  },
  values: [
    {
      title: "Reliability",
      text: "We deliver equipment on schedule and operators who are ready to work. Downtime costs money - we take that personally.",
      icon: "clock",
    },
    {
      title: "Safety first",
      text: "Every operator is TETA or SAMA accredited. Every machine is inspected before dispatch. Public liability insurance covers every job.",
      icon: "shield",
    },
    {
      title: "Transparency",
      text: "Clear pricing, honest timelines, and no hidden costs. We quote what we charge and charge what we quote.",
      icon: "eye",
    },
    {
      title: "Local commitment",
      text: "We're based in Pretoria and invested in the communities we serve. When you call, you speak to someone who knows your area.",
      icon: "map",
    },
  ],
  credentials: [
    { label: "CIDB Grade 6 CE", description: "Civil Engineering works" },
    { label: "CIDB Grade 6 EP", description: "Electrical Power works" },
    { label: "CIDB Grade 6 SH", description: "Structural Steel works" },
    { label: "CIDB Grade 5 GB", description: "General Building works" },
    { label: "CIDB Grade 4 SK", description: "Specialist Works" },
    { label: "COIDA Registered", description: "Compensation for Occupational Injuries" },
    { label: "Public Liability Insured", description: "Full coverage for all site operations" },
    { label: "TETA Accredited", description: "Transport Education Training Authority" },
    { label: "SAMA Accredited", description: "South African Machinery Association" },
  ],
  team: [
    {
      name: "Operations Team",
      role: "Dispatch & Scheduling",
      description: "Our dispatch team coordinates equipment delivery and operator scheduling across Gauteng, ensuring the right machine arrives at the right site on time.",
    },
    {
      name: "Site Supervisors",
      role: "Wet Hire Operations",
      description: "Experienced supervisors manage on-site operations for wet hire contracts, coordinating operators, safety protocols, and client communication.",
    },
    {
      name: "Fleet Maintenance",
      role: "Workshop & Compliance",
      description: "Our workshop maintains all equipment to manufacturer standards, conducts pre-dispatch inspections, and manages COIDA and insurance compliance.",
    },
  ],
} as const;
