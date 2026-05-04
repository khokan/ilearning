import { QuizHistoryEntry } from "@/types/iquiz.types";

const QUIZ_HISTORY_STORAGE_KEY = "ilearning.quiz.history";

const isBrowser = () => typeof window !== "undefined";

export const getQuizHistory = (): QuizHistoryEntry[] => {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(QUIZ_HISTORY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as QuizHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addQuizHistoryEntry = (entry: QuizHistoryEntry) => {
  if (!isBrowser()) {
    return;
  }

  const existing = getQuizHistory();
  const deduped = existing.filter((item) => item.id !== entry.id);
  const next = [entry, ...deduped].slice(0, 100);

  window.localStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, JSON.stringify(next));
};