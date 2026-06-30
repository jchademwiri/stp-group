import sharp from 'sharp';
import fs from 'fs';

const logoSvgPath = 'apps/stp/public/logo-white.svg';
const logoSvgContent = fs.readFileSync(logoSvgPath, 'utf8');

const images = [
  'dropside-truck.jpg',
  'septic-tank-truck.jpg',
  'utility-tractor.jpg',
  'ride-on-mower.jpg',
  'brush-cutter.jpg',
  'chainsaw.jpg',
  'tree-pruner.jpg'
];

async function applyWatermark(imageName) {
  const imagePath = `apps/stp/public/images/plant-hire/${imageName}`;
  const backupPath = `apps/stp/public/images/plant-hire/${imageName}.bak`;
  
  // Backup original if not already done
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(imagePath, backupPath);
  }
  
  const img = sharp(backupPath);
  const metadata = await img.metadata();
  
  const imgWidth = metadata.width;
  const imgHeight = metadata.height;
  
  // Logo aspect ratio is 162.89 / 60 = 2.7148
  const logoWidth = Math.round(imgWidth * 0.22); // 22% of image width
  const logoHeight = Math.round(logoWidth / 2.7148);
  
  // Insert width and height into the SVG tag
  const modifiedSvg = logoSvgContent.replace(
    '<svg ',
    `<svg width="${logoWidth}" height="${logoHeight}" `
  );
  
  // Position in bottom-right corner
  const padding = Math.round(imgWidth * 0.04); // 4% padding
  const left = imgWidth - logoWidth - padding;
  const top = imgHeight - logoHeight - padding;
  
  console.log(`Watermarking ${imageName} (${imgWidth}x${imgHeight}) with logo size ${logoWidth}x${logoHeight} at (${left}, ${top})...`);
  
  await img
    .composite([
      {
        input: Buffer.from(modifiedSvg),
        top: top,
        left: left,
      }
    ])
    .toFile(imagePath);
    
  console.log(`Saved watermarked ${imageName}`);
}

async function run() {
  for (const img of images) {
    try {
      await applyWatermark(img);
    } catch (e) {
      console.error(`Error watermarking ${img}:`, e);
    }
  }
}

run();
