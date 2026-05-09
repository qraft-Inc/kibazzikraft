"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlipHorizontal2,
  FlipVertical2,
  Pause,
  Play,
  RotateCcw,
  Gauge,
  Mic,
} from "lucide-react";

type RecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    0: { transcript: string };
    isFinal: boolean;
    length: number;
  }>;
};

type RecognitionErrorLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: RecognitionErrorLike) => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

type TeleprompterProps = {
  script: string;
  onPlayingChange?: (isPlaying: boolean) => void;
};

type VoiceMatchResult = {
  lineIndex: number;
  score: number;
};

const MIN_SPEED = 1;
const MAX_SPEED = 10;
const MIN_SENSITIVITY = 1;
const MAX_SENSITIVITY = 10;

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTokenSet = (value: string) => new Set(normalizeText(value).split(" ").filter(Boolean));

const getSpeechErrorMessage = (error?: string) => {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone access was blocked. You can continue immediately using Manual Mode (Play/Pause + Speed controls). To use Voice Mode later, allow mic permission in your browser site settings, then re-enable Voice Mode. If deployed, use HTTPS. In local development, use localhost.";
  }

  if (error === "audio-capture") {
    return "No microphone was detected. Connect or enable a microphone, then try Voice Mode again.";
  }

  if (error === "network") {
    return "Speech recognition had a network issue. Check your connection and try Voice Mode again.";
  }

  return `Voice recognition error (${error ?? "unknown"}). Switched back to manual mode.`;
};

