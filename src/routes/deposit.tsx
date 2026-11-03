import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMarket } from "@/components/market/provider";
import { RequireVerified } from "@/components/market/require-verified";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { errMsg, ethUsdRate, formatEth, formatUsd, formatWhen } from "@/lib/format";
import { getDeposits, registerDeposit } from "@/lib/market.functions";

export const Route = createFileRoute("/deposit")({ component: DepositPage });

function DepositPage() {
  const { user, isPending } = useCurrentUserState();
  const { me, refresh } = useMarket();
  const [pack, setPack] = useState<Awaited<ReturnType<typeof getDeposits>> | null>(null);
  const [amount, setAmount] = useState("1");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  function load() {
    return getDeposits()
      .then((value) => {
        setPack(value);
        if (value.items.some((item) => item.status === "pending" || item.status === "confirming")) refresh();
      })
      .catch((caught) => toast.error(errMsg(caught)));
  }

  useEffect(() => {
    if (!user) return;
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 2000);
    return () => window.clearInterval(timer);
  }, [user?.id]);

  if (isPending) return <p className="px-4 py-16 text-muted">Checking your session…</p>;
  if (!user) return <RedirectToSignIn />;
  if (me?.emailVerified === false) return <RequireVerified />;

  async function send(next: string) {
    setBusy(true);
    try {
      await registerDeposit({ data: Number(next) });
      toast.success("Deposit submitted. Confirmations are counting.");
      await load();
    } catch (caught) {
      toast.error(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  const usd = Number(amount);
  const usdLabel = Number.isFinite(usd) ? formatUsd(usd * ethUsdRate()) : "—";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold">Deposit</h1>
      <p className="mt-2 text-sm text-muted">Send ETH only. This address belongs to your account.</p>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void send(amount);
        }}
      >
        <label className="block">
          <span className="label">Amount to transfer</span>
          <input className="field" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <p className="mt-2 text-sm text-muted">≈ {usdLabel}</p>
        {pack ? (
          <div className="mt-6 flex items-start gap-4">
            <div className="rounded-2xl bg-paper p-3" dangerouslySetInnerHTML={{ __html: pack.qr }} />
            <div className="min-w-0">
              <p className="break-all font-mono text-sm">{pack.address}</p>
              <button
                type="button"
                className="btn-ghost mt-3"
                onClick={() => {
                  void navigator.clipboard.writeText(pack.address).then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  });
                }}
              >
                {copied ? "Copied" : "Copy address"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-raised" />
        )}
        <button className="btn mt-6" disabled={busy} type="submit">{busy ? "Sending…" : "Deposit"}</button>
      </form>
      <h2 className="mt-10 text-xl font-bold">Deposit history</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted">
              <th className="py-2 font-medium">When</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {pack?.items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="py-3 pr-3">{formatWhen(item.created_at)}</td>
                <td className="py-3 pr-3 tabular-nums">{formatEth(item.amount)}</td>
                <td className="py-3 capitalize">{item.status} · {item.confirmations}/{pack.required}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {pack && pack.items.length === 0 ? <p className="mt-3 text-sm text-muted">No deposits yet.</p> : null}
      </div>
    </div>
  );
}
