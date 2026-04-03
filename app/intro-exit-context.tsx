"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { IntroOverlay } from "./intro-overlay";

type IntroExitContextValue = {
  introDone: boolean;
};

const IntroExitContext = createContext<IntroExitContextValue | null>(null);

export function useIntroExit() {
  const ctx = useContext(IntroExitContext);
  if (!ctx) {
    throw new Error("useIntroExit는 IntroExitProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}

export function IntroExitProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const onExitComplete = useCallback(() => setIntroDone(true), []);

  const value = useMemo(() => ({ introDone }), [introDone]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (introDone) return;

    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [introDone]);

  useEffect(() => {
    if (!introDone) return;
    window.scrollTo(0, 0);
  }, [introDone]);

  return (
    <IntroExitContext.Provider value={value}>
      <IntroOverlay onExitComplete={onExitComplete} />
      {children}
    </IntroExitContext.Provider>
  );
}
