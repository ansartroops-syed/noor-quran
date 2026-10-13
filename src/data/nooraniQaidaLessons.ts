export interface QaidaCard {
  arabic: string;
  transliteration: string;
  note?: string;
}

export interface QaidaGroup {
  title: string;
  items: QaidaCard[];
}

export interface NooraniLesson {
  id: string;
  number: number;
  title: string;
  arabicTitle: string;
  instruction: string;
  groups: QaidaGroup[];
}

const LETTERS: Array<[string, string]> = [
  ["ا", "a"],
  ["ب", "ba"],
  ["ت", "ta"],
  ["ث", "tha"],
  ["ج", "ja"],
  ["ح", "ha"],
  ["خ", "kha"],
  ["د", "da"],
  ["ذ", "dha"],
  ["ر", "ra"],
  ["ز", "za"],
  ["س", "sa"],
  ["ش", "sha"],
  ["ص", "sa"],
  ["ض", "da"],
  ["ط", "ta"],
  ["ظ", "za"],
  ["ع", "'a"],
  ["غ", "gha"],
  ["ف", "fa"],
  ["ق", "qa"],
  ["ك", "ka"],
  ["ل", "la"],
  ["م", "ma"],
  ["ن", "na"],
  ["و", "wa"],
  ["ه", "ha"],
  ["ء", "hamza"],
  ["ي", "ya"],
];

function row(mark: string, sound: (base: string) => string): QaidaCard[] {
  return LETTERS.map(([letter, base]) => ({
    arabic: `${letter}${mark}`,
    transliteration: sound(base),
  }));
}

function cards(entries: Array<[string, string, string?]>): QaidaCard[] {
  return entries.map(([arabic, transliteration, note]) => ({ arabic, transliteration, note }));
}

