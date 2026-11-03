import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { errMsg } from "@/lib/format";
import { sendEmailCode, verificationStatus } from "@/lib/verify.functions";

function afterSignIn() {
  const next = sessionStorage.getItem("agora-next");
  sessionStorage.removeItem("agora-next");
  if (next && next.startsWith("/art/")) return next;
  return "/dashboard";
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "up" ? ("up" as const) : ("in" as const),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { mode: requested } = Route.useSearch();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">(requested);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adult, setAdult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (requested === "up") {
      void navigate({ to: "/create-account", replace: true });
    }
  }, [requested, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        if (!adult) throw new Error("You must confirm that you are 18 or older.");
        const result = await authClient.signUp.email({
          email,
          password,
          name: name || "Collector",
          callbackURL: "/",
        });
        if (result.error) throw new Error(result.error.message || "Could not create the account.");
      } else {
        const result = await authClient.signIn.email({ email, password, callbackURL: "/" });
        if (result.error) throw new Error(result.error.message || "Could not sign in.");
      }
      const status = await verificationStatus();
      if (!status.verified) {
        let devCode = "";
        try {
          const sent = await sendEmailCode();
          devCode = sent.devCode ?? "";
        } catch {
          /* A code was just sent, or the 60-second cooldown is still running. */
        }
        const codeQuery = devCode ? `&code=${encodeURIComponent(devCode)}` : "";
        window.location.replace(`/verify-email?email=${encodeURIComponent(status.email)}${codeQuery}`);
        return;
      }
      await router.invalidate();
      window.location.replace(afterSignIn());
    } catch (caught) {
      setError(errMsg(caught));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <div className="w-full">
        <p className="kicker">Account</p>
        <h1 className="mt-2 font-serif text-4xl">{mode === "up" ? "Create an account" : "Sign in"}</h1>
        {isPending ? <p className="mt-6 text-muted">Checking your session…</p> : null}
        {!isPending && user ? (
          <p className="mt-6 text-muted">
            You are signed in. <Link to="/dashboard" className="text-accent">Go to your dashboard.</Link>
          </p>
        ) : null}
        {!isPending && !user ? (
          <div className="mt-8 space-y-3">
            {authEnabled
              ? GROK_PROVIDERS.map((provider) => (
                  <button
                    key={provider.providerId}
                    type="button"
                    className="btn-ghost w-full"
                    onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
                  >
                    Continue with {provider.label}
                  </button>
                ))
              : null}
            <form onSubmit={onSubmit} className="space-y-3 pt-4">
              {mode === "up" ? (
                <label className="block">
                  <span className="label">Name</span>
                  <input className="field" value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
              ) : null}
              <label className="block">
                <span className="label">Email</span>
                <input className="field" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="block">
                <span className="label">Password</span>
                <input className="field" type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
              </label>
              {mode === "up" ? (
                <div className="space-y-3 rounded-2xl bg-raised p-4 text-sm text-muted">
                  <p>Digital assets can lose value. You can lose the entire amount you deposit. This marketplace does not provide investment advice.</p>
                  <p>Identity verification (KYC) may be required before a withdrawal is approved.</p>
                  <label className="flex items-start gap-2 text-fg">
                    <input type="checkbox" className="mt-1" checked={adult} onChange={(event) => setAdult(event.target.checked)} required />
                    <span>I confirm that I am 18 or older and that I agree to the Terms of Service.</span>
                  </label>
                </div>
              ) : null}
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <button className="btn w-full" type="submit" disabled={busy}>
                {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"}
              </button>
            </form>
            <button type="button" className="text-sm text-muted underline" onClick={() => setMode(mode === "up" ? "in" : "up")}>
              {mode === "up" ? "I already have an account" : "Create an email account"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
