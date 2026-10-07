export interface CurriculumLevel {
  levelNumber: number;
  id: string;
  title: string;
  subtitle: string;
  badgeName: string;
  badgeIcon: string;
  themeColor: string;
  gradientBg: string;
  xpReward: number;
  totalLessons: number;
  description: string;
  learningOutcomes: string[];
  lessons: {
    id: string;
    title: string;
    type: "alphabet" | "harakat" | "tajweed" | "vocab" | "surah" | "quiz";
    estimatedMinutes: number;
    description: string;
    targetRef?: string;
  }[];
}

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    levelNumber: 1,
    id: "level_1_qaida",
    title: "Level 1: Arabic Alphabet & Makharij (Noorani Qaida)",
    subtitle: "The Foundation of Quranic Reading",
    badgeName: "Alphabet Scholar",
    badgeIcon: "🔤",
    themeColor: "from-emerald-600 to-teal-800",
    gradientBg: "bg-emerald-900/20 border-emerald-500/30",
    xpReward: 300,
    totalLessons: 6,
    description: "Master all 28 Arabic letters, their correct points of articulation (Makharij: Throat, Tongue, Lips, Nasal), and how letters change shape in initial, medial, and final positions.",
    learningOutcomes: [
      "Pronounce all 28 Arabic letters accurately with exact articulation points",
      "Distinguish difficult phonetic pairs (e.g. ح vs هـ, ق vs ك, ص vs س, ض vs د)",
      "Recognize isolated, initial, medial, and final letter shapes in connected script",
      "Pass the Level 1 Makharij Assessment with audio listening",
    ],
    lessons: [
      { id: "l1_letters_1_7", title: "Letters 1-7: Alif to Khaa", type: "alphabet", estimatedMinutes: 10, description: "Learn Alif, Baa, Taa, Thaa, Jeem, Hhaa, and Khaa with throat & lip articulation.", targetRef: "alif" },
      { id: "l1_letters_8_14", title: "Letters 8-14: Daal to Saad", type: "alphabet", estimatedMinutes: 10, description: "Learn Daal, Dhaal, Raa, Zay, Seen, Sheen, and Saad with whistling and soft sounds.", targetRef: "daal" },
      { id: "l1_letters_15_21", title: "Letters 15-21: Daad to Qaaf", type: "alphabet", estimatedMinutes: 10, description: "Master emphatic heavy letters: Daad, Tta, Dhaa, Ayn, Ghayn, Faa, Qaaf.", targetRef: "daad" },
      { id: "l1_letters_22_28", title: "Letters 22-28: Kaaf to Yaa", type: "alphabet", estimatedMinutes: 10, description: "Complete the alphabet: Kaaf, Laam, Meem, Noon, Haa, Waw, and Yaa.", targetRef: "kaaf" },
      { id: "l1_connecting_forms", title: "Connecting Letter Positions", type: "alphabet", estimatedMinutes: 12, description: "Mastering Initial (بـ), Medial (ـبـ), and Final (ـب) letter transformations.", targetRef: "forms" },
      { id: "l1_exam", title: "Level 1 Graduation Quiz & Audio Test", type: "quiz", estimatedMinutes: 8, description: "Test your alphabet identification and phonetic listening skills to earn Level 1 Certificate.", targetRef: "quiz_level_1" },
    ],
  },
  {
    levelNumber: 2,
    id: "level_2_harakat",
    title: "Level 2: Harakat, Vowels & Connecting Sounds",
    subtitle: "From Individual Letters to Full Words",
    badgeName: "Vowel Master",
    badgeIcon: "✨",
    themeColor: "from-blue-600 to-indigo-800",
    gradientBg: "bg-blue-900/20 border-blue-500/30",
    xpReward: 400,
    totalLessons: 6,
    description: "Learn short vowels (Fatha, Kasra, Damma), double vowels (Tanween), vowelless stops (Sukoon), doubling emphasis (Shaddah), and natural 2-count long vowels (Madd Asli).",
    learningOutcomes: [
      "Fluently read 3-letter Arabic words with short vowels",
      "Master Tanween (-an, -in, -un) Nunation at word endings",
      "Control the Sukoon consonant stop without adding extra vowel sounds",
      "Pronounce doubled letters with Shaddah (ّ) and natural long vowels (Madd Asli)",
    ],
    lessons: [
      { id: "l2_short_vowels", title: "Short Vowels: Fatha, Kasra, Damma", type: "harakat", estimatedMinutes: 10, description: "Practice basic vowels (ـَ, ـِ, ـُ) on single and compound letters.", targetRef: "fatha" },
      { id: "l2_tanween", title: "Tanween: Double Vowels (-an, -in, -un)", type: "harakat", estimatedMinutes: 10, description: "Nunation marks (ـً, ـٍ, ـٌ) and their grammatical resonance.", targetRef: "tanween" },
      { id: "l2_sukoon", title: "Sukoon: The Resting Consonant", type: "harakat", estimatedMinutes: 10, description: "Pronouncing consonant stops (ـْ) cleanly in words like 'An'amta' and 'Qul'.", targetRef: "sukoon" },
      { id: "l2_shaddah", title: "Shaddah: Doubling & Emphasis", type: "harakat", estimatedMinutes: 12, description: "Holding and releasing doubled letters (ـّ) smoothly in sacred words.", targetRef: "shaddah" },
      { id: "l2_madd_asli", title: "Madd Asli: 2-Count Natural Vowels", type: "harakat", estimatedMinutes: 10, description: "Extending Alif, Waw, and Yaa for exactly two natural beats.", targetRef: "madd_asli" },
      { id: "l2_exam", title: "Level 2 Reading Fluency Exam", type: "quiz", estimatedMinutes: 8, description: "Test your vowel and connecting word skills to unlock Tajweed Masterclass.", targetRef: "quiz_level_2" },
    ],
  },
  {
    levelNumber: 3,
    id: "level_3_tajweed",
    title: "Level 3: Tajweed Rules Masterclass",
    subtitle: "Recite with Beauty, Precision & Sacred Rules",
    badgeName: "Tajweed Virtuoso",
    badgeIcon: "💎",
    themeColor: "from-amber-600 to-rose-800",
    gradientBg: "bg-amber-900/20 border-amber-500/30",
    xpReward: 500,
    totalLessons: 7,
    description: "Unlock the sacred art of Tajweed: Ghunnah nasalization, Qalqalah echoing sounds, Noon Sakinah rules (Izhar, Idgham, Iqlab, Ikhfa), Meem Sakinah rules, and compulsory Madd elongations.",
    learningOutcomes: [
      "Apply 2-count nasal Ghunnah on doubled Noon & Meem",
      "Execute crisp Qalqalah bouncing sounds on Qutb Jad (ق ط ب ج د)",
      "Correctly implement all 4 Noon Sakinah & Tanween rules in live recitation",
      "Recognize and apply 4, 5, and 6-count Madd elongations with color-coded guidance",
    ],
    lessons: [
      { id: "l3_ghunnah", title: "Ghunnah: Nasal Resonance Masterclass", type: "tajweed", estimatedMinutes: 10, description: "Sustaining 2 beats on Noon & Meem Mushaddadah (نّ, مّ).", targetRef: "ghunnah" },
      { id: "l3_qalqalah", title: "Qalqalah: The 5 Echo Letters", type: "tajweed", estimatedMinutes: 12, description: "Minor, Medium, and Major Qalqalah bounces on ق ط ب ج د.", targetRef: "qalqalah" },
      { id: "l3_izhar_idgham", title: "Izhar & Idgham (Clarity & Merging)", type: "tajweed", estimatedMinutes: 12, description: "Izhar Halqi with 6 throat letters & Idgham with/without Ghunnah.", targetRef: "izhar" },
      { id: "l3_iqlab_ikhfa", title: "Iqlab & Ikhfa (Conversion & Concealment)", type: "tajweed", estimatedMinutes: 15, description: "Converting to Meem before Baa & concealing Noon before 15 letters.", targetRef: "ikhfa" },
      { id: "l3_madd_rules", title: "Madd Rules: 4, 5 & 6 Counts Elongation", type: "tajweed", estimatedMinutes: 15, description: "Madd Muttasil, Munfassil, and compulsory Madd Lazim (6 beats).", targetRef: "madd_rules" },
      { id: "l3_tafkheem_tarqeeq", title: "Tafkheem & Tarqeeq (Heavy vs Light)", type: "tajweed", estimatedMinutes: 10, description: "Rules of Raa and the majestic Laam of Allah (اللَّه).", targetRef: "tafkheem" },
      { id: "l3_exam", title: "Level 3 Tajweed Master Quiz", type: "quiz", estimatedMinutes: 10, description: "Comprehensive test on Quranic rules and color-coded verse identification.", targetRef: "quiz_level_3" },
    ],
  },
  {
    levelNumber: 4,
    id: "level_4_vocabulary",
    title: "Level 4: Quranic Vocabulary & Core Comprehension",
    subtitle: "Understand 80% of Quranic Words as You Recite",
    badgeName: "Vocabulary Master",
    badgeIcon: "📖",
    themeColor: "from-purple-600 to-indigo-900",
    gradientBg: "bg-purple-900/20 border-purple-500/30",
    xpReward: 450,
    totalLessons: 5,
    description: "Learn the top high-frequency Quranic words, divine names, prepositions, and key verbs that recur thousands of times throughout the Holy Quran.",
    learningOutcomes: [
      "Understand the top 100 most frequent Quranic words",
      "Recognize 3-letter Arabic root systems (e.g. ك-ت-ب, ر-ح-م, ع-ل-م)",
      "Translate key verses in your mind as you listen to recitations",
      "Master interactive flashcards with spaced repetition",
    ],
    lessons: [
      { id: "l4_divine_names", title: "Divine Names & Pillars of Faith", type: "vocab", estimatedMinutes: 10, description: "Key terms: Allah, Rabb, Rahman, Raheem, Deen, Eemaan, Noor.", targetRef: "divine" },
      { id: "l4_verbs", title: "High-Frequency Quranic Verbs", type: "vocab", estimatedMinutes: 12, description: "Qaala, Kaana, Aamana, 'Alima, Ja'ala, Khalaqa, Hadaa.", targetRef: "verbs" },
      { id: "l4_prepositions", title: "Prepositions & Particles", type: "vocab", estimatedMinutes: 10, description: "Fee, Min, 'Alaa, Ilaa, Ma'a, Inna, Anna, Lam, Lammaa.", targetRef: "particles" },
      { id: "l4_hereafter", title: "Cosmos & The Hereafter Terms", type: "vocab", estimatedMinutes: 10, description: "Jannah, Naar, Yawm, Samaa', Ard, Kitab, Aayah, Mala'ikah.", targetRef: "cosmos" },
      { id: "l4_exam", title: "Level 4 Vocabulary Match Challenge", type: "quiz", estimatedMinutes: 8, description: "Rapid-fire meaning matching test across top Quranic words.", targetRef: "quiz_level_4" },
    ],
  },
  {
    levelNumber: 5,
    id: "level_5_surahs",
    title: "Level 5: Progressive Short Surahs (Juz Amma)",
    subtitle: "Word-by-Word Practice & Recitation Perfection",
    badgeName: "Juz Amma Reciter",
    badgeIcon: "🌟",
    themeColor: "from-teal-600 to-emerald-900",
    gradientBg: "bg-teal-900/20 border-teal-500/30",
    xpReward: 600,
    totalLessons: 6,
    description: "Practice essential daily Surahs word-by-word with transliteration, translation, audio recitations, and built-in voice recorder for self-assessment.",
    learningOutcomes: [
      "Master Surah Al-Fatiha with flawless Tajweed and meaning",
      "Recite the 4 Quls (Al-Ikhlas, Al-Falaq, An-Nas, Al-Kafirun) with exact Ghunnah & Qalqalah",
      "Understand Surah Al-Kawthar, Al-Asr, An-Nasr, and Al-Qadr",
      "Record your recitation and compare against Sheikh Alafasy & Al-Husary",
    ],
    lessons: [
      { id: "l5_fatiha", title: "Surah Al-Fatiha (The Opening)", type: "surah", estimatedMinutes: 15, description: "Word-by-word recitation, meaning, and Tajweed breakdown of the Mother of the Book.", targetRef: "1" },
      { id: "l5_ikhlas", title: "Surah Al-Ikhlas (Purity of Monotheism)", type: "surah", estimatedMinutes: 10, description: "Mastering Qalqalah Kubra on Ahad, Samad, and Yoolad.", targetRef: "112" },
      { id: "l5_falaq_nas", title: "The Mu'awwidhatayn (Al-Falaq & An-Nas)", type: "surah", estimatedMinutes: 15, description: "Protection Surahs with heavy Ikhfa and continuous Ghunnah practice.", targetRef: "113" },
      { id: "l5_kawthar_asr", title: "Surah Al-Kawthar & Surah Al-Asr", type: "surah", estimatedMinutes: 12, description: "Madd Munfassil, Izhar Halqi, and the golden principles of time.", targetRef: "108" },
      { id: "l5_nasr_qadr", title: "Surah An-Nasr & Surah Al-Qadr", type: "surah", estimatedMinutes: 15, description: "Madd Muttasil, Laylatul Qadr contemplation, and divine praise.", targetRef: "97" },
      { id: "l5_exam", title: "Level 5 Short Surahs Mastery Test", type: "quiz", estimatedMinutes: 10, description: "Comprehensive recitation fluency and verse completion test.", targetRef: "quiz_level_5" },
    ],
  },
  {
    levelNumber: 6,
    id: "level_6_full_quran",
    title: "Level 6: Complete Quran (114 Surahs / 30 Juz)",
    subtitle: "Lifelong Journey of Recitation, Tafseer & Hifz",
    badgeName: "Quran Champion",
    badgeIcon: "👑",
    themeColor: "from-amber-500 via-emerald-600 to-indigo-900",
    gradientBg: "bg-emerald-950/40 border-amber-500/40",
    xpReward: 1000,
    totalLessons: 4,
    description: "Navigate all 114 Surahs and 30 Juz with verse-by-verse audio, repeat looping for memorization (Hifz), search by keyword, Tajweed color coding, and daily reflections.",
    learningOutcomes: [
      "Navigate all 114 Surahs and 30 Juz with custom bookmarks and daily goals",
      "Utilize the Hifz Memorization Companion (hide translation, hide text, repeat loops)",
      "Search the complete Quran in Arabic, English, and Roman transliteration",
      "Earn the Grand Graduation Certificate of Quranic Learning",
    ],
    lessons: [
      { id: "l6_navigating_quran", title: "Quran Navigation & Juz Breakdown", type: "surah", estimatedMinutes: 10, description: "How to use Surah / Juz selectors, Uthmani vs Indo-Pak scripts, and audio controls.", targetRef: "quran_guide" },
      { id: "l6_hifz_mode", title: "Hifz Memorization Companion Guide", type: "surah", estimatedMinutes: 10, description: "Using repeat range loops, audio slowing (0.5x), and verse masking for retention.", targetRef: "hifz_guide" },
      { id: "l6_tafseer_search", title: "Deep Search & Verse Reflections", type: "surah", estimatedMinutes: 10, description: "Searching root concepts, saving personal notes, and tracking daily reading streaks.", targetRef: "search_guide" },
      { id: "l6_graduation", title: "Grand Quranic Learning Graduation", type: "quiz", estimatedMinutes: 15, description: "Final assessment across all 6 levels to generate your official printable Certificate.", targetRef: "quiz_grand_final" },
    ],
  },
];
