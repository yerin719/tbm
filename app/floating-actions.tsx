"use client";

export function FloatingActions() {
  return (
    <div
      className="fixed bottom-8 right-6 z-40 flex flex-col gap-3 md:bottom-10 md:right-8"
      role="toolbar"
      aria-label="빠른 도구"
    >
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--tbm-blue)] bg-white text-[var(--tbm-blue)] shadow-sm transition hover:bg-zinc-50"
        aria-label="맨 위로"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tbm-blue)] text-white shadow-md transition hover:brightness-110"
        aria-label="고객 상담"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      </button>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-zinc-800"
        aria-label="닫기"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
