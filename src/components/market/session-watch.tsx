import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getBearerToken, signOut, authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const PROTECTED = ["/dashboard", "/mint", "/deposit", "/withdraw"];
const WARN_MS = 28 * 60 * 1000;
const LIMIT_MS = 30 * 60 * 1000;

export function SessionWatch() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [warn, setWarn] = useState(false);
  const last = useRef(Date.now());
  const signedOut = useRef(false);

  useEffect(() => {
    const leave = () => {
      if (signedOut.current) return;
      if (window.location.pathname.startsWith("/admin")) return;
      signedOut.current = true;
      window.location.replace("/");
    };
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("agora-auth");
      channel.onmessage = (event) => {
        if (event.data === "signed-out") leave();
      };
    } catch {
      channel = null;
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === "agora-signed-out") leave();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      channel?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (isPending || user) return;
    if (PROTECTED.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      window.location.replace("/login?mode=in");
    }
  }, [isPending, user, pathname]);

  useEffect(() => {
    if (!user) return;
    const mark = () => {
      last.current = Date.now();
      setWarn(false);
    };
    const events = ["pointerdown", "keydown", "scroll"] as const;
    for (const name of events) window.addEventListener(name, mark, { passive: true });
    const timer = window.setInterval(() => {
      const idle = Date.now() - last.current;
      if (idle >= LIMIT_MS) {
        void signOut("/");
        return;
      }
      if (idle >= WARN_MS) setWarn(true);
    }, 15_000);
    const onFocus = () => {
      void authClient.getSession().then((result) => {
        if (!result.data?.user && !getBearerToken()) {
          if (PROTECTED.some((path) => pathname === path)) window.location.replace("/login?mode=in");
        }
      });
    };
    window.addEventListener("focus", onFocus);
    return () => {
      for (const name of events) window.removeEventListener(name, mark);
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [user, pathname]);

  if (!warn) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/50 px-4" role="dialog" aria-modal="true" aria-labelledby="idle-title">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 text-fg">
        <h2 id="idle-title" className="text-xl">You will be signed out soon</h2>
        <p className="mt-2 text-sm text-muted">For your security, this session ends after 30 minutes without activity. Two minutes remain.</p>
        <div className="mt-5 flex gap-2">
          <button type="button" className="btn" onClick={() => { last.current = Date.now(); setWarn(false); }}>Stay signed in</button>
          <button type="button" className="btn-ghost" onClick={() => void signOut("/")}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
