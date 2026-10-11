export interface QuranAyah {
  ayahNumber: number;
  arabicUthmani: string;
  arabicTajweed?: string;
  transliteration: string;
  translationSaheeh: string;
  translationClearQuran?: string;
  audioUrl?: string;
  words: {
    arabic: string;
    transliteration: string;
    translation: string;
    tajweedRule?: string;
  }[];
  tafseerNote?: string;
}

export interface SurahDetail {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: "Meccan" | "Medinan";
  juzNumber: number;
  themeSummary: string;
  ayahs: QuranAyah[];
}

export const EMBEDDED_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    nameArabic: "الفاتحة",
    nameTransliterated: "Al-Fatihah",
    nameEnglish: "The Opening",
    versesCount: 7,
    revelationType: "Meccan",
    juzNumber: 1,
    themeSummary: "The quintessential prayer and opening chapter of the Quran, summarizing the essence of monotheism, divine mercy, worship, and the quest for righteous guidance.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismi-Llaahir-Rahmaanir-Raheem",
        translationSaheeh: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        words: [
          { arabic: "بِسْمِ", transliteration: "Bismi", translation: "In the name" },
          { arabic: "اللَّهِ", transliteration: "Allāh", translation: "(of) Allah", tajweedRule: "Tafkheem" },
          { arabic: "الرَّحْمَٰنِ", transliteration: "Ar-Rahmān", translation: "the Entirely Merciful", tajweedRule: "Madd Asli" },
          { arabic: "الرَّحِيمِ", transliteration: "Ar-Raheem", translation: "the Especially Merciful", tajweedRule: "Madd Aridh" },
        ],
        tafseerNote: "Every action of a believer begins with seeking the blessing and remembrance of Allah.",
      },
      {
        ayahNumber: 2,
        arabicUthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Al-hamdu li-Llaahi Rabbil-'aalameen",
        translationSaheeh: "All praise is due to Allah, Lord of the worlds.",
        words: [
          { arabic: "الْحَمْدُ", transliteration: "Al-hamdu", translation: "All praise" },
          { arabic: "لِلَّهِ", transliteration: "lillāhi", translation: "(is due) to Allah" },
          { arabic: "رَبِّ", transliteration: "Rabbi", translation: "Lord / Sustainer" },
          { arabic: "الْعَالَمِينَ", transliteration: "al-'ālameen", translation: "of all the worlds", tajweedRule: "Madd Aridh" },
        ],
        tafseerNote: "Praising Allah with gratitude for His infinite sustenance across all realms of existence.",
      },
      {
        ayahNumber: 3,
        arabicUthmani: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Ar-Rahmaanir-Raheem",
        translationSaheeh: "The Entirely Merciful, the Especially Merciful.",
        words: [
          { arabic: "الرَّحْمَٰنِ", transliteration: "Ar-Rahmān", translation: "The Entirely Merciful", tajweedRule: "Madd Asli" },
          { arabic: "الرَّحِيمِ", transliteration: "Ar-Raheem", translation: "The Especially Merciful", tajweedRule: "Madd Aridh" },
        ],
        tafseerNote: "Ar-Rahman denotes boundless mercy for all creation; Ar-Raheem denotes His special mercy for believers.",
      },
      {
        ayahNumber: 4,
        arabicUthmani: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: "Maaliki Yawmid-Deen",
        translationSaheeh: "Sovereign of the Day of Recompense.",
        words: [
          { arabic: "مَالِكِ", transliteration: "Māliki", translation: "Master / Owner / King", tajweedRule: "Madd Asli" },
          { arabic: "يَوْمِ", transliteration: "Yawmi", translation: "(of the) Day" },
          { arabic: "الدِّينِ", transliteration: "ad-Deen", translation: "(of) Recompense / Judgment", tajweedRule: "Madd Aridh" },
        ],
        tafseerNote: "Allah alone holds supreme judgment on the Day when all deeds are laid bare.",
      },
      {
        ayahNumber: 5,
        arabicUthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een",
        translationSaheeh: "It is You we worship and You we ask for help.",
        words: [
          { arabic: "إِيَّاكَ", transliteration: "Iyyāka", translation: "You alone", tajweedRule: "Shaddah" },
          { arabic: "نَعْبُدُ", transliteration: "na'budu", translation: "we worship" },
          { arabic: "وَإِيَّاكَ", transliteration: "wa-iyyāka", translation: "and You alone", tajweedRule: "Shaddah" },
          { arabic: "نَسْتَعِينُ", transliteration: "nasta'een", translation: "we ask for help", tajweedRule: "Madd Aridh" },
        ],
        tafseerNote: "The heart of Tawheed (Monotheism): exclusive devotion and absolute reliance upon Allah.",
      },
      {
        ayahNumber: 6,
        arabicUthmani: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdinas-Siraatal-Mustaqeem",
        translationSaheeh: "Guide us to the straight path.",
        words: [
          { arabic: "اهْدِنَا", transliteration: "Ihdinā", translation: "Guide us" },
          { arabic: "الصِّرَاطَ", transliteration: "as-Sirāta", translation: "(to) the Path", tajweedRule: "Tafkheem (Saad & Tta)" },
          { arabic: "الْمُسْتَقِيمَ", transliteration: "al-Mustaqeem", translation: "the Straight", tajweedRule: "Madd Aridh" },
        ],
        tafseerNote: "The ultimate supplication: continuously asking Allah to keep our hearts upon truth and righteousness.",
      },
      {
        ayahNumber: 7,
        arabicUthmani: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration: "Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daaaalleen",
        translationSaheeh: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        words: [
          { arabic: "صِرَاطَ", transliteration: "Sirāta", translation: "The path" },
          { arabic: "الَّذِينَ", transliteration: "alladheena", translation: "(of) those who" },
          { arabic: "أَنْعَمْتَ", transliteration: "an'amta", translation: "You have bestowed favor", tajweedRule: "Izhar Halqi (Noon + Ayn)" },
          { arabic: "عَلَيْهِمْ", transliteration: "'alayhim", translation: "upon them" },
          { arabic: "غَيْرِ", transliteration: "ghayri", translation: "not (of)" },
          { arabic: "الْمَغْضُوبِ", transliteration: "al-maghdoobi", translation: "those who evoked anger" },
          { arabic: "عَلَيْهِمْ", transliteration: "'alayhim", translation: "upon them" },
          { arabic: "وَلَا", transliteration: "wa-lā", translation: "nor (of)" },
          { arabic: "الضَّالِّينَ", transliteration: "ad-dāāllleen", translation: "those who are astray", tajweedRule: "Madd Lazim (6 counts)" },
        ],
        tafseerNote: "The blessed path of the Prophets, the truthful, the martyrs, and the righteous.",
      },
    ],
  },
  112: {
    number: 112,
    nameArabic: "الإخلاص",
    nameTransliterated: "Al-Ikhlas",
    nameEnglish: "The Sincerity (Purity of Faith)",
    versesCount: 4,
    revelationType: "Meccan",
    juzNumber: 30,
    themeSummary: "The absolute declaration of the Oneness and Self-Sufficiency of Allah, equaling one-third of the Quran in spiritual weight.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: "Qul Huwa-Llaahu Ahad",
        translationSaheeh: "Say, 'He is Allah, [who is] One.'",
        words: [
          { arabic: "قُلْ", transliteration: "Qul", translation: "Say" },
          { arabic: "هُوَ", transliteration: "Huwa", translation: "He is" },
          { arabic: "اللَّهُ", transliteration: "Allāhu", translation: "Allah", tajweedRule: "Tafkheem" },
          { arabic: "أَحَدٌ", transliteration: "Ahad", translation: "One / Unique", tajweedRule: "Qalqalah (Kubra)" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "اللَّهُ الصَّمَدُ",
        transliteration: "Allāhus-Samad",
        translationSaheeh: "Allah, the Eternal Refuge (The Absolute, upon whom all depend).",
        words: [
          { arabic: "اللَّهُ", transliteration: "Allāhu", translation: "Allah", tajweedRule: "Tafkheem" },
          { arabic: "الصَّمَدُ", transliteration: "as-Samad", translation: "the Eternal Refuge", tajweedRule: "Qalqalah" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yoolad",
        translationSaheeh: "He neither begets nor is born,",
        words: [
          { arabic: "لَمْ", transliteration: "Lam", translation: "Not" },
          { arabic: "يَلِدْ", transliteration: "yalid", translation: "He begets", tajweedRule: "Qalqalah (Daal)" },
          { arabic: "وَلَمْ", transliteration: "wa lam", translation: "and not" },
          { arabic: "يُولَدْ", transliteration: "yoolad", translation: "is He begotten", tajweedRule: "Qalqalah (Daal)" },
        ],
      },
      {
        ayahNumber: 4,
        arabicUthmani: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Wa lam yakul-lahoo kufuwan ahad",
        translationSaheeh: "Nor is there to Him any equivalent.",
        words: [
          { arabic: "وَلَمْ", transliteration: "Wa lam", translation: "And not" },
          { arabic: "يَكُن", transliteration: "yakul-", translation: "is there", tajweedRule: "Idgham bila Ghunnah (Noon + Lam)" },
          { arabic: "لَّهُ", transliteration: "lahoo", translation: "to Him", tajweedRule: "Madd Silah" },
          { arabic: "كُفُوًا", transliteration: "kufuwan", translation: "equal / comparable" },
          { arabic: "أَحَدٌ", transliteration: "ahad", translation: "any one", tajweedRule: "Qalqalah (Kubra)" },
        ],
      },
    ],
  },
  113: {
    number: 113,
    nameArabic: "الفلق",
    nameTransliterated: "Al-Falaq",
    nameEnglish: "The Daybreak",
    versesCount: 5,
    revelationType: "Meccan",
    juzNumber: 30,
    themeSummary: "A profound divine refuge seeking protection from all external evils, darkness, witchcraft, and envy.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        transliteration: "Qul a'oodhu bi-Rabbil-falaq",
        translationSaheeh: "Say, 'I seek refuge in the Lord of daybreak'",
        words: [
          { arabic: "قُلْ", transliteration: "Qul", translation: "Say" },
          { arabic: "أَعُوذُ", transliteration: "a'oodhu", translation: "I seek refuge" },
          { arabic: "بِرَبِّ", transliteration: "bi-Rabbi", translation: "in the Lord" },
          { arabic: "الْفَلَقِ", transliteration: "al-falaq", translation: "(of) the daybreak", tajweedRule: "Qalqalah (Qaaf)" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "مِن شَرِّ مَا خَلَقَ",
        transliteration: "Min sharri maa khalaq",
        translationSaheeh: "From the evil of that which He created",
        words: [
          { arabic: "مِن", transliteration: "Min", translation: "From", tajweedRule: "Ikhfa (Noon + Sheen)" },
          { arabic: "شَرِّ", transliteration: "sharri", translation: "the evil" },
          { arabic: "مَا", transliteration: "mā", translation: "(of) what" },
          { arabic: "خَلَقَ", transliteration: "khalaq", translation: "He created", tajweedRule: "Qalqalah (Qaaf)" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        transliteration: "Wa min sharri ghaasiqin idhaa waqab",
        translationSaheeh: "And from the evil of darkness when it settles",
        words: [
          { arabic: "وَمِن", transliteration: "Wa min", translation: "And from", tajweedRule: "Ikhfa" },
          { arabic: "شَرِّ", transliteration: "sharri", translation: "the evil (of)" },
          { arabic: "غَاسِقٍ", transliteration: "ghāsiqin", translation: "darkness", tajweedRule: "Izhar (Tanween + Hamzah)" },
          { arabic: "إِذَا", transliteration: "idhā", translation: "when" },
          { arabic: "وَقَبَ", transliteration: "waqab", translation: "it spreads", tajweedRule: "Qalqalah (Baa)" },
        ],
      },
      {
        ayahNumber: 4,
        arabicUthmani: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        transliteration: "Wa min sharrin-naffaathaati fil-'uqad",
        translationSaheeh: "And from the evil of the blowers in knots",
        words: [
          { arabic: "وَمِن", transliteration: "Wa min", translation: "And from", tajweedRule: "Ikhfa" },
          { arabic: "شَرِّ", transliteration: "sharri", translation: "the evil (of)" },
          { arabic: "النَّفَّاثَاتِ", transliteration: "an-naffāthāt", translation: "the blowers", tajweedRule: "Ghunnah (Noon)" },
          { arabic: "فِي", transliteration: "fee", translation: "in" },
          { arabic: "الْعُقَدِ", transliteration: "al-'uqad", translation: "the knots", tajweedRule: "Qalqalah (Daal)" },
        ],
      },
      {
        ayahNumber: 5,
        arabicUthmani: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Wa min sharri haasidin idhaa hasad",
        translationSaheeh: "And from the evil of an envier when he envies.",
        words: [
          { arabic: "وَمِن", transliteration: "Wa min", translation: "And from", tajweedRule: "Ikhfa" },
          { arabic: "شَرِّ", transliteration: "sharri", translation: "the evil (of)" },
          { arabic: "حَاسِدٍ", transliteration: "hāsidin", translation: "an envier", tajweedRule: "Izhar (Tanween + Hamzah)" },
          { arabic: "إِذَا", transliteration: "idhā", translation: "when" },
          { arabic: "حَسَدَ", transliteration: "hasad", translation: "he envies", tajweedRule: "Qalqalah (Daal)" },
        ],
      },
    ],
  },
  114: {
    number: 114,
    nameArabic: "الناس",
    nameTransliterated: "An-Nas",
    nameEnglish: "Mankind",
    versesCount: 6,
    revelationType: "Meccan",
    juzNumber: 30,
    themeSummary: "Seeking divine sanctuary in the Lord, King, and God of mankind against internal whisperings (Waswas) of Satan and corrupt humans.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Qul a'oodhu bi-Rabbin-naas",
        translationSaheeh: "Say, 'I seek refuge in the Lord of mankind,'",
        words: [
          { arabic: "قُلْ", transliteration: "Qul", translation: "Say" },
          { arabic: "أَعُوذُ", transliteration: "a'oodhu", translation: "I seek refuge" },
          { arabic: "بِرَبِّ", transliteration: "bi-Rabbi", translation: "in the Lord" },
          { arabic: "النَّاسِ", transliteration: "an-nās", translation: "(of) mankind", tajweedRule: "Ghunnah (Noon) & Madd Aridh" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "مَلِكِ النَّاسِ",
        transliteration: "Malikin-naas",
        translationSaheeh: "The Sovereign of mankind,",
        words: [
          { arabic: "مَلِكِ", transliteration: "Maliki", translation: "The King / Sovereign" },
          { arabic: "النَّاسِ", transliteration: "an-nās", translation: "(of) mankind", tajweedRule: "Ghunnah & Madd Aridh" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "إِلَٰهِ النَّاسِ",
        transliteration: "Ilaahin-naas",
        translationSaheeh: "The God of mankind,",
        words: [
          { arabic: "إِلَٰهِ", transliteration: "Ilāhi", translation: "The God (of)" },
          { arabic: "النَّاسِ", transliteration: "an-nās", translation: "mankind", tajweedRule: "Ghunnah & Madd Aridh" },
        ],
      },
      {
        ayahNumber: 4,
        arabicUthmani: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        transliteration: "Min sharril-waswaasil-khannaas",
        translationSaheeh: "From the evil of the retreating whisperer",
        words: [
          { arabic: "مِن", transliteration: "Min", translation: "From", tajweedRule: "Ikhfa" },
          { arabic: "شَرِّ", transliteration: "sharri", translation: "the evil (of)" },
          { arabic: "الْوَسْوَاسِ", transliteration: "al-waswāsi", translation: "the whisperer" },
          { arabic: "الْخَنَّاسِ", transliteration: "al-khannās", translation: "who retreats", tajweedRule: "Ghunnah & Madd Aridh" },
        ],
      },
      {
        ayahNumber: 5,
        arabicUthmani: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        transliteration: "Alladhee yuwaswisu fee sudoorin-naas",
        translationSaheeh: "Who whispers [evil] into the breasts of mankind -",
        words: [
          { arabic: "الَّذِي", transliteration: "Alladhee", translation: "Who" },
          { arabic: "يُوَسْوِسُ", transliteration: "yuwaswisu", translation: "whispers" },
          { arabic: "فِي", transliteration: "fee", translation: "in(to)" },
          { arabic: "صُدُورِ", transliteration: "sudoori", translation: "the breasts / hearts" },
          { arabic: "النَّاسِ", transliteration: "an-nās", translation: "(of) mankind", tajweedRule: "Ghunnah & Madd Aridh" },
        ],
      },
      {
        ayahNumber: 6,
        arabicUthmani: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration: "Minal-jinnati wan-naas",
        translationSaheeh: "From among the jinn and mankind.",
        words: [
          { arabic: "مِنَ", transliteration: "Mina", translation: "From among" },
          { arabic: "الْجِنَّةِ", transliteration: "al-jinnati", translation: "the jinn", tajweedRule: "Ghunnah" },
          { arabic: "وَالنَّاسِ", transliteration: "wan-nās", translation: "and mankind", tajweedRule: "Ghunnah & Madd Aridh" },
        ],
      },
    ],
  },
  108: {
    number: 108,
    nameArabic: "الكوثر",
    nameTransliterated: "Al-Kawthar",
    nameEnglish: "The Abundance",
    versesCount: 3,
    revelationType: "Meccan",
    juzNumber: 30,
    themeSummary: "Consolation to the Prophet ﷺ with the promise of celestial abundance and the River of Kawthar in Paradise.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        transliteration: "Innaaa a'taynaakal-Kawthar",
        translationSaheeh: "Indeed, We have granted you, [O Muhammad], al-Kawthar (Abundance).",
        words: [
          { arabic: "إِنَّا", transliteration: "Innaaa", translation: "Indeed We", tajweedRule: "Ghunnah & Madd Munfasil (4-5 counts)" },
          { arabic: "أَعْطَيْنَاكَ", transliteration: "a'taynaaka", translation: "have granted you" },
          { arabic: "الْكَوْثَرَ", transliteration: "al-Kawthar", translation: "the Abundance / River Kawthar" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        transliteration: "Fasalli li-Rabbika wan-har",
        translationSaheeh: "So pray to your Lord and sacrifice [to Him alone].",
        words: [
          { arabic: "فَصَلِّ", transliteration: "Fa-salli", translation: "So pray" },
          { arabic: "لِرَبِّكَ", transliteration: "li-Rabbika", translation: "to your Lord" },
          { arabic: "وَانْحَرْ", transliteration: "wan-har", translation: "and sacrifice", tajweedRule: "Izhar Halqi (Noon + Hhaa)" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        transliteration: "Inna shaani'aka huwal-abtar",
        translationSaheeh: "Indeed, your enemy is the one cut off.",
        words: [
          { arabic: "إِنَّ", transliteration: "Inna", translation: "Indeed", tajweedRule: "Ghunnah (Noon)" },
          { arabic: "شَانِئَكَ", transliteration: "shāni'aka", translation: "your hater / enemy" },
          { arabic: "هُوَ", transliteration: "huwa", translation: "he is" },
          { arabic: "الْأَبْتَرُ", transliteration: "al-abtar", translation: "the one cut off", tajweedRule: "Qalqalah (Baa)" },
        ],
      },
    ],
  },
  103: {
    number: 103,
    nameArabic: "العصر",
    nameTransliterated: "Al-'Asr",
    nameEnglish: "The Declining Day / Time",
    versesCount: 3,
    revelationType: "Meccan",
    juzNumber: 30,
    themeSummary: "Imam Ash-Shafi'i noted: If humanity reflected upon this surah alone, it would suffice them for salvation.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "وَالْعَصْرِ",
        transliteration: "Wal-'Asr",
        translationSaheeh: "By time,",
        words: [
          { arabic: "وَالْعَصْرِ", transliteration: "Wal-'Asr", translation: "By time / declining day", tajweedRule: "Tafkheem (Saad & Raa)" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        transliteration: "Innal-insaana lafee khusr",
        translationSaheeh: "Indeed, mankind is in loss,",
        words: [
          { arabic: "إِنَّ", transliteration: "Inna", translation: "Indeed", tajweedRule: "Ghunnah" },
          { arabic: "الْإِنسَانَ", transliteration: "al-insāna", translation: "mankind", tajweedRule: "Ikhfa (Noon + Seen)" },
          { arabic: "لَفِي", transliteration: "la-fee", translation: "is surely in" },
          { arabic: "خُسْرٍ", transliteration: "khusr", translation: "loss", tajweedRule: "Tafkheem (Khaa)" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        transliteration: "Illal-ladheena aamanoo wa 'amilus-saalihaati wa tawaasaw bil-haqqi wa tawaasaw bis-sabr",
        translationSaheeh: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
        words: [
          { arabic: "إِلَّا", transliteration: "Illā", translation: "Except" },
          { arabic: "الَّذِينَ", transliteration: "alladheena", translation: "those who" },
          { arabic: "آمَنُوا", transliteration: "āmanoo", translation: "believed", tajweedRule: "Madd Badal" },
          { arabic: "وَعَمِلُوا", transliteration: "wa 'amiloo", translation: "and did" },
          { arabic: "الصَّالِحَاتِ", transliteration: "as-sālihāti", translation: "righteous deeds" },
          { arabic: "وَتَوَاصَوْا", transliteration: "wa tawāsaw", translation: "and exhorted each other" },
          { arabic: "بِالْحَقِّ", transliteration: "bil-haqq", translation: "to the truth", tajweedRule: "Qalqalah Kubra (Qaaf)" },
          { arabic: "وَتَوَاصَوْا", transliteration: "wa tawāsaw", translation: "and exhorted each other" },
          { arabic: "بِالصَّبْرِ", transliteration: "bis-sabr", translation: "to patience", tajweedRule: "Qalqalah (Baa)" },
        ],
      },
    ],
  },
  110: {
    number: 110,
    nameArabic: "النصر",
    nameTransliterated: "An-Nasr",
    nameEnglish: "The Divine Support",
    versesCount: 3,
    revelationType: "Medinan",
    juzNumber: 30,
    themeSummary: "The triumph of Islam, the conquest of Makkah, and instructions for praise and seeking forgiveness.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        transliteration: "Idhaa jaaa'a nasrul-laahi wal-fath",
        translationSaheeh: "When the victory of Allah has come and the conquest,",
        words: [
          { arabic: "إِذَا", transliteration: "Idhā", translation: "When" },
          { arabic: "جَاءَ", transliteration: "jāā'a", translation: "has come", tajweedRule: "Madd Muttasil (4-5 counts)" },
          { arabic: "نَصْرُ", transliteration: "nasru", translation: "the victory" },
          { arabic: "اللَّهِ", transliteration: "Allāhi", translation: "(of) Allah", tajweedRule: "Tafkheem" },
          { arabic: "وَالْفَتْحُ", transliteration: "wal-fath", translation: "and the conquest" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
        transliteration: "Wa ra'aytan-naasa yadkhuloona fee deenil-laahi afwaajaa",
        translationSaheeh: "And you see the people entering into the religion of Allah in multitudes,",
        words: [
          { arabic: "وَرَأَيْتَ", transliteration: "Wa ra'ayta", translation: "And you see" },
          { arabic: "النَّاسَ", transliteration: "an-nāsa", translation: "the people", tajweedRule: "Ghunnah" },
          { arabic: "يَدْخُلُونَ", transliteration: "yadkhuloona", translation: "entering", tajweedRule: "Qalqalah (Daal)" },
          { arabic: "فِي", transliteration: "fee", translation: "into" },
          { arabic: "دِينِ", transliteration: "deeni", translation: "the religion" },
          { arabic: "اللَّهِ", transliteration: "Allāhi", translation: "(of) Allah" },
          { arabic: "أَفْوَاجًا", transliteration: "afwājā", translation: "in crowds / multitudes", tajweedRule: "Madd 'Iwad" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
        transliteration: "Fasabbih bi-hamdi Rabbika wastaghfirh, innahoo kaana tawwaabaa",
        translationSaheeh: "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.",
        words: [
          { arabic: "فَسَبِّحْ", transliteration: "Fa-sabbih", translation: "Then glorify" },
          { arabic: "بِحَمْدِ", transliteration: "bi-hamdi", translation: "with praise" },
          { arabic: "رَبِّكَ", transliteration: "Rabbika", translation: "(of) your Lord" },
          { arabic: "وَاسْتَغْفِرْهُ", transliteration: "wastaghfirhu", translation: "and ask His forgiveness" },
          { arabic: "إِنَّهُ", transliteration: "innahoo", translation: "Indeed He", tajweedRule: "Ghunnah & Madd Silah" },
          { arabic: "كَانَ", transliteration: "kāna", translation: "is ever" },
          { arabic: "تَوَّابًا", transliteration: "tawwābā", translation: "Accepting of repentance", tajweedRule: "Madd 'Iwad" },
        ],
      },
    ],
  },
  97: {
    number: 97,
    nameArabic: "القدر",
    nameTransliterated: "Al-Qadr",
    nameEnglish: "The Night of Decree / Power",
    versesCount: 5,
    revelationType: "Meccan",
    juzNumber: 30,
    themeSummary: "The supreme nobility of Laylat al-Qadr in Ramadan, better than a thousand months of worship.",
    ayahs: [
      {
        ayahNumber: 1,
        arabicUthmani: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
        transliteration: "Innaaa anzalnaahu fee laylatil-qadr",
        translationSaheeh: "Indeed, We sent the Qur'an down during the Night of Decree.",
        words: [
          { arabic: "إِنَّا", transliteration: "Innaaa", translation: "Indeed We", tajweedRule: "Ghunnah & Madd Munfasil" },
          { arabic: "أَنزَلْنَاهُ", transliteration: "anzalnāhu", translation: "sent it down", tajweedRule: "Ikhfa (Noon + Zay)" },
          { arabic: "فِي", transliteration: "fee", translation: "in" },
          { arabic: "لَيْلَةِ", transliteration: "laylati", translation: "the Night" },
          { arabic: "الْقَدْرِ", transliteration: "al-qadr", translation: "(of) Decree / Power", tajweedRule: "Qalqalah (Daal)" },
        ],
      },
      {
        ayahNumber: 2,
        arabicUthmani: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ",
        transliteration: "Wa maaa adraaka maa laylatul-qadr",
        translationSaheeh: "And what can make you know what is the Night of Decree?",
        words: [
          { arabic: "وَمَا", transliteration: "Wa māāā", translation: "And what", tajweedRule: "Madd Munfasil" },
          { arabic: "أَدْرَاكَ", transliteration: "adrāka", translation: "can make you know", tajweedRule: "Qalqalah (Daal)" },
          { arabic: "مَا", transliteration: "mā", translation: "what is" },
          { arabic: "لَيْلَةُ", transliteration: "laylatu", translation: "the Night" },
          { arabic: "الْقَدْرِ", transliteration: "al-qadr", translation: "(of) Decree", tajweedRule: "Qalqalah (Daal)" },
        ],
      },
      {
        ayahNumber: 3,
        arabicUthmani: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
        transliteration: "Laylatul-qadri khayrum-min alfi shahr",
        translationSaheeh: "The Night of Decree is better than a thousand months.",
        words: [
          { arabic: "لَيْلَةُ", transliteration: "Laylatu", translation: "The Night" },
          { arabic: "الْقَدْرِ", transliteration: "al-qadri", translation: "(of) Decree", tajweedRule: "Qalqalah" },
          { arabic: "خَيْرٌ", transliteration: "khayrum-", translation: "is better", tajweedRule: "Idgham bi-Ghunnah" },
          { arabic: "مِّنْ", transliteration: "min", translation: "than", tajweedRule: "Izhar Halqi (Noon + Hamzah)" },
          { arabic: "أَلْفِ", transliteration: "alfi", translation: "a thousand" },
          { arabic: "شَهْرٍ", transliteration: "shahr", translation: "months" },
        ],
      },
      {
        ayahNumber: 4,
        arabicUthmani: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ",
        transliteration: "Tanazzalul-malaaa'ikatu war-Roohu feehaa bi-idhni Rabbihim min kulli amr",
        translationSaheeh: "The angels and the Spirit [Gabriel] descend therein by permission of their Lord for every matter.",
        words: [
          { arabic: "تَنَزَّلُ", transliteration: "Tanazzalu", translation: "Descend" },
          { arabic: "الْمَلَائِكَةُ", transliteration: "al-malāā'ikatu", translation: "the angels", tajweedRule: "Madd Muttasil" },
          { arabic: "وَالرُّوحُ", transliteration: "war-roohu", translation: "and the Spirit (Gabriel)" },
          { arabic: "فِيهَا", transliteration: "feehā", translation: "therein" },
          { arabic: "بِإِذْنِ", transliteration: "bi-idhni", translation: "by permission" },
          { arabic: "رَبِّهِم", transliteration: "Rabbihim", translation: "(of) their Lord", tajweedRule: "Idgham Shafawi" },
          { arabic: "مِّن", transliteration: "min", translation: "for", tajweedRule: "Ikhfa (Noon + Kaf)" },
          { arabic: "كُلِّ", transliteration: "kulli", translation: "every" },
          { arabic: "أَمْرٍ", transliteration: "amr", translation: "matter" },
        ],
      },
      {
        ayahNumber: 5,
        arabicUthmani: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
        transliteration: "Salaamun hiya hattaa matla'il-fajr",
        translationSaheeh: "Peace it is until the emergence of dawn.",
        words: [
          { arabic: "سَلَامٌ", transliteration: "Salāmun", translation: "Peace", tajweedRule: "Izhar Halqi" },
          { arabic: "هِيَ", transliteration: "hiya", translation: "it is" },
          { arabic: "حَتَّىٰ", transliteration: "hattā", translation: "until" },
          { arabic: "مَطْلَعِ", transliteration: "matla'i", translation: "the rising / break", tajweedRule: "Qalqalah (Tta)" },
          { arabic: "الْفَجْرِ", transliteration: "al-fajr", translation: "(of) the dawn", tajweedRule: "Qalqalah (Jeem)" },
        ],
      },
    ],
  },
};
