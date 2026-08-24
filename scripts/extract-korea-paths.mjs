import fs from 'node:fs';

const svg = fs.readFileSync('public/svg/south-korea.svg', 'utf8');
const paths = [...svg.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1]);

fs.writeFileSync('src/components/home/korea-map-paths.json', JSON.stringify(paths));
console.log(`extracted ${paths.length} paths`);
