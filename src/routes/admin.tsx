import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AdminFrame } from "@/components/admin/frame";
import { adminFetch } from "@/lib/admin-client";
import { errMsg, formatEth } from "@/lib/format";

const SECTIONS = ["overview", "users", "deposits", "withdrawals", "address", "artworks", "transactions", "settings", "admins", "audit"] as const;
type Section = (typeof SECTIONS)[number];

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>) => ({
    section: SECTIONS.includes(search.section as Section) ? (search.section as Section) : "overview",
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/admin") return <Outlet />;
  return <AdminHome />;
}

function AdminHome() {
  const { section } = Route.useSearch();
  const [counts, setCounts] = useState({ deposits: 0, withdrawals: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    adminFetch<{ admin: { mustChange: boolean } }>("session")
      .then((data) => {
        if (data.admin.mustChange) {
          window.location.replace("/admin/password");
          return;
        }
        setReady(true);
      })
      .catch(() => {
        window.location.replace("/admin/login");
      });
  }, []);

  useEffect(() => {
    if (!ready) return;
    adminFetch<{ pendingDeposits: number; pendingWithdrawals: number }>("overview")
      .then((data) => setCounts({ deposits: data.pendingDeposits, withdrawals: data.pendingWithdrawals }))
      .catch(() => undefined);
  }, [ready, section]);

  if (!ready) return <p className="p-8 text-sm text-[#6b7280]">Checking the admin session…</p>;

  return (
    <AdminFrame counts={counts}>
      {section === "overview" ? <Overview /> : null}
      {section === "users" ? <Users /> : null}
      {section === "deposits" ? <Deposits /> : null}
      {section === "withdrawals" ? <Withdrawals /> : null}
      {section === "address" ? <Address /> : null}
      {section === "artworks" ? <Artworks /> : null}
      {section === "transactions" ? <Transactions /> : null}
      {section === "settings" ? <Settings /> : null}
      {section === "admins" ? <Admins /> : null}
      {section === "audit" ? <Audit /> : null}
    </AdminFrame>
  );
}

function useLoad<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  function load() {
    adminFetch<T>(path).then(setData).catch((caught) => setError(errMsg(caught)));
  }
  useEffect(() => {
    load();
  }, [path]);
  return { data, error, load, setData };
}

function Overview() {
  const { data, error } = useLoad<{ users: number; balances: string; pendingDeposits: number; pendingWithdrawals: number; artworks: number; mintFees: string; activity: { id: number; action: string; detail: string; at: string }[] }>("overview");
  if (error) return <p className="text-red-700">{error}</p>;
  if (!data) return <p>Loading…</p>;
  const cards = [
    ["Users", String(data.users)],
    ["ETH balances", formatEth(data.balances)],
    ["Pending deposits", String(data.pendingDeposits)],
    ["Pending withdrawals", String(data.pendingWithdrawals)],
    ["Artworks", String(data.artworks)],
    ["Mint fee revenue", formatEth(data.mintFees)],
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-[#6b7280]">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-bold">Recent activity</h2>
      <ul className="mt-2 divide-y rounded-2xl bg-white">
        {data.activity.map((row) => (
          <li key={row.id} className="px-4 py-3 text-sm">{row.action} · {row.detail || row.at}</li>
        ))}
      </ul>
    </div>
  );
}

function Users() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pack, setPack] = useState<{ rows: { user_id: string; display_name: string; username: string; email: string; balance: string; status: string; joined: string }[]; total: number } | null>(null);
  function load(next = page) {
    const params = new URLSearchParams({ q, status, page: String(next) });
    adminFetch<typeof pack>(`users?${params}`).then(setPack).catch(() => undefined);
  }
  useEffect(() => {
    load(1);
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); setPage(1); load(1); }}>
        <input className="field max-w-xs" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search name, username, or email" />
        <select className="field max-w-[10rem]" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <button className="btn" type="submit">Search</button>
      </form>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-[#6b7280]"><th className="p-3">Name</th><th>Username</th><th>Email</th><th>Balance</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            {pack?.rows.map((row) => (
              <tr key={row.user_id} className="border-t">
                <td className="p-3"><Link to="/admin/users/$id" params={{ id: row.user_id }} search={{ section: "users" }} className="font-semibold text-[#2563eb]">{row.display_name}</Link></td>
                <td>@{row.username}</td>
                <td>{row.email}</td>
                <td>{formatEth(row.balance)}</td>
                <td className="capitalize">{row.status}</td>
                <td>{new Date(row.joined).toLocaleDateString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn-ghost" type="button" disabled={page <= 1} onClick={() => { const next = page - 1; setPage(next); load(next); }}>Previous</button>
        <button className="btn-ghost" type="button" disabled={!pack || page * 20 >= pack.total} onClick={() => { const next = page + 1; setPage(next); load(next); }}>Next</button>
      </div>
    </div>
  );
}

