import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { errMsg, formatWhen } from "@/lib/format";
import { getActivity, type Activity } from "@/lib/market.functions";

export const Route = createFileRoute("/activity")({ component: ActivityPage });

function ActivityPage() {
  const [items, setItems] = useState<Activity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getActivity()
      .then((value) => setItems(value.items))
      .catch((caught) => setError(errMsg(caught)));
  }, []);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="kicker">Ledger</p>
      <h1 className="mt-2 font-serif text-4xl">What changed hands</h1>
      {error ? <p className="mt-6 text-danger">{error}</p> : null}
      <ul className="mt-8 divide-y divide-line">
        {items?.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            {item.image ? <img src={item.image} alt="" className="h-16 w-12 rounded-lg object-cover" /> : <span className="h-16 w-12 rounded-lg bg-raised" />}
            <div>
              <a href={item.href} className="underline">{item.text}</a>
              <p className="text-sm text-muted">{formatWhen(item.at)}</p>
            </div>
          </li>
        ))}
      </ul>
      {items && items.length === 0 ? <p className="text-muted">Quiet for now.</p> : null}
    </div>
  );
}
