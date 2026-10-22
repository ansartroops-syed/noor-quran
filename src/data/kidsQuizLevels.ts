export interface KidsQuestion {
  prompt: string;
  arabic?: string;
  options: string[];
  answer: number;
  praise: string;
}

export interface KidsLevel {
  id: string;
  number: number;
  title: string;
  emoji: string;
  color: string;
  intro: string;
  questions: KidsQuestion[];
}

export const KIDS_QUIZ_LEVELS: KidsLevel[] = [
  {
    id: "letters",
    number: 1,
    title: "Letter Friends",
    emoji: "🔤",
    color: "from-sky-100 to-sky-50",
    intro: "Tap the name of the big letter.",
    questions: [
      { prompt: "What is this letter?", arabic: "ا", options: ["Alif", "Baa", "Meem", "Noon"], answer: 0, praise: "Yes! Alif is the first friend." },
      { prompt: "What is this letter?", arabic: "ب", options: ["Taa", "Baa", "Yaa", "Laam"], answer: 1, praise: "Baa has one dot below." },
      { prompt: "What is this letter?", arabic: "م", options: ["Noon", "Waw", "Meem", "Qaf"], answer: 2, praise: "Meem sounds like mmmm." },
      { prompt: "What is this letter?", arabic: "ن", options: ["Noon", "Thaa", "Seen", "Ayn"], answer: 0, praise: "Noon has one dot above." },
      { prompt: "Which letter says Laam?", arabic: "ل", options: ["Kaaf", "Laam", "Daal", "Jeem"], answer: 1, praise: "Laam is tall and lovely." },
    ],
  },
  {
    id: "bismillah",
    number: 2,
    title: "Bismillah Garden",
    emoji: "🌱",
    color: "from-emerald-100 to-lime-50",
    intro: "Learn the beautiful opening words.",
    questions: [
      { prompt: "What do we say before we start?", arabic: "بِسْمِ اللّٰهِ", options: ["Bismillah", "Alhamdulillah", "Subhanallah", "Allahu Akbar"], answer: 0, praise: "Bismillah means we begin with Allah's name." },
      { prompt: "Who is Ar-Rahman?", options: ["The Most Gracious", "A mountain", "A star", "A river"], answer: 0, praise: "Allah is Ar-Rahman, the Most Gracious." },
      { prompt: "Ar-Raheem means...", options: ["The Most Merciful", "The sun", "A book", "A bird"], answer: 0, praise: "Allah's mercy is very special." },
      { prompt: "Which line is Bismillah?", options: ["بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", "اَلْحَمْدُ لِلّٰهِ", "قُلْ هُوَ اللّٰهُ اَحَدٌ", "اِيَّاكَ نَعْبُدُ"], answer: 0, praise: "You found Bismillah!" },
      { prompt: "Bismillah comes at the start of most surahs. Which surah does not begin with it?", options: ["At-Tawbah", "Al-Fatiha", "Al-Ikhlas", "An-Nas"], answer: 0, praise: "Surah At-Tawbah is the special one." },
    ],
  },
  {
    id: "surah-names",
    number: 3,
    title: "Surah Name Picnic",
    emoji: "🧺",
    color: "from-amber-100 to-orange-50",
    intro: "Match the surah to its friendly meaning.",
    questions: [
      { prompt: "Al-Fatiha means...", options: ["The Opening", "The Elephant", "The Night", "The Star"], answer: 0, praise: "Al-Fatiha opens the Quran." },
      { prompt: "Al-Ikhlas is about...", options: ["Allah is One", "A big ship", "A garden only", "A camel"], answer: 0, praise: "Allah is One. That is Ikhlas." },
      { prompt: "An-Nas means...", options: ["Mankind", "The moon", "A river", "A house"], answer: 0, praise: "An-Nas means people, all of us." },
      { prompt: "Al-Falaq is a surah for...", options: ["Seeking protection", "Counting camels", "Drawing stars", "Building a tent"], answer: 0, praise: "We ask Allah to protect us." },
      { prompt: "How many surahs are in the Quran?", options: ["114", "10", "30", "7"], answer: 0, praise: "114 surahs, like 114 treasure boxes." },
    ],
  },
  {
    id: "finish-ayah",
    number: 4,
    title: "Finish the Ayah",
    emoji: "✨",
    color: "from-violet-100 to-fuchsia-50",
    intro: "Pick the words that come next.",
    questions: [
      { prompt: "اَلْحَمْدُ لِلّٰهِ ...", options: ["رَبِّ الْعٰلَمِيْنَ", "قُلْ هُوَ", "مِنْ شَرِّ", "اَحَدٌ"], answer: 0, praise: "Lord of all the worlds." },
      { prompt: "قُلْ هُوَ اللّٰهُ ...", options: ["اَحَدٌ", "الرَّحِيْمِ", "الْفَلَقِ", "النَّاسِ"], answer: 0, praise: "Allah is Ahad, One." },
      { prompt: "اِيَّاكَ نَعْبُدُ وَ ...", options: ["اِيَّاكَ نَسْتَعِيْنُ", "الْعٰلَمِيْنَ", "مَالِكِ", "بِسْمِ"], answer: 0, praise: "We ask Allah for help." },
      { prompt: "قُلْ اَعُوْذُ بِرَبِّ ...", options: ["الْفَلَقِ", "الْكِتَابِ", "الْبَيْتِ", "الْقَمَرِ"], answer: 0, praise: "Lord of the daybreak." },
      { prompt: "The last surah of the Quran is...", options: ["An-Nas", "Al-Baqarah", "Ya-Sin", "Ar-Rahman"], answer: 0, praise: "An-Nas is surah 114." },
    ],
  },
  {
    id: "meanings",
    number: 5,
    title: "Kind Word Meanings",
    emoji: "💛",
    color: "from-rose-100 to-pink-50",
    intro: "Little words with big meanings.",
    questions: [
      { prompt: "What does Noor mean?", arabic: "نُور", options: ["Light", "Shoe", "Cloud", "Boat"], answer: 0, praise: "Noor is light." },
      { prompt: "What does Jannah mean?", arabic: "جَنَّة", options: ["Paradise", "Pencil", "Market", "Rain"], answer: 0, praise: "Jannah is Paradise." },
      { prompt: "Alhamdulillah means...", options: ["All praise is for Allah", "Good night", "Please sit", "Open the door"], answer: 0, praise: "We praise Allah." },
      { prompt: "Rabb means...", options: ["Lord", "Apple", "Window", "Horse"], answer: 0, praise: "Allah is our Rabb." },
      { prompt: "Which word means peace?", options: ["Salaam", "Qalam", "Qamar", "Jabal"], answer: 0, praise: "Salaam is peace." },
    ],
  },
  {
    id: "champion",
    number: 6,
    title: "Little Hafiz Champion",
    emoji: "🏆",
    color: "from-yellow-100 to-amber-50",
    intro: "A gentle mix of everything you learned.",
    questions: [
      { prompt: "Which is the opening surah?", options: ["Al-Fatiha", "Al-Fil", "Al-Asr", "Al-Kawthar"], answer: 0, praise: "Al-Fatiha comes first." },
      { prompt: "Allah is...", options: ["One", "Two", "Three", "Many"], answer: 0, praise: "Allah is One." },
      { prompt: "Pick the letter Meem.", options: ["م", "ب", "ت", "ك"], answer: 0, praise: "That round letter is Meem." },
      { prompt: "We begin with...", options: ["Bismillah", "A story about a lion", "Counting toys", "A race"], answer: 0, praise: "Always a beautiful start." },
      { prompt: "Hifz means...", options: ["Memorizing the Quran", "Drawing a map", "Cooking rice", "Flying a kite"], answer: 0, praise: "You are learning to be a little hafiz!" },
    ],
  },
];
