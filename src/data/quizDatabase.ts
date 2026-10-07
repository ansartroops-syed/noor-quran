export interface QuizQuestion {
  id: string;
  level: number;
  question: string;
  arabicPrompt?: string;
  transliterationPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioText?: string;
}

export const QUIZ_DATABASE: Record<string, QuizQuestion[]> = {
  quiz_level_1: [
    {
      id: "q1_1",
      level: 1,
      question: "Which of the following letters is articulated from the middle of the throat (Halq)?",
      options: ["ح (Hhaa)", "ت (Taa)", "ب (Baa)", "س (Seen)"],
      correctIndex: 0,
      explanation: "ح (Hhaa) is pronounced from the middle part of the throat with a crisp, breathy sound.",
    },
    {
      id: "q1_2",
      level: 1,
      question: "Which letter is known as the unique letter exclusive to the Arabic language?",
      options: ["ض (Daad)", "م (Meem)", "ل (Laam)", "ف (Faa)"],
      correctIndex: 0,
      explanation: "ض (Daad) gives Arabic the famous honorary title 'Lughat al-Daad' (Language of the Daad).",
    },
    {
      id: "q1_3",
      level: 1,
      question: "How many dots does the letter Thaa (ث) have?",
      options: ["3 dots on top", "2 dots below", "1 dot on top", "No dots"],
      correctIndex: 0,
      explanation: "Thaa (ث) has three dots placed above the boat-shaped letter body.",
    },
    {
      id: "q1_4",
      level: 1,
      question: "What is the initial (beginning) form of the letter Baa (ب)?",
      options: ["بـ", "ـبـ", "ـب", "ب"],
      correctIndex: 0,
      explanation: "In initial position, Baa starts the word as 'بـ' connecting to the next letter on the left.",
    },
    {
      id: "q1_5",
      level: 1,
      question: "Which group of letters does NOT connect to letters that follow them?",
      options: ["ا, د, ذ, ر, ز, و", "ب, ت, ث, ج, ح, خ", "س, ش, ص, ض, ط, ظ", "ف, ق, ك, ل, م, ن"],
      correctIndex: 0,
      explanation: "The six non-connecting letters (Alif, Daal, Dhaal, Raa, Zay, Waw) only connect from the right.",
    },
  ],
  quiz_level_2: [
    {
      id: "q2_1",
      level: 2,
      question: "What sound does the word 'دَرَسَ' make?",
      arabicPrompt: "دَرَسَ",
      options: ["Darasa", "Durisa", "Dirisa", "Darsa"],
      correctIndex: 0,
      explanation: "All three letters carry a Fatha: Da (دَ) + Ra (رَ) + Sa (سَ) = Darasa.",
    },
    {
      id: "q2_2",
      level: 2,
      question: "What does Tanween Kasratayn (ـٍ) add to the end of a word?",
      arabicPrompt: "ـٍ",
      options: ["'-in' sound", "'-an' sound", "'-un' sound", "'-oo' sound"],
      correctIndex: 0,
      explanation: "Kasratayn represents double Kasra, producing the '-in' nunation sound.",
    },
    {
      id: "q2_3",
      level: 2,
      question: "What is the purpose of the Shaddah (ـّ) mark?",
      arabicPrompt: "ـّ",
      options: [
        "It doubles the letter (first with sukoon, second with vowel)",
        "It silences the letter completely",
        "It turns the vowel into a long 'aa'",
        "It indicates the end of a sentence",
      ],
      correctIndex: 0,
      explanation: "Shaddah indicates doubling/emphasis: two identical letters merged together.",
    },
    {
      id: "q2_4",
      level: 2,
      question: "How long should Madd Asli (Natural Long Vowel) be elongated?",
      options: ["2 counts / beats", "1 count", "4 counts", "6 counts"],
      correctIndex: 0,
      explanation: "Madd Asli is naturally held for exactly 2 counts (the time it takes to open or fold a finger).",
    },
  ],
  quiz_level_3: [
    {
      id: "q3_1",
      level: 3,
      question: "Which of the following are the 5 Qalqalah (Echo) letters?",
      options: ["ق ط ب ج د (Qutb Jad)", "ي ن م و (Yanmoo)", "ء هـ ع ح غ خ", "ت ث ج د ذ ز"],
      correctIndex: 0,
      explanation: "The 5 Qalqalah letters are summarized in the mnemonic 'قُطْبُ جَدّ' (Qaf, Tta, Baa, Jeem, Daal).",
    },
    {
      id: "q3_2",
      level: 3,
      question: "What rule applies when Noon Sakinah (نْ) is followed by Baa (ب)?",
      options: ["Iqlab (Converts to Meem with Ghunnah)", "Izhar (Pronounced clearly)", "Idgham (Merged completely)", "Madd Lazim"],
      correctIndex: 0,
      explanation: "Iqlab converts the Noon/Tanween into a soft Meem (م) with 2 counts of nasal Ghunnah before Baa.",
    },
    {
      id: "q3_3",
      level: 3,
      question: "How many counts must a compulsory Madd Lazim (e.g. 'الضَّالِّينَ') be elongated?",
      options: ["6 counts (Mandatory)", "2 counts", "3 counts", "4 counts"],
      correctIndex: 0,
      explanation: "Madd Lazim is mandatory (Lazim) and must be stretched for a full 6 counts.",
    },
    {
      id: "q3_4",
      level: 3,
      question: "When is the letter Laam in the divine name 'Allah' (اللَّه) pronounced heavy (Tafkheem)?",
      options: [
        "When preceded by a Fatha or Damma",
        "When preceded by a Kasra",
        "Always light in all positions",
        "Only at the end of an Ayah",
      ],
      correctIndex: 0,
      explanation: "The Laam in 'Allah' is heavy after Fatha/Damma (e.g. Qul Huwa-Llaahu) and light after Kasra (e.g. Bismillah).",
    },
  ],
  quiz_level_4: [
    {
      id: "q4_1",
      level: 4,
      question: "What is the English meaning of the high-frequency Quranic word 'كِتَاب' (Kitaab)?",
      arabicPrompt: "كِتَاب",
      options: ["Book / Scripture", "Mosque", "Light", "Mountain"],
      correctIndex: 0,
      explanation: "'Kitaab' occurs over 260 times in the Quran meaning Book or Scripture.",
    },
    {
      id: "q4_2",
      level: 4,
      question: "What does the word 'جَنَّة' (Jannah) mean?",
      arabicPrompt: "جَنَّة",
      options: ["Paradise / Garden", "Hellfire", "Stars", "Ocean"],
      correctIndex: 0,
      explanation: "'Jannah' refers to the celestial Gardens of Paradise in the Hereafter.",
    },
    {
      id: "q4_3",
      level: 4,
      question: "What does the Arabic preposition 'فِي' (Fee) mean?",
      arabicPrompt: "فِي",
      options: ["In / Inside", "From", "Upon", "With"],
      correctIndex: 0,
      explanation: "'Fee' is one of the most frequent prepositions in Arabic meaning 'In' or 'Inside'.",
    },
  ],
  quiz_level_5: [
    {
      id: "q5_1",
      level: 5,
      question: "Complete the next verse of Surah Al-Fatiha: 'الرَّحْمَٰنِ الرَّحِيمِ' -> ...?",
      options: ["مَالِكِ يَوْمِ الدِّينِ", "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"],
      correctIndex: 0,
      explanation: "Ayah 3 is 'Ar-Rahmaanir-Raheem' followed by Ayah 4: 'Maaliki Yawmid-Deen'.",
    },
    {
      id: "q5_2",
      level: 5,
      question: "In Surah Al-Ikhlas, why does 'أَحَدٌ' (Ahad) bounce at the end of the Ayah?",
      options: [
        "Because stopping on Daal creates a Sukoon, triggering Qalqalah Kubra",
        "Because it has a Madd Lazim",
        "Because it has a Shaddah",
        "Because of Izhar Halqi",
      ],
      correctIndex: 0,
      explanation: "When pausing at the end of a verse, the Tanween is dropped and Daal becomes Sakin, producing a strong Qalqalah bounce.",
    },
    {
      id: "q5_3",
      level: 5,
      question: "What is Surah Al-Falaq primarily a supplication against?",
      options: [
        "External evils: the night darkness, witchcraft, and envy",
        "Hypocrisy in prayer",
        "Arrogance in wealth",
        "Neglect of orphans",
      ],
      correctIndex: 0,
      explanation: "Surah Al-Falaq seeks protection from external harm (darkness, blowers in knots, envier).",
    },
  ],
  quiz_grand_final: [
    {
      id: "qg_1",
      level: 6,
      question: "How many Surahs are there in the Holy Quran?",
      options: ["114 Surahs", "110 Surahs", "120 Surahs", "100 Surahs"],
      correctIndex: 0,
      explanation: "The Holy Quran consists of exactly 114 Surahs divided across 30 Juz.",
    },
    {
      id: "qg_2",
      level: 6,
      question: "What are the letters of Idgham bi-Ghunnah (Merging with 2-count nasal sound)?",
      options: ["ي, ن, م, و (Yanmoo)", "ل, ر", "ق, ط, ب, ج, د", "ء, هـ, ع, ح, غ, خ"],
      correctIndex: 0,
      explanation: "The four letters of Idgham bi-Ghunnah are Yaa, Noon, Meem, and Waw (يَنْمُو).",
    },
    {
      id: "qg_3",
      level: 6,
      question: "Which Surah is described in Hadith as being equal to one-third of the Quran?",
      options: ["Surah Al-Ikhlas", "Surah Al-Fatiha", "Surah Al-Baqarah", "Surah Ya-Sin"],
      correctIndex: 0,
      explanation: "The Prophet ﷺ taught that Surah Al-Ikhlas is equivalent to one-third of the Quran in virtue and core theology.",
    },
  ],
};
