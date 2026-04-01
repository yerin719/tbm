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
/** Pretendard Bold 40 / 44, letter-spacing 0 (globals.css --font-sans = Pretendard) */
const headlineTypography =
  "font-sans font-bold text-[40px] leading-[44px] tracking-normal";
/** 밑줄(underscore)의 초기 너비 — 처음부터 div 선으로 표시 */
const UNDERLINE_START_PX = 12;
const GROW_RIGHT_MS = 1200;
const TEXT_FADE_MS = 400;
const GROW_LEFT_MS = 1200;
const WHITE_EXPAND_MS = 900;
const EXIT_FADE_MS = 400;

type LineGeom = {
  startLeft: number;
  lineTop: number;
  fullWidth: number;
};

type Phase = "measure" | "growRight" | "textOut" | "growLeft" | "whiteExpand";

export function IntroOverlay() {
  const lineRef = useRef<HTMLDivElement>(null);
  /** 글씨 페이드 후 measure 값이 달라지며 fixed 선이 한 번 더 움직이는 것 방지 */
  const [lockedLineGeom, setLockedLineGeom] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [geom, setGeom] = useState<LineGeom | null>(null);
  const [viewportH, setViewportH] = useState(0);
  const [mounted, setMounted] = useState(true);
  const [overlayFade, setOverlayFade] = useState(false);
  /** growLeft: absolute → fixed 정렬 후 left/width 애니메이션 시작 */
  const [growLeftReady, setGrowLeftReady] = useState(false);
  /** 흰색 커튼 scaleY 시작 */
  const [whiteExpandGo, setWhiteExpandGo] = useState(false);

  const [showText, setShowText] = useState(true);
  const [phase, setPhase] = useState<Phase>("measure");

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
    if (typeof window !== "undefined") {
      setViewportH(window.innerHeight);
    }
  }, [measure]);

  useEffect(() => {
    const onResize = () => {
      measure();
      setViewportH(window.innerHeight);
    };
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
    const t = window.setTimeout(() => setPhase("whiteExpand"), GROW_LEFT_MS);
    return () => window.clearTimeout(t);
  }, [phase, growLeftReady]);

  useEffect(() => {
    if (phase !== "whiteExpand") {
      setWhiteExpandGo(false);
      return;
    }
    setWhiteExpandGo(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setWhiteExpandGo(true));
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "whiteExpand") return;
    const t = window.setTimeout(() => setOverlayFade(true), WHITE_EXPAND_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (!overlayFade) return;
    const t = window.setTimeout(() => setMounted(false), EXIT_FADE_MS);
    return () => window.clearTimeout(t);
  }, [overlayFade]);

  useLayoutEffect(() => {
    if (phase !== "textOut") return;
    setLockedLineGeom((prev) => {
      if (prev != null) return prev;
      const el = lineRef.current;
      if (!el) return prev;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left };
    });
  }, [phase]);

  if (!mounted) return null;

  const fullWidth = geom?.fullWidth ?? 0;
  const startLeft = geom?.startLeft ?? 0;
  const lineTop = geom?.lineTop ?? 0;
  const rightSegmentWidth = Math.max(0, fullWidth - startLeft);

  const useLockedLineGeom = phase === "growLeft" || phase === "whiteExpand";
  const lineTopForAnim =
    useLockedLineGeom && lockedLineGeom ? lockedLineGeom.top : lineTop;
  const startLeftForAnim =
    useLockedLineGeom && lockedLineGeom ? lockedLineGeom.left : startLeft;
  const rightSegmentForAnim = Math.max(0, fullWidth - startLeftForAnim);

  const useFixedLine = phase === "growLeft";
  const showLine = phase !== "whiteExpand";

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
        top: lineTopForAnim,
        left: startLeftForAnim,
        width: rightSegmentForAnim,
        transition: "none",
        zIndex: 20,
      };
    } else if (phase === "growLeft" && growLeftReady) {
      fixedStyle = {
        position: "fixed",
        top: lineTopForAnim,
        left: 0,
        width: fullWidth,
        transition: `width ${GROW_LEFT_MS}ms cubic-bezier(0.22, 1, 0.36, 1), left ${GROW_LEFT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        zIndex: 20,
      };
    } else {
      fixedStyle = {
        position: "fixed",
        top: lineTopForAnim,
        left: 0,
        width: fullWidth,
        transition: "none",
        zIndex: 20,
      };
    }
  } else {
    fixedStyle = {};
  }

  /** 밑줄·흰 확장 띠 높이와 맞춤 */
  const lineStripH = 3;
  const vh =
    viewportH || (typeof window !== "undefined" ? window.innerHeight : 0);
  /** 선 중심이 화면 중앙이 아니면 vh/2 스케일로는 위·아래 끝에 못 닿음 → 더 먼 쪽 끝까지 닿도록 */
  const stripCenterY = lineTopForAnim + lineStripH / 2;
  const expandScaleY =
    vh > 0 && lineStripH > 0
      ? (2 * Math.max(stripCenterY, vh - stripCenterY)) / lineStripH
      : 1;

  return (
    <div
      className={`fixed inset-0 z-9999 transition-opacity ease-out ${
        overlayFade
          ? "pointer-events-none opacity-0"
          : "pointer-events-auto opacity-100 duration-300"
      }`}
      style={{
        backgroundColor: BG,
        transitionDuration: overlayFade ? `${EXIT_FADE_MS}ms` : undefined,
      }}
      aria-hidden
    >
      <div className="relative flex h-full w-full items-center justify-center px-6">
        <div className="relative z-10 -mt-10 flex w-max max-w-full flex-col items-start gap-1 text-left sm:-mt-12">
          <p
            className={`${headlineTypography} text-white transition-opacity duration-300 ease-out ${
              showText ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            정확하고
          </p>
          <div className="relative inline-flex items-end">
            <span
              className={`${headlineTypography} text-white transition-opacity duration-300 ease-out ${
                showText ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              안전한
            </span>
            {showLine && (
              <div
                ref={lineRef}
                className={`h-[4px] shrink-0 bg-white will-change-[width,left] ${
                  useFixedLine ? "" : "absolute bottom-0.5 left-full z-20"
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
            )}
          </div>
        </div>
      </div>

      {/* 가로 선이 끝난 뒤: 같은 높이의 흰 띠가 위아래로 scaleY로 펼쳐짐 */}
      {phase === "whiteExpand" && geom && vh > 0 && (
        <div
          className="pointer-events-none fixed inset-x-0 z-30 bg-white will-change-transform"
          style={{
            top: lineTopForAnim,
            height: lineStripH,
            transform: whiteExpandGo ? `scaleY(${expandScaleY})` : "scaleY(1)",
            transformOrigin: "center center",
            transition: `transform ${WHITE_EXPAND_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      )}
    </div>
  );
}
