export interface WordQuestion {
  id: string;
  word: string;
  fr_translation: string | null;
  en_translation: string | null;
}

export interface WordOut {
  id: string;
  word: string;
  article: string;
  level: string | null;
  fr_translation: string | null;
  en_translation: string | null;
}

export interface WordWithProgress extends WordOut {
  correct_streak: number;
  mastered_at: string | null;
  total_attempts: number;
}

export interface WordListResponse {
  total: number;
  page: number;
  page_size: number;
  words: WordWithProgress[];
}
