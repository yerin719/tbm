"use client";

import {
  createContext,
  useCallback,
  useContext,
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

  return (
    <IntroExitContext.Provider value={value}>
      <IntroOverlay onExitComplete={onExitComplete} />
      {children}
    </IntroExitContext.Provider>
  );
}
