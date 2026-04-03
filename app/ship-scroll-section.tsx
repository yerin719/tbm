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

    const row = ship.querySelector<HTMLElement>('[data-row="images"]');
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
    const nonShipItems = afterHeroItems;

    gsap.set(ship, {
      visibility: "visible",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      y: 0,
    });

    gsap.set([...shipItem, ...afterHeroItems], { y: window.innerHeight });
    if (row) {
      gsap.set(row, { "--pad": "0px" });
    }
    gsap.set([...shipItem, ...afterHeroItems], { opacity: 1 });

    const ctx = gsap.context(() => {
      /** 사진 간격(--pad)이 벌어지는 구간의 스크롤 길이 (뷰포트 높이 배수) */
      const SPREAD_SCROLL_VH = 0.55;
      /** 간격 애니메이션 종료 후 선박 확대가 시작되기까지 추가 스크롤 */
      const POST_SPREAD_BEFORE_SHIP_VH = 0.26;

      const gapScrollEndY = (afterHeroEndY: number) =>
        afterHeroEndY + 300 + window.innerHeight * SPREAD_SCROLL_VH;
      const shipZoomStartY = (afterHeroEndY: number) =>
        gapScrollEndY(afterHeroEndY) + 40 + window.innerHeight * POST_SPREAD_BEFORE_SHIP_VH;

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
            return `top+=${y + 200 + window.innerHeight * 1.1} top`;
          },
          scrub: 1.6,
        },
      });

      // 이미지가 정렬된 뒤 추가 스크롤에서 간격(총 4px)을 서서히 생성
      if (row) {
        gsap.to(row, {
          "--pad": "4px",
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: () => {
              const el = document.querySelector<HTMLElement>("#phase2-content");
              const y = el
                ? el.getBoundingClientRect().top + window.scrollY
                : 0;
              const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
              return `top+=${afterHeroEndY + 300} top`;
            },
            end: () => {
              const el = document.querySelector<HTMLElement>("#phase2-content");
              const y = el
                ? el.getBoundingClientRect().top + window.scrollY
                : 0;
              const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
              return `top+=${gapScrollEndY(afterHeroEndY)} top`;
            },
            scrub: 1,
          },
        });
      }

      // Phase 3: 간격이 벌어진 이후 추가 스크롤에서 ship 확대/좌측 이동 + 나머지 숨김
      if (items.ship) {
        const shipEl = items.ship;
        gsap.fromTo(
          shipEl,
          { scale: 1, x: 0, y: 0 },
          {
            scale: () => {
              // 사업소개 고정 이미지 영역(w-[45%]) 가로에 맞추기 — 높이(100vh) 채움보다 큰 배율이면 그만큼 더 확대
              const w = shipEl.offsetWidth;
              const h = shipEl.offsetHeight;
              const targetW = window.innerWidth * 0.45;
              const scaleW = targetW / Math.max(1, w);
              const scaleH = window.innerHeight / Math.max(1, h);
              return Math.max(scaleW, scaleH);
            },
            x: () => {
              const r = shipEl.getBoundingClientRect();
              const curX = Number(gsap.getProperty(shipEl, "x")) || 0;
              return -(r.left - curX);
            },
            y: () => {
              const r = shipEl.getBoundingClientRect();
              const curY = Number(gsap.getProperty(shipEl, "y")) || 0;
              return -(r.top - curY);
            },
            transformOrigin: "top left",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: document.body,
              start: () => {
                const el =
                  document.querySelector<HTMLElement>("#phase2-content");
                const y = el
                  ? el.getBoundingClientRect().top + window.scrollY
                  : 0;
                const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
                return `top+=${shipZoomStartY(afterHeroEndY)} top`;
              },
              end: () => {
                const el =
                  document.querySelector<HTMLElement>("#phase2-content");
                const y = el
                  ? el.getBoundingClientRect().top + window.scrollY
                  : 0;
                const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
                return `top+=${shipZoomStartY(afterHeroEndY) + window.innerHeight * 0.9} top`;
              },
              scrub: 1,
            },
          },
        );
      }

      if (nonShipItems.length > 0) {
        gsap.to(nonShipItems, {
          opacity: 0,
          scale: 0.96,
          ease: "none",
          stagger: 0.02,
          scrollTrigger: {
            trigger: document.body,
            start: () => {
              const el = document.querySelector<HTMLElement>("#phase2-content");
              const y = el
                ? el.getBoundingClientRect().top + window.scrollY
                : 0;
              const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
              return `top+=${shipZoomStartY(afterHeroEndY)} top`;
            },
            end: () => {
              const el = document.querySelector<HTMLElement>("#phase2-content");
              const y = el
                ? el.getBoundingClientRect().top + window.scrollY
                : 0;
              const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
              return `top+=${shipZoomStartY(afterHeroEndY) + window.innerHeight * 0.45} top`;
            },
            scrub: 1,
          },
        });
      }

      // Phase 3 동시: 사업소개 텍스트 페이드인
      ScrollTrigger.create({
        trigger: document.body,
        start: () => {
          const el = document.querySelector<HTMLElement>("#phase2-content");
          const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
          return `top+=${shipZoomStartY(afterHeroEndY)} top`;
        },
        end: () => {
          const el = document.querySelector<HTMLElement>("#phase2-content");
          const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          const afterHeroEndY = y + 200 + window.innerHeight * 1.1;
          return `top+=${shipZoomStartY(afterHeroEndY) + window.innerHeight * 0.9} top`;
        },
        scrub: 1,
        onUpdate: (self) => {
          const bizText =
            document.querySelector<HTMLElement>("[data-biz-text]");
          if (bizText) {
            gsap.set(bizText, { opacity: self.progress });
          }
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
      data-ship-overlay
      className="pointer-events-none fixed z-30"
      style={{ visibility: "hidden", willChange: "transform" }}
    >
      <div
        className="flex w-screen items-end"
        data-row="images"
        style={{
          gap: "calc(var(--pad) * 2)",
          marginLeft: "calc(var(--pad) * -1)",
          marginRight: "calc(var(--pad) * -1)",
        }}
      >
        <div
          className="relative aspect-256/470 w-1/5"
          data-item="buynow"
          style={{ paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}
        >
          <Image
            src="/buynow.png"
            alt="구매"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div
          className="relative aspect-256/470 w-1/5"
          data-item="airplane"
          style={{ paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}
        >
          <Image
            src="/airplane.png"
            alt="비행기"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div
          className="relative aspect-256/470 w-1/5"
          data-item="ship"
          style={{ paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}
        >
          <Image
            src="/ship.png"
            alt="화물선"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div
          className="relative aspect-256/470 w-1/5"
          data-item="truck"
          style={{ paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}
        >
          <Image
            src="/truck.png"
            alt="트럭"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <div
          className="relative aspect-256/470 w-1/5"
          data-item="safe"
          style={{ paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}
        >
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
