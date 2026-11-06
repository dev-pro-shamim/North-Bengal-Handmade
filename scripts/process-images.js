const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = 'C:/Users/DITS-USER/Videos/handmade product';
const outDir = path.join(__dirname, '../public/assets/products-gallery');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.match(/\.(jpe?g|png|webp)$/i));
console.log(`Found ${files.length} images to process from: ${srcDir}`);

async function process() {
  const catalog = [];
  
  for (let idx = 0; idx < files.length; idx++) {
    const file = files[idx];
    const srcPath = path.join(srcDir, file);
    const cleanId = `product-${String(idx + 1).padStart(2, '0')}`;
    const outName = `${cleanId}.jpg`;
    const thumbName = `${cleanId}-thumb.jpg`;
    const outPath = path.join(outDir, outName);
    const thumbPath = path.join(outDir, thumbName);

    try {
      const meta = await sharp(srcPath).metadata();
      
      // Let's do professional export enhancement:
      // 1. Auto-orient
      // 2. Normalize tone & enhance contrast (linear stretch / gamma adjustment)
      // 3. Modulate: increase saturation slightly (+10%) and brightness slightly if dim
      // 4. Sharpen (studio detail enhancement)
      // 5. Fit inside clean 1200x1200 with subtle studio background or clean white/neutral canvas
      
      // High-res enhanced version
      await sharp(srcPath)
        .rotate() // auto-orient
        .normalize() // stretch contrast
        .modulate({
          brightness: 1.04,
          saturation: 1.15
        })
        .sharpen({
          sigma: 1.2,
          m1: 1.0,
          m2: 2.0
        })
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(outPath);

      // Thumbnail version for gallery grids & fast load
      await sharp(srcPath)
        .rotate()
        .normalize()
        .modulate({
          brightness: 1.04,
          saturation: 1.15
        })
        .sharpen()
        .resize({
          width: 500,
          height: 500,
          fit: 'cover'
        })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(thumbPath);

      catalog.push({
        id: cleanId,
        index: idx + 1,
        originalName: file,
        image: `/assets/products-gallery/${outName}`,
        thumb: `/assets/products-gallery/${thumbName}`,
        width: meta.width,
        height: meta.height
      });

      console.log(`[${idx + 1}/${files.length}] Processed: ${file} -> ${outName}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  // Save metadata json
  fs.writeFileSync(
    path.join(__dirname, '../data/gallery-products.json'),
    JSON.stringify(catalog, null, 2),
    'utf-8'
  );
  console.log(`Saved catalog metadata to data/gallery-products.json with ${catalog.length} products.`);
}

process().catch(console.error);
