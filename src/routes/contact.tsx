import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { errMsg } from "@/lib/format";
import { submitContact } from "@/lib/market.functions";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      await submitContact({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          topic: String(form.get("topic") ?? ""),
          message: String(form.get("message") ?? ""),
        },
      });
      setSent(true);
    } catch (caught) {
      toast.error(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="mx-auto max-w-xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">Support</p>
      <h1 className="mt-2 text-4xl">Contact Us</h1>
      <p className="mt-3 text-sm text-muted">Send a message to support@agoragallery.com. We reply by email.</p>
      {sent ? (
        <p className="mt-8 rounded-2xl bg-raised p-4 text-sm">We received your message and will reply to the email address you provided.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-3">
          <label><span className="label">Name</span><input className="field" name="name" required autoComplete="name" /></label>
          <label><span className="label">Email</span><input className="field" name="email" type="email" required autoComplete="email" /></label>
          <label>
            <span className="label">Topic</span>
            <select className="field" name="topic" defaultValue="Account">
              <option>Account</option>
              <option>Buying</option>
              <option>Selling</option>
              <option>Deposits</option>
              <option>Other</option>
            </select>
          </label>
          <label><span className="label">Message</span><textarea className="field min-h-32 py-3" name="message" required minLength={10} /></label>
          <button className="btn w-fit" disabled={busy} type="submit">{busy ? "Sending…" : "Send message"}</button>
        </form>
      )}
    </article>
  );
}
