"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroExit } from "./intro-exit-context";

gsap.registerPlugin(ScrollTrigger);

export function ShipScrollSection() {
  const shipRef = useRef<HTMLDivElement>(null);
  const { introDone } = useIntroExit();

  useEffect(() => {
    const ship = shipRef.current;
    if (!ship) return;

    gsap.set(ship, {
      visibility: "visible",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      y: window.innerHeight,
    });

    const ctx = gsap.context(() => {
      // Phase 1: hero를 고정(pin)하고, 배가 화면 아래에서 중앙으로 올라옴
      gsap.to(ship, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top 54px",
          end: "+=100%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Phase 2 끝 부분에서 배 페이드아웃
      gsap.to(ship, {
        opacity: 0,
        scrollTrigger: {
          trigger: "#phase2-content",
          start: "80% center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (introDone) {
      ScrollTrigger.refresh();
    }
  }, [introDone]);

  return (
    <div
      ref={shipRef}
      className="pointer-events-none fixed z-30"
      style={{ visibility: "hidden", willChange: "transform" }}
    >
      <Image
        src="/ship.png"
        alt="화물선"
        width={512}
        height={940}
        className="h-auto w-[280px] md:w-[360px] lg:w-[420px]"
        priority
      />
    </div>
  );
}
