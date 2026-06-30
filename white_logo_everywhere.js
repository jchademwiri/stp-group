import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import sharp from 'sharp';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const logoSvgPath = 'apps/stp/public/logo-white.svg';

const tasks = [
  {
    name: 'dropside-truck.jpg',
    type: 'copy',
    src: 'C:\\Users\\Accounts Manager\\.gemini\\antigravity-cli\\brain\\2a3ddb02-cfb0-4fdc-8cf4-50da31a73b48\\dropside_truck_1782805834358.jpg'
  },
  {
    name: 'septic-tank-truck.jpg',
    type: 'copy',
    src: 'C:\\Users\\Accounts Manager\\.gemini\\antigravity-cli\\brain\\2a3ddb02-cfb0-4fdc-8cf4-50da31a73b48\\septic_tank_truck_1782805848464.jpg'
  },
  {
    name: 'ride-on-mower.jpg',
    type: 'copy',
    src: 'C:\\Users\\Accounts Manager\\.gemini\\antigravity-cli\\brain\\2a3ddb02-cfb0-4fdc-8cf4-50da31a73b48\\ride_on_mower_1782805904732.jpg'
  },
  {
    name: 'brush-cutter.jpg',
    type: 'copy',
    src: 'C:\\Users\\Accounts Manager\\.gemini\\antigravity-cli\\brain\\2a3ddb02-cfb0-4fdc-8cf4-50da31a73b48\\brush_cutter_1782805915982.jpg'
  },
  {
    name: 'chainsaw.jpg',
    type: 'download',
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Stihl_MS_192C_chainsaw_20190326.jpg'
  },
  {
    name: 'tree-pruner.jpg',
    type: 'download',
    src: 'https://www.coopsuperstores.ie/cdn/shop/files/1971168_2.jpg?v=1728505207&width=1500'
  },
  {
    name: 'utility-tractor.jpg',
    type: 'download',
    src: 'https://www.rdoequipment.com.au/wp-content/uploads/2023/08/Howard-Nugget-NUG150-Tractor-Slasher-2.jpg'
  },
  {
    name: 'bobcat.jpg',
    type: 'git-restore'
  }
];

async function download(url, outputPath) {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const fileStream = fs.createWriteStream(outputPath);
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  console.log(`Downloaded ${outputPath}`);
}

async function applyWatermark(imagePath) {
  console.log(`Applying white watermark to ${imagePath}...`);
  const logoSvgContent = fs.readFileSync(logoSvgPath, 'utf8');
  
  const img = sharp(imagePath);
  const metadata = await img.metadata();
  
  const imgWidth = metadata.width;
  const imgHeight = metadata.height;
  
  // Logo aspect ratio is 162.89 / 60 = 2.7148
  const logoWidth = Math.round(imgWidth * 0.08); // 8% of image width
  const logoHeight = Math.round(logoWidth / 2.7148);
  
  // Insert width and height into the SVG tag
  const modifiedSvg = logoSvgContent.replace(
    '<svg ',
    `<svg width="${logoWidth}" height="${logoHeight}" `
  );
  
  // Position with 12% bottom padding, 5% right padding
  const paddingX = Math.round(imgWidth * 0.05);
  const paddingY = Math.round(imgHeight * 0.12);
  const left = imgWidth - logoWidth - paddingX;
  const top = imgHeight - logoHeight - paddingY;
  
  const tempPath = imagePath + '.tmp';
  await img
    .composite([
      {
        input: Buffer.from(modifiedSvg),
        top: top,
        left: left,
      }
    ])
    .toFile(tempPath);
    
  fs.renameSync(tempPath, imagePath);
  console.log(`Successfully watermarked ${imagePath}`);
}

async function run() {
  const destDir = 'apps/stp/public/images/plant-hire/';
  
  for (const task of tasks) {
    const outputPath = destDir + task.name;
    
    // Step 1: Restore clean image
    if (task.type === 'copy') {
      console.log(`Copying clean ${task.name} from ${task.src}...`);
      fs.copyFileSync(task.src, outputPath);
    } else if (task.type === 'download') {
      await download(task.src, outputPath);
    } else if (task.type === 'git-restore') {
      console.log(`Restoring original ${task.name} via Git...`);
      try {
        const { execSync } = await import('child_process');
        execSync(`git restore ${outputPath}`);
      } catch (err) {
        console.warn(`Git restore failed for ${task.name}, using existing file`);
      }
    }
    
    // Step 2: Apply watermark
    try {
      await applyWatermark(outputPath);
    } catch (e) {
      console.error(`Error watermarking ${task.name}:`, e);
    }
  }
  
  console.log('All watermarking complete!');
}

run();
