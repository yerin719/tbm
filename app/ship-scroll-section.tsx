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

    const items = {
      buynow: ship.querySelector<HTMLElement>('[data-item="buynow"]'),
      airplane: ship.querySelector<HTMLElement>('[data-item="airplane"]'),
      ship: ship.querySelector<HTMLElement>('[data-item="ship"]'),
      truck: ship.querySelector<HTMLElement>('[data-item="truck"]'),
      safe: ship.querySelector<HTMLElement>('[data-item="safe"]'),
    };

    const shipItem = [items.ship].filter(Boolean) as HTMLElement[];
    const afterHeroItems = [
      items.buynow,
      items.airplane,
      items.truck,
      items.safe,
    ].filter(Boolean) as HTMLElement[];

    gsap.set(ship, {
      visibility: "visible",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      y: 0,
    });

    gsap.set([...shipItem, ...afterHeroItems], { y: window.innerHeight });

    const ctx = gsap.context(() => {
      // Phase 1: hero를 고정(pin)하고 ship만 먼저 올라옴
      gsap.to(shipItem, {
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

      // Phase 2 시작(=hero 이후)에 나머지 4개가 순서대로 등장
      gsap.to(afterHeroItems, {
        y: 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: {
          // 섹션 트리거 대신 "문서 y좌표" 기준으로 시작/종료를 잡음
          trigger: document.body,
          start: () => {
            const el = document.querySelector<HTMLElement>("#phase2-content");
            const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
            return `top+=${y + 200} top`;
          },
          end: () => {
            const el = document.querySelector<HTMLElement>("#phase2-content");
            const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
            return `top+=${y + 200 + window.innerHeight * 0.6} top`;
          },
          scrub: 1,
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
      <div className="flex w-screen items-end">
        <div className="relative aspect-256/470 w-1/5" data-item="buynow">
          <Image
            src="/buynow.png"
            alt="구매"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="relative aspect-256/470 w-1/5" data-item="airplane">
          <Image
            src="/airplane.png"
            alt="비행기"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="relative aspect-256/470 w-1/5" data-item="ship">
          <Image
            src="/ship.png"
            alt="화물선"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="relative aspect-256/470 w-1/5" data-item="truck">
          <Image
            src="/truck.png"
            alt="트럭"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="relative aspect-256/470 w-1/5" data-item="safe">
          <Image
            src="/safe.png"
            alt="금고"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