export default function Teleprompter({ script, onPlayingChange }: TeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sensitivity, setSensitivity] = useState(6);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFlippedVertical, setIsFlippedVertical] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const frameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldRestartRecognitionRef = useRef(false);
  const currentLineIndexRef = useRef(0);
  const sensitivityRef = useRef(6);
  const voiceLinesRef = useRef<
    Array<{ displayIndex: number; normalized: string; tokens: Set<string> }>
  >([]);

  const scriptLines = useMemo(() => script.split("\n"), [script]);

  const voiceLines = useMemo(
    () =>
      scriptLines
        .map((line, displayIndex) => {
          const normalized = normalizeText(line);
          return {
            displayIndex,
            normalized,
            tokens: toTokenSet(line),
          };
        })
        .filter((line) => line.normalized.length > 0),
    [scriptLines],
  );

  const getBestVoiceMatch = useCallback((transcript: string): VoiceMatchResult | null => {
    const voiceLinesSnapshot = voiceLinesRef.current;
    const normalizedTranscript = normalizeText(transcript);
    if (!normalizedTranscript || voiceLinesSnapshot.length === 0) return null;

    const transcriptTokens = toTokenSet(normalizedTranscript);
    if (transcriptTokens.size === 0) return null;

    const currentVoicePosition = Math.max(
      0,
      voiceLinesSnapshot.findIndex(
        (line) => line.displayIndex >= currentLineIndexRef.current,
      ),
    );

    const lookAhead = 3 + sensitivityRef.current * 2;
    const start = Math.max(0, currentVoicePosition - 1);
    const end = Math.min(
      voiceLinesSnapshot.length - 1,
      currentVoicePosition + lookAhead,
    );

    let bestScore = -1;
    let bestDisplayIndex: number | null = null;

    for (let i = start; i <= end; i += 1) {
      const candidate = voiceLinesSnapshot[i];
      let overlap = 0;
      transcriptTokens.forEach((token) => {
        if (candidate.tokens.has(token)) overlap += 1;
      });

      const tokenScore = overlap / Math.max(candidate.tokens.size, 1);
      const containsScore =
        candidate.normalized.includes(normalizedTranscript) ||
        normalizedTranscript.includes(candidate.normalized)
          ? 0.35
          : 0;
      const score = Math.min(1, tokenScore + containsScore);

      if (score > bestScore) {
        bestScore = score;
        bestDisplayIndex = candidate.displayIndex;
      }
    }

    const threshold = 0.58 - sensitivityRef.current * 0.04;
    if (bestDisplayIndex !== null && bestScore >= threshold) {
      return { lineIndex: bestDisplayIndex, score: bestScore };
    }

    return null;
  }, []);

  const voiceConfidenceLabel = useMemo(() => {
    if (voiceConfidence === null) return null;
    if (voiceConfidence >= 0.75) return "High";
    if (voiceConfidence >= 0.5) return "Medium";
    return "Low";
  }, [voiceConfidence]);

  const voiceConfidenceBadgeClass = useMemo(() => {
    if (voiceConfidenceLabel === "High") {
      return "border-emerald-300/60 bg-emerald-300/20 text-emerald-100";
    }
    if (voiceConfidenceLabel === "Medium") {
      return "border-amber-300/60 bg-amber-300/20 text-amber-100";
    }
    if (voiceConfidenceLabel === "Low") {
      return "border-rose-300/60 bg-rose-300/20 text-rose-100";
    }
    return "border-zinc-400/50 bg-zinc-700/30 text-zinc-100";
  }, [voiceConfidenceLabel]);

  const scrollToLine = (lineIndex: number) => {
    const lineElement = lineRefs.current[lineIndex];
    if (!lineElement) return;
    lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getSpeechRecognitionConstructor = useCallback(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
  }, []);

  useEffect(() => {
    setCurrentLineIndex(0);
    lineRefs.current = [];
  }, [script]);

  useEffect(() => {
    currentLineIndexRef.current = currentLineIndex;
  }, [currentLineIndex]);

  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  useEffect(() => {
    voiceLinesRef.current = voiceLines;
  }, [voiceLines]);

  useEffect(() => {
    if (!isPlaying || isVoiceEnabled) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTsRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      if (lastTsRef.current === null) {
        lastTsRef.current = timestamp;
      }

      const deltaMs = timestamp - lastTsRef.current;
      lastTsRef.current = timestamp;

      // Enhanced speed calculation: exponential scaling for smoother control
      // Speed 1-3: slow speed, 4-7: medium speed, 8-10: fast speed
      const speedMultiplier = speed <= 3 ? speed * 35 : speed <= 7 ? speed * 40 : speed * 50;
      const pixelsPerSecond = speedMultiplier;
      const nextTop = scroller.scrollTop + (deltaMs / 1000) * pixelsPerSecond;
      const maxTop = scroller.scrollHeight - scroller.clientHeight;

      if (nextTop >= maxTop) {
        scroller.scrollTop = maxTop;
        setIsPlaying(false);
        return;
      }

      scroller.scrollTop = nextTop;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTsRef.current = null;
    };
  }, [isPlaying, speed, isVoiceEnabled]);

  useEffect(() => {
    onPlayingChange?.(isVoiceEnabled ? isListening : isPlaying);
  }, [isPlaying, isVoiceEnabled, isListening, onPlayingChange]);

  useEffect(() => {
    if (!isVoiceEnabled) {
      shouldRestartRecognitionRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
      setLastTranscript("");
      setVoiceConfidence(null);
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setVoiceWarning(
        "Voice mode is not supported in this browser. Falling back to manual speed control.",
      );
      setIsVoiceEnabled(false);
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const chunk = event.results[i]?.[0]?.transcript ?? "";
          transcript += ` ${chunk}`;
        }

        const transcriptPreview = transcript.trim();
        if (transcriptPreview) {
          setLastTranscript(transcriptPreview);
        }

        const bestMatch = getBestVoiceMatch(transcript);
        if (bestMatch === null) return;
        setVoiceConfidence(bestMatch.score);
        setCurrentLineIndex(bestMatch.lineIndex);
        scrollToLine(bestMatch.lineIndex);
      };

      recognition.onerror = (event) => {
        setVoiceWarning(getSpeechErrorMessage(event.error));
        shouldRestartRecognitionRef.current = false;
        setIsListening(false);
        setIsVoiceEnabled(false);
        setVoiceConfidence(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (!shouldRestartRecognitionRef.current) return;

        try {
          recognition.start();
        } catch {
          setVoiceWarning(
            "Voice recognition could not restart. Switched back to manual mode.",
          );
          shouldRestartRecognitionRef.current = false;
          setIsVoiceEnabled(false);
        }
      };

      recognitionRef.current = recognition;
    }

    setIsPlaying(false);
    setVoiceWarning(null);
    shouldRestartRecognitionRef.current = true;

    try {
      recognitionRef.current.start();
    } catch {
      setVoiceWarning(
        "Voice recognition could not start. Switched back to manual mode.",
      );
      shouldRestartRecognitionRef.current = false;
      setIsVoiceEnabled(false);
      setIsListening(false);
      setVoiceConfidence(null);
    }

    return () => {
      shouldRestartRecognitionRef.current = false;
      recognitionRef.current?.stop();
    };
  }, [isVoiceEnabled, getBestVoiceMatch, getSpeechRecognitionConstructor]);

  useEffect(() => {
    return () => {
      shouldRestartRecognitionRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isEditable) return;

      if (event.code === "Space") {
        event.preventDefault();
        if (isVoiceEnabled) return;
        setIsPlaying((prev) => !prev);
      }

      if (event.code === "ArrowUp") {
        event.preventDefault();
        if (isVoiceEnabled) return;
        setSpeed((prev) => Math.min(MAX_SPEED, prev + 1));
      }

      if (event.code === "ArrowDown") {
        event.preventDefault();
        if (isVoiceEnabled) return;
        setSpeed((prev) => Math.max(MIN_SPEED, prev - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVoiceEnabled]);

  const resetToStart = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = 0;
    lastTsRef.current = null;
    setCurrentLineIndex(0);
    setLastTranscript("");
    setVoiceConfidence(null);
    setIsPlaying(false);
  };

  const retryMicrophonePermission = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setVoiceWarning(
        "Your browser does not support direct microphone permission prompts. Open browser site settings and allow microphone.",
      );
      return;
    }

    try {
      setIsRequestingMic(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setVoiceWarning(
        "Microphone permission granted. You can now re-enable Voice Mode.",
      );
    } catch {
      setVoiceWarning(
        "Microphone permission is still blocked. Allow mic in browser site settings, refresh, then enable Voice Mode.",
      );
    } finally {
      setIsRequestingMic(false);
    }
  };

  const transformValue = [
    isMirrored ? "scaleX(-1)" : "",
    isFlippedVertical ? "scaleY(-1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="relative overflow-hidden rounded-2xl bg-black text-white">
      <div className="sticky top-0 z-30 border-b border-white/15 bg-black/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => {
              if (isVoiceEnabled) return;
              setIsPlaying((prev) => !prev);
            }}
            disabled={isVoiceEnabled}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <label className="inline-flex items-center gap-2 text-sm text-zinc-200">
            <Gauge size={16} />
            <span>Speed {speed}</span>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              disabled={isVoiceEnabled}
              className="h-2 w-36 cursor-pointer accent-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-44"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setIsVoiceEnabled((prev) => !prev);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <Mic
              size={16}
              className={isVoiceEnabled && isListening ? "animate-pulse text-emerald-300" : ""}
            />
            {isVoiceEnabled ? "Voice On" : "Voice Mode"}
          </button>

          <label className="inline-flex items-center gap-2 text-sm text-zinc-200">
            <span>Sensitivity {sensitivity}</span>
            <input
              type="range"
              min={MIN_SENSITIVITY}
              max={MAX_SENSITIVITY}
              value={sensitivity}
              onChange={(event) => setSensitivity(Number(event.target.value))}
              className="h-2 w-36 cursor-pointer accent-emerald-300 sm:w-44"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsMirrored((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <FlipHorizontal2 size={16} />
            {isMirrored ? "Mirror On" : "Mirror Mode"}
          </button>

          <button
            type="button"
            onClick={() => setIsFlippedVertical((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <FlipVertical2 size={16} />
            {isFlippedVertical ? "Flip On" : "Flip Vertical"}
          </button>

          <button
            type="button"
            onClick={resetToStart}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <p className="ml-auto text-xs text-zinc-400">
            {isVoiceEnabled
              ? isListening
                ? "Listening... voice-matched scrolling active"
                : "Voice mode on. Waiting for microphone access"
              : "Space: Play/Pause • ArrowUp/ArrowDown: Speed"}
          </p>

          {isVoiceEnabled ? (
            <div className="w-full rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold">Live Transcript</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${voiceConfidenceBadgeClass}`}
                >
                  Confidence: {voiceConfidenceLabel ?? "--"}
                </span>
              </div>
              {lastTranscript ? (
                <span className="italic">&quot;{lastTranscript.slice(0, 200)}&quot;</span>
              ) : (
                <span className="text-emerald-200/80">Waiting for speech...</span>
              )}
            </div>
          ) : null}
        </div>
        {voiceWarning ? (
          <div className="border-t border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-200 sm:px-6">
            <p>{voiceWarning}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  void retryMicrophonePermission();
                }}
                disabled={isRequestingMic}
                className="rounded-md border border-amber-200/50 bg-amber-200/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:bg-amber-200/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRequestingMic ? "Requesting Mic..." : "Retry Mic Access"}
              </button>
              <a
                href="https://support.google.com/chrome/answer/2693767"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-amber-200/40 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:bg-amber-200/20"
              >
                Open Browser Mic Help
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <div
        ref={scrollerRef}
        className="relative h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "auto",
        }}
      >
        <div
          className="relative min-h-full"
          style={transformValue ? { transform: transformValue } : undefined}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/3 z-20 w-[min(75vw,960px)] -translate-x-1/2 border-t border-emerald-400/80" />

          <div className="mx-auto w-full max-w-6xl px-6 pb-[45vh] pt-[33vh] sm:px-14 lg:px-28">
            <div className="space-y-6 text-center font-sans text-4xl font-medium leading-[1.35] tracking-[0.01em] text-zinc-100 sm:text-5xl">
              {scriptLines.length > 0 ? (
                scriptLines.map((line, index) =>
                  line.trim() ? (
                    <p
                      key={`${line.slice(0, 24)}-${index}`}
                      ref={(element) => {
                        lineRefs.current[index] = element;
                      }}
                      className={`whitespace-pre-wrap transition-colors ${
                        currentLineIndex === index
                          ? "text-yellow-300"
                          : "text-zinc-100"
                      }`}
                    >
                      {line}
                    </p>
                  ) : (
                    <div key={`blank-${index}`} className="h-8" aria-hidden="true" />
                  ),
                )
              ) : (
                <p className="text-zinc-400">No script provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}