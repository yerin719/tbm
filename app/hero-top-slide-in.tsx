"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useIntroExit } from "./intro-exit-context";

const WAIT_AFTER_INTRO_DONE_MS = 550; // IN EVERY STEP exit duration
const SLIDE_IN_MS = 650;
const FROM_X_PX = 48;

export function HeroTopSlideIn() {
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
      src="/hero-top.png"
      alt=""
      width={556}
      height={87}
      className="absolute bottom-[-26] left-0 h-auto w-full select-none will-change-[transform,opacity] transition-[transform,opacity] ease-out"
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
