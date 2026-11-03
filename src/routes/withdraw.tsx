import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useMarket } from "@/components/market/provider";
import { RequireVerified } from "@/components/market/require-verified";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { available, errMsg, formatEth, formatWhen, shortAddr } from "@/lib/format";
import { getWithdrawals, requestWithdrawal } from "@/lib/market.functions";

export const Route = createFileRoute("/withdraw")({ component: WithdrawPage });

function WithdrawPage() {
  const { user, isPending } = useCurrentUserState();
  const { me, refresh } = useMarket();
  const [pack, setPack] = useState<Awaited<ReturnType<typeof getWithdrawals>> | null>(null);
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    getWithdrawals().then(setPack).catch((caught) => toast.error(errMsg(caught)));
  }

  useEffect(() => {
    if (user) load();
  }, [user?.id]);

  if (isPending) return <p className="px-4 py-16 text-muted">Checking your session…</p>;
  if (!user) return <RedirectToSignIn />;
  if (me?.emailVerified === false) return <RequireVerified />;

  const avail = pack ? available(pack.balance, pack.locked) : me ? available(me.profile.balance, me.profile.locked_balance) : 0;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await requestWithdrawal({ data: { amount: Number(amount), destination, confirmEmail } });
      toast.success(result.status === "completed" ? "Withdrawal sent" : "Withdrawal is waiting on the desk");
      setAmount("");
      refresh();
      load();
    } catch (caught) {
      toast.error(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 md:grid-cols-2">
      <section>
        <p className="kicker">Withdraw</p>
        <h1 className="mt-2 font-serif text-4xl">Send ETH out</h1>
        <p className="mt-3 text-muted">
          Available {formatEth(avail)}. Minimum {formatEth(pack?.min ?? "0.05")} plus a network fee of {formatEth(pack?.networkFee ?? "0.002")}.
          Funds lock when you request, so they cannot be spent twice. Confirm with the email on this account.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="block">
            <span className="label">Amount</span>
            <input className="field" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </label>
          <label className="block">
            <span className="label">Destination address</span>
            <input className="field" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="0x" required />
          </label>
          <label className="block">
            <span className="label">Confirm email</span>
            <input className="field" type="email" value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} required />
          </label>
          <button className="btn" type="submit" disabled={busy}>{busy ? "Locking…" : "Request withdrawal"}</button>
        </form>
      </section>
      <section>
        <h2 className="font-serif text-2xl">History</h2>
        <ul className="mt-4 divide-y divide-line">
          {pack?.items.map((item) => (
            <li key={item.id} className="py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="tabular-nums">{formatEth(item.amount)}</span>
                <span className="capitalize">{item.status}</span>
              </div>
              <p className="text-muted">{shortAddr(item.destination)} · {formatWhen(item.created_at)}</p>
              {item.reason ? <p className="text-danger">{item.reason}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
