"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

const BG = "#00254D";
/** 밑줄(underscore)의 초기 너비 — 처음부터 div 선으로 표시 */
const UNDERLINE_START_PX = 12;
const GROW_RIGHT_MS = 1200;
const TEXT_FADE_MS = 400;
const GROW_LEFT_MS = 1200;
const OVERLAY_HOLD_MS = 5000;
const OVERLAY_FADE_MS = 300;

type LineGeom = {
  startLeft: number;
  lineTop: number;
  fullWidth: number;
};

export function IntroOverlay() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<LineGeom | null>(null);
  const [mounted, setMounted] = useState(true);
  const [overlayFade, setOverlayFade] = useState(false);
  /** growLeft: absolute → fixed 정렬 후 left/width 애니메이션 시작 */
  const [growLeftReady, setGrowLeftReady] = useState(false);

  const [showText, setShowText] = useState(true);
  const [phase, setPhase] = useState<
    "measure" | "growRight" | "textOut" | "growLeft" | "done"
  >("measure");

  const measure = useCallback(() => {
    const el = lineRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setGeom({
      startLeft: r.left,
      lineTop: r.bottom - 2,
      fullWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  useEffect(() => {
    if (!geom || phase !== "measure") return;
    const id = requestAnimationFrame(() => setPhase("growRight"));
    return () => cancelAnimationFrame(id);
  }, [geom, phase]);

  useEffect(() => {
    if (phase !== "growRight" || !geom) return;
    const t = window.setTimeout(() => setPhase("textOut"), GROW_RIGHT_MS);
    return () => window.clearTimeout(t);
  }, [phase, geom]);

  useEffect(() => {
    if (phase !== "textOut") return;
    setShowText(false);
    const t = window.setTimeout(() => setPhase("growLeft"), TEXT_FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "growLeft") {
      setGrowLeftReady(false);
      return;
    }
    setGrowLeftReady(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setGrowLeftReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "growLeft" || !growLeftReady) return;
    const t = window.setTimeout(() => setPhase("done"), GROW_LEFT_MS);
    return () => window.clearTimeout(t);
  }, [phase, growLeftReady]);

  useEffect(() => {
    const fadeTimer = window.setTimeout(
      () => setOverlayFade(true),
      OVERLAY_HOLD_MS
    );
    const removeTimer = window.setTimeout(
      () => setMounted(false),
      OVERLAY_HOLD_MS + OVERLAY_FADE_MS
    );
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  const fullWidth = geom?.fullWidth ?? 0;
  const startLeft = geom?.startLeft ?? 0;
  const lineTop = geom?.lineTop ?? 0;
  const rightSegmentWidth = Math.max(0, fullWidth - startLeft);

  const useFixedLine = phase === "growLeft" || phase === "done";

  const inlineWidth =
    phase === "measure"
      ? UNDERLINE_START_PX
      : phase === "growRight" || phase === "textOut"
        ? rightSegmentWidth
        : rightSegmentWidth;

  let fixedStyle: CSSProperties;
  if (useFixedLine) {
    if (phase === "growLeft" && !growLeftReady) {
      fixedStyle = {
        position: "fixed",
        top: lineTop,
        left: startLeft,
        width: rightSegmentWidth,
        transition: "none",
        zIndex: 20,
      };
    } else if (phase === "growLeft" && growLeftReady) {
      fixedStyle = {
        position: "fixed",
        top: lineTop,
        left: 0,
        width: fullWidth,
        transition: `width ${GROW_LEFT_MS}ms cubic-bezier(0.22, 1, 0.36, 1), left ${GROW_LEFT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        zIndex: 20,
      };
    } else {
      fixedStyle = {
        position: "fixed",
        top: lineTop,
        left: 0,
        width: fullWidth,
        transition: "none",
        zIndex: 20,
      };
    }
  } else {
    fixedStyle = {};
  }

  return (
    <div
      className={`fixed inset-0 z-9999 transition-opacity duration-300 ease-out ${
        overlayFade ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
      }`}
      style={{ backgroundColor: BG }}
      aria-hidden
    >
      <div className="relative flex h-full w-full items-center justify-center px-6">
        <div className="relative z-10 flex flex-col items-center gap-1 text-center">
          <p
            className={`text-2xl font-semibold tracking-tight text-white transition-opacity duration-300 ease-out sm:text-3xl ${
              showText ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            정확하고
          </p>
          {/* 안전한 + 밑줄: 밑줄은 처음부터 div 한 개 (텍스트만 페이드) */}
          <div className="relative inline-flex items-end">
            <span
              className={`text-2xl font-semibold tracking-tight text-white transition-opacity duration-300 ease-out sm:text-3xl ${
                showText ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              안전한
            </span>
            <div
              ref={lineRef}
              className={`h-0.5 shrink-0 bg-white will-change-[width,left] ${
                useFixedLine ? "" : "absolute bottom-0 left-full z-20"
              }`}
              style={
                useFixedLine
                  ? fixedStyle
                  : {
                      width: inlineWidth,
                      transition:
                        phase === "growRight"
                          ? `width ${GROW_RIGHT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                          : "none",
                    }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
