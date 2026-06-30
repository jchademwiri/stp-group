import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const urls = [
  'https://images.unsplash.com/photo-1546483875-ad90e4787ee6?q=80&w=800&auto=format&fit=crop', // chainsaw
  'https://images.unsplash.com/photo-1589051030489-2b4915b166e5?q=80&w=800&auto=format&fit=crop', // garden/branches
  'https://upload.wikimedia.org/wikipedia/commons/e/ed/Stihl_MS260.jpg', // wikimedia stihl
  'https://upload.wikimedia.org/wikipedia/commons/a/af/Telescope_pole_saw.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6c/Limb_cutting_with_pole_saw.jpg'
];

async function checkUrl(url, i) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`URL ${i}: ${url} -> Status: ${res.status}`);
  } catch (e) {
    console.log(`URL ${i}: ${url} -> Error: ${e.message}`);
  }
}

async function run() {
  for (let i = 0; i < urls.length; i++) {
    await checkUrl(urls[i], i);
  }
}

run();
