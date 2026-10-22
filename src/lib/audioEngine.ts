// Robust Audio Engine for Quran Recitations, Alphabet Phonetics MP3s & Voice Recording

export interface ReciterOption {
  id: string;
  name: string;
  subname: string;
  subfolder: string;
  quality: string;
  isSlowForLearning?: boolean;
}

export const AVAILABLE_RECITERS: ReciterOption[] = [
  {
    id: "Alafasy_128kbps",
    name: "Sheikh Mishary Rashid Alafasy",
    subname: "Clear, melodious and globally beloved",
    subfolder: "Alafasy_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Abdurrahmaan_As-Sudais_192kbps",
    name: "Sheikh Abdurrahman As-Sudais",
    subname: "Imam of Masjid al-Haram, Makkah",
    subfolder: "Abdurrahmaan_As-Sudais_192kbps",
    quality: "192 kbps",
  },
  {
    id: "Saood_ash-Shuraym_128kbps",
    name: "Sheikh Saud Ash-Shuraim",
    subname: "Imam of Masjid al-Haram, Makkah",
    subfolder: "Saood_ash-Shuraym_128kbps",
    quality: "128 kbps",
  },
  {
    id: "MaherAlMuaiqly128kbps",
    name: "Sheikh Maher Al-Muaiqly",
    subname: "Imam of Masjid al-Haram, Makkah",
    subfolder: "MaherAlMuaiqly128kbps",
    quality: "128 kbps",
  },
  {
    id: "Yasser_Ad-Dussary_128kbps",
    name: "Sheikh Yasser Al-Dosari",
    subname: "Imam of Masjid al-Haram, emotional recitation",
    subfolder: "Yasser_Ad-Dussary_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Salah_Al_Budair_128kbps",
    name: "Sheikh Salah Al-Budair",
    subname: "Imam of Masjid an-Nabawi, Madinah",
    subfolder: "Salah_Al_Budair_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Husary_Muallim_128kbps",
    name: "Sheikh Al-Husary (Muallim)",
    subname: "Slow teaching recitation for learners",
    subfolder: "Husary_Muallim_128kbps",
    quality: "128 kbps",
    isSlowForLearning: true,
  },
  {
    id: "Husary_128kbps",
    name: "Sheikh Mahmoud Khalil Al-Husary",
    subname: "Clear murattal, excellent for Tajweed",
    subfolder: "Husary_128kbps",
    quality: "128 kbps",
    isSlowForLearning: true,
  },
  {
    id: "Ayman_Sowaid_64kbps",
    name: "Sheikh Ayman Suwaid",
    subname: "Tajweed teacher recitation",
    subfolder: "Ayman_Sowaid_64kbps",
    quality: "64 kbps",
    isSlowForLearning: true,
  },
  {
    id: "Abdul_Basit_Murattal_192kbps",
    name: "Sheikh Abdul Basit (Murattal)",
    subname: "Steady murattal by the golden voice",
    subfolder: "Abdul_Basit_Murattal_192kbps",
    quality: "192 kbps",
  },
  {
    id: "Abdul_Basit_Mujawwad_128kbps",
    name: "Sheikh Abdul Basit (Mujawwad)",
    subname: "Legendary melodic mujawwad",
    subfolder: "Abdul_Basit_Mujawwad_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Minshawy_Murattal_128kbps",
    name: "Sheikh Al-Minshawi (Murattal)",
    subname: "Clear teaching-style murattal",
    subfolder: "Minshawy_Murattal_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Minshawy_Mujawwad_192kbps",
    name: "Sheikh Mohamed Siddiq Al-Minshawi",
    subname: "Deep, soulful mujawwad",
    subfolder: "Minshawy_Mujawwad_192kbps",
    quality: "192 kbps",
  },
  {
    id: "Abu_Bakr_Ash-Shaatree_128kbps",
    name: "Sheikh Abu Bakr Al-Shatri",
    subname: "Soft, emotional and easy to follow",
    subfolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Hani_Rifai_192kbps",
    name: "Sheikh Hani Ar-Rifai",
    subname: "Calm and beautiful recitation",
    subfolder: "Hani_Rifai_192kbps",
    quality: "192 kbps",
  },
  {
    id: "Muhammad_Ayyoub_128kbps",
    name: "Sheikh Muhammad Ayyub",
    subname: "Former Imam of Masjid an-Nabawi",
    subfolder: "Muhammad_Ayyoub_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Muhammad_Jibreel_128kbps",
    name: "Sheikh Muhammad Jibreel",
    subname: "Powerful Egyptian recitation",
    subfolder: "Muhammad_Jibreel_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Nasser_Alqatami_128kbps",
    name: "Sheikh Nasser Al-Qatami",
    subname: "Smooth modern recitation",
    subfolder: "Nasser_Alqatami_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Ali_Jaber_64kbps",
    name: "Sheikh Ali Jaber",
    subname: "Imam of Masjid al-Haram",
    subfolder: "Ali_Jaber_64kbps",
    quality: "64 kbps",
  },
  {
    id: "Fares_Abbad_64kbps",
    name: "Sheikh Fares Abbad",
    subname: "Imam of Masjid al-Haram",
    subfolder: "Fares_Abbad_64kbps",
    quality: "64 kbps",
  },
  {
    id: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net",
    name: "Sheikh Ahmed Al-Ajmi",
    subname: "Widely loved emotional voice",
    subfolder: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net",
    quality: "128 kbps",
  },
  {
    id: "Hudhaify_128kbps",
    name: "Sheikh Ali Al-Hudhaify",
    subname: "Imam of Masjid an-Nabawi",
    subfolder: "Hudhaify_128kbps",
    quality: "128 kbps",
  },
  {
    id: "Ghamadi_40kbps",
    name: "Sheikh Saad Al-Ghamdi",
    subname: "Warm, rhythmic and soothing",
    subfolder: "Ghamadi_40kbps",
    quality: "40 kbps",
  },
  {
    id: "Abdullah_Basfar_192kbps",
    name: "Sheikh Abdullah Basfar",
    subname: "Clear Saudi recitation",
    subfolder: "Abdullah_Basfar_192kbps",
    quality: "192 kbps",
  },
  {
    id: "Mustafa_Ismail_48kbps",
    name: "Sheikh Mustafa Ismail",
    subname: "Classic Egyptian mujawwad master",
    subfolder: "Mustafa_Ismail_48kbps",
    quality: "48 kbps",
  },
  {
    id: "Mohammad_al_Tablaway_128kbps",
    name: "Sheikh Mohammad Al-Tablawi",
    subname: "Classic Egyptian recitation",
    subfolder: "Mohammad_al_Tablaway_128kbps",
    quality: "128 kbps",
  },
  {
    id: "English_Sahih_Ibrahim_Walk",
    name: "English: Sahih International",
    subname: "English meaning recited by Ibrahim Walk",
    subfolder: "English/Sahih_Intnl_Ibrahim_Walk_192kbps",
    quality: "192 kbps",
  },
];

