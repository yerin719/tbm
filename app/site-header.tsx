"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useIntroExit } from "./intro-exit-context";

const navItems = [
  { href: "#about", label: "회사소개" },
  { href: "#business", label: "사업영역" },
  { href: "#board", label: "게시판" },
] as const;

const pillLinks = [
  { href: "/login", label: "LOGIN" },
  { href: "/register", label: "REGISTER" },
  { href: "/my", label: "MY" },
  { href: "#search", label: "SEARCH" },
] as const;

export function SiteHeader() {
  const { introDone } = useIntroExit();
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!introDone) return;

    lastYRef.current = window.scrollY || 0;
    window.requestAnimationFrame(() => setHiddenByScroll(false));

    const update = () => {
      tickingRef.current = false;

      const y = window.scrollY || 0;
      const lastY = lastYRef.current;
      const delta = y - lastY;

      lastYRef.current = y;

      // 최상단에서는 항상 보이게
      if (y <= 0) {
        setHiddenByScroll(false);
        return;
      }

      // 미세한 흔들림(터치 스크롤) 무시
      if (Math.abs(delta) < 6) return;

      if (delta > 0) setHiddenByScroll(true); // 아래로 스크롤: 숨김
      else setHiddenByScroll(false); // 위로 스크롤: 표시
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [introDone]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-[100] h-[54px] bg-white transition-transform duration-500 ease-out will-change-transform ${
        introDone && !hiddenByScroll ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1320px] flex-nowrap items-center justify-between gap-3 px-5 md:gap-4 md:px-8">
        <Link
          href="/"
          className="group shrink-0 text-[14px] font-semibold leading-[18px] not-italic"
        >
          <span className="text-[var(--tbm-maroon)]">TBM</span>{" "}
          <span className="text-black">SHIPPING</span>
        </Link>

        <nav
          className="flex min-w-0 flex-1 justify-center gap-4 text-[13px] font-medium text-black sm:gap-6 sm:text-[14px] md:gap-8 md:text-[15px]"
          aria-label="주 메뉴"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {pillLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-8 min-w-[3.5rem] shrink-0 items-center justify-center rounded-full border border-black px-2 text-[10px] font-semibold tracking-wide text-black transition hover:bg-black hover:text-white sm:min-w-[4rem] sm:px-3 sm:text-[11px] md:h-9 md:min-w-[4.25rem] md:text-xs"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
