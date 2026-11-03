import { createFileRoute, Link, notFound } from "@tanstack/react-router";

const PAGES: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: "Terms of Service",
    body: [
      "These terms govern your use of Agora Gallery NFTs. By creating an account, you agree to them.",
      "You must be at least 18 years old and able to form a binding contract under US law. You are responsible for the accuracy of your account information.",
      "Artworks listed on the marketplace are offered by their owners. A completed purchase transfers the listed work in our records and pays the seller, the artist royalty, and the platform fee.",
      "Digital assets are volatile. Agora Gallery NFTs does not provide investment, legal, or tax advice. You can lose the entire amount you deposit.",
      "We may suspend an account that violates these terms, including fraud, infringement, or misuse of the withdrawal process.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect the information you give us: name, email, password (stored as a hash), profile details, and messages you send to support.",
      "We also store marketplace activity, including listings, purchases, deposits, withdrawals, and sign-in records, so we can operate your account and investigate disputes.",
      "We do not sell personal information. We share it only with service providers who process it for us, or when the law requires it.",
      "You may request a correction or deletion of your account by contacting support@agoragallery.com. Some records are kept where we have a legal duty to retain them.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    body: [
      "We use a necessary session cookie to keep you signed in. It is httpOnly, Secure, and SameSite, and it is cleared when you sign out.",
      "Your theme, time zone, and cookie choice are stored in local storage on this device. They are not used for advertising.",
      "Blocking the session cookie will sign you out. You can withdraw the cookie choice by clearing site data in your browser.",
    ],
  },
  fees: {
    title: "Fees and Royalties",
    body: [
      "Minting a work charges the mint fee shown on the mint page. The default is 0.20 ETH. The fee is paid from your account balance to the platform.",
      "A primary or secondary sale pays the artist the royalty percentage set when the work was minted. The platform fee is taken from the sale price. The seller receives the remainder.",
      "Withdrawals may include a network fee. The minimum withdrawal is set by the marketplace and shown before you confirm.",
      "US dollar amounts next to ETH prices use a published reference rate. They are estimates, not a quote or an offer to exchange at that price.",
    ],
  },
};

export const Route = createFileRoute("/legal/$page")({
  component: LegalPage,
  loader: ({ params }) => {
    if (!PAGES[params.page]) throw notFound();
    return PAGES[params.page];
  },
});

function LegalPage() {
  const page = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">Agora Gallery NFTs</p>
      <h1 className="mt-2 text-4xl">{page.title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
        {page.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link to="/contact" className="text-accent">Contact support</Link>
      </p>
    </article>
  );
}
