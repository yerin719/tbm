"use client";

import { useEffect, useState } from "react";
import { useIntroExit } from "./intro-exit-context";

// hero-top: introDone 이후 550ms 대기 + 650ms 슬라이드인
// hero-bottom은 그 다음 등장하도록 맞춰둠
const WAIT_AFTER_INTRO_DONE_MS = 550 + 650;
const SHIFT_MS = 700;

export function HeroLinesShift() {
  const { introDone } = useIntroExit();
  const [go, setGo] = useState(false);
  const [hideTail, setHideTail] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    const t = window.setTimeout(() => {
      setGo(true);
      window.setTimeout(() => setHideTail(true), SHIFT_MS);
    }, WAIT_AFTER_INTRO_DONE_MS);
    return () => window.clearTimeout(t);
  }, [introDone]);

  const commonLineStyle: React.CSSProperties = {
    transitionDuration: `${SHIFT_MS}ms`,
  };

  return (
    <>
      <span
        className="block will-change-transform transition-transform ease-out"
        style={{
          ...commonLineStyle,
          transform: go ? "translateX(470px)" : "translateX(0)",
        }}
      >
        <span className="text-(--tbm-blue)">B</span>
        <span className="text-black">EYOND </span>
        <span
          className="text-black will-change-opacity transition-opacity ease-out"
          style={{
            transitionDuration: `${SHIFT_MS}ms`,
            opacity: go ? 0 : 1,
            visibility: hideTail ? "hidden" : "visible",
          }}
          aria-hidden={go || hideTail ? true : undefined}
        >
          THE BORDER
        </span>
      </span>

      <span
        className="block will-change-transform transition-transform ease-out"
        style={{
          ...commonLineStyle,
          transform: go ? "translateX(500px)" : "translateX(0)",
        }}
      >
        <span className="text-(--tbm-blue)">M</span>
        <span className="text-black">ASTER </span>
        <span
          className="text-black will-change-opacity transition-opacity ease-out"
          style={{
            transitionDuration: `${SHIFT_MS}ms`,
            opacity: go ? 0 : 1,
            visibility: hideTail ? "hidden" : "visible",
          }}
          aria-hidden={go || hideTail ? true : undefined}
        >
          OF LOGISTICS
        </span>
      </span>
    </>
  );
}

