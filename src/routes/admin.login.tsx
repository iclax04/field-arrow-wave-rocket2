import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BackButton } from "@/components/market/back-button";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const nextEmail = String(form.get("email") || email);
    const nextPassword = String(form.get("password") || password);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: nextEmail, password: nextPassword }),
      });
      const data = (await response.json()) as { error?: string; mustChange?: boolean };
      if (!response.ok || data.error) throw new Error(data.error || "Could not sign in.");
      window.location.replace(data.mustChange ? "/admin/password" : "/admin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-md place-items-center bg-[#f4f6f8] px-4">
      <div className="w-full rounded-3xl bg-white p-8 shadow-sm">
        <BackButton />
        <p className="mt-4 text-sm font-semibold text-[#2563eb]">Agora Gallery NFTs</p>
        <h1 className="mt-1 text-3xl font-bold">Admin sign in</h1>
        <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
          <label className="label">Email<input className="field" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="label">Password<input className="field" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button className="btn" disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
