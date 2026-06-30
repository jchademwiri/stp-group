import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { execSync } from 'child_process';

const USER_AGENT = 'STP-Group-Bot/1.0 (contact@stp-group.co.za) Bun/1.3.11';
const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Cattle_egret_following_tractor_slasher_7th_Brigade_Park_Chermside_P1020951.jpg';
const targetPath = 'apps/stp/public/images/plant-hire/utility-tractor.jpg';
const backupPath = 'apps/stp/public/images/plant-hire/utility-tractor.jpg.bak';

async function download(url, outputPath) {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const fileStream = fs.createWriteStream(outputPath);
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  console.log(`Successfully downloaded to ${outputPath}`);
}

async function run() {
  try {
    // Delete existing backup so watermark script backs up the new image
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      console.log(`Deleted old backup: ${backupPath}`);
    }
    
    await download(imageUrl, targetPath);
    
    // Run the watermarking script to watermark it
    console.log('Running watermark script for utility-tractor.jpg...');
    execSync('bun watermark.js', { stdio: 'inherit' });
    console.log('Done!');
  } catch (e) {
    console.error('Error during download/watermark:', e);
  }
}

run();
