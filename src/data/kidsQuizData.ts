export type KidsDifficulty = "Basic" | "Medium" | "Hard";

export interface KidsQuizQuestion {
  id: string;
  question: string;
  arabicPrompt?: string;
  emoji: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  praise: string;
}

export interface KidsQuizLevel {
  id: string;
  levelNumber: number;
  difficulty: KidsDifficulty;
  title: string;
  subtitle: string;
  emoji: string;
  mascot: string;
  color: string;
  cardBg: string;
  xpReward: number;
  questions: KidsQuizQuestion[];
}

export const KIDS_DIFFICULTIES: { id: KidsDifficulty | "All"; label: string; emoji: string; desc: string }[] = [
  { id: "All", label: "All Levels", emoji: "🌈", desc: "Every adventure!" },
  { id: "Basic", label: "Basic", emoji: "🌱", desc: "Easy & fun" },
  { id: "Medium", label: "Medium", emoji: "🚀", desc: "Trickier" },
  { id: "Hard", label: "Hard", emoji: "🏆", desc: "Champion challenge!" },
];

// All levels have 10 questions each, own question type, correct answers mixed.
// App also shuffles at runtime so answers are never predictable.
export const KIDS_QUIZ_LEVELS: KidsQuizLevel[] = [
  {
    id: "kids_level_1",
    levelNumber: 1,
    difficulty: "Basic",
    title: "Alphabet Friends",
    subtitle: "Type: Letter shapes & dots",
    emoji: "🔤",
    mascot: "🐪",
    color: "from-amber-400 to-orange-500",
    cardBg: "bg-amber-950/40 border-amber-500/30",
    xpReward: 50,
    questions: [
      { id: "k1_q1", question: "Which letter is this?", arabicPrompt: "ا", emoji: "👀", options: ["Baa", "Meem", "Alif"], correctIndex: 2, funFact: "Alif is tall and straight like number 1!", praise: "Amazing! You know Alif! 🌟" },
      { id: "k1_q2", question: "Which letter has ONE dot below it?", arabicPrompt: "ب", emoji: "🔵", options: ["Baa", "Taa", "Noon"], correctIndex: 0, funFact: "Baa carries one apple below like a boat! ⛵", praise: "Super! Baa loves you! 💙" },
      { id: "k1_q3", question: "Which letter is round like a little head?", arabicPrompt: "م", emoji: "🌙", options: ["Seen", "Waw", "Meem"], correctIndex: 2, funFact: "Meem starts the word Masjid! 🕌", praise: "Wonderful! Meem is your friend! 🎉" },
      { id: "k1_q4", question: "How many dots does SEEN have?", arabicPrompt: "س", emoji: "⭐", options: ["No dots", "Three dots", "One dot"], correctIndex: 0, funFact: "Seen has NO dots but three teeth like a smile! 😁", praise: "Brilliant smile! 😁" },
      { id: "k1_q5", question: "Which letter starts the word Noor (light)?", arabicPrompt: "ن", emoji: "💡", options: ["Qaaf", "Noon", "Raa"], correctIndex: 1, funFact: "Noon has one dot on top and starts NOOR! ✨", praise: "You shine like Noor! ✨" },
      { id: "k1_q6", question: "Which letter has THREE dots on top?", arabicPrompt: "ث", emoji: "🔺", options: ["Taa", "Thaa", "Baa"], correctIndex: 1, funFact: "Thaa has 3 dots — Taa has 2, Baa has 1 below!", praise: "Dot detective! 🔺" },
      { id: "k1_q7", question: "Which letter growls deep from the throat?", arabicPrompt: "ح", emoji: "😮‍💨", options: ["Hhaa (deep H)", "Soft Haa", "Jeem"], correctIndex: 0, funFact: "Hhaa breathes deep from the middle throat!", praise: "Deep voice star! 😮‍💨" },
      { id: "k1_q8", question: "Which letter has TWO dots on top and pops deep?", arabicPrompt: "ق", emoji: "🎈", options: ["Faa", "Kaaf", "Qaaf"], correctIndex: 2, funFact: "Qaaf pops from the very back — deeper than Kaaf!", praise: "Pop star! 🎈" },
      { id: "k1_q9", question: "Which letter says Yaaa like yes?", arabicPrompt: "ي", emoji: "🐥", options: ["Yaa", "Waw", "Alif"], correctIndex: 0, funFact: "Yaa has 2 dots below and says yeee!", praise: "Yes! Yaa! 🐥" },
      { id: "k1_q10", question: "Which letter is heavy and full like a lion roar?", arabicPrompt: "ص", emoji: "🦁", options: ["Seen (light S)", "Saad (heavy S)", "Sheen"], correctIndex: 1, funFact: "Saad fills the whole mouth — ROAR!", praise: "Lion voice! 🦁" },
    ],
  },
  {
    id: "kids_level_2",
    levelNumber: 2,
    difficulty: "Basic",
    title: "Harakat Heroes",
    subtitle: "Type: Short vowels & signs",
    emoji: "🦸",
    mascot: "🦁",
    color: "from-sky-400 to-blue-600",
    cardBg: "bg-sky-950/40 border-sky-500/30",
    xpReward: 60,
    questions: [
      { id: "k2_q1", question: "Fatha ( َ ) on top says…?", arabicPrompt: "بَ", emoji: "🎵", options: ["Bee", "Boo", "Ba"], correctIndex: 2, funFact: "Fatha opens mouth with short a!", praise: "Hero power! 🦸" },
      { id: "k2_q2", question: "Kasra ( ِ ) below says…?", arabicPrompt: "بِ", emoji: "🎶", options: ["Bee", "Boo", "Ba"], correctIndex: 0, funFact: "Kasra hides below and whispers ee!", praise: "Found hiding Kasra! 🕵️" },
      { id: "k2_q3", question: "Damma ( ُ ) with round lips says…?", arabicPrompt: "بُ", emoji: "⭕", options: ["Ba", "Bee", "Boo"], correctIndex: 2, funFact: "Damma rounds lips like blowing a bubble! 🫧", praise: "Bubbly brilliant! 🫧" },
      { id: "k2_q4", question: "What does this word say?", arabicPrompt: "نُور", emoji: "🌟", options: ["Book", "Moon", "Light (Noor)"], correctIndex: 2, funFact: "NOOR means light — our app name! 💛", praise: "You ARE the light! 💛" },
      { id: "k2_q5", question: "Shaddah ( ّ ) means the letter is…?", arabicPrompt: "رَبِّ", emoji: "💪", options: ["Doubled & strong", "Silent", "Skipped"], correctIndex: 0, funFact: "Shaddah makes the letter TWICE strong!", praise: "Superhero strong! 💪" },
      { id: "k2_q6", question: "Sukoon ( ْ ) tiny circle means…?", arabicPrompt: "قُلْ", emoji: "🤫", options: ["A long song", "No vowel — little stop", "Two dots"], correctIndex: 1, funFact: "Sukoon tells the letter to whisper-stop: Qul!", praise: "Quiet star! 🤫" },
      { id: "k2_q7", question: "Tanween بٌ (two dammas) sounds like…?", arabicPrompt: "بٌ", emoji: "🔔", options: ["Bu", "Bun", "Ban"], correctIndex: 1, funFact: "Double damma adds a tiny n: Bun!", praise: "Ring-a-ling! 🔔" },
      { id: "k2_q8", question: "Which word has a LONG aa stretch?", arabicPrompt: "بَا", emoji: "📏", options: ["Bu", "Baa (long)", "Bi"], correctIndex: 1, funFact: "Alif after Fatha stretches 2 beats!", praise: "Stretchy! 📏" },
      { id: "k2_q9", question: "Read this: دَ رَ سَ together?", arabicPrompt: "دَرَسَ", emoji: "📚", options: ["Darasa", "Durisu", "Dirasa"], correctIndex: 0, funFact: "Da-ra-sa means he studied!", praise: "Little scholar! 📚" },
      { id: "k2_q10", question: "Leen letters بَيْت are read…?", arabicPrompt: "بَيْت", emoji: "🏠", options: ["Fast hum", "Soft and quick (Bayt)", "Super long Beeeet"], correctIndex: 1, funFact: "Leen glides softly — Bayt means house!", praise: "Home sweet home! 🏠" },
    ],
  },
  {
    id: "kids_level_3",
    levelNumber: 4,
    difficulty: "Medium",
    title: "Short Surah Stars",
    subtitle: "Type: Which Surah is it?",
    emoji: "🌙",
    mascot: "🦄",
    color: "from-violet-400 to-purple-600",
    cardBg: "bg-violet-950/40 border-violet-500/30",
    xpReward: 80,
    questions: [
      { id: "k3_q1", question: "Qul Huwa Allahu Ahad — which Surah?", arabicPrompt: "قُلْ هُوَ اللَّهُ أَحَدٌ", emoji: "💎", options: ["Surah Al-Fatiha", "Surah An-Nas", "Surah Al-Ikhlas"], correctIndex: 2, funFact: "Al-Ikhlas equals one-third of Quran in reward!", praise: "Diamond star! 💎" },
      { id: "k3_q2", question: "Which Surah starts Alhamdu lillahi Rabbil Aalameen?", arabicPrompt: "الْحَمْدُ لِلَّهِ", emoji: "📖", options: ["Surah Al-Kawthar", "Surah Al-Fatiha", "Surah Al-Asr"], correctIndex: 1, funFact: "Al-Fatiha is read in EVERY prayer!", praise: "Fatiha friend! 🤲" },
      { id: "k3_q3", question: "Inna atayna kal Kawthar — which Surah?", arabicPrompt: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", emoji: "🏞️", options: ["Surah Al-Kawthar", "Surah Al-Fil", "Surah Al-Masad"], correctIndex: 0, funFact: "Al-Kawthar is the shortest — 3 verses!", praise: "Short and smart! 🍬" },
      { id: "k3_q4", question: "We say Audhu in An-Nas to ask for…?", arabicPrompt: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", emoji: "🛡️", options: ["Candy", "Toys", "Protection"], correctIndex: 2, funFact: "An-Nas is a shield from whispers!", praise: "Brave and protected! 🛡️" },
      { id: "k3_q5", question: "How many verses in Surah Al-Kawthar?", arabicPrompt: "الكوثر", emoji: "🔢", options: ["3 verses", "7 verses", "5 verses"], correctIndex: 0, funFact: "Only 3 — shortest Surah!", praise: "Counter star! 🔢" },
      { id: "k3_q6", question: "Surah Al-Asr teaches us TIME is…?", arabicPrompt: "وَالْعَصْرِ", emoji: "⏰", options: ["For games only", "Boring", "Precious — only 3 verses"], correctIndex: 2, funFact: "Al-Asr warns mankind is in loss except believers!", praise: "Time master! ⏰" },
      { id: "k3_q7", question: "Surah Al-Falaq protects from…?", arabicPrompt: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", emoji: "🌅", options: ["Darkness and envy", "Lions", "Broken toys"], correctIndex: 0, funFact: "Al-Falaq means Daybreak!", praise: "Morning hero! 🌅" },
      { id: "k3_q8", question: "Tabbat yada Abi Lahab — which Surah?", arabicPrompt: "تَبَّتْ يَدَا", emoji: "🔥", options: ["Al-Fil", "Al-Masad", "An-Nasr"], correctIndex: 1, funFact: "Al-Masad is about Abu Lahab!", praise: "Fire fact finder! 🔥" },
      { id: "k3_q9", question: "Alam tara kayfa — the elephant Surah?", arabicPrompt: "أَلَمْ تَرَ", emoji: "🐘", options: ["Al-Kawthar", "Al-Asr", "Al-Fil"], correctIndex: 2, funFact: "Al-Fil tells of elephants and birds with stones!", praise: "Elephant expert! 🐘" },
      { id: "k3_q10", question: "Idha jaa nasrullah — which Surah?", arabicPrompt: "إِذَا جَاءَ", emoji: "🎉", options: ["An-Nasr", "Al-Ikhlas", "Al-Falaq"], correctIndex: 0, funFact: "An-Nasr came near the end of revelation!", praise: "Victory star! 🎉" },
    ],
  },
  {
    id: "kids_level_4",
    levelNumber: 5,
    difficulty: "Medium",
    title: "Quran Word Wizards",
    subtitle: "Type: Magic meanings",
    emoji: "🧙",
    mascot: "🐬",
    color: "from-emerald-400 to-teal-600",
    cardBg: "bg-emerald-950/40 border-emerald-500/30",
    xpReward: 100,
    questions: [
      { id: "k4_q1", question: "What does Jannah mean?", arabicPrompt: "جَنَّة", emoji: "🌳", options: ["Desert", "Ocean", "Paradise gardens"], correctIndex: 2, funFact: "Gardens with honey and milk rivers!", praise: "Paradise-bound! 🌳" },
      { id: "k4_q2", question: "What does Salaam mean?", arabicPrompt: "سَلَام", emoji: "🕊️", options: ["War", "Peace", "Food"], correctIndex: 1, funFact: "As-salamu alaykum = peace be upon you!", praise: "Peaceful! 🕊️" },
      { id: "k4_q3", question: "What does Shams mean?", arabicPrompt: "شَمْس", emoji: "☀️", options: ["Moon", "Star", "Sun"], correctIndex: 2, funFact: "Surah Ash-Shams = The Sun!", praise: "Sunny superstar! ☀️" },
      { id: "k4_q4", question: "What does Noor mean?", arabicPrompt: "نُور", emoji: "🔆", options: ["Light", "Darkness", "Cloud"], correctIndex: 0, funFact: "Allah is Light of heavens and earth!", praise: "Glowing! 🔆" },
      { id: "k4_q5", question: "What does Qamar mean?", arabicPrompt: "قَمَر", emoji: "🌙", options: ["Sun", "Qamar = Moon", "Star"], correctIndex: 1, funFact: "Surah Al-Qamar = The Moon!", praise: "Moon magic! 🌙" },
      { id: "k4_q6", question: "What does Kitab mean?", arabicPrompt: "كِتَاب", emoji: "📚", options: ["A shoe", "A book", "A cake"], correctIndex: 1, funFact: "Quran is called Al-Kitab — The Book!", praise: "Bookworm! 📚" },
      { id: "k4_q7", question: "What does Rabb mean?", arabicPrompt: "رَبّ", emoji: "💚", options: ["Lord who cares for us", "King of toys", "Mountain"], correctIndex: 0, funFact: "Rabb feeds and protects us!", praise: "Loved! 💚" },
      { id: "k4_q8", question: "What does Masjid mean?", arabicPrompt: "مَسْجِد", emoji: "🕌", options: ["Market", "Mosque", "School"], correctIndex: 1, funFact: "Place of sujood (prostration)!", praise: "Masjid friend! 🕌" },
      { id: "k4_q9", question: "What does Malaika mean?", arabicPrompt: "مَلَائِكَة", emoji: "👼", options: ["Angels", "Birds", "Stars"], correctIndex: 0, funFact: "Angels made of light!", praise: "Angelic! 👼" },
      { id: "k4_q10", question: "What does Sabr mean?", arabicPrompt: "صَبْر", emoji: "⏳", options: ["Running fast", "Patience", "Sleeping"], correctIndex: 1, funFact: "Allah is with the patient!", praise: "Patient wizard! ⏳" },
    ],
  },
  {
    id: "kids_level_5",
    levelNumber: 7,
    difficulty: "Hard",
    title: "Quran Champions",
    subtitle: "Type: Hard Quran facts",
    emoji: "🏆",
    mascot: "🦅",
    color: "from-rose-400 to-pink-600",
    cardBg: "bg-rose-950/40 border-rose-500/30",
    xpReward: 150,
    questions: [
      { id: "k5_q1", question: "How many Surahs in the whole Quran?", arabicPrompt: "١١٤", emoji: "📚", options: ["99", "30", "114"], correctIndex: 2, funFact: "114 — longest Baqarah, shortest Kawthar!", praise: "Champion counter! 🏆" },
      { id: "k5_q2", question: "Which Surah has NO Bismillah at the start?", arabicPrompt: "التوبة", emoji: "🚫", options: ["An-Nas", "At-Tawbah (9)", "Al-Fatiha"], correctIndex: 1, funFact: "Only Surah 9 has no Bismillah!", praise: "Tricky one — nailed it! 🚫" },
      { id: "k5_q3", question: "Which Surah has TWO Bismillahs?", arabicPrompt: "النمل", emoji: "✌️", options: ["An-Naml (27)", "Al-Fil", "Al-Asr"], correctIndex: 0, funFact: "Second Bismillah inside verse 30!", praise: "Double detective! ✌️" },
      { id: "k5_q4", question: "Which is the LONGEST Surah?", arabicPrompt: "البقرة", emoji: "📜", options: ["Al-Imran", "Al-Baqarah", "An-Nisa"], correctIndex: 1, funFact: "Al-Baqarah — 286 verses!", praise: "Long-book legend! 📜" },
      { id: "k5_q5", question: "How many Juz (parts) in the Quran?", arabicPrompt: "٣٠", emoji: "🧩", options: ["20", "30", "40"], correctIndex: 1, funFact: "30 Juz — one per Ramadan day!", praise: "Puzzle perfect! 🧩" },
      { id: "k5_q6", question: "What was the FIRST word revealed? (Cave Hira)", arabicPrompt: "اقْرَأْ", emoji: "⛰️", options: ["Pray!", "Fast!", "Iqra (Read)!"], correctIndex: 2, funFact: "Iqra — first command!", praise: "Reader champion! ⛰️" },
      { id: "k5_q7", question: "Over how many years was the Quran revealed?", arabicPrompt: "٢٣", emoji: "📆", options: ["23 years", "10 years", "40 years"], correctIndex: 0, funFact: "23 years to Prophet Muhammad ﷺ!", praise: "History hero! 📆" },
      { id: "k5_q8", question: "Which is the greatest verse (Ayatul Kursi)?", arabicPrompt: "آية الكرسي", emoji: "🛡️", options: ["2:255", "1:1", "112:1"], correctIndex: 0, funFact: "Al-Baqarah 255 — read for protection!", praise: "Throne-verse titan! 🛡️" },
      { id: "k5_q9", question: "Which Surah is the HEART of the Quran?", arabicPrompt: "يس", emoji: "💛", options: ["Al-Kahf", "An-Nas", "Yaa-Seen"], correctIndex: 2, funFact: "Surah Yaa-Seen!", praise: "Heart of gold! 💛" },
      { id: "k5_q10", question: "Which angel brought the Quran?", arabicPrompt: "جِبْرِيل", emoji: "👼", options: ["Jibreel (AS)", "Malik", "Israfil"], correctIndex: 0, funFact: "Angel of revelation!", praise: "Heavenly! 👼" },
    ],
  },
];
