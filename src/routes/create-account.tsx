import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { errMsg } from "@/lib/format";
import { updateMe } from "@/lib/market.functions";
import { sendEmailCode } from "@/lib/verify.functions";

export const Route = createFileRoute("/create-account")({
  component: CreateAccountPage,
});

function CreateAccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adult, setAdult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const handle = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(handle)) {
      setError("Username must be 3–24 letters, numbers, or underscores.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!adult) {
      setError("You must confirm that you are 18 or older.");
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
        callbackURL: "/dashboard",
      });
      if (result.error) throw new Error(result.error.message || "Could not create the account.");
      await updateMe({
        data: {
          displayName: name.trim(),
          username: handle,
          bio: "",
          city: "",
          phone: "",
          region: "",
          postalCode: "",
          siteUrl: "",
          xHandle: "",
          avatar: "",
          clearAvatar: false,
          wallet: "",
        },
      });
      await sendEmailCode();
      window.location.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (caught) {
      setError(errMsg(caught));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full">
        <p className="kicker">Agora Gallery NFTs</p>
        <h1 className="mt-2 text-4xl">Create an account</h1>
        <p className="mt-2 text-sm text-muted">Open a studio, mint work, and collect from the marketplace.</p>
        {isPending ? <p className="mt-6 text-muted">Checking your session…</p> : null}
        {!isPending && user ? (
          <p className="mt-6 text-sm text-muted">
            You are already signed in. <Link to="/dashboard" className="font-semibold text-accent">Go to your dashboard.</Link>
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
                    onClick={() => signIn(provider.providerId, { callbackURL: "/dashboard" })}
                  >
                    Continue with {provider.label}
                  </button>
                ))
              : null}
            <form onSubmit={onSubmit} className="space-y-3 pt-2">
              <label className="block">
                <span className="label">Full name</span>
                <input className="field" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
              </label>
              <label className="block">
                <span className="label">Username</span>
                <input className="field" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
              </label>
              <label className="block">
                <span className="label">Email</span>
                <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </label>
              <label className="block">
                <span className="label">Password</span>
                <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
              </label>
              <label className="block">
                <span className="label">Confirm password</span>
                <input className="field" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" minLength={8} required />
              </label>
              <div className="space-y-3 rounded-2xl bg-raised p-4 text-sm text-muted">
                <p>Digital assets can lose value. You can lose the entire amount you deposit. This marketplace does not provide investment advice.</p>
                <p>Identity verification may be required before a withdrawal is approved.</p>
                <label className="flex items-start gap-2 text-fg">
                  <input type="checkbox" className="mt-1" checked={adult} onChange={(event) => setAdult(event.target.checked)} required />
                  <span>
                    I confirm that I am 18 or older and that I agree to the{" "}
                    <Link to="/legal/$page" params={{ page: "terms" }} className="text-accent">Terms of Service</Link>.
                  </span>
                </label>
              </div>
              {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
              <button className="btn w-full" type="submit" disabled={busy}>
                {busy ? "Creating account…" : "Create account"}
              </button>
            </form>
            <p className="text-sm text-muted">
              Already have an account? <Link to="/login" search={{ mode: "in" }} className="font-semibold text-accent">Sign in</Link>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
