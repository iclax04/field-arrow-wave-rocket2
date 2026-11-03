import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMe, type Me } from "@/lib/market.functions";
import { getDisplayZone, setDisplayZone, type DisplayZone } from "@/lib/format";

type ThemeName = "dark" | "light";

type MarketContextValue = {
  me: Me | null;
  authPending: boolean;
  ready: boolean;
  refresh: () => void;
  theme: ThemeName;
  setTheme: (next: ThemeName) => void;
  toggleTheme: () => void;
  timeZone: DisplayZone;
  setTimeZone: (zone: string) => void;
};

const MarketContext = createContext<MarketContextValue | null>(null);

function applyTheme(next: ThemeName) {
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;
  root.style.backgroundColor = next === "dark" ? "#0b1220" : "#ffffff";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "dark" ? "#0b1220" : "#ffffff");
  try {
    window.localStorage.setItem("agora-theme", next);
  } catch {
    /* private mode */
  }
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<ThemeName>("light");
  const [timeZone, setTimeZoneState] = useState<DisplayZone>(getDisplayZone());
  const userId = user?.id;

  useEffect(() => {
    const stored = window.localStorage.getItem("agora-theme");
    const next = stored === "dark" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }, []);

  const chooseTheme = useCallback((next: ThemeName) => {
    applyTheme(next);
    setTheme(next);
  }, []);

  const setTimeZone = useCallback((zone: string) => {
    setDisplayZone(zone);
    const next = getDisplayZone();
    setTimeZoneState(next);
    try {
      window.localStorage.setItem("agora-tz", next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("agora-tz");
    if (stored) setTimeZone(stored);
  }, [setTimeZone]);

  const refresh = useCallback(() => {
    if (!userId) {
      setMe(null);
      setReady(true);
      return;
    }
    getMe()
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setReady(true));
  }, [userId]);

  useEffect(() => {
    setReady(false);
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;
    const pull = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", pull);
    window.addEventListener("focus", pull);
    const timer = window.setInterval(pull, 8000);
    return () => {
      document.removeEventListener("visibilitychange", pull);
      window.removeEventListener("focus", pull);
      window.clearInterval(timer);
    };
  }, [refresh, userId]);

  return (
    <MarketContext.Provider value={{ me, authPending: isPending, ready, refresh, theme, setTheme: chooseTheme, toggleTheme, timeZone, setTimeZone }}>
      {children}
      <Toaster theme={theme} position="top-center" />
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const value = useContext(MarketContext);
  if (!value) throw new Error("useMarket must be used inside MarketProvider");
  return value;
}
