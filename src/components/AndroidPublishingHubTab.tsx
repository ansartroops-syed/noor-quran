"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Terminal,
  FileCode,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Key,
  PlaySquare,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { ANDROID_PUBLISHING_GUIDE, PLAY_STORE_METADATA } from "@/data/androidPublishingGuide";

export function AndroidPublishingHubTab() {
  const [activeSubtab, setActiveSubtab] = useState<"steps" | "generators" | "store_listing" | "privacy">("steps");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const capacitorConfigCode = `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noorquran.learning.app',
  appName: 'Noor Quran',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#064e3b",
      showSpinner: false,
      androidSplashResourceName: "splash",
    }
  }
};

export default config;`;

  const androidManifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.noorquran.learning.app">

    <!-- Permissions required for Quran streaming & Tajweed voice recorder -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
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
</manifest>`;

  const assetLinksJsonCode = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.noorquran.learning.app",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7D:0F:52:AB:E0:85:47:7E:5B:70:2B:86:84:4F:1B:5B:48:2B:38:00:26:A4:7B:64:0A:FB:74:29:40"
      ]
    }
  }
]`;

  const oneClickBuildScript = `#!/bin/bash
# ==============================================================
# Noor Quran - Android Native APK & AAB Production Build Script
# ==============================================================
set -e

echo "🌟 [1/5] Building static web bundle for Android export..."
npm run build

echo "📦 [2/5] Initializing / Syncing Capacitor Android Container..."
if [ ! -d "android" ]; then
  npx cap add android
fi
npx cap sync android

echo "🔑 [3/5] Verifying Keystore Signing Keys..."
if [ ! -f "my-release-key.jks" ]; then
  echo "Generating release keystore 'my-release-key.jks'..."
  keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias noor-quran-key -storepass "NoorQuranPass123" -keypass "NoorQuranPass123" -dname "CN=Noor Quran, OU=App, O=Noor Quran, L=City, S=State, C=US"
fi

echo "🚀 [4/5] Compiling Android App Bundle (AAB) with Gradle..."
cd android
./gradlew bundleRelease

echo "✅ [5/5] Build Completed Successfully!"
echo "Your Google Play production bundle is ready at:"
echo "android/app/build/outputs/bundle/release/app-release.aab"
`;

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#063e30] via-[#04281f] to-[#021812] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Smartphone className="w-3.5 h-3.5" /> Android APK & Google Play Publishing Hub
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Build & Publish to Google Play Store
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Step-by-step instructions, pre-written configuration files, keystore signing commands, and ASO store metadata to turn this fullstack application into a Google Play Android App!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-center shrink-0 space-y-1">
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Ready Formats</span>
            <span className="text-base font-extrabold text-amber-300 block">.AAB & .APK</span>
            <span className="text-[10px] text-emerald-400 block">Google Play Compliant (2026)</span>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-emerald-900/60 overflow-x-auto no-scrollbar">
          {[
            { id: "steps", label: "Step-by-Step Guide", icon: Terminal },
            { id: "generators", label: "Config Files & Scripts", icon: FileCode },
            { id: "store_listing", label: "Play Store Listing & ASO", icon: PlaySquare },
            { id: "privacy", label: "Privacy Policy HTML", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubtab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubtab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-emerald-950/60 text-slate-300 hover:text-white border border-emerald-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: STEP-BY-STEP PUBLISHING PROCESS */}
      {activeSubtab === "steps" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {ANDROID_PUBLISHING_GUIDE.map((step) => (
              <div
                key={step.id}
                className="p-6 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-4 shadow-xl"
              >
                {/* Step Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-900/60">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
                      {step.stepNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{step.title}</h3>
                      <span className="text-[11px] text-emerald-400 font-semibold">{step.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200">{step.shortSummary}</p>

                {/* Details List */}
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {step.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>

                {/* Code Snippet Box */}
                {step.codeSnippet && (
                  <div className="rounded-2xl bg-[#031510] border border-emerald-900 overflow-hidden space-y-0">
                    <div className="px-4 py-2 bg-[#02100c] border-b border-emerald-950 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-emerald-400">{step.codeSnippet.filename}</span>
                      <button
                        onClick={() => handleCopy(step.codeSnippet!.code, `step_${step.stepNumber}`)}
                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition"
                      >
                        {copiedKey === `step_${step.stepNumber}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                      <code>{step.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Tips Box */}
                {step.tips.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 space-y-1">
                    <span className="font-bold block">💡 Pro Developer Tips:</span>
                    {step.tips.map((t, idx) => (
                      <p key={idx} className="text-slate-300 text-[11px]">
                        • {t}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CONFIG GENERATORS & DOWNLOADS */}
      {activeSubtab === "generators" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* capacitor.config.ts */}
            <div className="p-6 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" /> capacitor.config.ts
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300">
                    Capacitor Config
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Required in project root for Capacitor Android build.
                </p>
                <pre className="p-3.5 rounded-xl bg-[#031510] text-[11px] font-mono text-emerald-200 overflow-x-auto max-h-48">
                  {capacitorConfigCode}
                </pre>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopy(capacitorConfigCode, "cap_config")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 font-semibold text-xs border border-emerald-800 flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === "cap_config" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadFile(capacitorConfigCode, "capacitor.config.ts")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* AndroidManifest.xml */}
            <div className="p-6 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-400" /> AndroidManifest.xml
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900 text-teal-300">
                    Permissions & Manifest
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Located at android/app/src/main/AndroidManifest.xml.
                </p>
                <pre className="p-3.5 rounded-xl bg-[#031510] text-[11px] font-mono text-emerald-200 overflow-x-auto max-h-48">
                  {androidManifestCode}
                </pre>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopy(androidManifestCode, "android_manifest")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 font-semibold text-xs border border-emerald-800 flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === "android_manifest" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadFile(androidManifestCode, "AndroidManifest.xml", "application/xml")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* .well-known/assetlinks.json */}
            <div className="p-6 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" /> assetlinks.json (TWA / PWA)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900 text-purple-300">
                    Digital Asset Links
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Host at https://your-domain.com/.well-known/assetlinks.json for URL-bar-free TWA.
                </p>
                <pre className="p-3.5 rounded-xl bg-[#031510] text-[11px] font-mono text-emerald-200 overflow-x-auto max-h-48">
                  {assetLinksJsonCode}
                </pre>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopy(assetLinksJsonCode, "asset_links")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 font-semibold text-xs border border-emerald-800 flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === "asset_links" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadFile(assetLinksJsonCode, "assetlinks.json", "application/json")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* One-Click build-android.sh */}
            <div className="p-6 rounded-3xl bg-[#06241c] border border-amber-500/40 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" /> build-android.sh (Automated 1-Click Build)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900 text-amber-300">
                    Bash Automator
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Run <code>bash build-android.sh</code> on your computer to build the .aab in one go!
                </p>
                <pre className="p-3.5 rounded-xl bg-[#031510] text-[11px] font-mono text-amber-200 overflow-x-auto max-h-48">
                  {oneClickBuildScript}
                </pre>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopy(oneClickBuildScript, "build_script")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 font-semibold text-xs border border-emerald-800 flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === "build_script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadFile(oneClickBuildScript, "build-android.sh", "application/x-sh")}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" /> Download Script
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: GOOGLE PLAY STORE LISTING & ASO METADATA */}
      {activeSubtab === "store_listing" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PlaySquare className="w-5 h-5 text-amber-400" /> Google Play Store Listing (ASO-Optimized)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Copy and paste these pre-formatted descriptions directly into your Google Play Console store listing.
            </p>
          </div>

          {/* App Title */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#041a14] border border-emerald-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                App Title (Max 30 characters)
              </label>
              <button
                onClick={() => handleCopy(PLAY_STORE_METADATA.appTitle, "store_title")}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copiedKey === "store_title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
              </button>
            </div>
            <p className="text-base font-bold text-white">{PLAY_STORE_METADATA.appTitle}</p>
          </div>

          {/* Short Description */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#041a14] border border-emerald-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Short Description (Max 80 characters)
              </label>
              <button
                onClick={() => handleCopy(PLAY_STORE_METADATA.shortDescription, "store_short")}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copiedKey === "store_short" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-200">{PLAY_STORE_METADATA.shortDescription}</p>
          </div>

          {/* Full Description */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#041a14] border border-emerald-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Full Description (Max 4000 characters)
              </label>
              <button
                onClick={() => handleCopy(PLAY_STORE_METADATA.fullDescription, "store_full")}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copiedKey === "store_full" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy All
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-[#02130e] text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
              {PLAY_STORE_METADATA.fullDescription}
            </div>
          </div>

          {/* Graphic Assets Checklist */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-xs">
            <span className="font-bold text-amber-300 block">🎨 Required Store Graphics Dimensions:</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li><strong>App Icon:</strong> 512 x 512 px, 32-bit PNG (with alpha)</li>
              <li><strong>Feature Graphic:</strong> 1024 x 500 px, JPG or 24-bit PNG (no alpha)</li>
              <li><strong>Phone Screenshots:</strong> At least 4 screenshots (minimum 1080 x 1920 px or 16:9 ratio)</li>
              <li><strong>7-inch & 10-inch Tablet Screenshots:</strong> Optional, but recommended for top ranking</li>
            </ul>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PRIVACY POLICY HTML */}
      {activeSubtab === "privacy" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Compliant Privacy Policy
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Google Play requires a public HTTPS Privacy Policy covering microphone audio recording and user data.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(PLAY_STORE_METADATA.privacyPolicyText, "privacy_copy")}
                className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 font-semibold text-xs border border-emerald-800 flex items-center gap-1.5 transition"
              >
                {copiedKey === "privacy_copy" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
              </button>
              <button
                onClick={() => handleDownloadFile(PLAY_STORE_METADATA.privacyPolicyText, "privacy-policy.txt")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#031510] text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-emerald-900">
            {PLAY_STORE_METADATA.privacyPolicyText}
          </div>
        </div>
      )}
    </div>
  );
}
