const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = 'C:/Users/DITS-USER/Videos/handmade product';
const outDir = path.join(__dirname, '../public/assets/products-gallery');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.match(/\.(jpe?g|png|webp)$/i));

// Pre-defined curated export product names and specs based on authentic North Bengal craft collections
const productTitles = [
  { title: "Kaunia Rectangular Seagrass Storage Baskets (Set of 3)", cat: "Storage Baskets", mat: "Wild Kaunia Seagrass & Cotton Warp", shape: "Rectangular with Inset Handles" },
  { title: "Circular Handwoven Seagrass Storage Cylinder Trio", cat: "Storage Baskets", mat: "Seagrass Coil with White Cotton Stitching", shape: "Cylindrical Nested" },
  { title: "Natural Golden Jute Weave Tapered Waste Basket", cat: "Home Accents & Trays", mat: "100% Export-Grade Golden Jute", shape: "Tapered Circular" },
  { title: "Braided Cotton Rope & Jute Two-Tone Utility Hamper (Set of 3)", cat: "Laundry & Hampers", mat: "Braided Cotton Cord & Natural Jute", shape: "Oval with Slotted Handles" },
  { title: "Shallow Kaunia Seagrass Desktop Organizer Trays (Set of 3)", cat: "Home Accents & Trays", mat: "Hand-coiled Seagrass & Bleached Cotton", shape: "Low-profile Rectangular" },
  { title: "Golden Jute & Seagrass Ribbed Laundry Hamper with Lid", cat: "Laundry & Hampers", mat: "Raw Golden Jute & Kaunia Seagrass", shape: "Cylindrical with Fitted Cover" },
  { title: "Artisan Braided Jute Plant Basket with Vegan Leather Handles", cat: "Planters & Pots", mat: "Heavy-duty Twisted Golden Jute", shape: "Wide-mouth Cylinder" },
  { title: "Handwoven Natural Fiber Shallow Fruit & Bread Bowls", cat: "Home Accents & Trays", mat: "Wild River Seagrass", shape: "Round Serving Bowl" },
  { title: "Chevron Pattern Handloomed Jute Floor Rug", cat: "Natural Fiber Rugs", mat: "Natural & Charcoal Dyed Jute Fiber", shape: "Rectangular Area Rug" },
  { title: "Eco-Friendly Coiled Seagrass Table Placemats (Set of 4)", cat: "Home Accents & Trays", mat: "Spiral-wound Natural Seagrass", shape: "Circular Flat Mats" },
  { title: "Boho Fringe Cotton Rope & Jute Decorative Bin", cat: "Storage Baskets", mat: "Organic Cotton Yarn & Jute Base", shape: "Round with Macrame Accents" },
  { title: "Nested Square Seagrass Cube Storage with Handles (Set of 3)", cat: "Storage Baskets", mat: "Kaunia Riverbed Seagrass", shape: "Cube Cubby Organizers" },
  { title: "Minimalist Two-Tone Jute & Cotton Storage Tub", cat: "Storage Baskets", mat: "Pure Golden Jute & Natural Cotton", shape: "Tub Style with Rope Handles" },
  { title: "Braided Jute Hanging Wall Planter Pouch", cat: "Planters & Pots", mat: "Braided Jute Twine", shape: "Wall-mount Hanging Teardrop" },
  { title: "Heavy Duty Woven Jute Firewood & Log Carrier Tote", cat: "Home Accents & Trays", mat: "Reinforced 4-ply Golden Jute", shape: "Open Tote with Sturdy Handles" },
  { title: "Geometric Hand-Embroidered Jute Cushion Cover", cat: "Home Accents & Trays", mat: "Fine Jute Fabric & Cotton Floss", shape: "Square 45x45 cm" },
  { title: "Hand-coiled Seagrass Hanging Planters (Duo Pack)", cat: "Planters & Pots", mat: "Seagrass & Cotton Suspension Rope", shape: "Suspended Bowls" },
  { title: "Organic Twisted Jute Table Runner with Fringe", cat: "Home Accents & Trays", mat: "Hand-spun Raw Golden Jute", shape: "Long Runner 180x35 cm" },
  { title: "Extra Large Braided Cotton Rope Nursery Laundry Basket", cat: "Laundry & Hampers", mat: "Soft Touch Cotton Rope", shape: "Deep Cylinder with Ear Handles" },
  { title: "Artisanal Kaunia Seagrass Bread Basket with Liner", cat: "Home Accents & Trays", mat: "Seagrass with Unbleached Cotton Liner", shape: "Oval Tabletop Basket" },
  { title: "Natural Jute & Recycled Cotton Braided Oval Mat", cat: "Natural Fiber Rugs", mat: "Jute Braid with Multi-color Cotton Flecks", shape: "Oval Floor Mat" },
  { title: "Spiral Seagrass Belly Basket with Foldable Top", cat: "Storage Baskets", mat: "Flexible Kaunia Seagrass", shape: "Collapsible Belly Basket" },
  { title: "Modernist Monochrome Jute & White Cotton Pot Cover", cat: "Planters & Pots", mat: "Natural Jute & White Cotton Cord", shape: "Snug-fit Planter Sleeve" },
  { title: "Handwoven Date Palm Leaf & Jute Storage Box with Lid", cat: "Storage Baskets", mat: "Date Palm Fronds & Jute Ribbing", shape: "Covered Chest" },
  { title: "Round Natural Fiber Serving Tray with Sturdy Wood Core", cat: "Home Accents & Trays", mat: "Woven Seagrass over Wooden Frame", shape: "Round Platter with Rims" },
  { title: "Braided Jute Coaster Set with Holder (Pack of 6)", cat: "Home Accents & Trays", mat: "Hand-braided Jute Twine", shape: "Circular 10cm Coasters" },
  { title: "Vertical Stripe Seagrass Tall Laundry Hamper", cat: "Laundry & Hampers", mat: "Dyed & Natural Seagrass Fibers", shape: "Tall Standing Hamper" },
  { title: "Ribbed Jute Desktop Pen Holder & Accessory Cups (Trio)", cat: "Home Accents & Trays", mat: "Golden Jute Cord", shape: "Small Cylinders" },
  { title: "Hand-knotted Macrame & Jute Plant Hanger", cat: "Planters & Pots", mat: "100% Cotton & Jute Core", shape: "Ceiling Suspended" },
  { title: "Vintage Style Seagrass Picnic Basket with Double Flap Lid", cat: "Storage Baskets", mat: "Tough Seagrass & Bamboo Latches", shape: "Traditional Hamper" },
  { title: "Neutral Beige Cotton & Jute Woven Toy Storage Basket", cat: "Storage Baskets", mat: "Cotton Rope with Jute Rim", shape: "Wide Circular Tub" },
  { title: "Raw Jute Rope Round Ottoman Pouf Cover", cat: "Home Accents & Trays", mat: "Heavy Hand-braided Jute Rope", shape: "Circular Floor Pouf" },
  { title: "Natural Seagrass Flower Pot Cover with Waterproof Liner", cat: "Planters & Pots", mat: "Kaunia Seagrass & PVC Inner Barrier", shape: "Cylindrical Pot Cover" },
  { title: "Hexagonal Pattern Jute Floor Rug (Handwoven)", cat: "Natural Fiber Rugs", mat: "Natural Golden Jute Yarn", shape: "Hexagonal Geometric Rug" },
  { title: "Two-Tier Seagrass Hanging Fruit Basket", cat: "Home Accents & Trays", mat: "Seagrass Coils with Jute Hanger", shape: "Tiered Hanging System" },
  { title: "Minimalist Jute Entryway Shoe Basket", cat: "Storage Baskets", mat: "Stiffened Jute & Seagrass Base", shape: "Wide Low Basket" },
  { title: "Natural Fiber Handwoven Magazine & Book Rack", cat: "Storage Baskets", mat: "Seagrass over Steel Wire Frame", shape: "Divided Caddy" },
  { title: "Decorative Jute Mirror Frame with Sunburst Braids", cat: "Home Accents & Trays", mat: "Twisted Jute Cord & Glass", shape: "Circular Sunburst" },
  { title: "Natural Kaunia Seagrass Waste Paper Bin (Office Grade)", cat: "Storage Baskets", mat: "Export-grade Stiff Seagrass", shape: "Tapered Square" },
  { title: "Hand-spun Jute Twine Garden Basket with Cutout Handles", cat: "Storage Baskets", mat: "Unbleached Biodegradable Jute", shape: "Deep Oval Basket" },
  { title: "Chevron Weave Seagrass Planter Basket with Contrast Rim", cat: "Planters & Pots", mat: "Black Dyed & Natural Seagrass", shape: "Round Tapered" },
  { title: "Handcrafted Jute Rope Bathroom Vanity Organizer Tray", cat: "Home Accents & Trays", mat: "Moisture-resistant Treated Jute", shape: "Rectangular Tray" },
  { title: "Dual-color Braided Cotton Rope Blanket Basket", cat: "Laundry & Hampers", mat: "Ultra-thick Cotton Cord", shape: "Extra Wide Hamper" },
  { title: "Fine Kaunia Seagrass Round Storage Box with Finial Lid", cat: "Storage Baskets", mat: "Fine-strand Kaunia Seagrass", shape: "Decorative Jar Shape" },
  { title: "Woven Jute Bedside Table Lamp Shade", cat: "Home Accents & Trays", mat: "Natural Jute String over Wire", shape: "Cylindrical Drum Shade" },
  { title: "Eco-chic Jute Grocery & Market Shopper Bag (Export Model)", cat: "Home Accents & Trays", mat: "High-density Laminated Jute", shape: "Structured Shopper" },
  { title: "Handwoven Seagrass Floor Cushion with Cotton Fill", cat: "Home Accents & Trays", mat: "Braided Seagrass & Cotton Waste", shape: "Round Zabuton Style" },
  { title: "Tiered Seagrass Desktop Letter & Paper Sorter", cat: "Storage Baskets", mat: "Fine Seagrass & Bamboo Slats", shape: "2-Tier Desk Organizer" },
  { title: "Rustic Jute Rope Storage Bin with Metal Riveted Handles", cat: "Storage Baskets", mat: "Heavy Jute Rope & Brass Rivets", shape: "Structured Box" },
  { title: "Artisan Kaunia Seagrass Corner Laundry Hamper", cat: "Laundry & Hampers", mat: "Tough Kaunia Seagrass Braid", shape: "Quarter-circle Corner Unit" },
  { title: "Natural Jute Fiber Pet Bed Basket with Washable Pad", cat: "Home Accents & Trays", mat: "Thick Braided Jute Ring", shape: "Oval Pet Bed" },
  { title: "Deluxe Kaunia Heritage Master Collection Basket", cat: "Storage Baskets", mat: "Museum-grade Seagrass & Fine Jute", shape: "Exquisite Centerpiece" }
];

