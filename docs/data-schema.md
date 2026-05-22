# Sithembe Plant Hire Data Schema & Fleet Data

This document acts as the data specification sheet for Sithembe's plant hire fleet, defining the exact fields, attributes, rate indicators, and specs for the 8 assets in the inventory.

---

## 1. Framework-Agnostic Schema Definition

The data model for each equipment listing is defined below.

```json
{
  "id": "string (unique identifier)",
  "slug": "string (URL route param)",
  "title": "string (display name)",
  "category": "string (heavy-machinery | commercial-vehicles | landscaping-mowers | handheld-tools)",
  "shortDescription": "string (marketing teaser)",
  "longDescription": "string (detailed page intro)",
  "primaryImage": "string (path to main optimized asset)",
  "galleryImages": "array of strings (paths to detail pictures)",
  "rates": {
    "indicator": "string (e.g., 'From R1,800 / day')",
    "basis": "string (daily | hourly | weekly)",
    "operatorCostIncluded": "boolean"
  },
  "specifications": {
    "key_name_1": "string (value)",
    "key_name_2": "string (value)"
  },
  "availability": "string (available | booked | maintenance)"
}
```

---

## 2. Image Asset Specifications

For optimal load speeds (Core Web Vitals) and image rendering:
*   **Format**: WebP (`.webp`) is the required production format. JPG or PNG files must be converted.
*   **Main Dimensions**: Width: `1200px` minimum, Height: `800px` minimum (3:2 aspect ratio).
*   **Alt Text Guideline**: Format as: `[Equipment Title] for hire in Pretoria, Gauteng - Sithembe Plant Hire`.

---

## 3. Fleet Inventory Data (The 8 Items)

### Item 1: 8-Ton Dropside Truck
*   **ID**: `dropside-8t`
*   **Slug**: `8-ton-dropside-truck`
*   **Title**: *"8-Ton Dropside Truck"*
*   **Category**: `commercial-vehicles`
*   **Short Description**: *"Robust dropside commercial carrier for bulk material delivery and site logistics."*
*   **Long Description**: *"Designed to transport large construction volumes and heavy building materials. Fitted with drop-down sides to facilitate effortless manual and mechanical loading."*
*   **Primary Image**: `/images/plant-hire/dropside-truck.webp`
*   **Gallery Images**: `[]` (MVP: empty array fallback)
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily"*
    *   *OperatorCostIncluded*: `true`
*   **Specifications**:
    *   *Load Capacity*: *"8,000 kg (8 Tons)"*
    *   *Bed Length*: *"6.2 Meters"*
    *   *Dropside Height*: *"450 mm"*
    *   *Operator*: *"Licensed Code 14 driver included (Wet Hire)"*

### Item 2: Septic Tank Truck (Honey Sucker)
*   **ID**: `honey-sucker-10k`
*   **Slug**: `septic-tank-truck`
*   **Title**: *"Septic Tank Truck (Honey Sucker)"*
*   **Category**: `commercial-vehicles`
*   **Short Description**: *"High-suction vacuum tanker for professional wastewater extraction and septic management."*
*   **Long Description**: *"Equipped with industrial-grade positive displacement vacuum pumps. Engineered to safely remove and transport sludge, septic tank wastewater, and industrial liquids."*
*   **Primary Image**: `/images/plant-hire/septic-tank-truck.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"per load / daily"*
    *   *OperatorCostIncluded*: `true`
*   **Specifications**:
    *   *Tank Capacity*: *"10,000 Liters"*
    *   *Suction Rate*: *"High-volume displacement"*
    *   *Hose Reach*: *"Up to 30 meters"*
    *   *Operator*: *"Accredited utility operator included"*

### Item 3: Bobcat Loader
*   **ID**: `bobcat-s185`
*   **Slug**: `bobcat-loader`
*   **Title**: *"Bobcat (Skid Steer Loader)"*
*   **Category**: `heavy-machinery`
*   **Short Description**: *"Compact, highly maneuverable skid steer loader for earthmoving and site preparation."*
*   **Long Description**: *"Perfect for earthmoving, grading, site clearing, and loading tasks in cramped conditions where full-size machinery cannot access."*
*   **Primary Image**: `/images/plant-hire/bobcat.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily / hourly"*
    *   *OperatorCostIncluded*: `true`
*   **Specifications**:
    *   *Operating Capacity*: *"900 kg"*
    *   *Engine Power*: *"49 HP"*
    *   *Operating Weight*: *"2,800 kg"*
    *   *Operator*: *"Certified skid steer operator included"*

