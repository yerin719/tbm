"use client";

import { useEffect, useState } from "react";

export function IntroOverlay() {
  const [mounted, setMounted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 5000);
    const removeTimer = window.setTimeout(() => setMounted(false), 5300);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#00254D] transition-opacity duration-300 ease-out ${
        fadeOut ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
      }`}
      aria-hidden
    />
  );
}