function Deposits() {
  const [status, setStatus] = useState("pending");
  const [rows, setRows] = useState<{ id: number; display_name: string; amount: string; tx_hash: string; status: string; at: string; user_id: string }[]>([]);
  const [manual, setManual] = useState({ userId: "", amount: "" });
  const [edit, setEdit] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  function load() {
    adminFetch<{ rows: typeof rows }>(`deposits?status=${status}`).then((data) => setRows(data.rows)).catch((caught) => setError(errMsg(caught)));
  }
  useEffect(() => { load(); }, [status]);
  async function act(id: number, action: "approve" | "reject") {
    const reason = action === "reject" ? window.prompt("Reason for rejection") || "" : "";
    if (action === "reject" && reason.length < 3) {
      setError("A rejection reason is required.");
      return;
    }
    setError("");
    try {
      await adminFetch(`deposits/${id}/${action}`, { method: "POST", body: JSON.stringify({ reason, amount: edit[id] || undefined }) });
      load();
    } catch (caught) {
      setError(errMsg(caught));
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Deposits</h1>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 flex gap-2">
        {["pending", "approved", "rejected", ""].map((item) => (
          <button key={item || "all"} type="button" className={status === item ? "btn" : "btn-ghost"} onClick={() => setStatus(item)}>{item || "All"}</button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-[#6b7280]"><th className="p-3">User</th><th>Amount</th><th>Tx hash</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td className="p-3 text-[#6b7280]" colSpan={6}>No deposits in this view.</td></tr> : null}
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.display_name}</td>
                <td>
                  <input className="field w-28" defaultValue={row.amount} onChange={(event) => setEdit({ ...edit, [row.id]: event.target.value })} />
                </td>
                <td className="max-w-[10rem] truncate font-mono text-xs">{row.tx_hash}</td>
                <td className="capitalize">{row.status}</td>
                <td>{new Date(row.at).toLocaleDateString("en-US")}</td>
                <td className="space-x-2 p-3">
                  {row.status === "pending" || row.status === "confirming" ? (
                    <>
                      <button type="button" className="btn px-3" onClick={() => void act(row.id, "approve")}>Approve</button>
                      <button type="button" className="btn-ghost" onClick={() => void act(row.id, "reject")}>Reject</button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="mt-6 grid max-w-md gap-2 rounded-2xl bg-white p-4" onSubmit={(event) => {
        event.preventDefault();
        setError("");
        adminFetch("deposits", { method: "POST", body: JSON.stringify(manual) }).then(() => { setManual({ userId: "", amount: "" }); load(); }).catch((caught) => setError(errMsg(caught)));
      }}>
        <h2 className="font-bold">Add a deposit</h2>
        <input className="field" placeholder="Email, username, or user id" value={manual.userId} onChange={(event) => setManual({ ...manual, userId: event.target.value })} />
        <input className="field" placeholder="Amount in ETH" value={manual.amount} onChange={(event) => setManual({ ...manual, amount: event.target.value })} />
        <button className="btn" type="submit">Add deposit</button>
      </form>
    </div>
  );
}

function Withdrawals() {
  const [rows, setRows] = useState<{ id: number; display_name: string; amount: string; destination: string; status: string; at: string; warning: boolean; warningNote?: string }[]>([]);
  const [error, setError] = useState("");
  function load() {
    adminFetch<{ rows: typeof rows }>("withdrawals").then((data) => setRows(data.rows)).catch((caught) => setError(errMsg(caught)));
  }
  useEffect(() => { load(); }, []);
  async function act(id: number, action: "approve" | "reject" | "complete") {
    const reason = action === "reject" ? window.prompt("Reason") || "" : "";
    const txHash = action === "complete" ? window.prompt("Transaction hash") || "" : "";
    if (action === "reject" && reason.length < 3) {
      setError("A rejection reason is required.");
      return;
    }
    setError("");
    try {
      await adminFetch(`withdrawals/${id}/${action}`, { method: "POST", body: JSON.stringify({ reason, txHash }) });
      load();
    } catch (caught) {
      setError(errMsg(caught));
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Withdrawals</h1>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-[#6b7280]"><th className="p-3">User</th><th>Amount</th><th>Destination</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.display_name}{row.warning ? <span className="ml-2 text-xs font-bold text-red-600">{row.warningNote || "Review"}</span> : null}</td>
                <td>{formatEth(row.amount)}</td>
                <td className="max-w-[12rem] truncate font-mono text-xs">{row.destination}</td>
                <td className="capitalize">{row.status}</td>
                <td>{new Date(row.at).toLocaleDateString("en-US")}</td>
                <td className="space-x-2 p-3">
                  {row.status === "pending" ? <button type="button" className="btn px-3" onClick={() => void act(row.id, "approve")}>Approve</button> : null}
                  {row.status === "pending" || row.status === "approved" ? <button type="button" className="btn-ghost" onClick={() => void act(row.id, "reject")}>Reject</button> : null}
                  {row.status === "approved" ? <button type="button" className="btn px-3" onClick={() => void act(row.id, "complete")}>Complete</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Address() {
  const [address, setAddress] = useState("");
  const [qr, setQr] = useState("");
  const [history, setHistory] = useState<{ id: number; address: string; at: string }[]>([]);
  const [error, setError] = useState("");
  function load() {
    adminFetch<{ address: string; qr: string; history: typeof history }>("deposit-address").then((data) => {
      setAddress(data.address);
      setQr(data.qr);
      setHistory(data.history);
    }).catch((caught) => setError(errMsg(caught)));
  }
  useEffect(() => { load(); }, []);
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Deposit Ethereum address</h1>
      <p className="mt-2 text-sm text-[#6b7280]">Users see this address on their Deposit page unless a user has a custom override.</p>
      <form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); adminFetch("deposit-address", { method: "PUT", body: JSON.stringify({ address }) }).then(load).catch((caught) => setError(errMsg(caught))); }}>
        <input className="field font-mono" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x…" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="btn w-fit" type="submit">Save address</button>
      </form>
      {qr ? <div className="mt-4 w-40 rounded-2xl bg-white p-3" dangerouslySetInnerHTML={{ __html: qr }} /> : null}
      <h2 className="mt-6 font-bold">Change history</h2>
      <ul className="mt-2 text-sm">{history.map((row) => <li key={row.id} className="py-1 font-mono">{row.address}</li>)}</ul>
    </div>
  );
}

function Artworks() {
  const { data, load } = useLoad<{ rows: { id: number; title: string; artist: string; hidden: boolean; removed: boolean }[] }>("artworks");
  async function act(id: number, action: string) {
    await adminFetch("artworks", { method: "POST", body: JSON.stringify({ id, action }) });
    load();
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Artworks</h1>
      <ul className="mt-4 divide-y rounded-2xl bg-white">
        {data?.rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
            <span>{row.title} · {row.artist}{row.hidden ? " · hidden" : ""}{row.removed ? " · removed" : ""}</span>
            <span className="space-x-2">
              <button type="button" className="btn-ghost" onClick={() => void act(row.id, row.hidden ? "unhide" : "hide")}>{row.hidden ? "Unhide" : "Hide"}</button>
              <button type="button" className="btn-ghost" onClick={() => void act(row.id, "remove")}>Remove</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Transactions() {
  const [kind, setKind] = useState("");
  const { data } = useLoad<{ rows: { id: number; kind: string; price: string; buyer: string | null; seller: string | null; at: string }[] }>(`transactions?kind=${kind}`);
  return (
    <div>
      <h1 className="text-2xl font-bold">Transactions</h1>
      <div className="mt-4 flex gap-2">
        <select className="field max-w-xs" value={kind} onChange={(event) => setKind(event.target.value)}>
          {["", "deposit", "withdrawal", "mint_fee", "purchase", "sale", "royalty", "adjustment"].map((item) => <option key={item} value={item}>{item || "All"}</option>)}
        </select>
        <a className="btn" href={`/api/admin/transactions/export?kind=${kind}`}>Export CSV</a>
      </div>
      <ul className="mt-4 divide-y rounded-2xl bg-white text-sm">
        {data?.rows.map((row) => <li key={row.id} className="px-4 py-3">{row.kind} · {formatEth(row.price)} · {row.buyer || row.seller || ""}</li>)}
      </ul>
    </div>
  );
}

function Settings() {
  const [form, setForm] = useState({ mintFee: "0.2", minWithdrawal: "0.05", platformFeePct: "2.5", autoApproveUnder: "0", autoApproveEnabled: false, supportEmail: "", announcement: "", withdrawalWarnEth: "5" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    adminFetch<{ settings: { mint_fee: string; min_withdrawal: string; platform_fee_bps: number; auto_approve_under: string; auto_approve_enabled: boolean; support_email: string; announcement: string; withdrawal_warn_eth: string } }>("settings").then((data) => {
      const row = data.settings;
      setForm({
        mintFee: row.mint_fee,
        minWithdrawal: row.min_withdrawal,
        platformFeePct: String(row.platform_fee_bps / 100),
        autoApproveUnder: row.auto_approve_under,
        autoApproveEnabled: row.auto_approve_enabled,
        supportEmail: row.support_email,
        announcement: row.announcement,
        withdrawalWarnEth: row.withdrawal_warn_eth,
      });
    }).catch((caught) => setError(errMsg(caught)));
  }, []);
  function save(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    setError("");
    adminFetch("settings", { method: "PUT", body: JSON.stringify(form) }).then(() => setSaved(true)).catch((caught) => setError(errMsg(caught)));
  }
  return (
    <form className="grid max-w-lg gap-3" onSubmit={save}>
      <h1 className="text-2xl font-bold">Settings</h1>
      <label className="label">Minting fee (ETH)<input className="field" value={form.mintFee} onChange={(event) => setForm({ ...form, mintFee: event.target.value })} /></label>
      <label className="label">Minimum withdrawal<input className="field" value={form.minWithdrawal} onChange={(event) => setForm({ ...form, minWithdrawal: event.target.value })} /></label>
      <label className="label">Platform fee %<input className="field" value={form.platformFeePct} onChange={(event) => setForm({ ...form, platformFeePct: event.target.value })} /></label>
      <label className="label">Auto-approve under (ETH)<input className="field" value={form.autoApproveUnder} onChange={(event) => setForm({ ...form, autoApproveUnder: event.target.value })} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.autoApproveEnabled} onChange={(event) => setForm({ ...form, autoApproveEnabled: event.target.checked })} /> Auto-approve enabled</label>
      <label className="label">Withdrawal warning above (ETH)<input className="field" value={form.withdrawalWarnEth} onChange={(event) => setForm({ ...form, withdrawalWarnEth: event.target.value })} /></label>
      <label className="label">Support email<input className="field" value={form.supportEmail} onChange={(event) => setForm({ ...form, supportEmail: event.target.value })} /></label>
      <label className="label">Announcement<input className="field" value={form.announcement} onChange={(event) => setForm({ ...form, announcement: event.target.value })} /></label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {saved ? <p className="text-sm text-[#2563eb]">Settings saved.</p> : null}
      <button className="btn w-fit" type="submit">Save settings</button>
    </form>
  );
}

function Admins() {
  const { data, error, load } = useLoad<{ rows: { id: string; email: string; name: string; role: string }[] }>("admins");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "support" });
  const [note, setNote] = useState("");
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin accounts</h1>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      {note ? <p className="mt-2 text-sm text-red-700">{note}</p> : null}
      <ul className="mt-4 divide-y rounded-2xl bg-white text-sm">
        {data?.rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between px-4 py-3">
            <span>{row.name} · {row.email} · {row.role === "super" ? "Super admin" : "Support"}</span>
            <button type="button" className="btn-ghost" onClick={() => void adminFetch(`admins/${encodeURIComponent(row.id)}`, { method: "DELETE" }).then(() => { setNote(""); load(); }).catch((caught) => setNote(errMsg(caught)))}>Remove</button>
          </li>
        ))}
      </ul>
      <form className="mt-6 grid max-w-md gap-2" onSubmit={(event) => { event.preventDefault(); void adminFetch("admins", { method: "POST", body: JSON.stringify(form) }).then(() => { setNote(""); setForm({ name: "", email: "", password: "", role: "support" }); load(); }).catch((caught) => setNote(errMsg(caught))); }}>
        <input className="field" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="field" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="field" placeholder="Temporary password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <select className="field" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="support">Support</option>
          <option value="super">Super admin</option>
        </select>
        <button className="btn w-fit" type="submit">Add admin</button>
      </form>
    </div>
  );
}

function Audit() {
  const { data } = useLoad<{ rows: { id: number; actor_id: string; action: string; detail: string | null; ip: string; old_value: string | null; new_value: string | null; at: string }[] }>("audit-log");
  return (
    <div>
      <h1 className="text-2xl font-bold">Audit log</h1>
      <p className="mt-1 text-sm text-[#6b7280]">This record cannot be edited or deleted.</p>
      <ul className="mt-4 divide-y rounded-2xl bg-white text-sm">
        {data?.rows.map((row) => (
          <li key={row.id} className="px-4 py-3">
            <p className="font-semibold">{row.action}</p>
            <p className="text-[#6b7280]">{row.actor_id} · {row.ip || "no IP"} · {new Date(row.at).toLocaleString("en-US")}</p>
            <p>{row.detail}{row.old_value ? ` · ${row.old_value} → ${row.new_value}` : ""}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
