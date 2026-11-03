import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { errMsg } from "@/lib/format";
import { confirmEmailCode, sendEmailCode } from "@/lib/verify.functions";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
    code: typeof search.code === "string" ? search.code.replace(/\D/g, "").slice(0, 6) : "",
  }),
  component: VerifyPage,
});

function afterSignIn() {
  const next = sessionStorage.getItem("agora-next");
  sessionStorage.removeItem("agora-next");
  if (next && next.startsWith("/art/")) return next;
  return "/dashboard";
}

function VerifyPage() {
  const { email, code: hinted } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [code, setCode] = useState(hinted);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(60);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setInterval(() => setWait((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [wait]);

  if (isPending) return <p className="px-4 py-16 text-muted">Checking your session…</p>;
  if (!user) return <RedirectToSignIn />;

  async function resend() {
    setBusy(true);
    setError(null);
    try {
      const result = await sendEmailCode();
      setWait(60);
      setDevCode(result.devCode);
      setNote(result.sent ? "A new code is on the way." : "Email delivery is not configured, so the code is shown below.");
    } catch (caught) {
      setError(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await confirmEmailCode({ data: { code } });
      await router.invalidate();
      window.location.replace(afterSignIn());
    } catch (caught) {
      setError(errMsg(caught));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full">
        <p className="kicker">Agora Gallery NFTs</p>
        <h1 className="mt-2 text-4xl">Verify your email</h1>
        <p className="mt-2 text-sm text-muted">
          Enter the 6-digit code sent to {email || "your email"}. It expires in 10 minutes.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <label className="block">
            <span className="label">Verification code</span>
            <input
              className="field text-center text-2xl tracking-[0.4em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </label>
          {hinted ? <p className="rounded-xl bg-raised p-3 text-sm">Your code is {hinted}. Email delivery is not configured yet, so it is shown here.</p> : null}
          {devCode ? <p className="rounded-xl bg-raised p-3 text-sm">Your code is {devCode}.</p> : null}
          {note ? <p className="text-sm text-muted">{note}</p> : null}
          {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
          <button className="btn w-full" type="submit" disabled={busy || code.length !== 6}>
            {busy ? "Checking…" : "Verify email"}
          </button>
        </form>
        <button type="button" className="mt-4 text-sm font-semibold text-accent disabled:opacity-50" disabled={busy || wait > 0} onClick={() => void resend()}>
          {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}
