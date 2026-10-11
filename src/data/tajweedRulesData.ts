export interface TajweedRule {
  id: string;
  category: "Noon & Tanween" | "Meem Sakinah" | "Qalqalah (Echo)" | "Madd (Elongations)" | "Ghunnah" | "Tafkheem & Tarqeeq";
  name: string;
  arabicName: string;
  tagColor: string;
  badgeBg: string;
  definition: string;
  letters: string[];
  durationCounts?: string;
  ruleExplanation: string;
  visualColorCode: string; // Used in color-coded Quran view
  examples: {
    arabic: string;
    surahRef: string;
    transliteration: string;
    highlightWord: string;
    explanation: string;
    audioAyah?: string;
  }[];
  commonMistakes: string;
}

export const TAJWEED_RULES: TajweedRule[] = [
  {
    id: "ghunnah",
    category: "Ghunnah",
    name: "Ghunnah (Nasalization)",
    arabicName: "غُنَّة",
    tagColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    definition: "A sweet, resonant sound emitted through the nasal cavity (Khayshum) for 2 counts whenever Noon or Meem has a Shaddah (نّ / مّ).",
    letters: ["نّ", "مّ"],
    durationCounts: "2 counts (beats)",
    ruleExplanation: "Whenever you encounter a Noon Mushaddadah (نّ) or Meem Mushaddadah (مّ), hold the sound in your nose smoothly for 2 full beats before transitioning to the vowel.",
    visualColorCode: "#10b981", // Emerald
    examples: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        surahRef: "Surah An-Nas (114:1)",
        transliteration: "Qul a'oodhu bi-Rabbin-Naas",
        highlightWord: "النَّاسِ",
        explanation: "The Noon in 'An-Naas' has a Shaddah (نّ) and must be held with a 2-count nasal Ghunnah.",
      },
      {
        arabic: "عَمَّ يَتَسَاءَلُونَ",
        surahRef: "Surah An-Naba (78:1)",
        transliteration: "'Amma yatasaa'aloon",
        highlightWord: "عَمَّ",
        explanation: "The Meem in ''Amma' has a Shaddah (مّ) and requires a 2-count nasal resonance.",
      },
      {
        arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        surahRef: "Surah Al-Asr (103:2)",
        transliteration: "Innal-insaana lafee khusr",
        highlightWord: "إِنَّ",
        explanation: "The Noon in 'Inna' has a Shaddah (نّ) requiring full Ghunnah.",
      },
    ],
    commonMistakes: "Rushing past the doubled Noon or Meem without giving the full 2 counts of nasal vibration.",
  },
  {
    id: "qalqalah",
    category: "Qalqalah (Echo)",
    name: "Qalqalah (Echoing / Bouncing Sound)",
    arabicName: "قَلْقَلَة",
    tagColor: "text-sky-700 dark:text-sky-300",
    badgeBg: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    definition: "An explosive bouncing or echoing acoustic vibration produced when one of the 5 Qalqalah letters (ق, ط, ب, ج, د - Qutb Jad) carries a Sukoon.",
    letters: ["ق", "ط", "ب", "ج", "د"],
    durationCounts: "Instantaneous bounce",
    ruleExplanation: "The 5 letters are grouped in the mnemonic 'قُطْبُ جَدّ' (Qutb Jad). When vowelless (Sukoon) or stopped upon at the end of an Ayah, bounce the sound cleanly without adding a fake Fatha, Kasra, or Damma.",
    visualColorCode: "#0284c7", // Sky Blue
    examples: [
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        surahRef: "Surah Al-Ikhlas (112:1)",
        transliteration: "Qul Huwa-Llaahu Ahad(b)",
        highlightWord: "أَحَدٌ",
        explanation: "Stopping on the Daal (د) at the end of the Ayah turns it into a Sukoon, creating a clear Qalqalah Kubra (major echo).",
      },
      {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        surahRef: "Surah Al-Ikhlas (112:3)",
        transliteration: "Lam yalid wa lam yoolad",
        highlightWord: "يَلِدْ ... يُولَدْ",
        explanation: "Both occurrences of Daal with Sukoon (دْ) bounce crisply.",
      },
      {
        arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
        surahRef: "Surah Al-Masad (111:1)",
        transliteration: "Tabbat yadaa Abee Lahabinw-wa tabb",
        highlightWord: "وَتَبَّ",
        explanation: "Stopping on Baa with Shaddah (بّ) creates the strongest Qalqalah Akbar.",
      },
      {
        arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
        surahRef: "Surah Al-Alaq (96:1)",
        transliteration: "Iqra' bismi Rabbikal-ladhee khalaq",
        highlightWord: "اقْرَأْ / خَلَقَ",
        explanation: "The Qaaf with Sukoon (قْ) in 'Iqra' (minor) and stopped Qaaf at end of 'Khalaq' (major).",
      },
    ],
    commonMistakes: "Adding an extra vowel 'e' or 'a' after the bounce instead of a clean, natural acoustic release.",
  },
  {
    id: "izhar",
    category: "Noon & Tanween",
    name: "Izhar Halqi (Clear Pronunciation)",
    arabicName: "إِظْهَار حَلْقِي",
    tagColor: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    definition: "Pronouncing the Noon Sakinah (نْ) or Tanween clearly, distinctly, and without any extra nasalization (Ghunnah) when followed by one of the 6 Throat letters (Halqi).",
    letters: ["ء", "هـ", "ع", "ح", "غ", "خ"],
    durationCounts: "Normal 1-count clarity",
    ruleExplanation: "When Noon Sakinah or Tanween is followed by Hamzah (ء), Haa (هـ), Ayn (ع), Hhaa (ح), Ghayn (غ), or Khaa (خ), pronounce the 'N' sound cleanly from its natural tongue makhraj without lingering in the nose.",
    visualColorCode: "#d97706", // Amber
    examples: [
      {
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
        surahRef: "Surah Al-Fatiha (1:7)",
        transliteration: "Siraatal-ladheena an'amta 'alayhim",
        highlightWord: "أَنْعَمْتَ",
        explanation: "Noon Sakinah (نْ) followed by throat letter Ayn (ع) is pronounced completely clear: 'An-' (Izhar).",
      },
      {
        arabic: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
        surahRef: "Surah Al-Qadr (97:5)",
        transliteration: "Salaamun hiya hattaa matla'il-fajr",
        highlightWord: "سَلَامٌ هِيَ",
        explanation: "Tanween (ـٌ) followed by Haa (هـ) is read with crisp clarity: 'Salaamun hiya'.",
      },
      {
        arabic: "مِنْ خَوْفٍ",
        surahRef: "Surah Quraysh (106:4)",
        transliteration: "Min khawf",
        highlightWord: "مِنْ خَوْفٍ",
        explanation: "Noon Sakinah followed by throat letter Khaa (خ): clear 'Min khawf'.",
      },
    ],
    commonMistakes: "Adding a buzzing nasal sound to the 'N' before throat letters instead of pronouncing it instantly clear.",
  },
  {
    id: "idgham_ghunnah",
    category: "Noon & Tanween",
    name: "Idgham bi-Ghunnah (Merging With Nasalization)",
    arabicName: "إِدْغَام بِغُنَّة",
    tagColor: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    definition: "Completely merging the Noon Sakinah (نْ) or Tanween into the next letter while sustaining a 2-count nasal Ghunnah when followed by: Yaa (ي), Noon (ن), Meem (م), or Waw (و) [Yanmoo / يَنْمُو].",
    letters: ["ي", "ن", "م", "و"],
    durationCounts: "2 counts merging",
    ruleExplanation: "When a Noon Sakinah or Tanween is followed by any letter of 'يَنْمُو' (Yanmoo) across two words, drop the 'N' sound and blend directly into the next letter with 2 counts of nasal humming.",
    visualColorCode: "#8b5cf6", // Purple
    examples: [
      {
        arabic: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
        surahRef: "Surah Az-Zalzalah (99:7)",
        transliteration: "Fa-may-ya'mal mithqaala dharratin khayray-yarah",
        highlightWord: "فَمَن يَعْمَلْ ... خَيْرًا يَرَهُ",
        explanation: "'Man ya'mal' becomes 'May-ya'mal' and 'Khayran yarah' becomes 'Khayray-yarah' with nasal blend.",
      },
      {
        arabic: "مِن وَالٍ",
        surahRef: "Surah Ar-Ra'd (13:11)",
        transliteration: "Miw-waal",
        highlightWord: "مِن وَالٍ",
        explanation: "'Min waal' merges into 'Miw-waal' with 2 beats of nasal Ghunnah.",
      },
      {
        arabic: "مِّن مَّالٍ",
        surahRef: "Surah Al-Mu'minun (23:55)",
        transliteration: "Mim-maalin",
        highlightWord: "مِّن مَّالٍ",
        explanation: "'Min maalin' merges seamlessly into 'Mim-maalin'.",
      },
    ],
    commonMistakes: "Pronouncing a hard 'N' instead of smoothly blending into the Waw or Yaa.",
  },
  {
    id: "idgham_bila_ghunnah",
    category: "Noon & Tanween",
    name: "Idgham bila Ghunnah (Merging Without Nasalization)",
    arabicName: "إِدْغَام بِلَا غُنَّة",
    tagColor: "text-indigo-700 dark:text-indigo-300",
    badgeBg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    definition: "Merging the Noon Sakinah or Tanween completely into the letter Laam (ل) or Raa (ر) without any nasal sound (Ghunnah).",
    letters: ["ل", "ر"],
    durationCounts: "Direct instant transition",
    ruleExplanation: "When followed by Laam (ل) or Raa (ر), the 'N' sound disappears completely and the Laam or Raa is pronounced with emphasis (Shaddah).",
    visualColorCode: "#6366f1", // Indigo
    examples: [
      {
        arabic: "هُدًى لِّلْمُتَّقِينَ",
        surahRef: "Surah Al-Baqarah (2:2)",
        transliteration: "Hudal-lil-muttaqeen",
        highlightWord: "هُدًى لِّلْمُتَّقِينَ",
        explanation: "'Hudan lil-muttaqeen' merges completely into 'Hudal-lil-muttaqeen' with zero nasal sound.",
      },
      {
        arabic: "مِّن رَّبِّهِمْ",
        surahRef: "Surah Al-Baqarah (2:5)",
        transliteration: "Mir-Rabbihim",
        highlightWord: "مِّن رَّبِّهِمْ",
        explanation: "'Min Rabbihim' is pronounced 'Mir-Rabbihim' with direct Raa sound.",
      },
      {
        arabic: "غَفُورٌ رَّحِيمٌ",
        surahRef: "Surah Al-Baqarah (2:173)",
        transliteration: "Ghafoorur-Raheem",
        highlightWord: "غَفُورٌ رَّحِيمٌ",
        explanation: "Tanween merges into Raa: 'Ghafoorur-Raheem'.",
      },
    ],
    commonMistakes: "Letting nasal air escape through the nose when pronouncing the Laam or Raa.",
  },
  {
    id: "iqlab",
    category: "Noon & Tanween",
    name: "Iqlab (Conversion to Meem)",
    arabicName: "إِقْلَاب",
    tagColor: "text-rose-700 dark:text-rose-300",
    badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    definition: "Transforming the Noon Sakinah (نْ) or Tanween into a hidden Meem (م) with 2 counts Ghunnah when followed by the letter Baa (ب). In the Quran, a tiny Meem (مـ) is printed above the letter.",
    letters: ["ب"],
    durationCounts: "2 counts Meem nasalization",
    ruleExplanation: "Whenever Noon Sakinah or Tanween is followed by Baa (ب), change the 'N' sound to an 'M' sound with light lip closure and 2 counts of nasal Ghunnah.",
    visualColorCode: "#f43f5e", // Rose
    examples: [
      {
        arabic: "كَلَّا لَيُنبَذَنَّ فِي الْحُطَمَةِ",
        surahRef: "Surah Al-Humazah (104:4)",
        transliteration: "Kalla layum-badhanna fil-Hutamah",
        highlightWord: "لَيُنبَذَنَّ",
        explanation: "'La-yunbadhanna' is read 'La-yum-badhanna' with a soft Meem before the Baa.",
      },
      {
        arabic: "مِن بَعْدِ",
        surahRef: "Surah Al-Baqarah (2:27)",
        transliteration: "Mim-ba'di",
        highlightWord: "مِن بَعْدِ",
        explanation: "'Min ba'di' transforms to 'Mim-ba'di' with nasal Ghunnah.",
      },
      {
        arabic: "سَمِيعٌ بَصِيرٌ",
        surahRef: "Surah Al-Hajj (22:61)",
        transliteration: "Samee'um-Baseer",
        highlightWord: "سَمِيعٌ بَصِيرٌ",
        explanation: "Tanween changes to Meem before Baa: 'Samee'um-Baseer'.",
      },
    ],
    commonMistakes: "Pressing the lips too tightly together; the lips should touch softly without harsh pressure.",
  },
  {
    id: "ikhfa",
    category: "Noon & Tanween",
    name: "Ikhfa Haqiqi (Concealment / Hidden Noon)",
    arabicName: "إِخْفَاء حَقِيقِي",
    tagColor: "text-teal-700 dark:text-teal-300",
    badgeBg: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    definition: "Concealing the Noon Sakinah or Tanween between Izhar (clarity) and Idgham (merging) with a 2-count nasal Ghunnah when followed by any of the 15 Ikhfa letters.",
    letters: ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"],
    durationCounts: "2 counts with tongue near next makhraj",
    ruleExplanation: "Prepare your tongue at the articulation point of the coming letter while letting the nasal Ghunnah sound flow for 2 counts. If the letter is heavy (ص ض ط ظ ق), make the Ikhfa heavy; if light, make it light.",
    visualColorCode: "#0d9488", // Teal
    examples: [
      {
        arabic: "مِن قَبْلُ",
        surahRef: "Surah Al-Baqarah (2:25)",
        transliteration: "Min qablu (Heavy Ikhfa)",
        highlightWord: "مِن قَبْلُ",
        explanation: "Noon Sakinah followed by heavy Qaaf (ق) gives a deep, heavy concealed Ghunnah.",
      },
      {
        arabic: "أَنتُمْ",
        surahRef: "Surah Al-Kafirun (109:3)",
        transliteration: "Antum (Light Ikhfa)",
        highlightWord: "أَنتُمْ",
        explanation: "Noon followed by light Taa (ت) gives a light, soft concealed Ghunnah.",
      },
      {
        arabic: "إِن كُنتُمْ",
        surahRef: "Surah Al-Baqarah (2:23)",
        transliteration: "In kuntum",
        highlightWord: "إِن كُنتُمْ",
        explanation: "Both Noon occurrences before Kaf (ك) and Taa (ت) are concealed with 2 counts.",
      },
    ],
    commonMistakes: "Touching the tongue firmly against the upper gum (making a hard 'N') instead of floating the tongue near the target letter.",
  },
  {
    id: "madd_rules",
    category: "Madd (Elongations)",
    name: "Madd Rules (Compulsory & Connected Elongations)",
    arabicName: "أَحْكَام الْمَدّ",
    tagColor: "text-pink-700 dark:text-pink-300",
    badgeBg: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
    definition: "Elongating a Madd letter (ا, و, ي) beyond the natural 2 counts up to 4, 5, or 6 counts when followed by a Hamzah (ء), Sukoon (ْ), or Shaddah (ّ).",
    letters: ["Madd Muttasil (4-5 counts)", "Madd Munfassil (4-5 counts)", "Madd Lazim (6 counts compulsory)"],
    durationCounts: "4, 5, or 6 counts (beats)",
    ruleExplanation: "1) Madd Muttasil (Connected): Madd letter + Hamzah in SAME word -> 4 to 5 counts (e.g. جَاءَ, السَّمَاء). 2) Madd Munfassil (Separated): Madd at end of word 1 + Hamzah at start of word 2 -> 4 to 5 counts (e.g. إِنَّا أَعْطَيْنَاكَ). 3) Madd Lazim: Madd followed by Sukoon/Shaddah -> 6 counts (e.g. وَلَا الضَّالِّينَ, الْحَاقَّة).",
    visualColorCode: "#db2777", // Pink / Crimson
    examples: [
      {
        arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        surahRef: "Surah An-Nasr (110:1)",
        transliteration: "Idhaa jaaa'a nasrul-laahi wal-fath",
        highlightWord: "جَاءَ",
        explanation: "Madd Muttasil in 'Jaaa'a' (Hamzah in same word) must be stretched for 4-5 counts.",
      },
      {
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        surahRef: "Surah Al-Kawthar (108:1)",
        transliteration: "Innaaa a'taynaakal-Kawthar",
        highlightWord: "إِنَّا أَعْطَيْنَاكَ",
        explanation: "Madd Munfassil between 'Innaaa' and 'A'taynaaka' elongated 4-5 counts.",
      },
      {
        arabic: "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        surahRef: "Surah Al-Fatiha (1:7)",
        transliteration: "Ghayril-maghdoobi 'alayhim wa lad-Daaallleeeen",
        highlightWord: "الضَّالِّينَ",
        explanation: "Madd Lazim Kalimi Muthaqqal in 'Ad-Daalleen' must be elongated for a full 6 counts before the Shaddah.",
      },
    ],
    commonMistakes: "Under-stretching Madd Lazim to only 2 or 3 counts instead of the full mandatory 6 counts.",
  },
];
