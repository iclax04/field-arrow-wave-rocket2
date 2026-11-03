const ETH_USD = 3482;

const ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
] as const;

export type DisplayZone = (typeof ZONES)[number];

let displayZone: DisplayZone = "America/New_York";

export function displayZones(): readonly DisplayZone[] {
  return ZONES;
}

export function getDisplayZone(): DisplayZone {
  return displayZone;
}

export function setDisplayZone(zone: string) {
  if ((ZONES as readonly string[]).includes(zone)) displayZone = zone as DisplayZone;
}

export function ethUsdRate(): number {
  return ETH_USD;
}

export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatEth(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  const eth = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  const usd = formatUsd(n * ETH_USD);
  return `${eth} ETH ≈ ${usd}`;
}

export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString("en-US", {
    timeZone: displayZone,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    timeZone: displayZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const zone = d
    .toLocaleTimeString("en-US", { timeZone: displayZone, timeZoneName: "short" })
    .split(" ")
    .pop();
  return `${date}, ${time} ${zone ?? ""}`.trim();
}

export function errMsg(error: unknown): string {
  if (error instanceof Error && error.message) {
    const cleaned = error.message.replace(/^\[.*?\]\s*/, "");
    return cleaned.length > 280 ? cleaned.slice(0, 280) : cleaned;
  }
  return "Something went wrong. Please try again.";
}

export function royaltyLabel(bps: number): string {
  const pct = bps / 100;
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`;
}

export function shortAddr(addr: string): string {
  if (!addr || addr.length < 12) return addr || "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function available(balance: string, locked: string): number {
  return Math.max(0, Number(balance) - Number(locked));
}
