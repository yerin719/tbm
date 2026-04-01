"use client";

import { useEffect, useState } from "react";
import { useIntroExit } from "./intro-exit-context";

const EXIT_MS = 550;
const EXIT_X_PX = 28;

export function InEveryStep() {
  const { introDone } = useIntroExit();
  const [exiting, setExiting] = useState(false);
  const [visuallyHidden, setVisuallyHidden] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    setExiting(true);
    const t = window.setTimeout(() => setVisuallyHidden(true), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [introDone]);

  return (
    <span
      className="inline-block will-change-[transform,opacity] transition-[transform,opacity] ease-out"
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        transform: exiting ? `translateX(${EXIT_X_PX}px)` : "translateX(0)",
        opacity: exiting ? 0 : 1,
        visibility: visuallyHidden ? "hidden" : "visible",
      }}
      aria-hidden={exiting || visuallyHidden ? true : undefined}
    >
      IN EVERY STEP
    </span>
  );
}

