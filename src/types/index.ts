export interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
  last_played: string | null;
  games_played: number;
  correct_answers: number;
  total_answers: number;
  created_at: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  mode: GameMode;
  score: number;
  xp_earned: number;
  correct: number;
  total: number;
  duration_seconds: number;
  completed_at: string;
}

export interface DailyScore {
  id: string;
  user_id: string;
  challenge_date: string;
  score: number;
  time_seconds: number;
}

export type GameMode = 'quick_play' | 'survival' | 'topic_challenge' | 'daily_challenge';

export type Topic = 'cell_biology' | 'genetics' | 'ecology' | 'anatomy' | 'evolution' | 'microbiology';

export interface GameState {
  mode: GameMode;
  topic?: Topic;
  questions: Question[];
  currentIndex: number;
  score: number;
  correct: number;
  lives: number;
  timeLeft: number;
  totalTime: number;
  isFinished: boolean;
  answers: (number | null)[];
  xpEarned: number;
}

export const TOPICS: { value: Topic; label: string; icon: string; color: string }[] = [
  { value: 'cell_biology', label: 'Cell Biology', icon: '🔬', color: '#00d4aa' },
  { value: 'genetics', label: 'Genetics', icon: '🧬', color: '#7c5cfc' },
  { value: 'ecology', label: 'Ecology', icon: '🌿', color: '#34d399' },
  { value: 'anatomy', label: 'Human Anatomy', icon: '🫀', color: '#f472b6' },
  { value: 'evolution', label: 'Evolution', icon: '🦕', color: '#fbbf24' },
  { value: 'microbiology', label: 'Microbiology', icon: '🦠', color: '#38bdf8' },
];

export const DIFFICULTY_COLORS = {
  easy: '#34d399',
  medium: '#fbbf24',
  hard: '#f87171',
};
