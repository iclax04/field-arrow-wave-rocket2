import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { RequireVerified } from "@/components/market/require-verified";
import { StudioView, type StudioTab } from "@/components/market/studio-view";
import { useMarket } from "@/components/market/provider";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { fileToCover } from "@/lib/files";
import { available, errMsg } from "@/lib/format";
import {
  acceptOffer,
  getDashboard,
  rejectOffer,
  searchStudios,
  updateMe,
  withdrawOffer,
} from "@/lib/market.functions";

export const Route = createFileRoute("/dashboard")({
  headers: () => ({ "Cache-Control": "no-store" }),
  component: DashboardPage,
});

type Tab = StudioTab;

function DashboardPage() {
  const { user, isPending } = useCurrentUserState();
  const { me, refresh } = useMarket();
  const [tab, setTab] = useState<Tab>("holdings");
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Awaited<ReturnType<typeof searchStudios>>>([]);
  const [assetQuery, setAssetQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "value" | "name">("recent");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [unit, setUnit] = useState<"usd" | "eth">("usd");
  const [hideValue, setHideValue] = useState(false);
  const [menu, setMenu] = useState(false);
  const [more, setMore] = useState(false);
  const [wallets, setWallets] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function load() {
    getDashboard()
      .then((value) => setData(value))
      .catch((caught) => setError(errMsg(caught)));
  }

  useEffect(() => {
    if (user) load();
  }, [user?.id]);

  const works = useMemo(() => {
    const source = tab === "watch" ? data?.watchlist ?? [] : data?.owned ?? [];
    const q = assetQuery.trim().toLowerCase();
    const filtered = source.filter((work) => !q || work.title.toLowerCase().includes(q) || work.category_slug.includes(q));
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "value") return Number(b.price ?? 0) - Number(a.price ?? 0);
      return 0;
    });
  }, [data, tab, assetQuery, sort]);

  if (isPending) return <p className="bg-[#0d0d0f] px-4 py-16 text-white/60">Checking your session…</p>;
  if (!user) return <RedirectToSignIn />;
  if (me?.emailVerified === false) return <RequireVerified />;

  const avail = me ? available(me.profile.balance, me.profile.locked_balance) : 0;
  const profile = me?.profile;
  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    : "";
  const walletRows = [
    profile?.deposit_address ? { label: "Deposit", address: profile.deposit_address } : null,
    profile?.wallet_address ? { label: "Personal", address: profile.wallet_address } : null,
  ].filter((row): row is { label: string; address: string } => Boolean(row));

  return (
    <StudioView
      name={profile?.display_name || "Collector"}
      username={profile?.username || "collector"}
      avatarUrl={profile?.avatar_url ?? null}
      joined={joined}
      wallets={walletRows}
      balanceEth={avail}
      unit={unit}
      setUnit={setUnit}
      hideValue={hideValue}
      setHideValue={setHideValue}
      tab={tab}
      setTab={setTab}
      menu={menu}
      setMenu={setMenu}
      more={more}
      setMore={setMore}
      walletsOpen={wallets}
      setWalletsOpen={setWallets}
      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
      query={query}
      setQuery={setQuery}
      hits={hits}
      onSearch={() => {
        searchStudios({ data: query }).then(setHits).catch((caught) => toast.error(errMsg(caught)));
      }}
      assetQuery={assetQuery}
      setAssetQuery={setAssetQuery}
      sort={sort}
      setSort={setSort}
      layout={layout}
      setLayout={setLayout}
      works={works}
      trades={[...(data?.sold ?? []), ...(data?.purchases ?? [])]}
      activity={data?.activity ?? []}
      offersIn={data?.offersIn ?? []}
      offersOut={data?.offersOut ?? []}
      onAccept={(id) => {
        acceptOffer({ data: id }).then(() => { toast.success("Accepted"); refresh(); load(); }).catch((caught) => toast.error(errMsg(caught)));
      }}
      onDecline={(id) => {
        rejectOffer({ data: id }).then(() => { toast.success("Declined"); load(); }).catch((caught) => toast.error(errMsg(caught)));
      }}
      onWithdraw={(id) => {
        withdrawOffer({ data: id }).then(() => { toast.success("Withdrawn"); refresh(); load(); }).catch((caught) => toast.error(errMsg(caught)));
      }}
      onSignOut={() => void signOut("/")}
      profile={me ? (<><ProfileForm /><PasswordForm /></>) : null}
    />
  );
}

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function ProfileForm() {
  const { me, refresh } = useMarket();
  const profile = me?.profile;
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [region, setRegion] = useState(profile?.region ?? "");
  const [postalCode, setPostalCode] = useState(profile?.postal_code ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [siteUrl, setSiteUrl] = useState(profile?.site_url ?? "");
  const [xHandle, setXHandle] = useState(profile?.x_handle ?? "");
  const [wallet, setWallet] = useState(profile?.wallet_address ?? "");
  const [avatar, setAvatar] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name);
    setUsername(profile.username);
    setBio(profile.bio);
    setCity(profile.city);
    setRegion(profile.region ?? "");
    setPostalCode(profile.postal_code ?? "");
    setPhone(profile.phone ?? "");
    setSiteUrl(profile.site_url ?? "");
    setXHandle(profile.x_handle ?? "");
    setWallet(profile.wallet_address ?? "");
  }, [profile?.user_id]);

  if (!profile) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await updateMe({
        data: { displayName, username, bio, city, region, postalCode, phone, siteUrl, xHandle, avatar, clearAvatar: false, wallet },
      });
      toast.success("Profile saved");
      refresh();
    } catch (caught) {
      toast.error(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-3">
      <h2 className="text-3xl font-bold">Edit profile</h2>
      <label><span className="label">Name</span><input className="field" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" /></label>
      <label><span className="label">Username</span><input className="field" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
      <label><span className="label">Phone</span><input className="field" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="(555) 555-0100" /></label>
      <label><span className="label">City</span><input className="field" value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" /></label>
      <label>
        <span className="label">State</span>
        <select className="field" value={region} onChange={(event) => setRegion(event.target.value)} autoComplete="address-level1">
          <option value="">Select</option>
          {US_STATES.map((code) => <option key={code} value={code}>{code}</option>)}
        </select>
      </label>
      <label><span className="label">ZIP code</span><input className="field" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} autoComplete="postal-code" inputMode="numeric" placeholder="10001" /></label>
      <label><span className="label">Bio</span><textarea className="field min-h-24 py-3" value={bio} onChange={(event) => setBio(event.target.value)} /></label>
      <label><span className="label">Site</span><input className="field" value={siteUrl} onChange={(event) => setSiteUrl(event.target.value)} placeholder="https://" /></label>
      <label><span className="label">X</span><input className="field" value={xHandle} onChange={(event) => setXHandle(event.target.value)} /></label>
      <label>
        <span className="label">Avatar</span>
        <input className="field py-2" type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          fileToCover(file).then(setAvatar).catch((caught) => toast.error(errMsg(caught)));
        }} />
      </label>
      <label><span className="label">Personal wallet</span><input className="field" value={wallet} onChange={(event) => setWallet(event.target.value)} placeholder="0x" /></label>
      <button className="btn w-fit" disabled={busy} type="submit">{busy ? "Saving…" : "Save profile"}</button>
    </form>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });
      if (result.error) throw new Error(result.error.message || "Could not change the password.");
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated");
    } catch (caught) {
      toast.error(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 grid max-w-xl gap-3 border-t border-line pt-8">
      <h2 className="font-serif text-3xl">Password</h2>
      <label>
        <span className="label">Current password</span>
        <input className="field" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
      </label>
      <label>
        <span className="label">New password</span>
        <input className="field" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
      </label>
      <button className="btn w-fit" disabled={busy} type="submit">{busy ? "Saving…" : "Change password"}</button>
    </form>
  );
}
