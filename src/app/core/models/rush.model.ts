import { WordOut, WordQuestion } from './word.model';

export interface RushWords {
  rush_id: string;
  words: WordQuestion[];
}

export interface AttemptCreate {
  rush_id: string;
  word_id: string;
  proposed_article: string;
}

export interface AttemptResult {
  word_id: string;
  correct_article: string;
  is_correct: boolean;
}

export interface RushSummary {
  rush_id: string;
  score: number;
  total_words: number;
  correct_words: number;
  words_to_review: WordOut[];
}