### Item 4: Utility Tractor
*   **ID**: `utility-tractor-75`
*   **Slug**: `utility-tractor`
*   **Title**: *"Utility Tractor"*
*   **Category**: `heavy-machinery`
*   **Short Description**: *"Versatile four-wheel-drive tractor for agricultural pulling and heavy plot clearing."*
*   **Long Description**: *"High-torque utility tractor designed to operate agricultural implements, pull heavy clearing attachments, and handle rough terrains."*
*   **Primary Image**: `/images/plant-hire/utility-tractor.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily"*
    *   *OperatorCostIncluded*: `true`
*   **Specifications**:
    *   *Engine Power*: *"75 HP"*
    *   *Drive Type*: *"4WD"*
    *   *Rear Lift Capacity*: *"2,200 kg"*
    *   *Operator*: *"Tractor specialist driver included"*

### Item 5: Ride-on Mower
*   **ID**: `rideon-mower-48`
*   **Slug**: `ride-on-mower`
*   **Title**: *"Ride-on Mower"*
*   **Category**: `landscaping-mowers`
*   **Short Description**: *"High-efficiency commercial lawn tractor for large lawns and sports fields."*
*   **Long Description**: *"Engineered for fast, clean grass-cutting across municipal parks, institutional grounds, and sports fields. Features a wide cutting deck."*
*   **Primary Image**: `/images/plant-hire/ride-on-mower.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily"*
    *   *OperatorCostIncluded*: `false`
*   **Specifications**:
    *   *Cutting Width*: *"48 Inches (122 cm)"*
    *   *Engine Power*: *"22 HP"*
    *   *Transmission*: *"Hydrostatic"*
    *   *Operator*: *"Dry Hire / Operator optional"*

### Item 6: Brush Cutter
*   **ID**: `brush-cutter-pro`
*   **Slug**: `brush-cutter`
*   **Title**: *"Commercial Brush Cutter"*
*   **Category**: `handheld-tools`
*   **Short Description**: *"Handheld high-torque weed trimmer for thick weeds and dense roadside grass."*
*   **Long Description**: *"Professional-grade handheld cutter fitted with steel blade options or heavy nylon lines, perfect for clearing dense vegetation on slopes and site perimeters."*
*   **Primary Image**: `/images/plant-hire/brush-cutter.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily"*
    *   *OperatorCostIncluded*: `false`
*   **Specifications**:
    *   *Engine Capacity*: *"45.6 cc"*
    *   *Blade Types*: *"Nylon Line & 3-Tooth Metal Blade"*
    *   *Weight*: *"8.0 kg"*
    *   *Operator*: *"Dry Hire (Requires safety wear guidelines)"*

### Item 7: Chainsaw
*   **ID**: `chainsaw-ms382`
*   **Slug**: `chainsaw`
*   **Title**: *"Heavy-Duty Chainsaw"*
*   **Category**: `handheld-tools`
*   **Short Description**: *"High-performance petrol chainsaw for tree felling and branch clearing."*
*   **Long Description**: *"Heavy-duty chainsaw optimized for felling small to medium trees, cutting thick logs, and site clearing works."*
*   **Primary Image**: `/images/plant-hire/chainsaw.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily"*
    *   *OperatorCostIncluded*: `false`
*   **Specifications**:
    *   *Engine Capacity*: *"72.2 cc"*
    *   *Guide Bar Length*: *"50 cm (20 Inches)"*
    *   *Safety*: *"Integrated inertia chain brake"*
    *   *Operator*: *"Dry Hire"*

### Item 8: Tree Pruner
*   **ID**: `tree-pruner-ht103`
*   **Slug**: `tree-pruner`
*   **Title**: *"Telescopic Pole Tree Pruner"*
*   **Category**: `handheld-tools`
*   **Short Description**: *"Extendable pole saw for trimming high branches safely from the ground."*
*   **Long Description**: *"Features a telescopic extendable shaft to trim branches at high elevations without requiring ladders, minimizing operator risk."*
*   **Primary Image**: `/images/plant-hire/tree-pruner.webp`
*   **Gallery Images**: `[]`
*   **Rates**:
    *   *Indicator*: *"Contact for Rates"*
    *   *Basis*: *"daily"*
    *   *OperatorCostIncluded*: `false`
*   **Specifications**:
    *   *Max Length Reach*: *"3.9 Meters"*
    *   *Engine Capacity*: *"31.4 cc"*
    *   *Weight*: *"7.2 kg"*
    *   *Operator*: *"Dry Hire"*
