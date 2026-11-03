import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatEth } from "./format-BVC2xU7d.mjs";
import { t as adminFetch } from "./admin-client-B0sXbIcE.mjs";
import { t as AdminFrame } from "./frame-u_PiU_JB.mjs";
import { d as Route } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users._id-CZ6Pi2X3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"deposits",
	"withdrawals",
	"artworks",
	"transactions",
	"activity"
];
function describe(row) {
	const at = row.at ? new Date(String(row.at)).toLocaleString("en-US") : "";
	if ("title" in row) return `${row.title}${row.hidden ? " · hidden" : ""}${row.removed ? " · removed" : ""} · ${at}`;
	if ("amount" in row) return `${row.amount} ETH · ${row.status || ""} · ${row.destination || row.tx_hash || ""} · ${at}`;
	if ("price" in row) return `${row.kind} · ${row.price} ETH · ${row.note || ""} · ${at}`;
	return `${row.kind || "Activity"} · ${row.detail || ""} · ${at}`;
}
function UserPage() {
	const { id } = Route.useParams();
	const [user, setUser] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("set");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("deposits");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)("");
	function load() {
		adminFetch(`users/${encodeURIComponent(id)}`).then((data) => setUser(data.user)).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load the user."));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [id]);
	(0, import_react.useEffect)(() => {
		adminFetch(`users/${encodeURIComponent(id)}/${tab}`).then((data) => setRows(data.rows)).catch(() => setRows([]));
	}, [id, tab]);
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8",
		children: error || "Loading…"
	});
	async function save(event) {
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
					depositAddress: user?.deposit_address || ""
				})
			});
			setNotice("User saved.");
			load();
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "Could not save.");
		}
	}
	async function action(path, body) {
		if ((path === "delete" || path === "ban") && !window.confirm(`Confirm ${path} for this user?`)) return;
		setNotice("");
		setError("");
		try {
			await adminFetch(`users/${encodeURIComponent(id)}/${path}`, {
				method: "POST",
				body: JSON.stringify(body || {})
			});
			setNotice("Done.");
			load();
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "That action failed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminFrame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: user.display_name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 grid max-w-xl gap-3",
			onSubmit: save,
			children: [
				[
					"display_name",
					"username",
					"email",
					"phone",
					"bio",
					"avatar_url",
					"wallet_address"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "label capitalize",
					children: [key.replaceAll("_", " "), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: String(user[key] ?? ""),
						onChange: (event) => setUser({
							...user,
							[key]: event.target.value
						})
					})]
				}, key)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "label",
					children: ["Role", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: user.role,
						onChange: (event) => setUser({
							...user,
							role: event.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "user"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "admin",
								children: "admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "catalog",
								children: "catalog"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "label",
					children: ["Status", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: user.status,
						onChange: (event) => setUser({
							...user,
							status: event.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "suspended",
								children: "suspended"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "banned",
								children: "banned"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						"Email verified: ",
						user.verified ? "Yes" : "No",
						" · Balance ",
						formatEth(user.balance)
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-red-700",
					children: error
				}) : null,
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#2563eb]",
					children: notice
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: !user.use_platform_deposit,
						onChange: (event) => setUser({
							...user,
							use_platform_deposit: !event.target.checked
						})
					}), "Custom deposit address"]
				}),
				!user.use_platform_deposit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field font-mono",
					value: user.deposit_address || "",
					onChange: (event) => setUser({
						...user,
						deposit_address: event.target.value
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn w-fit",
					type: "submit",
					children: "Save user"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid max-w-xl gap-2 rounded-2xl bg-white p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-bold",
					children: ["Balance · ", formatEth(user.balance)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "field",
					value: mode,
					onChange: (event) => setMode(event.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "set",
							children: "Set"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "add",
							children: "Add"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "sub",
							children: "Subtract"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "ETH amount",
					value: amount,
					onChange: (event) => setAmount(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Reason",
					value: reason,
					onChange: (event) => setReason(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn w-fit",
					onClick: () => void action("balance", {
						mode,
						amount: Number(amount),
						reason
					}),
					children: "Update balance"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field max-w-xs",
					placeholder: "New password",
					value: password,
					onChange: (event) => setPassword(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void action("reset-password", { password }),
					children: "Reset password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void action("verify"),
					children: "Force verify email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void action("suspend"),
					children: "Suspend"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void action("ban"),
					children: "Ban"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void action("delete"),
					children: "Delete"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void action("sign-out"),
					children: "Sign out user"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 flex gap-2",
			children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: tab === item ? "btn" : "btn-ghost",
				onClick: () => setTab(item),
				children: item
			}, item))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 divide-y rounded-2xl bg-white text-sm",
			children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-3 text-[#6b7280]",
				children: "Nothing here yet."
			}) : null, rows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-3",
				children: describe(row)
			}, index))]
		})
	] });
}
//#endregion
export { UserPage as component };
