import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            TBM
          </span>
          <nav className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="#"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              소개
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              문의
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 sm:py-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]"
            aria-hidden
          />
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium text-violet-600 dark:text-violet-400">
              환영합니다
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              당신의 사이트를
              <br />
              여기서 시작하세요
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Next.js App Router와 Tailwind CSS로 구성된 프로젝트입니다.
              <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                app/page.tsx
              </code>
              를 수정해 홈을 꾸며 보세요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <Link
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                문서 보기
              </Link>
              <Link
                href="#"
                className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full border border-zinc-300 bg-transparent px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                더 알아보기
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} TBM. All rights reserved.
      </footer>
    </div>
  );
}
