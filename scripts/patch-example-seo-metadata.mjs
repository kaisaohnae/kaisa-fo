/**
 * Enhances example page metadata with buildPageMetadata + canonical/OG.
 * Run: node scripts/patch-example-seo-metadata.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/app/(example)/example');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'page.tsx') out.push(full);
  }
  return out;
}

const titleRe = /title:\s*'([^']+)'/;
const descRe = /description:\s*'([^']+)'/;

for (const file of walk(root)) {
  let source = fs.readFileSync(file, 'utf8');
  if (source.includes('buildPageMetadata(')) continue;

  const rel = path.relative(path.resolve('src/app'), file).replace(/\\/g, '/');
  const routePath = `/${rel.replace('/page.tsx', '').replace(/^\([^)]+\)\//, '')}/`;

  const titleMatch = source.match(titleRe);
  const descMatch = source.match(descRe);
  if (!titleMatch) {
    console.warn('skip (no title):', routePath);
    continue;
  }

  const title = titleMatch[1].replace(/'/g, "\\'");
  const description = (descMatch?.[1] ?? `${title} — Kaisa portfolio example`).replace(/'/g, "\\'");

  source = source.replace(/import type \{Metadata\} from 'next';\r?\n/, '');
  if (!source.includes("from '@/lib/seo'")) {
    const lines = source.split('\n');
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImport = i;
    }
    lines.splice(lastImport + 1, 0, "import {buildPageMetadata} from '@/lib/seo';");
    source = lines.join('\n');
  }

  source = source.replace(
    /export const metadata(?:: Metadata)?\s*=\s*\{[\s\S]*?\};/,
    `export const metadata = buildPageMetadata({ title: '${title}', description: '${description}', path: '${routePath}' });`,
  );

  fs.writeFileSync(file, source, 'utf8');
  console.log('updated', routePath);
}

console.log('done');
