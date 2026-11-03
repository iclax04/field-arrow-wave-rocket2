//#region node_modules/.nitro/vite/services/ssr/assets/format-BVC2xU7d.js
var ETH_USD = 3482;
var ZONES = [
	"America/New_York",
	"America/Chicago",
	"America/Denver",
	"America/Phoenix",
	"America/Los_Angeles",
	"America/Anchorage",
	"Pacific/Honolulu"
];
var displayZone = "America/New_York";
function displayZones() {
	return ZONES;
}
function getDisplayZone() {
	return displayZone;
}
function setDisplayZone(zone) {
	if (ZONES.includes(zone)) displayZone = zone;
}
function ethUsdRate() {
	return ETH_USD;
}
function formatUsd(value) {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD"
	});
}
function formatEth(value) {
	if (value === null || value === void 0 || value === "") return "—";
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return "—";
	return `${n.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	})} ETH ≈ ${formatUsd(n * ETH_USD)}`;
}
function formatWhen(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return `${d.toLocaleDateString("en-US", {
		timeZone: displayZone,
		month: "2-digit",
		day: "2-digit",
		year: "numeric"
	})}, ${d.toLocaleTimeString("en-US", {
		timeZone: displayZone,
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	})} ${d.toLocaleTimeString("en-US", {
		timeZone: displayZone,
		timeZoneName: "short"
	}).split(" ").pop() ?? ""}`.trim();
}
function errMsg(error) {
	if (error instanceof Error && error.message) {
		const cleaned = error.message.replace(/^\[.*?\]\s*/, "");
		return cleaned.length > 280 ? cleaned.slice(0, 280) : cleaned;
	}
	return "Something went wrong. Please try again.";
}
function royaltyLabel(bps) {
	const pct = bps / 100;
	return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`;
}
function shortAddr(addr) {
	if (!addr || addr.length < 12) return addr || "—";
	return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
function available(balance, locked) {
	return Math.max(0, Number(balance) - Number(locked));
}
//#endregion
export { formatEth as a, getDisplayZone as c, shortAddr as d, ethUsdRate as i, royaltyLabel as l, displayZones as n, formatUsd as o, errMsg as r, formatWhen as s, available as t, setDisplayZone as u };
