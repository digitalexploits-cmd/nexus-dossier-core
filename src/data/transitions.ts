// Shuffle pool of cinematic transition pieces played between rooms.
// Add new items here — the transition system picks one at random per navigation.
// Target library size: ~12 pieces (mix of stills and short videos).

export interface TransitionPiece {
  id: string;
  /** Optional video URL (mp4). Preferred when present. */
  video?: string;
  /** Optional still image URL. Used when no video, or as poster. */
  image?: string;
  /** Optional short label shown under the destination code, for flavor. */
  tag?: string;
}

export const TRANSITION_POOL: TransitionPiece[] = [
  {
    id: "fireworks-4th",
    video: "/__l5e/assets-v1/df935555-91eb-4b14-96e9-695bf71e9c43/Best_July_4_Vid.mp4",
    tag: "INDEPENDENCE · FLARE",
  },
  {
    id: "arch-approach-1",
    video: "/__l5e/assets-v1/29ae399e-c1e5-4576-9ca5-f156c780d5f1/grok_video_2026-07-14-17-30-48.mp4",
    tag: "GATEWAY · APPROACH",
  },
  {
    id: "arch-approach-2",
    video: "/__l5e/assets-v1/319d60ea-3f7a-4bee-a1b4-1380e1d1b856/grok_video_2026-07-20-16-11-58.mp4",
    tag: "GATEWAY · RISE",
  },

  // Legacy still-image approaches — kept in rotation until the video library reaches 12.
  { id: "still-rotunda",    image: "/media/transitions/transition-rotunda.jpg",    tag: "ATRIUM APPROACH" },
  { id: "still-mission",    image: "/media/transitions/transition-mission.jpg",    tag: "N/NE VECTOR" },
  { id: "still-technical",  image: "/media/transitions/transition-technical.jpg",  tag: "E SIGHTLINE" },
  { id: "still-capability", image: "/media/transitions/transition-capability.jpg", tag: "SE PATHWAY" },
  { id: "still-operations", image: "/media/transitions/transition-operations.jpg", tag: "SW OVERWATCH" },
  { id: "still-vault",      image: "/media/transitions/transition-vault.jpg",      tag: "SUB-LEVEL CORRIDOR" },
];

export function pickTransition(): TransitionPiece {
  return TRANSITION_POOL[Math.floor(Math.random() * TRANSITION_POOL.length)];
}