const ALPHABET_AUDIO_MAP: Record<string, string> = {
  alif: "/audio/alphabet/alif.mp3",
  baa: "/audio/alphabet/baa.mp3",
  taa: "/audio/alphabet/taa.mp3",
  thaa: "/audio/alphabet/thaa.mp3",
  jeem: "/audio/alphabet/jeem.mp3",
  hhaa: "/audio/alphabet/hhaa.mp3",
  khaa: "/audio/alphabet/khaa.mp3",
  daal: "/audio/alphabet/daal.mp3",
  dhaal: "/audio/alphabet/dhaal.mp3",
  raa: "/audio/alphabet/raa.mp3",
  zay: "/audio/alphabet/zay.mp3",
  seen: "/audio/alphabet/seen.mp3",
  sheen: "/audio/alphabet/sheen.mp3",
  saad: "/audio/alphabet/saad.mp3",
  daad: "/audio/alphabet/daad.mp3",
  tta: "/audio/alphabet/tta.mp3",
  dhaa_heavy: "/audio/alphabet/dhaa_heavy.mp3",
  dhaa: "/audio/alphabet/dhaa_heavy.mp3",
  ayn: "/audio/alphabet/ayn.mp3",
  ghayn: "/audio/alphabet/ghayn.mp3",
  faa: "/audio/alphabet/faa.mp3",
  qaaf: "/audio/alphabet/qaaf.mp3",
  kaaf: "/audio/alphabet/kaaf.mp3",
  laam: "/audio/alphabet/laam.mp3",
  meem: "/audio/alphabet/meem.mp3",
  noon: "/audio/alphabet/noon.mp3",
  haa_soft: "/audio/alphabet/haa_soft.mp3",
  haa: "/audio/alphabet/haa_soft.mp3",
  waw: "/audio/alphabet/waw.mp3",
  yaa: "/audio/alphabet/yaa.mp3",
};

// Singleton audio player for alphabet & pronunciation to prevent overlap
let activePronunciationAudio: HTMLAudioElement | null = null;

/**
 * Returns primary EveryAyah CDN URL
 */
