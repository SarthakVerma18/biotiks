// XP Calculation
export function calculateXP(
  correct: number,
  total: number,
  timeBonus: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
  const baseXP = correct * 10;
  const accuracyBonus = total > 0 ? Math.round((correct / total) * 20) : 0;
  const speedBonus = Math.round(timeBonus * 0.5);
  return Math.round(
    (baseXP + accuracyBonus + speedBonus) * (difficultyMultiplier[difficulty] || 1)
  );
}

// Level Calculation
export function calculateLevel(xp: number): number {
  // Each level requires progressively more XP
  // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 450, etc.
  let level = 1;
  let threshold = 0;
  let increment = 100;
  while (xp >= threshold + increment) {
    threshold += increment;
    level++;
    increment = Math.round(increment * 1.5);
  }
  return level;
}

// XP needed for next level
export function xpForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  let threshold = 0;
  let increment = 100;
  while (currentXP >= threshold + increment) {
    threshold += increment;
    increment = Math.round(increment * 1.5);
  }
  const current = currentXP - threshold;
  return {
    current,
    needed: increment,
    progress: Math.round((current / increment) * 100),
  };
}

// Format time in seconds to mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Shuffle array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get today's date string
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Calculate streak
export function calculateStreak(lastPlayed: string | null, currentStreak: number): number {
  if (!lastPlayed) return 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = new Date(lastPlayed);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1; // Streak broken
}

// Score calculation
export function calculateScore(
  correct: number,
  total: number,
  timeLeftSeconds: number
): number {
  const accuracy = total > 0 ? correct / total : 0;
  const baseScore = correct * 100;
  const timeBonus = timeLeftSeconds * 2;
  const accuracyMultiplier = accuracy >= 0.8 ? 1.5 : accuracy >= 0.6 ? 1.2 : 1;
  return Math.round((baseScore + timeBonus) * accuracyMultiplier);
}

// Generate avatar from username
export function getAvatarUrl(username: string): string {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(username)}`;
}

// Topic display names
export const topicLabels: Record<string, string> = {
  cell_biology: 'Cell Biology',
  genetics: 'Genetics',
  ecology: 'Ecology',
  anatomy: 'Human Anatomy',
  evolution: 'Evolution',
  microbiology: 'Microbiology',
};

// Difficulty display
export const difficultyLabels: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
