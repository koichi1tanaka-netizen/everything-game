export type ChallengeResult = "perfect" | "good" | "miss";

export const RESULT_MULTIPLIER: Record<ChallengeResult, number> = {
  perfect: 1.5,
  good: 1,
  miss: 0.6,
};

export const RESULT_LABEL: Record<ChallengeResult, string> = {
  perfect: "Perfect! 🎯",
  good: "Nice! 👍",
  miss: "Just okay...",
};

export const RESULT_COLOR: Record<ChallengeResult, string> = {
  perfect: "bg-mint/30",
  good: "bg-sky/30",
  miss: "bg-bubblegum/30",
};