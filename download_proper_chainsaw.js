import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const USER_AGENT = 'STP-Group-Bot/1.0 (contact@stp-group.co.za) Bun/1.3.11';
const targetPath = 'apps/stp/public/images/plant-hire/chainsaw.jpg';
const backupPath = 'apps/stp/public/images/plant-hire/chainsaw.jpg.bak';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

async function getImageUrl() {
  // Search for Stihl MS chainsaw images
  const query = 'Stihl MS chainsaw';
  console.log(`Searching Wikimedia for "${query}"...`);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srnamespace=6`;
  const searchResult = await fetchJson(searchUrl);
  const items = searchResult?.query?.search || [];
  if (items.length === 0) throw new Error(`No results for "${query}"`);

  // Log first few items
  for (let i = 0; i < Math.min(items.length, 5); i++) {
    console.log(`Candidate ${i}: ${items[i].title}`);
  }

  // Find a good candidate that doesn't mention "museum" or "exhibition"
  let chosenItem = items[0];
  for (const item of items) {
    const titleLower = item.title.toLowerCase();
    if (!titleLower.includes('museum') && !titleLower.includes('exhib') && !titleLower.includes('old') && !titleLower.includes('vintage')) {
      chosenItem = item;
      break;
    }
  }

  const title = chosenItem.title;
  console.log(`Chose file: ${title}`);
  const detailsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  const detailsResult = await fetchJson(detailsUrl);
  const pages = detailsResult?.query?.pages || {};
  const pageId = Object.keys(pages)[0];
  const url = pages[pageId]?.imageinfo?.[0]?.url;
  if (!url) throw new Error(`Could not find URL for ${title}`);
  return url;
}

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
    // Delete existing backup so it gets re-watermarked correctly
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      console.log(`Deleted backup: ${backupPath}`);
    }

    const url = await getImageUrl();
    await download(url, targetPath);
    console.log('Chainsaw image updated!');
  } catch (e) {
    console.error('Error:', e);
  }
}

run();
