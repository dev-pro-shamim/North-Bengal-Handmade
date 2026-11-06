export interface Product {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  gallery: string[];
  description: string;
  longDescription: string;
  features: string[];
  specs: {
    material: string;
    weightGsm: string;
    standardDimensions: string[];
    customDimensionsAvailable: boolean;
    dyes: string;
    moq: string;
    productionLeadTime: string;
    samplingTime: string;
    exportPackaging: string;
    portOfDispatch: string;
  };
  customizationOptions: {
    sizes: string[];
    colors: string[];
    branding: string[];
  };
}

export const PRODUCTS: Product[] = [
  {
    slug: 'kaisa-grass-deep-storage-baskets',
    category: 'Kaisa Grass Weaving & Storage',
    title: 'Handwoven Kaisa Grass Deep Storage Baskets (Set of 3)',
    subtitle: 'Nesting Rectangular Storage Organizers with Integrated Wrapped Handles',
    badge: 'Authentic Workshop Product',
    heroImage: '/assets/products/kaisa-grass-deep-baskets.jpg',
    gallery: [
      '/assets/products/kaisa-grass-deep-baskets.jpg',
      '/assets/products/kaisa-grass-low-trays.jpg',
      '/assets/products/banner-export-collection.jpg'
    ],
    description: 'Deep rectangular nesting storage baskets handwoven from natural Bangladeshi Kaisa grass. Features reinforced wrapped cutout handles, sturdy wire-free structural coils, and breathability ideal for linens, nursery items, and retail organization.',
    longDescription: 'Our signature Handwoven Kaisa Grass Deep Storage Baskets are crafted by skilled rural women artisans in Northern Bangladesh using wild-harvested kaisa grass (a sustainable fast-growing river reed). Each basket is tightly wound and interlaced with cotton wrap bindings, producing a resilient, rigid structure without requiring any plastic or metal internal wire framing. Designed as a 3-piece nested ensemble (Small, Medium, Large) that fits effortlessly into standard home wardrobes, laundry shelves, and walk-in pantries while reducing shipping CBM volume by 65%.',
    features: [
      '100% Natural Wild Kaisa Grass handwoven by Northern Bengal artisans',
      'Ergonomic reinforced cut-out carrying handles wrapped in soft natural binding',
      'Sturdy rectangular nesting 3-in-1 format optimizes retail space and ocean freight volume',
      'Breathable organic weave prevents dampness and musty odors in folded linens',
      'Zero synthetic wire frame or toxic lacquers — fully biodegradable and eco-friendly'
    ],
    specs: {
      material: '100% Wild River Kaisa Grass with Natural Cotton Wrap Stitching',
      weightGsm: 'Approx. 2.1 kg per complete 3-piece nesting set',
      standardDimensions: [
        'Small: 28 x 20 x 22 cm (11 x 8 x 8.7 in)',
        'Medium: 34 x 26 x 25 cm (13.4 x 10.2 x 9.8 in)',
        'Large: 40 x 32 x 28 cm (15.7 x 12.6 x 11 in)'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Untreated Grass (Custom Color Accent Bindings Available)',
      moq: '100 sets (300 individual pieces)',
      productionLeadTime: '3–4 Weeks for 500 sets',
      samplingTime: '7 Days with express air dispatch',
      exportPackaging: '3-in-1 Nested Set in breathable protective sleeve, 6 sets per 5-ply export master carton',
      portOfDispatch: 'FOB Chittagong Seaport (BDCGP) or Air Freight via Dhaka (DAC)'
    },
    customizationOptions: {
      sizes: ['Standard 3-in-1 Nested Set (S/M/L)', 'Large Basket Only (40x32x28 cm)', 'Medium Basket Only (34x26x25 cm)', 'Bespoke Custom Size'],
      colors: ['Natural Sun-Dried Blonde Kaisa', 'Natural with White Binding Accents', 'Natural with Black Contrast Bindings', 'Custom Brand Color Weave'],
      branding: ['Woven Fabric Brand Label', 'Debossed Faux Leather Patch', 'Printed Kraft Hangtag with Barcode', 'Neutral Export Packaging']
    }
  },
  {
    slug: 'seagrass-cylindrical-hampers-bowls',
    category: 'Seagrass Storage & Home Accents',
    title: 'Coiled Seagrass Cylindrical Hampers & Succulent Bowls',
    subtitle: 'Handcrafted Multi-Tier Storage Cylinders & Shallow Tabletop Catchall Bowls',
    badge: 'Export Best Seller',
    heroImage: '/assets/products/seagrass-cylindrical-hampers-bowls.jpg',
    gallery: [
      '/assets/products/seagrass-cylindrical-hampers-bowls.jpg',
      '/assets/products/banner-export-collection.jpg',
      '/assets/products/braided-jute-tapered-planter.jpg'
    ],
    description: 'Coiled river seagrass cylinders and matching shallow succulent planter bowls. Built with high-tensile contrast white cross-binding for high load capacity, self-standing stability, and Scandinavian bohemian styling.',
    longDescription: 'Handcrafted from sustainably gathered river seagrass in Bangladesh, this collection pairs tall cylindrical storage hampers with matching low-rim decorative planter bowls. The seagrass coils are bound with precision white binding cord, creating a contemporary dual-tone texture. The tall hampers serve as laundry bins, toy hampers, and large floor planter sleeves, while the low-profile bowls serve as catchalls, fruit bowls, or shallow succulent planters. Shipped nested to minimize container freight costs.',
    features: [
      'Pure natural river seagrass coiled with reinforced white structural binding',
      'Dual utility: tall cylindrical laundry/storage hampers + shallow succulent/decor bowls',
      'Freestanding cylindrical form with high crush-resistance and structural memory',
      'Smooth hand-finished rim and base that protects wooden and tiled floors',
      'Ideal for hotel spa rooms, residential bathrooms, and minimalist retail displays'
    ],
    specs: {
      material: '100% Natural River Seagrass with Durable Contrast Binding Cord',
      weightGsm: 'Approx. 2.4 kg for full 6-piece ensemble',
      standardDimensions: [
        'Tall Cylinders: Small (Dia 25 x H 28 cm), Medium (Dia 30 x H 34 cm), Large (Dia 36 x H 40 cm)',
        'Shallow Bowls: Small (Dia 16 x H 7 cm), Medium (Dia 20 x H 9 cm), Large (Dia 24 x H 11 cm)'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Seagrass Green-Beige with Crisp White Cord Accents',
      moq: '100 sets (or 150 individual units)',
      productionLeadTime: '3–4 Weeks for 500 sets',
      samplingTime: '7–10 Days',
      exportPackaging: 'Graduated nesting with silica gel moisture absorbents, packed 4 full sets per export carton',
      portOfDispatch: 'FOB Chittagong Port (BDCGP)'
    },
    customizationOptions: {
      sizes: ['Full 6-Piece Hamper & Bowl Set', '3-Piece Cylindrical Hamper Set Only', '3-Piece Succulent Bowl Set Only', 'Custom Diameter & Height'],
      colors: ['Natural Seagrass with White Binding', 'Natural Seagrass with Black Binding', 'Two-Tone Dip-Dyed Base', 'Natural Monochromatic Cord'],
      branding: ['Custom Woven Side Tag', 'Branded Cardboard Belly Band Wrap', 'Kraft Hangtag with EAN/UPC Barcode']
    }
  },
  {
    slug: 'braided-jute-tapered-planter',
    category: 'Golden Jute Planters & Interior Bins',
    title: 'Hand-Braided Golden Jute Tapered Planter & Waste Bin',
    subtitle: 'Dense Coiled Jute Braid Planter Pot Sleeve with Botanical Yellow Accent Dye',
    badge: 'Artisanal Dye Craft',
    heroImage: '/assets/products/braided-jute-tapered-planter.jpg',
    gallery: [
      '/assets/products/braided-jute-tapered-planter.jpg',
      '/assets/products/banner-export-collection.jpg',
      '/assets/products/kaisa-grass-deep-baskets.jpg'
    ],
    description: 'Heavy hand-braided golden tossa jute tapered container featuring botanical yellow dye accenting. Designed as an indoor planter cover, luxury hotel desk waste bin, or magazine stand.',
    longDescription: 'Created using premier Grade-A Golden Tossa Jute from the river basins of Northern Bengal. Artisans hand-braid the raw fiber into continuous thick strands, which are tightly coiled and lock-stitched into a graceful upward-tapered silhouette. A subtle band of eco-friendly sun-yellow botanical dye is woven into the upper rim, creating an earthy contrast. Durable, heavy-bottomed, naturally static-free, and 100% biodegradable.',
    features: [
      'Made from 100% pure Bangladeshi Golden Tossa Jute — the golden fiber of Bengal',
      'Upward-tapered architectural silhouette with heavy stable weighted bottom',
      'Artisan dyed sun-yellow botanical accent band along upper perimeter',
      'Lock-stitched with high-tensile invisible thread preventing uncoiling',
      'Naturally sound-dampening, anti-static, and completely plastic-free'
    ],
    specs: {
      material: '100% Natural Golden Tossa Jute with Eco-Certified Azo-Free Dye',
      weightGsm: 'Approx. 850 grams per unit',
      standardDimensions: [
        'Medium: Top Dia 28 cm x Bottom Dia 22 cm x Height 30 cm',
        'Large: Top Dia 34 cm x Bottom Dia 26 cm x Height 36 cm',
        'Desk Small: Top Dia 22 cm x Bottom Dia 18 cm x Height 24 cm'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Golden Jute with Botanical Yellow, Charcoal, or Terracotta Accent Band',
      moq: '150 pieces (assorted sizes accepted)',
      productionLeadTime: '2–3 Weeks for 500 pcs',
      samplingTime: '5–7 Days',
      exportPackaging: 'Nested stacking with protective corrugated interleaving, 20 pieces per master carton',
      portOfDispatch: 'FOB Chittagong (BDCGP) or Air Freight via Dhaka (DAC)'
    },
    customizationOptions: {
      sizes: ['Medium 28x30 cm', 'Large 34x36 cm', 'Desk Small 22x24 cm', 'Bespoke Planter Pot Dimensions'],
      colors: ['Natural Golden Jute with Yellow Accent', 'Natural with Charcoal Black Accent', 'Natural with Forest Olive Accent', 'Solid Natural Raw Jute'],
      branding: ['Debossed Real/Faux Leather Brand Patch', 'Custom Printed Kraft Label', 'Stitched Woven Edge Label']
    }
  },
  {
    slug: 'kaisa-grass-low-shelf-trays',
    category: 'Kaisa Grass Shelf Organization',
    title: 'Low-Profile Kaisa Grass Shelf Organizer Trays (Set of 3)',
    subtitle: 'Shallow Woven Rectangular Desk, Pantry & Vanity Organizer Baskets',
    badge: 'Home Organization',
    heroImage: '/assets/products/kaisa-grass-low-trays.jpg',
    gallery: [
      '/assets/products/kaisa-grass-low-trays.jpg',
      '/assets/products/kaisa-grass-deep-baskets.jpg',
      '/assets/products/banner-export-collection.jpg'
    ],
    description: 'Low-profile rectangular organizer trays with integrated cutout handles, woven from blonde kaisa grass. Tailored to fit standard vanity shelves, office bookcases, and kitchen pantries.',
    longDescription: 'Designed specifically for modular shelving systems and shallow drawers, these Low-Profile Kaisa Grass Shelf Organizer Trays offer an eco-conscious alternative to plastic storage bins. Woven by hand using resilient Northern Bengal kaisa grass, each tray features low-height walls for easy visibility and access to stored cosmetics, hand towels, desk accessories, or pantry spices. Reinforced cutout handles at both ends allow for effortless pulling and sliding on wooden shelves.',
    features: [
      'Low-profile 14–18 cm height engineered for standard bookshelf and vanity clearance',
      'Dual integrated wrapped handle cutouts for smooth sliding and carrying',
      'Set of 3 nesting graduated sizes optimizes storage utility and freight CBM',
      'Firm, flat base ensures steady support for jars, bottles, stationery, and folded napkins',
      'Handcrafted with zero plastic, synthetic resins, or noxious chemical varnishes'
    ],
    specs: {
      material: '100% Wild River Kaisa Grass with Natural Cotton Wrap Stitching',
      weightGsm: 'Approx. 1.6 kg per set of 3 trays',
      standardDimensions: [
        'Small: 30 x 20 x 13 cm (11.8 x 7.9 x 5.1 in)',
        'Medium: 36 x 25 x 15 cm (14.2 x 9.8 x 5.9 in)',
        'Large: 42 x 30 x 17 cm (16.5 x 11.8 x 6.7 in)'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Untreated Grass (Custom Color Accent Bindings Supported)',
      moq: '100 sets (300 individual trays)',
      productionLeadTime: '3 Weeks for 500 sets',
      samplingTime: '7 Days',
      exportPackaging: 'Sets nested 3-in-1 inside protective poly-sleeve, 8 sets per 5-ply export master carton',
      portOfDispatch: 'FOB Chittagong Port (BDCGP)'
    },
    customizationOptions: {
      sizes: ['Standard 3-Piece Tray Set', 'Large Tray Only (42x30x17 cm)', 'Medium Tray Only (36x25x15 cm)', 'Custom Shelf Dimension'],
      colors: ['Natural Blonde Kaisa Grass', 'Natural with White Accent Stitching', 'Natural with Olive Stitching', 'Custom Brand Stitching'],
      branding: ['Laser-Engraved Wooden Brand Tag', 'Stitched Care Label', 'Printed Paper Wrap Band with Barcode']
    }
  },
  {
    slug: 'handcrafted-seagrass-market-tote',
    category: 'Eco Lifestyle Carry Goods',
    title: 'Handcrafted Seagrass & Jute Market Tote Bags',
    subtitle: 'Sustainable Woven Shopping Totes & Beach Carryalls as Featured in Export Collection',
    badge: 'Zero Plastic Lifestyle',
    heroImage: '/assets/products/banner-export-collection.jpg',
    gallery: [
      '/assets/products/banner-export-collection.jpg',
      '/assets/products/seagrass-cylindrical-hampers-bowls.jpg',
      '/assets/products/kaisa-grass-deep-baskets.jpg'
    ],
    description: 'Handwoven natural seagrass and jute shopping totes with reinforced ergonomic handles, featured prominently in our official international export showcase.',
    longDescription: 'Showcased at the heart of our international export collection banner, our Handcrafted Seagrass & Jute Market Tote Bags provide global lifestyle brands with a zero-plastic alternative for supermarket shopping, beach outings, and urban weekend excursions. Skillfully handwoven with tightly plaited seagrass body panels and reinforced dual arch handles, each bag can comfortably carry up to 15 kg payload while offering organic tactile appeal.',
    features: [
      'Directly manufactured for international export since 2011',
      'Comfortable arched carrying handles designed for hand or shoulder wear',
      'Wide flat base allows the bag to stand upright when loaded',
      'Breathable natural fiber ideal for produce, beach towels, and daily essentials',
      'Complies with EU and US strict single-use plastic ban directives'
    ],
    specs: {
      material: '100% Sun-Dried River Seagrass with Jute Fiber Reinforcement',
      weightGsm: 'Approx. 450 - 650 grams per tote',
      standardDimensions: [
        'Standard Market Tote: 42 cm (W) x 30 cm (H) x 15 cm (Base)',
        'Large Beach Carryall: 48 cm (W) x 36 cm (H) x 18 cm (Base)',
        'Compact Town Tote: 34 cm (W) x 26 cm (H) x 12 cm (Base)'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Sun-Dried Seagrass with Optional Color Accent Stripes',
      moq: '200 pieces with custom brand hangtags',
      productionLeadTime: '2–3 Weeks for 1,000 pcs',
      samplingTime: '5–7 Days',
      exportPackaging: 'Nested flat in moisture-barrier bundles of 10, 50 pieces per heavy-duty export carton',
      portOfDispatch: 'FOB Chittagong (BDCGP) or Dhaka Airport (DAC)'
    },
    customizationOptions: {
      sizes: ['Standard Market Tote (42x30x15 cm)', 'Large Beach Carryall (48x36x18 cm)', 'Compact Town Tote (34x26x12 cm)', 'Bespoke Dimensions'],
      colors: ['Natural Sun-Dried Golden Seagrass', 'Natural with Navy Contrast Stripe', 'Natural with Black Geometric Accents'],
      branding: ['Sewn Fabric Brand Tag', 'Debossed Faux Leather Logo Patch', 'Custom Printed Kraft Hangtag with Barcode']
    }
  },
  {
    slug: 'two-tone-cotton-rope-storage-baskets',
    category: 'Cotton Rope & Jute Organization',
    title: 'Two-Tone Hand-Coiled Cotton Rope Storage Baskets (Set of 3)',
    subtitle: 'Nesting Rectangular Organizers with Tan Jute-Tone Trim & Off-White Body',
    badge: 'Artisanal Roots Featured',
    heroImage: '/assets/products/cotton-rope-two-tone-baskets.jpg',
    gallery: [
      '/assets/products/cotton-rope-two-tone-baskets.jpg',
      '/assets/products/kaisa-grass-deep-baskets.jpg',
      '/assets/products/banner-export-collection.jpg'
    ],
    description: 'Nesting set of 3 two-tone coiled cotton rope organizer bins featuring an artisan tan upper band with cutout handles and an ivory off-white base. Ultra-soft, scratch-free, and machine-washable.',
    longDescription: 'Handcrafted by our master artisans in Northern Bengal using premium natural cotton braided cords. Each basket combines an organic tan jute-colored upper rim with integrated ergonomic handle slits, and a clean off-white horizontal coiled body stitched with heavy-gauge invisible lock-threading. Ideal for children nurseries, baby changing tables, vanity towel trays, walk-in closets, and modern Scandinavian home decor.',
    features: [
      'Set of 3 nesting graduated sizes engineered for modular shelving units',
      'Ultra-soft natural cotton cord construction will never scratch luxury furniture or timber flooring',
      'Ergonomic seamless integrated carrying handle cutouts',
      'Collapsible for flat-pack container shipping, immediately recovers rounded-rectangle silhouette',
      'Zero synthetic plastic, wire, chemical glues, or sharp corners — 100% child and pet safe'
    ],
    specs: {
      material: '100% Natural Cotton Braided Cord with Jute-Dyed Accent Trim',
      weightGsm: 'Approx. 1.95 kg per 3-piece nesting set',
      standardDimensions: [
        'Small: 30 x 20 x 14 cm (11.8 x 7.9 x 5.5 in)',
        'Medium: 34 x 24 x 16 cm (13.4 x 9.4 x 6.3 in)',
        'Large: 38 x 28 x 18 cm (15.0 x 11.0 x 7.1 in)'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Ecru / Tan Non-Toxic Azo-Free Dyes',
      moq: '100 sets (300 individual baskets)',
      productionLeadTime: '2–3 Weeks for 500 sets',
      samplingTime: '5–7 Days with express air dispatch',
      exportPackaging: 'Folded flat or nested 3-in-1 with moisture-proof poly bag, 12 sets per master export carton',
      portOfDispatch: 'FOB Chittagong Port (BDCGP) or Dhaka Airport (DAC)'
    },
    customizationOptions: {
      sizes: ['Standard 3-in-1 Nested Set (S/M/L)', 'Large Basket Only (38x28x18 cm)', 'Medium Basket Only (34x24x16 cm)', 'Custom Dimensions'],
      colors: ['Tan Jute Rim & Off-White Base', 'Charcoal Grey Rim & Cream Base', 'Olive Green Rim & Natural Base', 'Solid Off-White Natural'],
      branding: ['Debossed Faux Leather Brand Tag', 'Woven Fabric Side Tab', 'Custom Printed Kraft Hangtag with Barcode']
    }
  }
];

import { ALL_PRODUCTS } from '@/lib/allProductsData';

export function getProductBySlug(slug: string): Product | undefined {
  const direct = PRODUCTS.find(p => p.slug === slug);
  if (direct) return direct;

  const galleryItem = ALL_PRODUCTS.find(p => p.slug === slug || p.id === slug);
  if (!galleryItem) return undefined;

  const mainImg = galleryItem.image || galleryItem.thumb || '/assets/products/kaisa-grass-deep-baskets.jpg';
  const galleryImgs = galleryItem.images && galleryItem.images.length > 0 ? galleryItem.images : [mainImg];

  return {
    slug: galleryItem.slug,
    category: galleryItem.category,
    title: galleryItem.title,
    subtitle: `${galleryItem.structure} • ${galleryItem.material}`,
    badge: galleryItem.featured ? 'Featured Workshop Product' : 'Export Catalog Item',
    heroImage: mainImg,
    gallery: galleryImgs,
    description: `${galleryItem.title} is meticulously handwoven by skilled rural artisans in Northern Bengal using sustainably sourced ${galleryItem.material}.`,
    longDescription: `Handcrafted in Kaunia, Rangpur and managed via our Dhaka corporate desk, this ${galleryItem.title} features resilient ${galleryItem.structure} construction. Designed for international lifestyle retailers, department stores, and eco-conscious interior brands seeking zero-plastic, 100% biodegradable natural home organizers.`,
    features: [
      `100% authentic natural ${galleryItem.material} handloomed by rural women artisans`,
      `Structure: ${galleryItem.structure} with artisan hand finishing`,
      `Compliance: ${galleryItem.compliance || 'Phytosanitary & Fumigation Certified'}`,
      `Export Incoterm: ${galleryItem.leadTime || 'FOB Chittagong Port (BDCGP)'}`,
      'Zero synthetic plastic or harsh chemical glues — 100% eco-friendly and biodegradable'
    ],
    specs: {
      material: galleryItem.material,
      weightGsm: 'Approx. 0.85 - 1.5 kg per unit (depending on size)',
      standardDimensions: [
        'Small: 28 x 20 x 14 cm',
        'Medium: 34 x 26 x 18 cm',
        'Large: 40 x 32 x 22 cm'
      ],
      customDimensionsAvailable: true,
      dyes: 'Natural Ecru / Non-Toxic Azo-Free Dyes',
      moq: galleryItem.moq || '300 pcs',
      productionLeadTime: galleryItem.leadTime || '25-35 Days FOB Chittagong',
      samplingTime: '5-7 Days Express Air Courier',
      exportPackaging: 'Moisture-proof poly lined 5-ply corrugated export cartons',
      portOfDispatch: 'Chittagong Port (BDCGP) / Dhaka Airport (DAC)'
    },
    customizationOptions: {
      sizes: ['Standard Medium', 'Standard Large', 'Set of 3 Nested', 'Bespoke Custom Size'],
      colors: ['Natural Unbleached Fiber', 'Two-Tone Accent', 'Smoked / Tea Wash', 'Custom Pantones'],
      branding: ['Debossed Faux Leather Tag', 'Woven Fabric Brand Label', 'Custom Barcode Kraft Hangtag']
    }
  };
}
