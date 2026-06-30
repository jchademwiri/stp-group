import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const USER_AGENT = 'STP-Group-Bot/1.0 (contact@stp-group.co.za) Bun/1.3.11';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

async function getImageUrl(searchQuery) {
  console.log(`Searching Wikimedia for "${searchQuery}"...`);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&srnamespace=6`;
  const searchResult = await fetchJson(searchUrl);
  const items = searchResult?.query?.search || [];
  if (items.length === 0) throw new Error(`No results for "${searchQuery}"`);

  // Get first item details
  const title = items[0].title;
  console.log(`Found file: ${title}`);
  const detailsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  const detailsResult = await fetchJson(detailsUrl);
  const pages = detailsResult?.query?.pages || {};
  const pageId = Object.keys(pages)[0];
  const url = pages[pageId]?.imageinfo?.[0]?.url;
  if (!url) throw new Error(`Could not find URL for ${title}`);
  return url;
}

async function download(url, outputPath) {
  console.log(`Downloading ${url} to ${outputPath}...`);
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const fileStream = fs.createWriteStream(outputPath);
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  console.log(`Successfully downloaded ${outputPath}`);
}

async function run() {
  try {
    const chainsawUrl = await getImageUrl('Stihl Chainsaw filetype:png|jpg|jpeg');
    await download(chainsawUrl, 'apps/stp/public/images/plant-hire/chainsaw.jpg');
  } catch (e) {
    console.error('Error fetching chainsaw:', e);
  }

  try {
    const prunerUrl = await getImageUrl('pole saw OR "pole pruner" filetype:png|jpg|jpeg');
    await download(prunerUrl, 'apps/stp/public/images/plant-hire/tree-pruner.jpg');
  } catch (e) {
    console.error('Error fetching tree pruner:', e);
  }
}

run();
