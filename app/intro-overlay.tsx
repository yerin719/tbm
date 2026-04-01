"use client";

import { Anton } from "next/font/google";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const BG = "#00254D";
/** Pretendard Bold 40 / 44, letter-spacing 0 (globals.css --font-sans = Pretendard) */
const headlineTypography =
  "font-sans font-bold text-[40px] leading-[44px] tracking-normal";
/** 밑줄(underscore)의 초기 너비 — 처음부터 div 선으로 표시 */
const UNDERLINE_START_PX = 12;
const GROW_RIGHT_MS = 1200;
const TEXT_FADE_MS = 400;
const GROW_LEFT_MS = 1200;
/** 흰색이 위·아래로 펼쳐지는 시간 */
const WHITE_EXPAND_MS = 2200;
const EXIT_FADE_MS = 400;

/** 홈 히어로 h1과 동일 3줄 (HeadlineLine: 첫 글자 파란 + 나머지 검정) */
const HERO_TYPE_LINES = [
  { full: "TRUST IN EVERY STEP" as const },
  { full: "BEYOND THE BORDER" as const },
  { full: "MASTER OF LOGISTICS" as const },
] as const;

const HERO_TOTAL_CHARS = HERO_TYPE_LINES.reduce((n, l) => n + l.full.length, 0);

const lineStartOffsets: number[] = [];
(() => {
  let o = 0;
  for (const l of HERO_TYPE_LINES) {
    lineStartOffsets.push(o);
    o += l.full.length;
  }
})();

type LineGeom = {
  startLeft: number;
  lineTop: number;
  fullWidth: number;
};

type Phase = "measure" | "growRight" | "textOut" | "growLeft" | "whiteExpand";

type IntroOverlayProps = {
  /** 오버레이 페이드 아웃이 끝난 뒤(언마운트 직전) 호출 */
  onExitComplete?: () => void;
};

export function IntroOverlay({ onExitComplete }: IntroOverlayProps) {
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
  /** whiteExpand 중 히어로 3줄 누적 타이핑 글자 수 */
  const [heroTypedCount, setHeroTypedCount] = useState(0);

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
      setHeroTypedCount(0);
      return;
    }
    setWhiteExpandGo(false);
    setHeroTypedCount(0);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setWhiteExpandGo(true));
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  /** 흰색이 위·아래로 열리는 동안 홈 메인과 동일 3줄 타이핑 (열림과 같은 길이) */
  useEffect(() => {
    if (phase !== "whiteExpand" || !whiteExpandGo) return;
    const n = HERO_TOTAL_CHARS;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / WHITE_EXPAND_MS);
      setHeroTypedCount(Math.min(n, Math.max(0, Math.ceil(t * n))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setHeroTypedCount(n);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, whiteExpandGo]);

  useEffect(() => {
    if (phase !== "whiteExpand") return;
    const t = window.setTimeout(() => setOverlayFade(true), WHITE_EXPAND_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (!overlayFade) return;
    const t = window.setTimeout(() => {
      onExitComplete?.();
      setMounted(false);
    }, EXIT_FADE_MS);
    return () => window.clearTimeout(t);
  }, [overlayFade, onExitComplete]);

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
        <div className="relative z-10 flex w-max max-w-full flex-col items-start gap-1 text-left">
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
                  useFixedLine
                    ? ""
                    : "-translate-y-[3px] absolute bottom-0.5 left-full z-20"
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

      {/* 흰 배경 위·홈 h1과 동일 3줄 타이포 — 세로 확장과 같은 시간에 타이핑 */}
      {phase === "whiteExpand" && whiteExpandGo && (
        <div
          className={`${anton.className} pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-5 text-center`}
          aria-hidden
        >
          <h1 className="max-w-[min(100%,920px)] font-normal uppercase leading-[1.06] tracking-[0.02em] text-black text-[clamp(2rem,10vw,100px)] md:text-[100px] md:leading-[106px]">
            {HERO_TYPE_LINES.map((line, lineIdx) => {
              const start = lineStartOffsets[lineIdx] ?? 0;
              const visible = Math.max(
                0,
                Math.min(line.full.length, heroTypedCount - start),
              );
              const showCursor =
                heroTypedCount < HERO_TOTAL_CHARS &&
                ((visible > 0 && visible < line.full.length) ||
                  (visible === 0 && heroTypedCount === start && lineIdx > 0));

              return (
                <span key={line.full} className="block">
                  {visible > 0 && (
                    <>
                      <span className="text-(--tbm-blue)">{line.full[0]}</span>
                      <span className="text-black">
                        {line.full.slice(1, visible)}
                      </span>
                    </>
                  )}
                  {showCursor && (
                    <span className="ml-1 inline-block animate-pulse font-light text-black">
                      |
                    </span>
                  )}
                </span>
              );
            })}
          </h1>
        </div>
      )}
    </div>
  );
}
