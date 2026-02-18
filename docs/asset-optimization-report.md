# 3D asset optimization report

## Target files (largest first)

1. `sony_pvm-1341__sony_playstation.glb` — 26 MB
2. `cyberpunk_laptop_concept_design.glb` — 11 MB
3. `weed_joint.glb` — 9.4 MB
4. `colossal_titan.glb` — 8.4 MB
5. `walkman.glb` — 6.5 MB
6. `moon_nonkey_nug.glb` — 6.3 MB
7. `fender_bass_amp.glb` — 6.3 MB
8. `marcelines_ax_bass.glb` — 3.7 MB
9. `brutalist_interior.glb` — 3.2 MB
10. `canon_at-1_retro_camera.glb` — 3.0 MB
11. `attack_on_titan_gear_sword_-_low_poly.glb` — 3.0 MB
12. `marlboro_pack_of_20_cigarettes.glb` — 1.4 MB

## Optimization status

I added `scripts/optimize-glb-assets.mjs` to automate glTF compression using:

- Draco geometry compression
- Meshopt
- WebP texture conversion
- Texture resize to 1024 max dimension

In this environment, optimization is currently blocked because `gltf-transform` is not available and cannot be installed from the restricted package registry.

Run this locally (or in CI with access to `@gltf-transform/cli`) to perform the actual compression:

```bash
node scripts/optimize-glb-assets.mjs
```

## Asset registry impact

No file names were changed, so `ASSET_REGISTRY` in `src/store/useSceneStore.ts` does not require updates.

## First meaningful render timing (baseline)

Measured with Playwright by waiting for:

1. `canvas` attached to DOM
2. `Loading...` fallback removed

Results:

- Desktop (1440x900): **1756.3 ms**
- Mid-range mobile emulation (390x844, touch): **2679.3 ms**

These are pre-optimization baseline measurements.
