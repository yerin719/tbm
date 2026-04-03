"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { key: "ship", label: "프로젝트/특수화물", desc: "중장비부터 항공 운송까지, 화물 특성에 최적화된\n맞춤 물류 솔루션" },
  { key: "truck", label: "신선물류", desc: "중장비부터 항공 운송까지, 화물 특성에 최적화된\n맞춤 물류 솔루션" },
  { key: "safe", label: "전시 화물", desc: "중장비부터 항공 운송까지, 화물 특성에 최적화된\n맞춤 물류 솔루션" },
  { key: "plane", label: "항공", desc: "중장비부터 항공 운송까지, 화물 특성에 최적화된\n맞춤 물류 솔루션" },
  { key: "buy", label: "이커머스", desc: "중장비부터 항공 운송까지, 화물 특성에 최적화된\n맞춤 물류 솔루션" },
];

const imageSlides = [
  { key: "truck", src: "/truck-big.png", alt: "트럭" },
  { key: "safe", src: "/safe-big.png", alt: "금고" },
  { key: "plane", src: "/plane-big.png", alt: "비행기" },
  { key: "buy", src: "/buynow-big.png", alt: "이커머스" },
];

export function BusinessIntroSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const textPanel = textRef.current;
    if (!wrap || !textPanel) return;

    const imgEls = gsap.utils.toArray<HTMLElement>("[data-biz-img]");
    const labelEls = gsap.utils.toArray<HTMLElement>(
      "[data-biz-label]",
      textPanel,
    );
    const descEls = gsap.utils.toArray<HTMLElement>(
      "[data-biz-desc]",
      textPanel,
    );

    imgEls.forEach((el) => gsap.set(el, { opacity: 0 }));
    labelEls.forEach((el, i) =>
      gsap.set(el, { color: i === 0 ? "#056BDB" : "#101116" }),
    );
    descEls.forEach((el, i) => {
      if (i === 0) {
        gsap.set(el, { height: "auto", opacity: 1 });
      } else {
        gsap.set(el, { height: 0, opacity: 0, overflow: "hidden" });
      }
    });

    function activateCategory(index: number) {
      const overlay =
        document.querySelector<HTMLElement>("[data-ship-overlay]");

      if (index === 0) {
        if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
        imgEls.forEach((el) =>
          gsap.to(el, { opacity: 0, duration: 0.5, ease: "power2.inOut" }),
        );
      } else {
        if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        imgEls.forEach((el, i) => {
          gsap.to(el, {
            opacity: i === index - 1 ? 1 : 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        });
      }

      labelEls.forEach((el, i) => {
        gsap.to(el, {
          color: i === index ? "#056BDB" : "#101116",
          duration: 0.3,
        });
      });
      descEls.forEach((el, i) => {
        if (i === index) {
          gsap.to(el, {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        }
      });
    }

    const ctx = gsap.context(() => {
      for (let i = 1; i < categories.length; i++) {
        ScrollTrigger.create({
          trigger: wrap,
          start: () => `top+=${window.innerHeight * i} top`,
          onEnter: () => activateCategory(i),
          onLeaveBack: () => activateCategory(i - 1),
        });
      }

      ScrollTrigger.create({
        trigger: wrap,
        start: "bottom top",
        onEnter: () => {
          gsap.to(textPanel, { opacity: 0, duration: 0.3 });
          imgEls.forEach((el) => gsap.to(el, { opacity: 0, duration: 0.3 }));
          const overlay =
            document.querySelector<HTMLElement>("[data-ship-overlay]");
          if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        },
        onLeaveBack: () => {
          gsap.to(textPanel, { opacity: 1, duration: 0.3 });
          activateCategory(categories.length - 1);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={textRef}
        data-biz-text
        className="pointer-events-none fixed right-0 top-0 z-50 flex h-screen w-[55%] flex-col justify-center bg-white pl-16 pr-8"
        style={{ opacity: 0 }}
      >
        <p
          className="mb-6"
          style={{
            fontFamily: "NeoHyundai, sans-serif",
            fontWeight: 800,
            fontSize: "18px",
            lineHeight: "22px",
            letterSpacing: "0.02em",
            color: "#7F0001",
          }}
        >
          사업소개
        </p>
        <div className="space-y-[22px]">
          {categories.map((cat) => (
            <div key={cat.key}>
              <h3
                data-biz-label
                className="cursor-default"
                style={{
                  fontFamily: "NeoHyundai, sans-serif",
                  fontWeight: 800,
                  fontSize: "36px",
                  lineHeight: "36px",
                  letterSpacing: "0.02em",
                  color: "#101116",
                }}
              >
                {cat.label}
              </h3>
              <div data-biz-desc>
                <p
                  className="mt-1 mb-3 whitespace-pre-line"
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0",
                    color: "#101116",
                  }}
                >
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed left-0 top-0 z-35 h-screen w-[45%]">
        {imageSlides.map((slide) => (
          <div key={slide.key} data-biz-img className="absolute inset-0">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="45vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <section
        ref={wrapRef}
        id="business-intro"
        className="relative"
        style={{ height: `${categories.length * 100}vh` }}
      />
    </>
  );
}
