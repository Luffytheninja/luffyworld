#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { statSync, existsSync, renameSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ASSET_DIR = join(ROOT, 'public/assets/3d');

const assets = [
  'sony_pvm-1341__sony_playstation.glb',
  'cyberpunk_laptop_concept_design.glb',
  'weed_joint.glb',
  'colossal_titan.glb',
  'walkman.glb',
  'moon_nonkey_nug.glb',
  'fender_bass_amp.glb',
  'marcelines_ax_bass.glb',
  'brutalist_interior.glb',
  'canon_at-1_retro_camera.glb',
  'attack_on_titan_gear_sword_-_low_poly.glb',
  'marlboro_pack_of_20_cigarettes.glb',
];

function human(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

const cli = spawnSync('gltf-transform', ['--version'], { encoding: 'utf-8' });
if (cli.status !== 0) {
  console.error('ERROR: gltf-transform CLI is not installed or not available in PATH.');
  console.error('Install @gltf-transform/cli (or provide Blender in PATH) and re-run this script.');
  process.exit(1);
}

const before = assets.map((name) => {
  const path = join(ASSET_DIR, name);
  return { name, path, size: statSync(path).size };
});

for (const asset of before) {
  const tmpPath = `${asset.path}.optimized`;
  const backupPath = `${asset.path}.bak`;

  const optimize = spawnSync(
    'gltf-transform',
    [
      'optimize',
      asset.path,
      tmpPath,
      '--compress',
      'draco',
      '--texture-compress',
      'webp',
      '--texture-size',
      '1024',
      '--meshopt',
    ],
    { stdio: 'inherit' },
  );

  if (optimize.status !== 0 || !existsSync(tmpPath)) {
    console.error(`Optimization failed for ${asset.name}`);
    process.exit(1);
  }

  copyFileSync(asset.path, backupPath);
  renameSync(tmpPath, asset.path);
}

const after = assets.map((name) => {
  const path = join(ASSET_DIR, name);
  return { name, path, size: statSync(path).size };
});

console.log('\nOptimization summary:');
for (let i = 0; i < before.length; i += 1) {
  const b = before[i];
  const a = after[i];
  const delta = b.size - a.size;
  const pct = (delta / b.size) * 100;
  console.log(`${b.name}: ${human(b.size)} -> ${human(a.size)} (${pct.toFixed(1)}% smaller)`);
}
