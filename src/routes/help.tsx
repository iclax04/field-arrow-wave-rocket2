import { createFileRoute, Link } from "@tanstack/react-router";

const ITEMS = [
  ["How do I create an account?", "Choose Create account, confirm that you are 18 or older, and use your email and a password of at least 8 characters. You can also continue with Google or X."],
  ["How do I add funds?", "After you sign in, open Deposit from your dashboard. Send ETH to the address shown for your account, then register the transfer. The balance updates after the required confirmations."],
  ["How do I buy a work?", "Open the artwork and choose Buy now, or place a bid on an auction. The price, artist royalty, and platform fee are shown before you confirm."],
  ["How do I sign out?", "Open the account menu or the dashboard sidebar and choose Sign out. Signing out ends the session on this device and in other open tabs."],
  ["Why do I see a US dollar amount?", "Each ETH price includes an estimated dollar value using a reference rate. It is not a live market quote."],
];

export const Route = createFileRoute("/help")({ component: HelpPage });

function HelpPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">Support</p>
      <h1 className="mt-2 text-4xl">Help Center</h1>
      <p className="mt-3 text-muted">Answers to common questions. If you still need help, contact us.</p>
      <dl className="mt-8 space-y-6">
        {ITEMS.map(([question, answer]) => (
          <div key={question}>
            <dt className="font-semibold">{question}</dt>
            <dd className="mt-1 text-sm leading-6 text-muted">{answer}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm">
        <Link to="/contact" className="text-accent">Contact support</Link>
      </p>
    </article>
  );
}
