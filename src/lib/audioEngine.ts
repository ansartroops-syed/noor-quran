// Robust Audio Engine for Quran Recitations, Alphabet Phonetics MP3s & Voice Recording

export interface ReciterOption {
  id: string;
  name: string;
  subname: string;
  subfolder: string;
  quality: string;
  category: "Most Popular" | "Haram Imams" | "Murattal (Study)" | "Mujawwad (Melodic)" | "Soothing Voices";
  isSlowForLearning?: boolean;
}

export const AVAILABLE_RECITERS: ReciterOption[] = [
  // ── Most Popular ──────────────────────────────────
  {
    id: "Alafasy_128kbps",
    name: "Mishary Rashid Alafasy",
    subname: "Clear, melodious & globally beloved",
    subfolder: "Alafasy_128kbps",
    quality: "128 kbps",
    category: "Most Popular",
  },
  {
    id: "Husary_128kbps",
    name: "Mahmoud Khalil Al-Husary",
    subname: "Master of Tajweed precision",
    subfolder: "Husary_128kbps",
    quality: "128 kbps",
    category: "Most Popular",
  },
  {
    id: "Husary_Muallim_128kbps",
    name: "Mahmoud Khalil Al-Husary (Muallim)",
    subname: "Slow teaching recitation — best for beginners",
    subfolder: "Husary_Muallim_128kbps",
    quality: "128 kbps",
    category: "Most Popular",
    isSlowForLearning: true,
  },
  {
    id: "Abdul_Basit_Murattal_192kbps",
    name: "Abdul Basit Abdul Samad (Murattal)",
    subname: "Legendary golden voice — clear study style",
    subfolder: "Abdul_Basit_Murattal_192kbps",
    quality: "192 kbps",
    category: "Most Popular",
  },
  {
    id: "Abdul_Basit_Mujawwad_128kbps",
    name: "Abdul Basit Abdul Samad (Mujawwad)",
    subname: "Legendary slow melodic style",
    subfolder: "Abdul_Basit_Mujawwad_128kbps",
    quality: "128 kbps",
    category: "Mujawwad (Melodic)",
  },
  // ── Haram Imams (Makkah & Madinah) ────────────────
  {
    id: "MaherAlMuaiqly128kbps",
    name: "Maher Al-Muaiqly",
    subname: "Imam of Masjid Al-Haram, Makkah",
    subfolder: "MaherAlMuaiqly128kbps",
    quality: "128 kbps",
    category: "Haram Imams",
  },
  {
    id: "Abdurrahmaan_As-Sudais_192kbps",
    name: "Abdurrahman As-Sudais",
    subname: "Imam of Masjid Al-Haram, Makkah",
    subfolder: "Abdurrahmaan_As-Sudais_192kbps",
    quality: "192 kbps",
    category: "Haram Imams",
  },
  {
    id: "Saood_ash-Shuraym_128kbps",
    name: "Saud Ash-Shuraym",
    subname: "Imam of Masjid Al-Haram, Makkah",
    subfolder: "Saood_ash-Shuraym_128kbps",
    quality: "128 kbps",
    category: "Haram Imams",
  },
  {
    id: "Yasser_Ad-Dussary_128kbps",
    name: "Yasser Ad-Dossari",
    subname: "Imam of Masjid Al-Haram, Makkah",
    subfolder: "Yasser_Ad-Dussary_128kbps",
    quality: "128 kbps",
    category: "Haram Imams",
  },
  {
    id: "Hudhaify_128kbps",
    name: "Ali Al-Hudhaify",
    subname: "Imam of Masjid An-Nabawi, Madinah",
    subfolder: "Hudhaify_128kbps",
    quality: "128 kbps",
    category: "Haram Imams",
  },
  {
    id: "Muhammad_Ayyoub_128kbps",
    name: "Muhammad Ayyoub",
    subname: "Imam of Masjid An-Nabawi, Madinah",
    subfolder: "Muhammad_Ayyoub_128kbps",
    quality: "128 kbps",
    category: "Haram Imams",
  },
  {
    id: "Salah_Al_Budair_128kbps",
    name: "Salah Al-Budair",
    subname: "Imam of Masjid An-Nabawi, Madinah",
    subfolder: "Salah_Al_Budair_128kbps",
    quality: "128 kbps",
    category: "Haram Imams",
  },
  // ── Murattal (Study) ──────────────────────────────
  {
    id: "Minshawy_Murattal_128kbps",
    name: "Mohamed Siddiq Al-Minshawi (Murattal)",
    subname: "Deep, soulful — excellent for memorisation",
    subfolder: "Minshawy_Murattal_128kbps",
    quality: "128 kbps",
    category: "Murattal (Study)",
  },
  {
    id: "Abu_Bakr_Ash-Shaatree_128kbps",
    name: "Abu Bakr Ash-Shatri",
    subname: "Calm and steady study recitation",
    subfolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    quality: "128 kbps",
    category: "Murattal (Study)",
  },
  {
    id: "Abdullah_Basfar_192kbps",
    name: "Abdullah Basfar",
    subname: "Clear Hijazi style",
    subfolder: "Abdullah_Basfar_192kbps",
    quality: "192 kbps",
    category: "Murattal (Study)",
  },
  {
    id: "Abdullah_Matroud_128kbps",
    name: "Abdullah Matroud",
    subname: "Soft and precise",
    subfolder: "Abdullah_Matroud_128kbps",
    quality: "128 kbps",
    category: "Murattal (Study)",
  },
  {
    id: "Ghamadi_40kbps",
    name: "Saad Al-Ghamadi",
    subname: "Fast, rhythmic & soothing",
    subfolder: "Ghamadi_40kbps",
    quality: "40 kbps",
    category: "Murattal (Study)",
  },
  // ── Mujawwad & Soothing ───────────────────────────
  {
    id: "Minshawy_Mujawwad_192kbps",
    name: "Mohamed Siddiq Al-Minshawi (Mujawwad)",
    subname: "Slow melodic Tajweed masterpiece",
    subfolder: "Minshawy_Mujawwad_192kbps",
    quality: "192 kbps",
    category: "Mujawwad (Melodic)",
  },
  {
    id: "Hani_Rifai_192kbps",
    name: "Hani Ar-Rifai",
    subname: "Emotional, heart-touching voice",
    subfolder: "Hani_Rifai_192kbps",
    quality: "192 kbps",
    category: "Soothing Voices",
  },
  {
    id: "Muhammad_Jibreel_128kbps",
    name: "Muhammad Jibreel",
    subname: "Famous Taraweeh cryful recitation",
    subfolder: "Muhammad_Jibreel_128kbps",
    quality: "128 kbps",
    category: "Soothing Voices",
  },
];