async function runEnhance() {
  console.log(`Starting studio contrast & eye-catching export processing for ${files.length} images...`);
  const catalog = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = path.join(srcDir, file);
    const cleanId = `nb-prod-${String(i + 1).padStart(2, '0')}`;
    const outName = `${cleanId}.jpg`;
    const thumbName = `${cleanId}-thumb.jpg`;
    const outPath = path.join(outDir, outName);
    const thumbPath = path.join(outDir, thumbName);

    const info = productTitles[i] || {
      title: `Handcrafted Natural Fiber Product #${i + 1}`,
      cat: "Storage Baskets",
      mat: "Natural Kaunia Seagrass & Golden Jute",
      shape: "Export Grade"
    };

    try {
      // High-contrast, vibrant, crystal-clear studio image
      await sharp(srcPath)
        .rotate()
        .normalize() // Stretch dynamic range to 0-255
        .linear(1.06, -4) // Boost contrast curve
        .modulate({
          brightness: 1.05,
          saturation: 1.18 // Rich natural golden jute and green-gold seagrass hues
        })
        .sharpen({
          sigma: 1.3,
          m1: 1.2,
          m2: 2.2
        })
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(outPath);

      // Web thumbnail
      await sharp(srcPath)
        .rotate()
        .normalize()
        .linear(1.06, -4)
        .modulate({
          brightness: 1.05,
          saturation: 1.18
        })
        .sharpen()
        .resize({
          width: 600,
          height: 600,
          fit: 'cover'
        })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(thumbPath);

      catalog.push({
        id: cleanId,
        slug: `artisan-handmade-${cleanId}`,
        itemNo: `NB-EXP-${String(100 + i + 1)}`,
        title: info.title,
        category: info.cat,
        material: info.mat,
        structure: info.shape,
        image: `/assets/products-gallery/${outName}`,
        thumb: `/assets/products-gallery/${thumbName}`,
        moq: "300 - 500 pcs",
        leadTime: "25-35 Days FOB Chittagong (BDCGP)",
        compliance: "Phytosanitary & Fumigation Certified",
        origin: "Kaunia, Rangpur & Dhaka, Bangladesh",
        featured: i < 12 // first 12 highlighted in hero slider
      });

      console.log(`[OK] (${i + 1}/${files.length}) ${info.title}`);
    } catch (err) {
      console.error(`Failed ${file}:`, err.message);
    }
  }

  // Write catalog to TypeScript data module in lib/productsData.ts & JSON in data/
  fs.writeFileSync(
    path.join(__dirname, '../data/full-catalog.json'),
    JSON.stringify(catalog, null, 2),
    'utf-8'
  );

  const tsContent = `// Auto-generated 52 Handcrafted Export Products Catalog
export interface ProductItem {
  id: string;
  slug: string;
  itemNo: string;
  title: string;
  category: string;
  material: string;
  structure: string;
  image: string;
  thumb: string;
  moq: string;
  leadTime: string;
  compliance: string;
  origin: string;
  featured: boolean;
}

export const ALL_PRODUCTS: ProductItem[] = ${JSON.stringify(catalog, null, 2)};
`;

  fs.writeFileSync(
    path.join(__dirname, '../lib/allProductsData.ts'),
    tsContent,
    'utf-8'
  );

  console.log(`Successfully generated lib/allProductsData.ts and data/full-catalog.json with ${catalog.length} items!`);
}

runEnhance().catch(console.error);
