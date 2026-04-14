"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlipHorizontal2,
  FlipVertical2,
  Pause,
  Play,
  RotateCcw,
  Gauge,
} from "lucide-react";

type TeleprompterProps = {
  script: string;
  onPlayingChange?: (isPlaying: boolean) => void;
};

const MIN_SPEED = 1;
const MAX_SPEED = 10;

export default function Teleprompter({ script, onPlayingChange }: TeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFlippedVertical, setIsFlippedVertical] = useState(false);

  const frameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const paragraphs = useMemo(
    () =>
      script
        .split(/\n\s*\n/g)
        .map((part) => part.trim())
        .filter(Boolean),
    [script],
  );

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

      const pixelsPerSecond = speed * 22;
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
  }, [isPlaying, speed]);

  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

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
      }

      if (event.code === "ArrowUp") {
        event.preventDefault();
        setSpeed((prev) => Math.min(MAX_SPEED, prev + 1));
      }

      if (event.code === "ArrowDown") {
        event.preventDefault();
        setSpeed((prev) => Math.max(MIN_SPEED, prev - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const resetToStart = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = 0;
    lastTsRef.current = null;
    setIsPlaying(false);
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
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
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
              className="h-2 w-36 cursor-pointer accent-white sm:w-44"
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
            Space: Play/Pause • ArrowUp/ArrowDown: Speed
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="relative h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain"
      >
        <div
          className="relative min-h-full"
          style={transformValue ? { transform: transformValue } : undefined}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/3 z-20 w-[min(75vw,960px)] -translate-x-1/2 border-t border-emerald-400/80" />

          <div className="mx-auto w-full max-w-6xl px-6 pb-[45vh] pt-[33vh] sm:px-14 lg:px-28">
            <div className="space-y-8 text-center font-sans text-4xl font-medium leading-[1.35] tracking-[0.01em] text-zinc-100 sm:text-5xl">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 24)}-${index}`} className="whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))
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