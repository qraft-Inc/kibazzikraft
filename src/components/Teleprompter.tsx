"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Upload,
} from "lucide-react";

type TeleprompterProps = {
  onPlayingChange?: (isPlaying: boolean) => void;
};

type UploadedScript = {
  id: string;
  fileName: string;
  title: string;
  content: string;
  loadedAt: string;
};

type TakeMarker = {
  id: string;
  label: string;
  elapsedAt: string;
  createdAt: string;
};

const STORAGE_KEYS = {
  speed: "teleprompter.speed",
  fontSize: "teleprompter.fontSize",
  mirrorMode: "teleprompter.mirrorMode",
  currentScriptId: "teleprompter.currentScriptId",
};

const MIN_SPEED = 1;
const MAX_SPEED = 12;
const MIN_FONT_SIZE = 32;
const MAX_FONT_SIZE = 96;

const isSupportedScriptFile = (fileName: string) => /\.(txt|md)$/i.test(fileName);

const toTitleFromFileName = (fileName: string) =>
  fileName
    .replace(/\.(txt|md)$/i, "")
    .replace(/[_-]+/g, " ")
    .trim() || "Untitled Script";

const formatElapsed = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

type ParsedLine =
  | { kind: "blank"; text: string }
  | { kind: "pause"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "speaker"; speaker: string; text: string }
  | { kind: "text"; text: string };

