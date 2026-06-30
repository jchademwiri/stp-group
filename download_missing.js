import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const images = {
  'chainsaw.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/23/STIHL_Chainsaw.jpg',
  'tree-pruner.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Fiskars_telescope_pruner.jpg'
};

async function download(url, outputPath) {
  console.log(`Downloading ${url} to ${outputPath}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const fileStream = fs.createWriteStream(outputPath);
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  console.log(`Finished downloading ${outputPath}`);
}

async function run() {
  for (const [filename, url] of Object.entries(images)) {
    const outputPath = `apps/stp/public/images/plant-hire/${filename}`;
    try {
      await download(url, outputPath);
    } catch (e) {
      console.error(`Error downloading ${filename}:`, e);
    }
  }
}

run();
