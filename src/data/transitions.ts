// Shuffle pool of cinematic transition pieces played between rooms.
// Each video is treated as its own immersive experience — the transit runs
// for the clip's natural duration (capped at 30s) so the piece plays through.

export interface TransitionPiece {
  id: string;
  /** Optional video URL (mp4). Preferred when present. */
  video?: string;
  /** Optional still image URL. Used when no video, or as poster. */
  image?: string;
  /** Optional short label shown under the destination code, for flavor. */
  tag?: string;
  /** Runtime in ms. Videos should set their true clip length (capped 30s). */
  durationMs?: number;
}

const STILL_DURATION_MS = 5000;
const MAX_TRANSIT_MS = 30000;

export const TRANSITION_POOL: TransitionPiece[] = [



  {
    id: "arch-approach-1",
    video: "/__l5e/assets-v1/29ae399e-c1e5-4576-9ca5-f156c780d5f1/grok_video_2026-07-14-17-30-48.mp4",
    tag: "GATEWAY · APPROACH",
    durationMs: 6000,
  },
  {
    id: "arch-approach-2",
    video: "/__l5e/assets-v1/319d60ea-3f7a-4bee-a1b4-1380e1d1b856/grok_video_2026-07-20-16-11-58.mp4",
    tag: "GATEWAY · RISE",
    durationMs: 10000,
  },
  {
    id: "rig-pulse",
    video: "/__l5e/assets-v1/79923186-a9fc-4fe1-9081-65053a26d215/transition-rig.mp4",
    tag: "COMPUTE · IGNITION",
    durationMs: 5000,
  },
  {
    id: "salute-orbit",
    video: "/__l5e/assets-v1/65ee462e-0ebb-4229-882a-75fa94d348b1/transition-salute.mp4",
    tag: "STANDARD · SALUTE",
    durationMs: 5000,
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

/** Effective transit duration for a piece, in ms. Videos use their own runtime (capped 30s). */
export function transitionDuration(piece: TransitionPiece): number {
  const d = piece.durationMs ?? STILL_DURATION_MS;
  return Math.max(2400, Math.min(MAX_TRANSIT_MS, d));
}

/** When the underlying view should be swapped in behind the transit overlay. */
export function transitionSwapMs(piece: TransitionPiece): number {
  // Swap early — around 30% in, clamped so long clips still reveal the room quickly.
  const d = transitionDuration(piece);
  return Math.round(Math.max(1500, Math.min(3200, d * 0.3)));
}