export const NOORANI_LESSONS: NooraniLesson[] = [
  {
    id: "single-letters",
    number: 1,
    title: "Single Letters",
    arabicTitle: "حُرُوفُ الْمُفْرَدَاتِ",
    instruction: "Learn every Arabic letter on its own before joining or adding vowels. Tap a letter to hear it.",
    groups: [
      {
        title: "The full alphabet",
        items: LETTERS.map(([arabic, transliteration]) => ({ arabic, transliteration })),
      },
      {
        title: "Hamza shapes",
        items: cards([
          ["ء", "hamza", "On the line"],
          ["أ", "a", "Hamza on alif"],
          ["إ", "i", "Hamza under alif"],
          ["ؤ", "u", "Hamza on waw"],
          ["ئ", "i", "Hamza on yaa"],
        ]),
      },
    ],
  },
  {
    id: "joined-letters",
    number: 2,
    title: "Joined Letters",
    arabicTitle: "حُرُوفُ الْمُرَكَّبَاتِ",
    instruction: "Most letters join to the letter after them. Six letters do not join onward: ا د ذ ر ز و.",
    groups: [
      {
        title: "Letters that do not join to the next letter",
        items: cards([
          ["ا", "alif"],
          ["د", "daal"],
          ["ذ", "dhaal"],
          ["ر", "raa"],
          ["ز", "zay"],
          ["و", "waw"],
        ]),
      },
      {
        title: "Three joined forms",
        items: cards([
          ["ب‍ب‍ب", "ba ba ba"],
          ["ت‍ت‍ت", "ta ta ta"],
          ["ث‍ث‍ث", "tha tha tha"],
          ["ج‍ج‍ج", "ja ja ja"],
          ["ح‍ح‍ح", "ha ha ha"],
          ["خ‍خ‍خ", "kha kha kha"],
          ["س‍س‍س", "sa sa sa"],
          ["ش‍ش‍ش", "sha sha sha"],
          ["ص‍ص‍ص", "sad sad sad"],
          ["ض‍ض‍ض", "dad dad dad"],
          ["ط‍ط‍ط", "ta ta ta"],
          ["ظ‍ظ‍ظ", "za za za"],
          ["ع‍ع‍ع", "ayn ayn ayn"],
          ["غ‍غ‍غ", "ghayn ghayn ghayn"],
          ["ف‍ف‍ف", "fa fa fa"],
          ["ق‍ق‍ق", "qa qa qa"],
          ["ك‍ك‍ك", "ka ka ka"],
          ["ل‍ل‍ل", "la la la"],
          ["م‍م‍م", "ma ma ma"],
          ["ن‍ن‍ن", "na na na"],
          ["ه‍ه‍ه", "ha ha ha"],
          ["ي‍ي‍ي", "ya ya ya"],
        ]),
      },
      {
        title: "Letter plus alif",
        items: cards([
          ["با", "baa"], ["تا", "taa"], ["ثا", "thaa"], ["جا", "jaa"], ["حا", "haa"], ["خا", "khaa"],
          ["دا", "daa"], ["ذا", "dhaa"], ["را", "raa"], ["زا", "zaa"], ["سا", "saa"], ["شا", "shaa"],
          ["صا", "saa"], ["ضا", "daa"], ["طا", "taa"], ["ظا", "zaa"], ["عا", "'aa"], ["غا", "ghaa"],
          ["فا", "faa"], ["قا", "qaa"], ["كا", "kaa"], ["لا", "laa"], ["ما", "maa"], ["نا", "naa"],
          ["وا", "waa"], ["ها", "haa"], ["يا", "yaa"],
        ]),
      },
    ],
  },
  {
    id: "muqattaat",
    number: 3,
    title: "Separated Quranic Letters",
    arabicTitle: "حُرُوفُ الْمُقَطَّعَاتِ",
    instruction: "These letter groups open some surahs. Read each letter separately, not as one ordinary word.",
    groups: [
      {
        title: "Huroof al-Muqatta'at",
        items: cards([
          ["الٓمّٓ", "Alif Lam Meem"],
          ["الٓمّٓصٓ", "Alif Lam Meem Sad"],
          ["الٓرٰ", "Alif Lam Raa"],
          ["الٓمّٓرٰ", "Alif Lam Meem Raa"],
          ["كٓهٰيٰعٓصٓ", "Kaf Ha Ya Ain Sad"],
          ["طٰهٰ", "Ta Ha"],
          ["طٰسٓمّٓ", "Ta Seen Meem"],
          ["طٰسٓ", "Ta Seen"],
          ["يٰسٓ", "Ya Seen"],
          ["صٓ", "Sad"],
          ["حٰمٓ", "Ha Meem"],
          ["عٓسٓقٓ", "Ain Seen Qaf"],
          ["قٓ", "Qaf"],
          ["نٓ", "Noon"],
        ]),
      },
    ],
  },
  {
    id: "harakat",
    number: 4,
    title: "Short Vowels",
    arabicTitle: "الْحَرَكَاتُ",
    instruction: "Fatha is a short a above the letter. Kasra is a short i below it. Damma is a short u above it.",
    groups: [
      { title: "Fatha — short a", items: row("َ", (base) => base.replace(/a$/, "") + "a") },
      { title: "Kasra — short i", items: row("ِ", (base) => base.replace(/a$/, "") + "i") },
      { title: "Damma — short u", items: row("ُ", (base) => base.replace(/a$/, "") + "u") },
    ],
  },
  {
    id: "harakat-practice",
    number: 5,
    title: "Short Vowel Practice",
    arabicTitle: "مَشْقُ الْحَرَكَاتِ",
    instruction: "Join the short vowels into small words. Do not stretch any vowel yet.",
    groups: [
      {
        title: "Two and three letter drills",
        items: cards([
          ["بَتَ", "bata"], ["بَثَ", "batha"], ["جَعَ", "ja'a"], ["خَلَ", "khala"],
          ["دَرَ", "dara"], ["سَمِ", "sami"], ["عَلِ", "ali"], ["كَتَ", "kata"],
          ["أَبَدَ", "abada"], ["بَرَزَ", "baraza"], ["تَرَكَ", "taraka"], ["جَعَلَ", "ja'ala"],
          ["خَلَقَ", "khalaqa"], ["ذَهَبَ", "dhahaba"], ["سَمِعَ", "sami'a"], ["عَلِمَ", "alima"],
          ["غَفَرَ", "ghafara"], ["فَتَحَ", "fataha"], ["كَتَبَ", "kataba"], ["نَصَرَ", "nasara"],
        ]),
      },
    ],
  },
  {
    id: "tanween",
    number: 6,
    title: "Tanween",
    arabicTitle: "التَّنْوِينُ",
    instruction: "A double vowel adds a clear n sound: -an, -in, or -un. It is used at the end of many words.",
    groups: [
      { title: "Fathatain — an", items: row("ً", (base) => base.replace(/a$/, "") + "an") },
      { title: "Kasratain — in", items: row("ٍ", (base) => base.replace(/a$/, "") + "in") },
      { title: "Dammatain — un", items: row("ٌ", (base) => base.replace(/a$/, "") + "un") },
      {
        title: "Word practice",
        items: cards([
          ["أَحَدًا", "ahadan"], ["كِتَابًا", "kitaban"], ["هُدًى", "hudan"],
          ["عَذَابٍ", "adhabin"], ["خَيْرٍ", "khayrin"], ["نَارٌ", "narun"],
          ["غَفُورٌ", "ghafoorun"], ["رَحِيمٌ", "raheemun"], ["عَلِيمٌ", "aleemun"],
        ]),
      },
    ],
  },
  {
    id: "standing-vowels",
    number: 7,
    title: "Standing Vowels",
    arabicTitle: "الْحَرَكَاتُ الْقَائِمَةُ",
    instruction: "A standing vowel is held a little longer than a normal short vowel, but it is not a full madd.",
    groups: [
      { title: "Standing fatha", items: row("ٰ", (base) => base.replace(/a$/, "") + "aa") },
      { title: "Standing kasra", items: row("ٖ", (base) => base.replace(/a$/, "") + "ee") },
      { title: "Standing damma", items: row("ٗ", (base) => base.replace(/a$/, "") + "oo") },
      {
        title: "Practice words",
        items: cards([
          ["هٰذَا", "haathaa", "this"],
          ["ذٰلِكَ", "dhaalika", "that"],
          ["مٰلِكِ", "maaliki", "Master of"],
          ["عِبٰدِهِ", "ibaadihi", "His servants"],
          ["يٰمُوسٰى", "yaa Moosaa", "O Moses"],
          ["اِلٰهِ", "ilaahi", "God of"],
        ]),
      },
    ],
  },
  {
    id: "sukoon",
    number: 8,
    title: "Sukoon",
    arabicTitle: "السُّكُونُ",
    instruction: "Sukoon means the letter has no vowel. Join it directly to the vowelled letter before it.",
    groups: [
      { title: "Alif with sukoon on each letter", items: row("ْ", (base) => "a" + base.replace(/a$/, "")) },
      {
        title: "Common sukoon words",
        items: cards([
          ["قُلْ", "qul", "Say"],
          ["مِنْ", "min", "from"],
          ["عَنْ", "an", "about"],
          ["قَدْ", "qad", "indeed"],
          ["بَلْ", "bal", "rather"],
          ["كَمْ", "kam", "how many"],
          ["اَبْ", "ab"],
          ["اَنْ", "an"],
          ["اِذْ", "idh"],
        ]),
      },
    ],
  },
  {
    id: "sukoon-practice",
    number: 9,
    title: "Sukoon Practice",
    arabicTitle: "مَشْقُ السُّكُونِ",
    instruction: "Read the vowelled letter, then stop cleanly on the letter with sukoon. Do not add a, i, or u after it.",
    groups: [
      {
        title: "Joined practice",
        items: cards([
          ["اَبْتَ", "abta"], ["اَثْبَ", "athba"], ["اَجْرَ", "ajra"], ["اَحْسَ", "ahsa"],
          ["اَخْرَ", "akhra"], ["اَدْخُ", "adkhu"], ["اَرْسُ", "arsu"], ["اَسْمُ", "asmu"],
          ["اَنْعَمْتَ", "an'amta", "You bestowed"],
          ["يَعْلَمُ", "ya'lamu", "He knows"],
          ["نَسْتَعِينُ", "nasta'eenu", "we ask for help"],
          ["اَلْحَمْدُ", "alhamdu", "all praise"],
        ]),
      },
    ],
  },
  {
    id: "shaddah",
    number: 10,
    title: "Shaddah",
    arabicTitle: "التَّشْدِيدُ",
    instruction: "Shaddah doubles the letter. Hold the first silent letter, then release it with the vowel shown.",
    groups: [
      { title: "Shaddah with fatha", items: row("َّ", (base) => base.replace(/a$/, "") + base.replace(/a$/, "") + "a") },
      { title: "Shaddah with kasra", items: row("ِّ", (base) => base.replace(/a$/, "") + base.replace(/a$/, "") + "i") },
      { title: "Shaddah with damma", items: row("ُّ", (base) => base.replace(/a$/, "") + base.replace(/a$/, "") + "u") },
    ],
  },
  {
    id: "shaddah-practice",
    number: 11,
    title: "Shaddah Practice",
    arabicTitle: "مَشْقُ التَّشْدِيدِ",
    instruction: "These words need a clear doubled letter. Noon and meem with shaddah also have a nasal sound.",
    groups: [
      {
        title: "Words with shaddah",
        items: cards([
          ["رَبِّ", "rabbi", "my Lord"],
          ["ثُمَّ", "thumma", "then"],
          ["اِنَّ", "inna", "indeed"],
          ["كُلُّ", "kullu", "every"],
          ["اِيَّاكَ", "iyyaka", "You alone"],
          ["اللّٰهِ", "Allahi", "of Allah"],
          ["الرَّحْمٰنِ", "ar-Rahmani", "the Most Gracious"],
          ["جَنَّةٍ", "jannatin", "a garden"],
          ["النَّاسِ", "an-naasi", "mankind"],
          ["الْحَقِّ", "al-haqqi", "the truth"],
        ]),
      },
    ],
  },
  {
    id: "madd",
    number: 12,
    title: "Madd: Long Vowels",
    arabicTitle: "الْمَدُّ",
    instruction: "A long vowel is held for two counts. Fatha plus alif makes aa. Kasra plus yaa makes ee. Damma plus waw makes oo.",
    groups: [
      { title: "Madd with alif — aa", items: row("َا", (base) => base.replace(/a$/, "") + "aa") },
      { title: "Madd with yaa — ee", items: row("ِي", (base) => base.replace(/a$/, "") + "ee") },
      { title: "Madd with waw — oo", items: row("ُو", (base) => base.replace(/a$/, "") + "oo") },
    ],
  },
  {
    id: "madd-practice",
    number: 13,
    title: "Madd Practice",
    arabicTitle: "مَشْقُ الْمَدِّ",
    instruction: "Stretch the long vowel smoothly for two counts, then continue. Do not rush قَالَ into قَلَ.",
    groups: [
      {
        title: "Long-vowel words",
        items: cards([
          ["قَالَ", "qaala", "he said"],
          ["كَانَ", "kaana", "he was"],
          ["قِيلَ", "qeela", "it was said"],
          ["يَقُولُ", "yaqoolu", "he says"],
          ["نُورٌ", "noorun", "a light"],
          ["كِتَابٌ", "kitaabun", "a book"],
          ["رَحِيمٌ", "raheemun", "especially merciful"],
          ["عَلِيمٌ", "aleemun", "all-knowing"],
          ["غَفُورٌ", "ghafoorun", "all-forgiving"],
          ["مُوسٰى", "Moosaa", "Moses"],
        ]),
      },
    ],
  },
  {
    id: "leen",
    number: 14,
    title: "Letters of Leen",
    arabicTitle: "حُرُوفُ اللِّينِ",
    instruction: "Waw or yaa with sukoon, after a fatha, is soft. Do not make it a full long oo or ee.",
    groups: [
      {
        title: "Soft waw and yaa",
        items: cards([
          ["بَوْ", "baw"], ["تَوْ", "taw"], ["ثَوْ", "thaw"], ["خَوْ", "khaw"], ["سَوْ", "saw"], ["قَوْ", "qaw"],
          ["بَيْ", "bay"], ["تَيْ", "tay"], ["ثَيْ", "thay"], ["شَيْ", "shay"], ["عَيْ", "ay"], ["قَيْ", "qay"],
          ["خَوْفٍ", "khawfin", "fear"],
          ["بَيْتٍ", "baytin", "a house"],
          ["قَوْمٍ", "qawmin", "a people"],
          ["يَوْمِ", "yawmi", "day of"],
        ]),
      },
    ],
  },
  {
    id: "noon-meem",
    number: 15,
    title: "Noon and Meem Sakinah",
    arabicTitle: "نُونْ سَاكِنَةٌ وَمِيمْ سَاكِنَةٌ",
    instruction: "Recognize a resting noon or meem. The nasal sound is practiced here before the full Tajweed rules.",
    groups: [
      {
        title: "Noon sakinah",
        items: cards([
          ["اَنْ", "an"], ["مِنْ", "min"], ["عَنْ", "an"], ["اِنْ", "in"],
          ["مَنْ يَّ", "may-ya", "blended noon"],
          ["مِنْ مَّ", "mim-ma", "noon before meem"],
          ["اَنْعَ", "an'a", "clear noon"],
          ["كُنْتُمْ", "kuntum", "hidden noon"],
        ]),
      },
      {
        title: "Meem sakinah",
        items: cards([
          ["اَمْ", "am"], ["هُمْ", "hum"], ["كُمْ", "kum"], ["لَمْ", "lam"],
          ["اَمْ بِ", "am-bi", "hidden meem"],
          ["هُمْ مُّ", "hum-mu", "merged meem"],
          ["عَلَيْهِمْ", "alayhim", "clear meem"],
        ]),
      },
    ],
  },
  {
    id: "qalqalah",
    number: 16,
    title: "Qalqalah",
    arabicTitle: "الْقَلْقَلَةُ",
    instruction: "The five echo letters are ق ط ب ج د. When one has sukoon, or you stop on it, let the sound bounce without adding a vowel.",
    groups: [
      {
        title: "The five letters",
        items: cards([
          ["قْ", "q", "echo"],
          ["طْ", "t", "echo"],
          ["بْ", "b", "echo"],
          ["جْ", "j", "echo"],
          ["دْ", "d", "echo"],
        ]),
      },
      {
        title: "Practice words",
        items: cards([
          ["اَقْ", "aq"], ["اَطْ", "at"], ["اَبْ", "ab"], ["اَجْ", "aj"], ["اَدْ", "ad"],
          ["يَخْلُقْ", "yakhluq", "He creates"],
          ["اَحَدْ", "ahad", "One, when stopping"],
          ["قَدْ", "qad", "indeed"],
          ["وَتَبْ", "watab", "and perish"],
          ["الْفَلَقِ", "al-falaq", "the daybreak"],
        ]),
      },
    ],
  },
  {
    id: "waqf",
    number: 17,
    title: "Stop Signs",
    arabicTitle: "عَلَامَاتُ الْوَقْفِ",
    instruction: "These small signs tell you where stopping is required, allowed, or not allowed.",
    groups: [
      {
        title: "Common signs",
        items: cards([
          ["مـ", "meem", "Must stop"],
          ["لا", "laa", "Do not stop"],
          ["ج", "jeem", "Stop is allowed"],
          ["ص", "sad", "Pause is preferred"],
          ["ق", "qaf", "Better not to stop"],
          ["ۙ", "stop sign", "Stop"],
          ["ۚ", "jeem sign", "Permitted stop"],
          ["ۛ", "equal pause", "Pause or continue"],
          ["ۜ", "saktah", "A brief breathless pause"],
          ["۝", "ayah mark", "End of a verse"],
        ]),
      },
    ],
  },
  {
    id: "fatiha-practice",
    number: 18,
    title: "Complete Practice: Al-Fatiha",
    arabicTitle: "مَشْقُ سُورَةِ الْفَاتِحَةِ",
    instruction: "Read slowly. Use the vowels, sukoon, shaddah, and madd you have learned. This is the final Qaida practice.",
    groups: [
      {
        title: "Word by word",
        items: cards([
          ["بِسْمِ", "bismi", "In the name"],
          ["اللّٰهِ", "Allahi", "of Allah"],
          ["الرَّحْمٰنِ", "ar-Rahmani", "the Most Gracious"],
          ["الرَّحِيْمِ", "ar-Raheemi", "the Most Merciful"],
          ["اَلْحَمْدُ", "alhamdu", "All praise"],
          ["لِلّٰهِ", "lillahi", "is for Allah"],
          ["رَبِّ", "rabbi", "Lord"],
          ["الْعٰلَمِيْنَ", "al-aalameen", "of all the worlds"],
          ["مٰلِكِ", "maaliki", "Master"],
          ["يَوْمِ", "yawmi", "of the Day"],
          ["الدِّيْنِ", "ad-deen", "of Judgement"],
          ["اِيَّاكَ", "iyyaka", "You alone"],
          ["نَعْبُدُ", "na'budu", "we worship"],
          ["وَاِيَّاكَ", "wa iyyaka", "and You alone"],
          ["نَسْتَعِيْنُ", "nasta'eenu", "we ask for help"],
          ["اِهْدِنَا", "ihdinaa", "Guide us"],
          ["الصِّرَاطَ", "as-siraata", "to the path"],
          ["الْمُسْتَقِيْمَ", "al-mustaqeema", "the straight"],
        ]),
      },
      {
        title: "Full lines",
        items: cards([
          ["بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", "Bismillahi ar-Rahmani ar-Raheem"],
          ["اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ", "Alhamdu lillahi rabbil-aalameen"],
          ["الرَّحْمٰنِ الرَّحِيْمِ", "Ar-Rahmani ar-Raheem"],
          ["مٰلِكِ يَوْمِ الدِّيْنِ", "Maliki yawmid-deen"],
          ["اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ", "Iyyaka na'budu wa iyyaka nasta'een"],
          ["اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ", "Ihdinas-siraatal-mustaqeem"],
          ["صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ", "Siratal-ladheena an'amta alayhim"],
          ["غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّآلِّيْنَ", "Ghayril-maghdoobi alayhim wa lad-daalleen"],
        ]),
      },
    ],
  },
];
