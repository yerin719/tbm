import Link from "next/link";
import { Anton } from "next/font/google";
import { FloatingActions } from "./floating-actions";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

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

function HeadlineLine({
  initial,
  rest,
}: {
  initial: string;
  rest: string;
}) {
  return (
    <span className="block">
      <span className="text-[var(--tbm-blue)]">{initial}</span>
      <span className="text-black">{rest}</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="h-[54px] shrink-0">
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
            <HeadlineLine initial="T" rest="RUST IN EVERY STEP" />
            <HeadlineLine initial="B" rest="EYOND THE BORDER" />
            <HeadlineLine initial="M" rest="ASTER OF LOGISTICS" />
          </h1>

          <div className="mt-[32px]">
            <Link
              href="#consult"
              className="inline-flex h-[54px] w-[139px] items-center justify-center rounded-full bg-[var(--tbm-maroon)] px-2 text-[13px] font-semibold leading-tight text-white shadow-sm transition hover:brightness-95 sm:text-[14px]"
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
