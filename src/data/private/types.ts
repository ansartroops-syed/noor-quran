export type QuizDifficulty = "basic" | "medium" | "hard";

export interface PrivateQuestion {
  prompt: string;
  options: string[];
  answer: number;
  praise: string;
}

export interface PrivateLevel {
  id: string;
  number: number;
  difficulty: QuizDifficulty;
  title: string;
  emoji: string;
  color: string;
  intro: string;
  questions: PrivateQuestion[];
}

export const PRIVATE_DIFFICULTIES: Array<{
  id: QuizDifficulty;
  title: string;
  emoji: string;
  grades: string;
  blurb: string;
}> = [
  {
    id: "basic",
    title: "Basic",
    emoji: "🌱",
    grades: "Kindergarten – Grade 2",
    blurb: "Very easy. Level 1 is open, then Level 2 unlocks.",
  },
  {
    id: "medium",
    title: "Medium",
    emoji: "🌟",
    grades: "Grades 3 – 5",
    blurb: "Reading, tables, and reasoning. Level 1 is open.",
  },
  {
    id: "hard",
    title: "Hard",
    emoji: "🏆",
    grades: "Grades 6 – 7",
    blurb: "Tougher sums and careful facts. Level 1 is open.",
  },
];

export function gradeBandLabel(difficulty: QuizDifficulty): string {
  return PRIVATE_DIFFICULTIES.find((item) => item.id === difficulty)?.grades ?? "";
}
