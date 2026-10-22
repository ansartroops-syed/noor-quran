export interface AndroidGuideStep {
  id: string;
  stepNumber: number;
  title: string;
  shortSummary: string;
  category: "Capacitor Native (Recommended)" | "Bubblewrap TWA" | "Google Play Console" | "Keystore & Signing";
  details: string[];
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  tips: string[];
}

export const ANDROID_PUBLISHING_GUIDE: AndroidGuideStep[] = [
  {
    id: "step_1_capacitor_setup",
    stepNumber: 1,
    title: "1. Initialize Capacitor in Your Project",
    shortSummary: "Turn this Next.js fullstack web application into a native Android project using Capacitor.",
    category: "Capacitor Native (Recommended)",
    details: [
      "Capacitor bridges web apps to native Android APIs seamlessly.",
      "Install Capacitor core, CLI, and Android platform packages in the project directory.",
      "Run the initialization command to create capacitor.config.ts.",
    ],
    codeSnippet: {
      filename: "terminal commands",
      language: "bash",
      code: `# Step 1: Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# Step 2: Initialize Capacitor with App Name and App ID (Package Name)
npx cap init "Noor Quran" "com.noorquran.learning.app" --web-dir "out"

# Step 3: Add Android Native Project Folder
npx cap add android`,
    },
    tips: [
      "Choose a unique package name like com.yourcompany.noorquran — it cannot be changed on Google Play later.",
      "Ensure Node.js v18+ or v20+ is installed on your machine.",
    ],
  },
  {
    id: "step_2_nextjs_static_export",
    stepNumber: 2,
    title: "2. Configure Next.js for Android Native Build",
    shortSummary: "Configure next.config.ts to export static assets that load instantly offline inside the Android APK/AAB.",
    category: "Capacitor Native (Recommended)",
    details: [
      "Set `output: 'export'` in `next.config.ts` so `npm run build` generates the static `out/` folder.",
      "Build the web project and sync files into the `android/` native container.",
    ],
    codeSnippet: {
      filename: "next.config.ts",
      language: "typescript",
      code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Generates the 'out' directory for Capacitor
  images: {
    unoptimized: true, // Needed for static export in mobile builds
  },
};

export default nextConfig;`,
    },
    tips: [
      "After editing, run `npm run build && npx cap sync android` whenever you update your code.",
    ],
  },
  {
    id: "step_3_android_manifest",
    stepNumber: 3,
    title: "3. Configure Android Manifest Permissions",
    shortSummary: "Ensure audio playback, voice recording, and internet permissions are enabled in AndroidManifest.xml.",
    category: "Capacitor Native (Recommended)",
    details: [
      "Open `android/app/src/main/AndroidManifest.xml`.",
      "Add permissions for Internet, Audio Recording (for Tajweed self-assessment), Wake Lock (for Quran recitation playback), and Audio Settings.",
    ],
    codeSnippet: {
      filename: "android/app/src/main/AndroidManifest.xml",
      language: "xml",
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.noorquran.learning.app">

    <!-- Network permissions for streaming recitations -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Audio permissions for Tajweed voice recorder & playback -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Noor Quran"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="Noor Quran"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },
    tips: [
      "Setting `android:supportsRtl='true'` guarantees proper right-to-left rendering for Arabic text.",
    ],
  },
  {
    id: "step_4_keystore_generation",
    stepNumber: 4,
    title: "4. Generate Release Keystore (App Signing)",
    shortSummary: "Create a secure cryptographic signing key required to sign your release Android App Bundle (.aab).",
    category: "Keystore & Signing",
    details: [
      "Google Play requires all production apps to be signed with a secure RSA 2048-bit key.",
      "Run keytool (included in JDK 17 / Android Studio) in your terminal.",
    ],
    codeSnippet: {
      filename: "terminal command",
      language: "bash",
      code: `# Run this command in your project root or android/ folder:
keytool -genkey -v -keystore my-release-key.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 \\
  -alias noor-quran-key`,
    },
    tips: [
      "CRITICAL: Keep your `my-release-key.jks` and password backed up securely! If lost, you cannot update your app on Google Play.",
      "Use at least a 2048-bit RSA key with 10,000+ days validity.",
    ],
  },
  {
    id: "step_5_build_aab",
    stepNumber: 5,
    title: "5. Build Production Android App Bundle (.aab)",
    shortSummary: "Compile your production Android App Bundle ready to upload to Google Play Console.",
    category: "Capacitor Native (Recommended)",
    details: [
      "Google Play requires `.aab` (Android App Bundle) format instead of legacy `.apk`.",
      "You can build using Android Studio GUI or via Gradle command line.",
    ],
    codeSnippet: {
      filename: "build commands",
      language: "bash",
      code: `# Option A: Open Android Studio and Build
npx cap open android
# In Android Studio: Build -> Generate Signed Bundle / APK -> Android App Bundle -> Select your keystore -> Release

# Option B: Build via command line inside android/ folder
cd android
./gradlew bundleRelease
# Output file will be located at:
# android/app/build/outputs/bundle/release/app-release.aab`,
    },
    tips: [
      "Android App Bundles automatically optimize download size for every user's specific Android device model.",
    ],
  },
  {
    id: "step_6_bubblewrap_twa",
    stepNumber: 6,
    title: "Alternative: 1-Click Trusted Web Activity (TWA)",
    shortSummary: "Instantly package your live hosted PWA into a Google Play AAB using Google's official Bubblewrap CLI.",
    category: "Bubblewrap TWA",
    details: [
      "Bubblewrap is Google's official CLI tool that converts any PWA into an Android App Bundle.",
      "Host your Noor Quran web app (e.g. on Vercel, Railway, AWS, or your domain) and run bubblewrap init.",
    ],
    codeSnippet: {
      filename: "bubblewrap CLI",
      language: "bash",
      code: `# Step 1: Install Google's Bubblewrap CLI
npm install -g @bubblewrap/cli

# Step 2: Initialize TWA with your live manifest URL
bubblewrap init --manifest="https://your-domain.com/manifest.webmanifest"

# Step 3: Build the Android App Bundle
bubblewrap build

# Step 4: Deploy assetlinks.json to your website at:
# https://your-domain.com/.well-known/assetlinks.json
# (Bubblewrap creates this file automatically during build)`,
    },
    tips: [
      "TWA requires `.well-known/assetlinks.json` on your domain so the Chrome browser knows your app is authorized without showing a URL bar.",
    ],
  },
  {
    id: "step_7_google_play_console",
    stepNumber: 7,
    title: "6. Google Play Console Submission & Review",
    shortSummary: "Complete the Store Listing, Content Rating, Data Safety, Privacy Policy, and Release rollout.",
    category: "Google Play Console",
    details: [
      "1. Create a Google Play Developer Account at https://play.google.com/console ($25 one-time fee).",
      "2. Click 'Create App' -> Enter App Name: 'Noor Quran: Learn & Read' -> Language: English -> Free -> Policy accept.",
      "3. Fill Store Listing with pre-written ASO description, 512x512 icon, and 1024x500 feature graphic.",
      "4. Complete Content Rating Questionnaire (Select 'Education/Reference' -> Category: Everyone / All Ages).",
      "5. Complete Data Safety: Declare audio recording (user microphone for recitation practice, not collected/sold).",
      "6. Provide Privacy Policy URL.",
      "7. Create Closed Testing release (20 testers for 14 days requirement) or apply for Production release.",
    ],
    tips: [
      "Google requires 20 testers opted-in for 14 days for personal developer accounts created after Nov 2023.",
      "Make sure to test on a physical Android device before submitting to review.",
    ],
  },
];

