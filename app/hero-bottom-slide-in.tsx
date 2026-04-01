"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useIntroExit } from "./intro-exit-context";

// hero-top: introDone 이후 550ms 대기 + 650ms 슬라이드인
const WAIT_AFTER_INTRO_DONE_MS = 550 + 650;
const SLIDE_IN_MS = 700;
const FROM_X_PX = -56;

export function HeroBottomSlideIn() {
  const { introDone } = useIntroExit();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    const t = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setShown(true));
    }, WAIT_AFTER_INTRO_DONE_MS);
    return () => window.clearTimeout(t);
  }, [introDone]);

  return (
    <Image
      src="/hero-bottom.png"
      alt=""
      width={470}
      height={192}
      className="h-full w-full select-none object-cover will-change-[transform,opacity] transition-[transform,opacity] ease-out"
      style={{
        transitionDuration: `${SLIDE_IN_MS}ms`,
        transform: shown ? "translateX(0)" : `translateX(${FROM_X_PX}px)`,
        opacity: shown ? 1 : 0,
        visibility: mounted ? "visible" : "hidden",
      }}
      priority
    />
  );
}

