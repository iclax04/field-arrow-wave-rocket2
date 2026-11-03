import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AdminFrame } from "@/components/admin/frame";
import { adminFetch } from "@/lib/admin-client";
import { formatEth } from "@/lib/format";

export const Route = createFileRoute("/admin/users/$id")({ component: UserPage });

type UserRow = {
  user_id: string;
  display_name: string;
  username: string;
  email: string;
  verified: boolean;
  phone: string;
  bio: string;
  avatar_url: string | null;
  wallet_address: string;
  deposit_address: string | null;
  use_platform_deposit: boolean;
  role: string;
  status: string;
  balance: string;
};

const TABS = ["deposits", "withdrawals", "artworks", "transactions", "activity"] as const;

function describe(row: Record<string, unknown>) {
  const at = row.at ? new Date(String(row.at)).toLocaleString("en-US") : "";
  if ("title" in row) return `${row.title}${row.hidden ? " · hidden" : ""}${row.removed ? " · removed" : ""} · ${at}`;
  if ("amount" in row) return `${row.amount} ETH · ${row.status || ""} · ${row.destination || row.tx_hash || ""} · ${at}`;
  if ("price" in row) return `${row.kind} · ${row.price} ETH · ${row.note || ""} · ${at}`;
  return `${row.kind || "Activity"} · ${row.detail || ""} · ${at}`;
}

function UserPage() {
  const { id } = Route.useParams();
  const [user, setUser] = useState<UserRow | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("set");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("deposits");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [notice, setNotice] = useState("");

  function load() {
    adminFetch<{ user: UserRow }>(`users/${encodeURIComponent(id)}`).then((data) => setUser(data.user)).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load the user."));
  }
  useEffect(() => { load(); }, [id]);
  useEffect(() => {
    adminFetch<{ rows: Record<string, unknown>[] }>(`users/${encodeURIComponent(id)}/${tab}`).then((data) => setRows(data.rows)).catch(() => setRows([]));
  }, [id, tab]);

  if (!user) return <p className="p-8">{error || "Loading…"}</p>;

  async function save(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    try {
      await adminFetch(`users/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({
          displayName: user?.display_name,
          username: user?.username,
          email: user?.email,
          phone: user?.phone,
          bio: user?.bio,
          avatarUrl: user?.avatar_url || "",
          wallet: user?.wallet_address,
          role: user?.role,
          status: user?.status,
          usePlatformDeposit: user?.use_platform_deposit,
          depositAddress: user?.deposit_address || "",
        }),
      });
      setNotice("User saved.");
      load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save.");
    }
  }

  async function action(path: string, body?: object) {
    if ((path === "delete" || path === "ban") && !window.confirm(`Confirm ${path} for this user?`)) return;
    setNotice("");
    setError("");
    try {
      const data = await adminFetch<{ ok?: boolean; balance?: string }>(`users/${encodeURIComponent(id)}/${path}`, { method: "POST", body: JSON.stringify(body || {}) });
      if (path === "balance" && data.balance) {
        setUser((current) => (current ? { ...current, balance: data.balance as string } : current));
        setNotice(`Balance updated to ${formatEth(data.balance)}.`);
      } else {
        setNotice("Done.");
      }
      load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That action failed.");
    }
  }

  return (
    <AdminFrame>
      <h1 className="text-2xl font-bold">{user.display_name}</h1>
      <form className="mt-4 grid max-w-xl gap-3" onSubmit={save}>
        {(["display_name", "username", "email", "phone", "bio", "avatar_url", "wallet_address"] as const).map((key) => (
          <label key={key} className="label capitalize">{key.replaceAll("_", " ")}
            <input className="field" value={String(user[key] ?? "")} onChange={(event) => setUser({ ...user, [key]: event.target.value })} />
          </label>
        ))}
        <label className="label">Role
          <select className="field" value={user.role} onChange={(event) => setUser({ ...user, role: event.target.value })}>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="catalog">catalog</option>
          </select>
        </label>
        <label className="label">Status
          <select className="field" value={user.status} onChange={(event) => setUser({ ...user, status: event.target.value })}>
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="banned">banned</option>
          </select>
        </label>
        <p className="text-sm">Email verified: {user.verified ? "Yes" : "No"} · Balance {formatEth(user.balance)}</p>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {notice ? <p className="text-sm text-[#2563eb]">{notice}</p> : null}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!user.use_platform_deposit} onChange={(event) => setUser({ ...user, use_platform_deposit: !event.target.checked })} />
          Custom deposit address
        </label>
        {!user.use_platform_deposit ? <input className="field font-mono" value={user.deposit_address || ""} onChange={(event) => setUser({ ...user, deposit_address: event.target.value })} /> : null}
        <button className="btn w-fit" type="submit">Save user</button>
      </form>
      <div className="mt-6 grid max-w-xl gap-2 rounded-2xl bg-white p-4">
        <h2 className="font-bold">Balance · {formatEth(user.balance)}</h2>
        <select className="field" value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="set">Set</option>
          <option value="add">Add</option>
          <option value="sub">Subtract</option>
        </select>
        <input className="field" placeholder="ETH amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <input className="field" placeholder="Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
        <button type="button" className="btn w-fit" onClick={() => void action("balance", { mode, amount: Number(amount), reason })}>Update balance</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <input className="field max-w-xs" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button type="button" className="btn-ghost" onClick={() => void action("reset-password", { password })}>Reset password</button>
        <button type="button" className="btn-ghost" onClick={() => void action("verify")}>Force verify email</button>
        <button type="button" className="btn-ghost" onClick={() => void action("suspend")}>Suspend</button>
        <button type="button" className="btn-ghost" onClick={() => void action("ban")}>Ban</button>
        <button type="button" className="btn-ghost" onClick={() => void action("delete")}>Delete</button>
        <button type="button" className="btn-ghost" onClick={() => void action("sign-out")}>Sign out user</button>
      </div>
      <div className="mt-8 flex gap-2">
        {TABS.map((item) => <button key={item} type="button" className={tab === item ? "btn" : "btn-ghost"} onClick={() => setTab(item)}>{item}</button>)}
      </div>
      <ul className="mt-3 divide-y rounded-2xl bg-white text-sm">
        {rows.length === 0 ? <li className="px-4 py-3 text-[#6b7280]">Nothing here yet.</li> : null}
        {rows.map((row, index) => <li key={index} className="px-4 py-3">{describe(row)}</li>)}
      </ul>
    </AdminFrame>
  );
}
