import Link from "next/link";
import { Anton } from "next/font/google";
import { FloatingActions } from "./floating-actions";
import { SiteHeader } from "./site-header";
import { InEveryStep } from "./in-every-step";
import { HeroTopSlideIn } from "./hero-top-slide-in";
import { HeroBottomSlideIn } from "./hero-bottom-slide-in";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

function HeadlineLine({ initial, rest }: { initial: string; rest: string }) {
  return (
    <span className="block">
      <span className="text-(--tbm-blue)">{initial}</span>
      <span className="text-black">{rest}</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white pt-[54px] text-black">
      <SiteHeader />

      <main className="flex w-full flex-1 flex-col">
        <section
          className="flex min-h-[calc(100dvh-54px)] w-full flex-1 flex-col items-center justify-center px-5 py-10 md:px-8 md:py-12"
          aria-labelledby="hero-heading"
        >
          <p className="mb-[26px] text-center text-[14px] font-semibold leading-[18px] text-black not-italic">
            TBM SHIPPING
          </p>

          <h1
            id="hero-heading"
            className={`${anton.className} max-w-[min(100%,920px)] text-center font-normal uppercase text-[clamp(2rem,10vw,100px)] leading-[1.06] tracking-[0.02em] md:text-[100px] md:leading-[106px]`}
          >
            <span className="relative block">
              <span className="relative z-0 block">
                <span className="block">
                  <span className="text-(--tbm-blue)">T</span>
                  <span className="text-black">RUST </span>
                  <span className="text-black">
                    <InEveryStep />
                  </span>
                </span>
              </span>
              <span
                className="pointer-events-none absolute left-[540px] top-[8px] z-10 h-[87px] w-[556px] -translate-x-1/2 overflow-hidden rounded-[8px]"
                aria-hidden
              >
                <HeroTopSlideIn />
              </span>
            </span>
            <span className="relative block">
              <span className="relative z-0 block">
                <HeadlineLine initial="B" rest="EYOND THE BORDER" />
                <HeadlineLine initial="M" rest="ASTER OF LOGISTICS" />
              </span>
              <span
                className="pointer-events-none absolute left-[252px] top-2 z-10 h-[192px] w-[470px] -translate-x-1/2 overflow-hidden rounded-[12px]"
                aria-hidden
              >
                <HeroBottomSlideIn />
              </span>
            </span>
          </h1>

          <div className="mt-[32px]">
            <Link
              href="#consult"
              className="inline-flex h-[54px] w-[139px] items-center justify-center rounded-full bg-(--tbm-maroon) px-2 text-[16px] font-bold leading-[22px] tracking-normal text-white not-italic shadow-sm transition hover:brightness-95"
            >
              빠른 상담 문의
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} TBM SHIPPING. All rights reserved.
      </footer>

      <FloatingActions />
    </div>
  );
}
