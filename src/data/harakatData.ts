export interface HarakatLesson {
  id: string;
  title: string;
  arabicName: string;
  symbol: string;
  description: string;
  soundRule: string;
  visualColor: string;
  examples: {
    letter: string;
    arabic: string;
    transliteration: string;
    englishHint: string;
    audioText: string;
  }[];
  practiceWords: {
    word: string;
    breakdown: string;
    transliteration: string;
    meaning: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const HARAKAT_LESSONS: HarakatLesson[] = [
  {
    id: "fatha",
    title: "Fatha (Short Vowel 'a')",
    arabicName: "فَتْحَة",
    symbol: "ـَ",
    description: "A small diagonal stroke placed ABOVE a letter. It produces a short, crisp 'a' sound (like 'u' in 'cup' or 'a' in 'cat').",
    soundRule: "Open your mouth slightly in a neutral smile. Duration: 1 count.",
    visualColor: "text-amber-500",
    examples: [
      { letter: "ب", arabic: "بَ", transliteration: "Ba", englishHint: "B + short 'a'", audioText: "Ba" },
      { letter: "ت", arabic: "تَ", transliteration: "Ta", englishHint: "T + short 'a'", audioText: "Ta" },
      { letter: "ث", arabic: "ثَ", transliteration: "Tha", englishHint: "Th + short 'a'", audioText: "Tha" },
      { letter: "ج", arabic: "جَ", transliteration: "Ja", englishHint: "J + short 'a'", audioText: "Ja" },
      { letter: "د", arabic: "دَ", transliteration: "Da", englishHint: "D + short 'a'", audioText: "Da" },
      { letter: "ر", arabic: "رَ", transliteration: "Ra", englishHint: "Heavy R + short 'a'", audioText: "Ra" },
    ],
    practiceWords: [
      { word: "دَرَسَ", breakdown: "دَ + رَ + سَ", transliteration: "Darasa", meaning: "He studied" },
      { word: "كَتَبَ", breakdown: "كَ + تَ + بَ", transliteration: "Kataba", meaning: "He wrote" },
      { word: "ذَهَبَ", breakdown: "ذَ + هَـ + بَ", transliteration: "Dhahaba", meaning: "He went" },
      { word: "خَلَقَ", breakdown: "خَ + لَ + قَ", transliteration: "Khalaqa", meaning: "He created" },
    ],
    quiz: [
      {
        question: "Where is the Fatha symbol placed on an Arabic letter?",
        options: ["Above the letter", "Below the letter", "After the letter", "Inside the letter"],
        correctIndex: 0,
        explanation: "Fatha (ـَ) is always drawn as a diagonal slash ABOVE the letter.",
      },
      {
        question: "What sound does Fatha make?",
        options: ["Short 'i' as in sit", "Short 'u' as in put", "Short 'a' as in run", "Long 'ee' as in see"],
        correctIndex: 2,
        explanation: "Fatha represents the short 'a' vowel.",
      },
    ],
  },
  {
    id: "kasra",
    title: "Kasra (Short Vowel 'i')",
    arabicName: "كَسْرَة",
    symbol: "ـِ",
    description: "A small diagonal stroke placed BELOW a letter. It produces a short 'i' sound (like 'i' in 'pin' or 'sit').",
    soundRule: "Lower your jaw slightly without stretching the mouth. Duration: 1 count.",
    visualColor: "text-blue-500",
    examples: [
      { letter: "ب", arabic: "بِ", transliteration: "Bi", englishHint: "B + short 'i'", audioText: "Bi" },
      { letter: "ت", arabic: "تِ", transliteration: "Ti", englishHint: "T + short 'i'", audioText: "Ti" },
      { letter: "ج", arabic: "جِ", transliteration: "Ji", englishHint: "J + short 'i'", audioText: "Ji" },
      { letter: "س", arabic: "سِ", transliteration: "Si", englishHint: "S + short 'i'", audioText: "Si" },
      { letter: "م", arabic: "مِ", transliteration: "Mi", englishHint: "M + short 'i'", audioText: "Mi" },
      { letter: "ل", arabic: "لِ", transliteration: "Li", englishHint: "L + short 'i'", audioText: "Li" },
    ],
    practiceWords: [
      { word: "عَلِمَ", breakdown: "عَ + لِ + مَ", transliteration: "'Alima", meaning: "He knew" },
      { word: "سَمِعَ", breakdown: "سَ + مِ + عَ", transliteration: "Sami'a", meaning: "He heard" },
      { word: "رَبِّ", breakdown: "رَ + بِّ", transliteration: "Rabbi", meaning: "My Lord" },
      { word: "حَمِدَ", breakdown: "حَ + مِ + دَ", transliteration: "Hamida", meaning: "He praised" },
    ],
    quiz: [
      {
        question: "Where is Kasra placed relative to the letter?",
        options: ["Directly beneath the letter", "Above the letter", "To the right", "At the end of line"],
        correctIndex: 0,
        explanation: "Kasra (ـِ) is always positioned BELOW the letter.",
      },
    ],
  },
  {
    id: "damma",
    title: "Damma (Short Vowel 'u')",
    arabicName: "ضَمَّة",
    symbol: "ـُ",
    description: "A miniature Waw symbol placed ABOVE a letter. It makes a short 'u' sound (like 'u' in 'pull' or 'oo' in 'book').",
    soundRule: "Round your lips forward slightly into a circle. Duration: 1 count.",
    visualColor: "text-emerald-500",
    examples: [
      { letter: "ب", arabic: "بُ", transliteration: "Bu", englishHint: "B + short 'u'", audioText: "Bu" },
      { letter: "ت", arabic: "تُ", transliteration: "Tu", englishHint: "T + short 'u'", audioText: "Tu" },
      { letter: "ر", arabic: "رُ", transliteration: "Ru", englishHint: "R + short 'u'", audioText: "Ru" },
      { letter: "ك", arabic: "كُ", transliteration: "Ku", englishHint: "K + short 'u'", audioText: "Ku" },
      { letter: "ن", arabic: "نُ", transliteration: "Nu", englishHint: "N + short 'u'", audioText: "Nu" },
      { letter: "هـ", arabic: "هُ", transliteration: "Hu", englishHint: "H + short 'u'", audioText: "Hu" },
    ],
    practiceWords: [
      { word: "كُتِبَ", breakdown: "كُ + تِ + بَ", transliteration: "Kutiba", meaning: "It was prescribed" },
      { word: "رُسُل", breakdown: "رُ + سُ + لُ", transliteration: "Rusul", meaning: "Messengers" },
      { word: "قُلْ", breakdown: "قُ + لْ", transliteration: "Qul", meaning: "Say" },
      { word: "نُور", breakdown: "نُ + و + ر", transliteration: "Noor", meaning: "Light" },
    ],
    quiz: [
      {
        question: "Which Harakah resembles a tiny Waw (و) above the letter?",
        options: ["Damma", "Fatha", "Kasra", "Sukoon"],
        correctIndex: 0,
        explanation: "Damma (ـُ) resembles a mini Waw above the letter and sounds like 'u'.",
      },
    ],
  },
  {
    id: "tanween",
    title: "Tanween (Nunation - Double Vowels)",
    arabicName: "تَنْوِين",
    symbol: "ـً ـٍ ـٌ",
    description: "Doubling of vowels at the end of nouns that adds an unwritten 'n' sound: Fathatayn (-an), Kasratayn (-in), Dammatayn (-un).",
    soundRule: "Add a crisp 'N' sound to the vowel without drawing out the vowel.",
    visualColor: "text-purple-500",
    examples: [
      { letter: "ب", arabic: "بًا", transliteration: "Ban", englishHint: "Fathatayn: 'an'", audioText: "Ban" },
      { letter: "ب", arabic: "بٍ", transliteration: "Bin", englishHint: "Kasratayn: 'in'", audioText: "Bin" },
      { letter: "ب", arabic: "بٌ", transliteration: "Bun", englishHint: "Dammatayn: 'un'", audioText: "Bun" },
      { letter: "ك", arabic: "كِتَابٌ", transliteration: "Kitaabun", englishHint: "A book (indefinite)", audioText: "Kitaabun" },
      { letter: "ع", arabic: "عَلِيمًا", transliteration: "'Aleeman", englishHint: "All-Knowing", audioText: "'Aleeman" },
    ],
    practiceWords: [
      { word: "أَحَدٌ", breakdown: "أَ + حَ + دٌ", transliteration: "Ahadun", meaning: "One / Unique" },
      { word: "غَفُورٌ", breakdown: "غَ + فُو + رٌ", transliteration: "Ghafoorun", meaning: "All-Forgiving" },
      { word: "رَحِيمًا", breakdown: "رَ + حِي + مًا", transliteration: "Raheeman", meaning: "Merciful" },
      { word: "خَيْرٍ", breakdown: "خَيْ + رٍ", transliteration: "Khayrin", meaning: "Goodness" },
    ],
    quiz: [
      {
        question: "What extra letter sound is added by Tanween?",
        options: ["Noon (N)", "Meem (M)", "Alif (A)", "Waw (W)"],
        correctIndex: 0,
        explanation: "Tanween produces a hidden 'N' sound (Nunation) at word endings.",
      },
    ],
  },
  {
    id: "sukoon",
    title: "Sukoon (Rest / Vowelless Stop)",
    arabicName: "سُكُون",
    symbol: "ـْ",
    description: "A small circle or crescent placed above a letter, indicating that the letter has NO vowel sound and is pronounced with a complete rest/stop.",
    soundRule: "Connect previous vowelled letter straight into this consonant without any trailing 'a', 'i', or 'u'.",
    visualColor: "text-indigo-500",
    examples: [
      { letter: "ب", arabic: "أَبْ", transliteration: "Ab", englishHint: "A + rest on B", audioText: "Ab" },
      { letter: "ت", arabic: "أَتْ", transliteration: "At", englishHint: "A + rest on T", audioText: "At" },
      { letter: "ل", arabic: "قُلْ", transliteration: "Qul", englishHint: "Qu + rest on L", audioText: "Qul" },
      { letter: "م", arabic: "أَمْ", transliteration: "Am", englishHint: "A + rest on M", audioText: "Am" },
    ],
    practiceWords: [
      { word: "أَنْعَمْتَ", breakdown: "أَنْ + عَمْ + تَ", transliteration: "An'amta", meaning: "You have bestowed favor" },
      { word: "يَعْلَمُ", breakdown: "يَعْ + لَ + مُ", transliteration: "Ya'lamu", meaning: "He knows" },
      { word: "مَسْجِد", breakdown: "مَسْ + جِ + د", transliteration: "Masjid", meaning: "Mosque" },
    ],
    quiz: [
      {
        question: "What does Sukoon (ـْ) indicate on a letter?",
        options: ["No vowel sound / consonant stop", "A long 'oo' sound", "Doubled letter", "Whispered silence"],
        correctIndex: 0,
        explanation: "Sukoon denotes the absence of any vowel on that consonant.",
      },
    ],
  },
  {
    id: "shaddah",
    title: "Shaddah (Letter Doubling / Emphasis)",
    arabicName: "شَدَّة",
    symbol: "ـّ",
    description: "A tiny 'w' shaped mark above a letter indicating that the letter is pronounced TWICE: first with a Sukoon (rest), then with the attached vowel.",
    soundRule: "Press and hold the letter momentarily before releasing its vowel. (1st letter has Sukoon, 2nd letter has Harakah).",
    visualColor: "text-rose-500",
    examples: [
      { letter: "ب", arabic: "رَبَّ", transliteration: "Rabba (Rab + ba)", englishHint: "Double B with Fatha", audioText: "Rabba" },
      { letter: "م", arabic: "ثُمَّ", transliteration: "Thumma (Thum + ma)", englishHint: "Double M with Ghunnah", audioText: "Thumma" },
      { letter: "ن", arabic: "إِنَّ", transliteration: "Inna (In + na)", englishHint: "Double N with Ghunnah", audioText: "Inna" },
      { letter: "ل", arabic: "اللَّه", transliteration: "Allah (Al + lah)", englishHint: "Double L in Allah", audioText: "Allah" },
    ],
    practiceWords: [
      { word: "إِيَّاكَ", breakdown: "إِيْ + يَا + كَ", transliteration: "Iyyaka", meaning: "You alone" },
      { word: "الرَّحْمَن", breakdown: "أَرْ + رَحْ + مَان", transliteration: "Ar-Rahmaan", meaning: "The Most Gracious" },
      { word: "جَنَّة", breakdown: "جَنْ + نَة", transliteration: "Jannah", meaning: "Paradise Garden" },
    ],
    quiz: [
      {
        question: "How is a letter with a Shaddah (ـّ) pronounced?",
        options: ["Doubled (first stopped, then vowelled)", "Whispered softly", "Skipped completely", "Elongated for 6 seconds"],
        correctIndex: 0,
        explanation: "Shaddah combines two identical letters: first silent/held, second vowelled.",
      },
    ],
  },
  {
    id: "madd_asli",
    title: "Madd Asli (Natural Long Vowels)",
    arabicName: "مَدّ أَصْلِي",
    symbol: "ـَا  ـِي  ـُو",
    description: "The natural elongation of short vowels for exactly 2 counts (harakat) using Alif, Yaa, or Waw.",
    soundRule: "Hold the vowel for 2 natural beats (opening/closing of a finger).",
    visualColor: "text-teal-500",
    examples: [
      { letter: "ا", arabic: "قَالَ", transliteration: "Qaala (Fatha + Alif)", englishHint: "Long 'aa' (2 counts)", audioText: "Qaala" },
      { letter: "ي", arabic: "قِيلَ", transliteration: "Qeela (Kasra + Yaa)", englishHint: "Long 'ee' (2 counts)", audioText: "Qeela" },
      { letter: "و", arabic: "يَقُولُ", transliteration: "Yaqoolu (Damma + Waw)", englishHint: "Long 'oo' (2 counts)", audioText: "Yaqoolu" },
    ],
    practiceWords: [
      { word: "كِتَاب", breakdown: "كِ + تَا + ب", transliteration: "Kitaab", meaning: "Book" },
      { word: "عَلِيم", breakdown: "عَ + لِي + م", transliteration: "'Aleem", meaning: "All-Knowing" },
      { word: "غَفُور", breakdown: "غَ + فُو + ر", transliteration: "Ghafoor", meaning: "All-Forgiving" },
    ],
    quiz: [
      {
        question: "How many counts/beats should a Madd Asli (Natural Madd) be held?",
        options: ["2 counts", "1 count", "4 counts", "6 counts"],
        correctIndex: 0,
        explanation: "Natural Madd (Madd Asli) is held for exactly 2 counts.",
      },
    ],
  },
];
