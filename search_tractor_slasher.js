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

  // Print first 3 results to choose
  for (let i = 0; i < Math.min(items.length, 3); i++) {
    console.log(`Result ${i}: ${items[i].title}`);
  }

  const title = items[0].title;
  const detailsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  const detailsResult = await fetchJson(detailsUrl);
  const pages = detailsResult?.query?.pages || {};
  const pageId = Object.keys(pages)[0];
  const url = pages[pageId]?.imageinfo?.[0]?.url;
  if (!url) throw new Error(`Could not find URL for ${title}`);
  return url;
}

async function run() {
  const queries = [
    'tractor slasher',
    'tractor rotary cutter',
    'tractor grass mowing',
    'rotary slasher tractor'
  ];

  for (const q of queries) {
    try {
      const url = await getImageUrl(q);
      console.log(`Successfully found url for query "${q}": ${url}\n`);
    } catch (e) {
      console.log(`Failed query "${q}": ${e.message}\n`);
    }
  }
}

run();
