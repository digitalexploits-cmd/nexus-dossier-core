# Next 10 improvements — ranked

Ranked by combined impact on **appearance × function**, cost-aware (no hero image/video regeneration).

## 1. Mask the baked gibberish text on the rotunda hero
The current rotunda PNG has AI-hallucinated typography burned in ("SBLECT OIUFCTIVE", "BOHIGOMSEI", "MI SSION"). Since we can't swap the image, overlay a dark navy gradient scrim (bottom third) + a subtle vignette on the kiosk area to hide the illegible text while keeping the architecture and skyline readable. Purely additive CSS layers inside `Rotunda.tsx`.

## 2. Align kiosk zone labels to the actual baked doorways
The five zone hotspots (`pos: 0.08, 0.30, 0.58, 0.82, 0.97`) were calibrated to an earlier crop. Re-measure against the current image so the pulsing markers sit cleanly under each visible bay doorway on desktop **and** the mobile Arch-centered framing.

## 3. Shorten and smooth the bay transitions
5s cinematic transitions feel long on a second visit. Drop to 3.2s, keep the bookends, add an "already-seen" fast path (1.6s) using a `sessionStorage` flag so power users aren't blocked. Timing only — no video swaps.

## 4. Intro overlay: skip control + one-time autoplay
Add a persistent "Skip intro" button (visible after 800ms) and a `localStorage` flag so returning visitors bypass the flyby automatically with a two-tap re-play option in the TopBar.

## 5. TopBar mobile density
At 492px, the seven-icon nav row (Rotunda + 4 bays + Vault + Home) crowds the labels. Collapse labels below `sm`, keep icons only, expose full labels in a bottom sheet on tap-hold.

## 6. MediaConsole preview quality
PDF thumbnails and video posters currently render at low fidelity. Add first-frame video posters, `object-fit: cover` framing, and a lit gold border on hover. Add filter chips (Video · PDF · Image · Audio) for browsability.

## 7. Vault presentation
The Vault currently opens as a plain document shelf. Wrap it in the same `bay-depth-stage` treatment used in bays (gold seams, bokeh, film grain) so it feels like a sanctioned room, not a modal.

## 8. Bay canon content — reading rhythm
`ProposalWalkthrough`, `DecisionTimeline`, `CanonReference`, `PatchDiagram` all render as dense text blocks. Add tab-based section anchors, `premium-fade-in` on tab change, and a right-rail progress indicator so reviewers can scan bay content without scrolling blind.

## 9. Accessibility + focus discipline
Full pass: color contrast on `text-primary/70` on light overlays, `aria-live` on transition status, keyboard shortcuts (arrow keys already work in rotunda — publish them in a `?` help sheet), skip-link to `<main>`.

## 10. SEO + share metadata
Set a proper `<title>`, `<meta name="description">`, canonical URL, OG title/description, and JSON-LD `Organization` schema in `index.html`. No `og:image` regen — hosting adds one.

---

## Technical notes

- **1, 2, 5, 7:** CSS + component edits only. Zero asset spend.
- **3, 4:** Timing constants and one `localStorage` key each.
- **6:** Reuses existing `PdfThumb`/`VideoThumb` primitives; adds `<video preload="metadata">` for poster frames.
- **8:** Existing components in `src/components/nexus/`; refactor renders, keep content.
- **9:** Audit + additive; no structural changes.
- **10:** `index.html` head only.

Everything above is non-destructive to the hero images and videos.