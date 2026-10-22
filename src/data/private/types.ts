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

export const PRIVATE_DIFFICULTIES: Array<{ id: QuizDifficulty; title: string; emoji: string; blurb: string }> = [
  { id: "basic", title: "Basic", emoji: "🌱", blurb: "Level 1 is open. Pass it to open Level 2." },
  { id: "medium", title: "Medium", emoji: "🌟", blurb: "Level 1 is open on its own." },
  { id: "hard", title: "Hard", emoji: "🏆", blurb: "Level 1 is open. Later levels stay locked until you pass." },
];