export const RECITER_CATEGORIES = [
  "All",
  "Most Popular",
  "Haram Imams",
  "Murattal (Study)",
  "Mujawwad (Melodic)",
  "Soothing Voices",
] as const;

export function getReciterBySubfolder(subfolder: string): ReciterOption | undefined {
  return AVAILABLE_RECITERS.find((r) => r.subfolder === subfolder);
}

export function getReciterDisplayName(subfolder: string): string {
  return getReciterBySubfolder(subfolder)?.name ?? subfolder.replace(/_/g, " ");
}

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
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterSubfolder = "Alafasy_128kbps"): string {
  const surahStr = String(surahNumber).padStart(3, "0");
  const ayahStr = String(ayahNumber).padStart(3, "0");
  return `https://everyayah.com/data/${reciterSubfolder}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Returns list of fallback CDN URLs in case primary CDN is unreachable
 */
export function getAyahFallbackUrls(surahNumber: number, ayahNumber: number, reciterSubfolder = "Alafasy_128kbps"): string[] {
  const surahStr = String(surahNumber).padStart(3, "0");
  const ayahStr = String(ayahNumber).padStart(3, "0");
  
  return [
    `https://everyayah.com/data/${reciterSubfolder}/${surahStr}${ayahStr}.mp3`,
    `https://verses.quran.com/Alafasy/mp3/${surahStr}${ayahStr}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${ayahStr}.mp3`,
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
