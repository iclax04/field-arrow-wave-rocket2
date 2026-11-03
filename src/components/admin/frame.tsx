import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/market/back-button";
import { adminFetch } from "@/lib/admin-client";

const LINKS = [
  ["overview", "Overview"],
  ["users", "Users"],
  ["deposits", "Deposits"],
  ["withdrawals", "Withdrawals"],
  ["address", "Deposit address"],
  ["artworks", "Artworks"],
  ["transactions", "Transactions"],
  ["settings", "Settings"],
  ["admins", "Admin accounts"],
  ["audit", "Audit log"],
] as const;

export function AdminFrame({ children, counts }: { children: React.ReactNode; counts?: { deposits?: number; withdrawals?: number } }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const section = useRouterState({ select: (state) => (state.location.search as { section?: string }).section || "overview" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const last = { at: Date.now() };
    const mark = () => {
      last.at = Date.now();
    };
    const events = ["pointerdown", "keydown"] as const;
    for (const name of events) window.addEventListener(name, mark);
    const timer = window.setInterval(() => {
      if (Date.now() - last.at >= 30 * 60 * 1000) {
        void adminFetch("logout", { method: "POST" }).finally(() => window.location.replace("/admin/login"));
      }
    }, 15_000);
    return () => {
      for (const name of events) window.removeEventListener(name, mark);
      window.clearInterval(timer);
    };
  }, []);

  async function signOut() {
    try {
      await adminFetch("logout", { method: "POST" });
    } finally {
      window.location.replace("/admin/login");
    }
  }

  const nav = (
    <nav className="grid gap-1 text-sm">
      {LINKS.map(([id, label]) => {
        const active = pathname === "/admin" && section === id;
        const badge = id === "deposits" ? counts?.deposits : id === "withdrawals" ? counts?.withdrawals : 0;
        return (
          <Link
            key={id}
            to="/admin"
            search={{ section: id }}
            className={`flex items-center justify-between rounded-xl px-3 py-2 ${active ? "bg-[#2563eb] text-white" : "hover:bg-black/5"}`}
            onClick={() => setOpen(false)}
          >
            {label}
            {badge ? <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{badge}</span> : null}
          </Link>
        );
      })}
      <button type="button" className="mt-4 rounded-xl px-3 py-2 text-left font-semibold text-red-700 hover:bg-red-50" onClick={() => void signOut()}>
        Sign out
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#111827] md:grid md:grid-cols-[15rem_1fr]">
      <aside className="hidden border-r border-black/10 bg-white p-4 md:block">
        <p className="px-3 py-2 text-lg font-extrabold">Agora admin</p>
        {nav}
      </aside>
      <div>
        <header className="flex items-center gap-2 border-b border-black/10 bg-white px-3 py-2">
          <button type="button" className="rounded-xl border px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)}>Menu</button>
          <BackButton />
        </header>
        {open ? <div className="border-b bg-white p-3 md:hidden">{nav}</div> : null}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