export const PLAY_STORE_METADATA = {
  appTitle: "Noor Quran: Learn Quran & Tajweed",
  shortDescription: "Learn Quran from Arabic basics to complete Quran with Tajweed & English translation.",
  fullDescription: `Embark on a transformative spiritual and educational journey with Noor Quran — the ultimate interactive app designed to teach you how to read, understand, and master the Holy Quran from the absolute basics to complete recitation.

✨ KEY LEARNING FEATURES:

📖 STAGE 1: NOORANI QAIDA & ARABIC ALPHABET
• Master all 28 Arabic letters with precise articulation points (Makharij).
• Visual and phonetic guide for Throat (Halq), Tongue (Lisan), and Lips (Shafatan).
• Learn Isolated, Initial, Medial, and Final connecting letter forms.

⚡ STAGE 2: HARAKAT & VOWELS MASTERY
• Short vowels: Fatha (َ), Kasra (ِ), Damma (ُ).
• Nunation / Tanween (-an, -in, -un) double vowels.
• Sukoon (ْ) resting stops, Shaddah (ّ) doubling, and Madd Asli natural long vowels.

💎 STAGE 3: TAJWEED MASTERCLASS (COLOR-CODED)
• Ghunnah 2-count nasal resonance on Noon & Meem Mushaddadah.
• Qalqalah echoing sounds on Qutb Jad (ق ط ب ج د).
• Noon Sakinah & Tanween rules: Izhar, Idgham (Yanmoo), Iqlab, and Ikhfa.
• Compulsory Madd rules (Madd Muttasil, Munfassil, and Madd Lazim 6 counts).
• Interactive audio examples and visual color-coded Quran viewer.

📚 STAGE 4: HIGH-FREQUENCY QURANIC VOCABULARY
• Learn the top 100+ most frequent Quranic words that make up 80% of Quran vocabulary.
• Interactive flashcards, root word breakdowns, and spaced repetition quizzes.

🌟 STAGE 5: PROGRESSIVE SHORT SURAHS (JUZ AMMA)
• Surah Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar, Al-Asr, Al-Qadr, An-Nasr.
• Word-by-word breakdown (Arabic, Roman Transliteration, English Meaning).
• Built-in Voice Recorder: Record your own recitation and compare with famous Qaris!

👑 STAGE 6: COMPLETE QURAN (114 SURAHS / 30 JUZ)
• Crystal-clear Uthmani and Indo-Pak Arabic typography.
• Authentic English translations (Saheeh International & Clear Quran).
• Word-by-word English translation and Roman transliteration.
• Renowned Qari Recitations: Sheikh Mishary Rashid Alafasy, Sheikh Mahmoud Khalil Al-Husary, Sheikh Abdul Basit Abdul Samad.
• Verse-by-verse sync highlight, repeat looping for Memorization (Hifz), and speed adjustment (0.5x, 0.75x, 1x).

🎯 GAMIFICATION, STREAKS & CERTIFICATES:
• Earn XP points, unlock level badges, and maintain daily reading streaks.
• Generate official Graduation Certificates upon completing levels!
• Bookmark verses, add personal reflection notes, and search across the entire Quran.

100% Free of intrusive distractions. Designed for learners of all ages.`,
  category: "Education",
  contentRating: "Everyone / PEGI 3",
  privacyPolicyText: `Privacy Policy for Noor Quran

Last updated: 2026

Noor Quran ("we", "our", or "the App") is committed to protecting your privacy. This Privacy Policy explains how information is handled within our application.

1. Information We Collect:
- Local Storage & Sync Data: We store user learning progress, XP points, completed quiz scores, bookmarks, and user interface preferences locally on your device or securely synced to our backend database.
- Microphone Access: The App requests permission to access your device's microphone exclusively for the interactive Tajweed voice recording feature. Recordings are processed locally in real-time for your self-assessment and are NOT transmitted to external third-party advertisers or sold to any entity.

2. Analytics and Performance:
We do not track or sell your personal identifiable information. We do not use third-party behavioral advertising trackers.

3. Children's Privacy:
Noor Quran complies with COPPA and global child privacy regulations. The app does not collect personal identification from children under 13.

4. Data Security:
We implement standard security measures to protect stored bookmark and progress data.

5. Contact Us:
If you have any questions about this Privacy Policy, you may contact our support team at support@noorquran.app.`,
};
