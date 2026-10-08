"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Microphone button for the search boxes, on the browser's own Web Speech
 * API (no audio reaches our servers; the browser vendor's speech service
 * transcribes it). Hidden where the API is missing — Firefox, and Safari
 * without Siri — so the box never shows a control that cannot work.
 *
 * The recognition language follows the browser's preferred Indian language
 * when it has one (hi-IN, kn-IN, ta-IN…), else Indian English. A spoken query
 * in any of those goes to /search, where plain-language queries are read.
 */
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function ctor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const INDIAN = /^(hi|kn|ta|te|ml|mr|bn|gu|pa|or)\b/i;

function speechLang(): string {
  const prefs = typeof navigator !== "undefined" ? navigator.languages ?? [navigator.language] : [];
  const hit = prefs.find((l) => INDIAN.test(l));
  return hit ? `${hit.slice(0, 2).toLowerCase()}-IN` : "en-IN";
}

export function VoiceSearch({ onInterim, onResult }: { onInterim?: (text: string) => void; onResult: (text: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    setSupported(Boolean(ctor()));
    return () => rec.current?.abort();
  }, []);

  if (!supported) return null;

  function toggle() {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const C = ctor();
    if (!C) return;
    const r = new C();
    r.lang = speechLang();
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;
    let finalText = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (interim && onInterim) onInterim((finalText + interim).trim());
    };
    r.onerror = (e) => {
      setStatus(e.error === "not-allowed" || e.error === "service-not-allowed" ? "Microphone access is blocked for this site." : e.error === "no-speech" ? "Didn't hear anything — try again." : "Voice search isn't available right now.");
    };
    r.onend = () => {
      setListening(false);
      const t = finalText.trim();
      if (t) {
        setStatus("");
        onResult(t);
      }
    };
    rec.current = r;
    setStatus("Listening… say a speciality, symptom or doctor's name.");
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
      setStatus("Voice search isn't available right now.");
    }
  }

  return (
    <>
      <button
        type="button"
        className={listening ? "voice on" : "voice"}
        onClick={toggle}
        aria-label={listening ? "Stop listening" : "Search by voice"}
        aria-pressed={listening}
        title={listening ? "Stop listening" : "Search by voice"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      </button>
      <span className="voice-status" role="status" aria-live="polite">{status}</span>
    </>
  );
}
