import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BackButton } from "@/components/market/back-button";
import { adminFetch } from "@/lib/admin-client";

export const Route = createFileRoute("/admin/password")({ component: PasswordPage });

function PasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await adminFetch("password", { method: "POST", body: JSON.stringify({ password }) });
      window.location.replace("/admin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the password.");
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-md place-items-center bg-[#f4f6f8] px-4">
      <form className="w-full rounded-3xl bg-white p-8 shadow-sm" onSubmit={onSubmit}>
        <BackButton />
        <h1 className="mt-4 text-3xl font-bold">Choose a new password</h1>
        <p className="mt-2 text-sm text-[#6b7280]">This admin password must be changed before the desk opens.</p>
        <label className="label mt-6">New password<input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
        <label className="label mt-3">Confirm<input className="field" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></label>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button className="btn mt-4" type="submit">Save password</button>
      </form>
    </div>
  );
}