function encodeReciterPath(reciterSubfolder: string): string {
  return reciterSubfolder
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterSubfolder = "Alafasy_128kbps"): string {
  const surahStr = String(surahNumber).padStart(3, "0");
  const ayahStr = String(ayahNumber).padStart(3, "0");
  return `https://everyayah.com/data/${encodeReciterPath(reciterSubfolder)}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Returns list of fallback CDN URLs in case primary CDN is unreachable
 */
export function getAyahFallbackUrls(surahNumber: number, ayahNumber: number, reciterSubfolder = "Alafasy_128kbps"): string[] {
  const surahStr = String(surahNumber).padStart(3, "0");
  const ayahStr = String(ayahNumber).padStart(3, "0");
  
  const primary = `https://everyayah.com/data/${encodeReciterPath(reciterSubfolder)}/${surahStr}${ayahStr}.mp3`;
  return [
    primary,
    `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${ayahStr}.mp3`,
    `https://verses.quran.com/Alafasy/mp3/${surahStr}${ayahStr}.mp3`,
    `https://everyayah.com/data/Husary_128kbps/${surahStr}${ayahStr}.mp3`,
  ];
}

/**
 * Plays real vocal MP3 audio for Arabic alphabet letters, Harakat drills and words
 */
export function playLetterPronunciation(letterNameOrId: string, arabicChar: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    // Stop previous pronunciation audio if playing
    if (activePronunciationAudio) {
      activePronunciationAudio.pause();
      activePronunciationAudio.currentTime = 0;
    }

    const cleanKey = (letterNameOrId || "").toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
    
    // Check if we have pre-recorded alphabet MP3
    const localAlphabetFile = ALPHABET_AUDIO_MAP[cleanKey] || ALPHABET_AUDIO_MAP[letterNameOrId.toLowerCase()];

    if (localAlphabetFile) {
      const audio = new Audio(localAlphabetFile);
      activePronunciationAudio = audio;
      audio.volume = 1.0;

      audio.onended = () => resolve();
      audio.onerror = () => {
        // Fallback to TTS route if local file somehow fails
        playTtsAudio(arabicChar || letterNameOrId).then(resolve);
      };

      audio.play().catch(() => {
        playTtsAudio(arabicChar || letterNameOrId).then(resolve);
      });
      return;
    }

    // Otherwise, play via our TTS proxy endpoint
    playTtsAudio(arabicChar || letterNameOrId).then(resolve);
  });
}

/**
 * Plays speech audio via Next.js TTS route or SpeechSynthesis
 */
function playTtsAudio(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!text || typeof window === "undefined") {
      resolve();
      return;
    }

    const ttsUrl = `/api/audio/tts?text=${encodeURIComponent(text.trim())}&lang=ar`;
    const audio = new Audio(ttsUrl);
    activePronunciationAudio = audio;
    audio.volume = 1.0;

    audio.onended = () => resolve();
    audio.onerror = () => {
      // Fallback to browser SpeechSynthesis
      fallbackSpeechSynthesis(text);
      resolve();
    };

    audio.play().catch(() => {
      fallbackSpeechSynthesis(text);
      resolve();
    });
  });
}

function fallbackSpeechSynthesis(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(
        (v) => v.lang.startsWith("ar") || v.lang.includes("Arabic") || v.lang.includes("ara")
      );
      if (arVoice) {
        utterance.voice = arVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }
}

/**
 * Pleasant melodic chime for general button clicks and confirmations
 */
export function playHarmonicChime(baseFreq = 440) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore
  }
}

/**
 * Fanfare chord when passing a quiz / earning a certificate
 */
export function playSuccessFanfare() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.1;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // ignore
  }
}

/**
 * Test Audio helper to immediately test speaker output with real Quran recitation
 */
export function testQuranAudio(reciterSubfolder = "Alafasy_128kbps"): Promise<boolean> {
  return new Promise((resolve) => {
    // Play Surah 1 Ayah 1 (Bismillah)
    const testUrl = getAyahAudioUrl(1, 1, reciterSubfolder);
    const audio = new Audio(testUrl);
    audio.volume = 1.0;

    audio.oncanplaythrough = () => {
      audio.play().then(() => {
        setTimeout(() => {
          audio.pause();
          resolve(true);
        }, 4000);
      }).catch(() => {
        // Fallback to Alif MP3
        const alifAudio = new Audio("/audio/alphabet/alif.mp3");
        alifAudio.play().then(() => resolve(true)).catch(() => resolve(true));
      });
    };

    audio.onerror = () => {
      const alifAudio = new Audio("/audio/alphabet/alif.mp3");
      alifAudio.play().then(() => resolve(true)).catch(() => resolve(true));
    };
  });
}

/**
 * Voice Recorder Manager for Tajweed self-assessment
 */
export class RecitationVoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioUrl: string | null = null;
  private isRecording = false;

  async startRecording(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      alert("Microphone recording is not supported in this browser environment.");
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Please allow microphone access to record your recitation practice.");
      return false;
    }
  }

  stopRecording(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve("");
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        if (this.audioUrl) {
          URL.revokeObjectURL(this.audioUrl);
        }
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.isRecording = false;

        // Stop all tracks to release mic hardware
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());

        resolve(this.audioUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }
}
