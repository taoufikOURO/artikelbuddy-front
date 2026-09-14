import { WordOut } from './word.model';

export interface LevelProgress {
  level: string;
  total_words: number;
  mastered_words: number;
  in_progress_words: number;
  not_started_words: number;
  completion_ratio: number;
  level_completed: boolean;
  words_needed_to_complete: number;
  estimated_rushes_remaining: number;
  accuracy: number;
  total_rushes_played: number;
  last_rush_score: number | null;
  last_rush_at: string | null;
  best_rush_score: number | null;
  words_to_review: WordOut[];
}
