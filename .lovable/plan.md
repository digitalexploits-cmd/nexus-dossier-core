## Goal
Reduce the visual noise layered over the rotunda hero so the Arch, stadium, and console read clearly. Current overlays (sky clouds, sun/moon disk, foliage, wet-glass reflection) are stacking on top of the baked-in artwork and creating a hazy, "reflection-y" look.

## Changes

1. **`src/components/nexus/SkyOverlay.tsx`** — tone the sky pass down so it enhances rather than washes out the artwork:
   - Drop cloud opacity ceiling from `0.95` to ~`0.35` (base `0.10 + cover * 0.25`).
   - Remove the sun/moon disk (it reads as a smudge over the baked sky).
   - Reduce condition tint alpha across the board (roughly halve each value; clear day ≈ `0.05`).
   - Shrink overlay height from `58%` to ~`38%` so it stays above the horizon and never touches the Arch / interior.
   - Switch blend from `mix-blend-screen` to `mix-blend-soft-light` for a gentler pass.
   - Keep stars, rain, and storm flash but lower their opacity ~40%.

2. **`src/components/nexus/FoliageOverlay.tsx`** — calm the leaf clusters:
   - Lower default `opacity` prop from `0.92` to `0.55` and drop the per-leaf drop-shadow to a much softer one.
   - Reduce leaf count per cluster from 4 to 3 and shrink sizes ~15%.

3. **`src/components/nexus/Rotunda.tsx`** — remove the wet-glass reflection layer (or gate it to only show during active rain with `opacity <= 0.15`). This is the "reflection interfering with clarity" the user is describing. Also lower the default foliage opacity passed in to match the new baseline.

## Out of scope
No changes to the hero image itself, the console, bay tiles, weather fetching logic, or adaptive lighting math — only overlay opacities, sizes, and blend modes.