const parseLine = (line: string): ParsedLine => {
  const trimmed = line.trim();

  if (!trimmed) {
    return { kind: "blank", text: "" };
  }

  if (/^\[PAUSE[^\]]*\]$/i.test(trimmed)) {
    return { kind: "pause", text: trimmed };
  }

  if (/^#{1,6}\s+/.test(trimmed)) {
    return { kind: "heading", text: trimmed.replace(/^#{1,6}\s+/, "") };
  }

  if (/^MODULE\b/i.test(trimmed)) {
    return { kind: "heading", text: trimmed };
  }

  const speakerMatch = trimmed.match(/^([A-Z][A-Z0-9\s]{1,24}):\s*(.*)$/);
  if (speakerMatch) {
    return {
      kind: "speaker",
      speaker: speakerMatch[1],
      text: speakerMatch[2],
    };
  }

  return { kind: "text", text: line };
};

export default function Teleprompter({ onPlayingChange }: TeleprompterProps) {
  const [scripts, setScripts] = useState<UploadedScript[]>([]);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [fontSize, setFontSize] = useState(56);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [takeLog, setTakeLog] = useState<TakeMarker[]>([]);
  const [editorNotes, setEditorNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const currentScript = useMemo(
    () => scripts.find((item) => item.id === currentScriptId) ?? null,
    [scripts, currentScriptId],
  );

  const currentScriptIndex = useMemo(
    () => scripts.findIndex((item) => item.id === currentScriptId),
    [scripts, currentScriptId],
  );

  const parsedLines = useMemo(() => {
    if (!currentScript) return [];
    return currentScript.content.split("\n").map(parseLine);
  }, [currentScript]);

  const resetToTop = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollTop = 0;
    }
    lastTsRef.current = null;
    setIsPlaying(false);
  }, []);

  const selectScript = useCallback(
    (scriptId: string) => {
      setCurrentScriptId(scriptId);
      resetToTop();
      setUploadError(null);
    },
    [resetToTop],
  );

  const goToRelativeScript = useCallback(
    (direction: -1 | 1) => {
      if (scripts.length === 0) return;
      const activeIndex = currentScriptIndex >= 0 ? currentScriptIndex : 0;
      const nextIndex = (activeIndex + direction + scripts.length) % scripts.length;
      selectScript(scripts[nextIndex].id);
    },
    [currentScriptIndex, scripts, selectScript],
  );

  // File upload logic: accepts .txt/.md only, reads content with file.text(),
  // and stores scripts in in-memory React state (no backend/database).
  const handleFileImport = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;
    const selectedFiles = Array.from(fileList);
    if (selectedFiles.length === 0) return;

    const unsupported = selectedFiles.filter((file) => !isSupportedScriptFile(file.name));
    const supported = selectedFiles.filter((file) => isSupportedScriptFile(file.name));

    const loadedScripts: UploadedScript[] = [];
    const failedFiles: string[] = [];

    for (const file of supported) {
      try {
        const content = await file.text();
        loadedScripts.push({
          id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          title: toTitleFromFileName(file.name),
          content,
          loadedAt: new Date().toISOString(),
        });
      } catch {
        failedFiles.push(file.name);
      }
    }

    if (loadedScripts.length > 0) {
      setScripts((prev) => [...prev, ...loadedScripts]);
      setCurrentScriptId((prev) => prev ?? loadedScripts[0].id);
    }

    if (unsupported.length > 0 || failedFiles.length > 0) {
      const unsupportedNames = unsupported.map((file) => file.name).join(", ");
      const failedNames = failedFiles.join(", ");
      const chunks = [
        unsupportedNames ? `Unsupported file type: ${unsupportedNames}` : "",
        failedNames ? `Could not read: ${failedNames}` : "",
      ].filter(Boolean);
      setUploadError(chunks.join(" • "));
    } else {
      setUploadError(null);
    }
  }, []);

  const clearAllScripts = useCallback(() => {
    setIsPlaying(false);
    setScripts([]);
    setCurrentScriptId(null);
    setUploadError(null);
    setTakeLog([]);
    setElapsedSeconds(0);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await root.requestFullscreen();
  }, []);

  const addTakeMarker = useCallback(() => {
    setTakeLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        label: `TAKE ${prev.length + 1}`,
        elapsedAt: formatElapsed(elapsedSeconds),
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [elapsedSeconds]);

  const exportTakeLog = useCallback(() => {
    const lines = [
      "Teleprompter Take Log",
      `Script: ${currentScript?.fileName ?? "No script selected"}`,
      `Elapsed: ${formatElapsed(elapsedSeconds)}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Take Markers:",
      ...(takeLog.length > 0
        ? takeLog.map((item) => `${item.label} at ${item.elapsedAt}`)
        : ["No take markers recorded."]),
      "",
      "Notes for Editor:",
      editorNotes.trim() || "(No notes)",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `take-log-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [currentScript?.fileName, elapsedSeconds, takeLog, editorNotes]);

  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
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

      const pixelsPerSecond = 30 + speed * 24;
      const nextTop = scroller.scrollTop + (deltaMs / 1000) * pixelsPerSecond;
      const maxTop = scroller.scrollHeight - scroller.clientHeight;

      if (nextTop >= maxTop) {
        scroller.scrollTop = Math.max(maxTop, 0);
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
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSpeed = Number(window.localStorage.getItem(STORAGE_KEYS.speed));
    const savedFontSize = Number(window.localStorage.getItem(STORAGE_KEYS.fontSize));
    const savedMirror = window.localStorage.getItem(STORAGE_KEYS.mirrorMode) === "true";
    const savedScriptId = window.localStorage.getItem(STORAGE_KEYS.currentScriptId);

    if (!Number.isNaN(savedSpeed) && savedSpeed >= MIN_SPEED && savedSpeed <= MAX_SPEED) {
      setSpeed(savedSpeed);
    }
    if (
      !Number.isNaN(savedFontSize) &&
      savedFontSize >= MIN_FONT_SIZE &&
      savedFontSize <= MAX_FONT_SIZE
    ) {
      setFontSize(savedFontSize);
    }
    setIsMirrored(savedMirror);
    if (savedScriptId) {
      setCurrentScriptId(savedScriptId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.speed, String(speed));
  }, [speed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.fontSize, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.mirrorMode, String(isMirrored));
  }, [isMirrored]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentScriptId) {
      window.localStorage.setItem(STORAGE_KEYS.currentScriptId, currentScriptId);
    }
  }, [currentScriptId]);

  useEffect(() => {
    if (scripts.length === 0) return;
    if (!currentScriptId || !scripts.some((item) => item.id === currentScriptId)) {
      setCurrentScriptId(scripts[0].id);
    }
  }, [scripts, currentScriptId]);

  // Keyboard shortcuts:
  // Space=Play/Pause, ArrowUp=slow down, ArrowDown=speed up,
  // R=reset, F=fullscreen, M=mirror, N=next script, P=previous script.
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
        setIsPlaying((prev) => !prev);
        return;
      }

      if (event.code === "ArrowUp") {
        event.preventDefault();
        setSpeed((prev) => Math.max(MIN_SPEED, prev - 1));
        return;
      }

      if (event.code === "ArrowDown") {
        event.preventDefault();
        setSpeed((prev) => Math.min(MAX_SPEED, prev + 1));
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        resetToTop();
        return;
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        setIsMirrored((prev) => !prev);
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        goToRelativeScript(1);
        return;
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        goToRelativeScript(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToRelativeScript, resetToTop, toggleFullscreen]);

  return (
    <section ref={rootRef} className="relative h-screen overflow-hidden bg-black text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md"
        multiple
        className="hidden"
        onChange={(event) => {
          void handleFileImport(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      <div className="flex h-full">
        <aside
          className={`border-r border-zinc-800 bg-zinc-950 transition-all duration-200 ${
            isSidebarOpen ? "w-80 p-4" : "w-0 overflow-hidden p-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">Script Queue</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium transition hover:bg-zinc-700"
            >
              <Upload size={14} /> Upload
            </button>
          </div>

          <button
            type="button"
            onClick={clearAllScripts}
            className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            Clear All Scripts
          </button>

          {uploadError ? (
            <p className="mt-3 rounded-md border border-amber-300/30 bg-amber-300/10 p-2 text-xs text-amber-200">
              {uploadError}
            </p>
          ) : null}

          <ul className="mt-4 space-y-2 overflow-y-auto pr-1 text-sm">
            {scripts.map((item) => {
              const active = item.id === currentScriptId;
              const isEmpty = item.content.trim().length === 0;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectScript(item.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      active
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                        : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="truncate text-xs opacity-75">{item.fileName}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      {new Date(item.loadedAt).toLocaleTimeString()} {isEmpty ? "• empty file" : ""}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={addTakeMarker}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-700"
            >
              Take Marker
            </button>

            <textarea
              value={editorNotes}
              onChange={(event) => setEditorNotes(event.target.value)}
              placeholder="Notes for Editor"
              className="h-28 w-full resize-y rounded-md border border-zinc-700 bg-black/40 p-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
            />

            <button
              type="button"
              onClick={exportTakeLog}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
            >
              <Download size={14} /> Export Take Log
            </button>

            <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/50 p-2 text-xs text-zinc-300">
              {takeLog.length > 0 ? (
                takeLog.map((item) => (
                  <p key={item.id}>
                    <span className="font-semibold text-yellow-300">{item.label}</span> @ {item.elapsedAt}
                  </p>
                ))
              ) : (
                <p className="text-zinc-500">No take markers yet.</p>
              )}
            </div>
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="absolute left-3 top-3 z-30 rounded-md border border-zinc-700 bg-black/70 p-2 text-zinc-200 backdrop-blur transition hover:bg-zinc-900"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <div
            ref={scrollerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div
              className="mx-auto w-full max-w-6xl px-6 pb-[40vh] pt-[28vh] sm:px-10 lg:px-20"
              style={{ transform: isMirrored ? "scaleX(-1)" : undefined }}
            >
              {currentScript ? (
                <div
                  className="space-y-5 text-center font-semibold leading-[1.75] tracking-wide text-zinc-50"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {parsedLines.map((line, index) => {
                    if (line.kind === "blank") {
                      return <div key={`blank-${index}`} className="h-8" aria-hidden="true" />;
                    }

                    if (line.kind === "pause") {
                      return (
                        <div
                          key={`pause-${index}`}
                          className="mx-auto w-fit rounded-md border border-yellow-500/40 bg-yellow-400/10 px-5 py-2 text-xl font-bold uppercase tracking-wider text-yellow-200"
                        >
                          {line.text}
                        </div>
                      );
                    }

                    if (line.kind === "heading") {
                      return (
                        <p
                          key={`heading-${index}`}
                          className="whitespace-pre-wrap text-5xl font-extrabold leading-[1.35] text-emerald-100 sm:text-6xl"
                        >
                          {line.text}
                        </p>
                      );
                    }

                    if (line.kind === "speaker") {
                      return (
                        <p key={`speaker-${index}`} className="whitespace-pre-wrap text-left">
                          <span className="mr-2 rounded bg-zinc-800 px-2 py-1 text-yellow-300">
                            {line.speaker}:
                          </span>
                          <span>{line.text}</span>
                        </p>
                      );
                    }

                    return (
                      <p key={`line-${index}`} className="whitespace-pre-wrap text-zinc-100">
                        {line.text}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="grid min-h-[50vh] place-items-center text-center">
                  <p className="text-2xl font-medium text-zinc-400">
                    Upload a .txt or .md script to begin.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 z-20 border-t border-zinc-800 bg-black/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-700"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={() => setSpeed((prev) => Math.max(MIN_SPEED, prev - 1))}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                Slower
              </button>
              <button
                type="button"
                onClick={() => setSpeed((prev) => Math.min(MAX_SPEED, prev + 1))}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                Faster
              </button>

              <button
                type="button"
                onClick={resetToTop}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                <RotateCcw size={14} /> Reset
              </button>

              <button
                type="button"
                onClick={() => setFontSize((prev) => Math.max(MIN_FONT_SIZE, prev - 4))}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize((prev) => Math.min(MAX_FONT_SIZE, prev + 4))}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                A+
              </button>

              <button
                type="button"
                onClick={() => setIsMirrored((prev) => !prev)}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                {isMirrored ? "Unmirror" : "Mirror"}
              </button>

              <button
                type="button"
                onClick={() => {
                  void toggleFullscreen();
                }}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>

              <button
                type="button"
                onClick={() => goToRelativeScript(-1)}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => goToRelativeScript(1)}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                Next
              </button>

              <div className="ml-auto text-right text-xs text-zinc-400">
                <p>
                  {currentScript ? `${currentScript.fileName}` : "No script loaded"} • Speed {speed}
                </p>
                <p>
                  Elapsed {formatElapsed(elapsedSeconds)} • Shortcuts: Space / ↑ / ↓ / R / F / M / N / P
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}