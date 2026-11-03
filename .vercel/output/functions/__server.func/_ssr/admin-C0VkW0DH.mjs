import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, _ as Outlet, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatEth, r as errMsg } from "./format-BVC2xU7d.mjs";
import { t as adminFetch } from "./admin-client-B0sXbIcE.mjs";
import { t as AdminFrame } from "./frame-u_PiU_JB.mjs";
import { p as Route } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C0VkW0DH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	if (useRouterState({ select: (state) => state.location.pathname }) !== "/admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHome, {});
}
function AdminHome() {
	const { section } = Route.useSearch();
	const [counts, setCounts] = (0, import_react.useState)({
		deposits: 0,
		withdrawals: 0
	});
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		adminFetch("session").then((data) => {
			if (data.admin.mustChange) {
				window.location.replace("/admin/password");
				return;
			}
			setReady(true);
		}).catch(() => void 0);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		adminFetch("overview").then((data) => setCounts({
			deposits: data.pendingDeposits,
			withdrawals: data.pendingWithdrawals
		})).catch(() => void 0);
	}, [ready, section]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-sm text-[#6b7280]",
		children: "Checking the admin session…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminFrame, {
		counts,
		children: [
			section === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}) : null,
			section === "users" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {}) : null,
			section === "deposits" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deposits, {}) : null,
			section === "withdrawals" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Withdrawals, {}) : null,
			section === "address" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Address, {}) : null,
			section === "artworks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Artworks, {}) : null,
			section === "transactions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transactions, {}) : null,
			section === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {}) : null,
			section === "admins" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Admins, {}) : null,
			section === "audit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Audit, {}) : null
		]
	});
}
function useLoad(path) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		adminFetch(path).then(setData).catch((caught) => setError(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [path]);
	return {
		data,
		error,
		load,
		setData
	};
}
function Overview() {
	const { data, error } = useLoad("overview");
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-red-700",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading…" });
	const cards = [
		["Users", String(data.users)],
		["ETH balances", formatEth(data.balances)],
		["Pending deposits", String(data.pendingDeposits)],
		["Pending withdrawals", String(data.pendingWithdrawals)],
		["Artworks", String(data.artworks)],
		["Mint fee revenue", formatEth(data.mintFees)]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Overview"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: cards.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-white p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#6b7280]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xl font-bold",
					children: value
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 text-lg font-bold",
			children: "Recent activity"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 divide-y rounded-2xl bg-white",
			children: data.activity.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-3 text-sm",
				children: [
					row.action,
					" · ",
					row.detail || row.at
				]
			}, row.id))
		})
	] });
}
function Users() {
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [pack, setPack] = (0, import_react.useState)(null);
	function load(next = page) {
		const params = new URLSearchParams({
			q,
			status,
			page: String(next)
		});
		adminFetch(`users?${params}`).then(setPack).catch(() => void 0);
	}
	(0, import_react.useEffect)(() => {
		load(1);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Users"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 flex flex-wrap gap-2",
			onSubmit: (event) => {
				event.preventDefault();
				setPage(1);
				load(1);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field max-w-xs",
					value: q,
					onChange: (event) => setQ(event.target.value),
					placeholder: "Search name, username, or email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "field max-w-[10rem]",
					value: status,
					onChange: (event) => setStatus(event.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "suspended",
							children: "Suspended"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "banned",
							children: "Banned"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn",
					type: "submit",
					children: "Search"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto rounded-2xl bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-[#6b7280]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Username" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Balance" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Joined" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pack?.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/users/$id",
								params: { id: row.user_id },
								search: { section: "users" },
								className: "font-semibold text-[#2563eb]",
								children: row.display_name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: ["@", row.username] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.email }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatEth(row.balance) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "capitalize",
							children: row.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(row.joined).toLocaleDateString("en-US") })
					]
				}, row.user_id)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-ghost",
				type: "button",
				disabled: page <= 1,
				onClick: () => {
					const next = page - 1;
					setPage(next);
					load(next);
				},
				children: "Previous"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-ghost",
				type: "button",
				disabled: !pack || page * 20 >= pack.total,
				onClick: () => {
					const next = page + 1;
					setPage(next);
					load(next);
				},
				children: "Next"
			})]
		})
	] });
}
function Deposits() {
	const [status, setStatus] = (0, import_react.useState)("pending");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [manual, setManual] = (0, import_react.useState)({
		userId: "",
		amount: ""
	});
	const [edit, setEdit] = (0, import_react.useState)({});
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		adminFetch(`deposits?status=${status}`).then((data) => setRows(data.rows)).catch((caught) => setError(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [status]);
	async function act(id, action) {
		const reason = action === "reject" ? window.prompt("Reason for rejection") || "" : "";
		if (action === "reject" && reason.length < 3) {
			setError("A rejection reason is required.");
			return;
		}
		setError("");
		try {
			await adminFetch(`deposits/${id}/${action}`, {
				method: "POST",
				body: JSON.stringify({
					reason,
					amount: edit[id] || void 0
				})
			});
			load();
		} catch (caught) {
			setError(errMsg(caught));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Deposits"
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-red-700",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex gap-2",
			children: [
				"pending",
				"approved",
				"rejected",
				""
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: status === item ? "btn" : "btn-ghost",
				onClick: () => setStatus(item),
				children: item || "All"
			}, item || "all"))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto rounded-2xl bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-[#6b7280]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "User"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Tx hash" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-3 text-[#6b7280]",
					colSpan: 6,
					children: "No deposits in this view."
				}) }) : null, rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: row.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field w-28",
							defaultValue: row.amount,
							onChange: (event) => setEdit({
								...edit,
								[row.id]: event.target.value
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-[10rem] truncate font-mono text-xs",
							children: row.tx_hash
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "capitalize",
							children: row.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(row.at).toLocaleDateString("en-US") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "space-x-2 p-3",
							children: row.status === "pending" || row.status === "confirming" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn px-3",
								onClick: () => void act(row.id, "approve"),
								children: "Approve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost",
								onClick: () => void act(row.id, "reject"),
								children: "Reject"
							})] }) : null
						})
					]
				}, row.id))] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid max-w-md gap-2 rounded-2xl bg-white p-4",
			onSubmit: (event) => {
				event.preventDefault();
				setError("");
				adminFetch("deposits", {
					method: "POST",
					body: JSON.stringify(manual)
				}).then(() => {
					setManual({
						userId: "",
						amount: ""
					});
					load();
				}).catch((caught) => setError(errMsg(caught)));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Add a deposit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Email, username, or user id",
					value: manual.userId,
					onChange: (event) => setManual({
						...manual,
						userId: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Amount in ETH",
					value: manual.amount,
					onChange: (event) => setManual({
						...manual,
						amount: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn",
					type: "submit",
					children: "Add deposit"
				})
			]
		})
	] });
}
function Withdrawals() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		adminFetch("withdrawals").then((data) => setRows(data.rows)).catch((caught) => setError(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function act(id, action) {
		const reason = action === "reject" ? window.prompt("Reason") || "" : "";
		const txHash = action === "complete" ? window.prompt("Transaction hash") || "" : "";
		if (action === "reject" && reason.length < 3) {
			setError("A rejection reason is required.");
			return;
		}
		setError("");
		try {
			await adminFetch(`withdrawals/${id}/${action}`, {
				method: "POST",
				body: JSON.stringify({
					reason,
					txHash
				})
			});
			load();
		} catch (caught) {
			setError(errMsg(caught));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Withdrawals"
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-red-700",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto rounded-2xl bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-[#6b7280]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "User"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Destination" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3",
							children: [row.display_name, row.warning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs font-bold text-red-600",
								children: row.warningNote || "Review"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatEth(row.amount) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-[12rem] truncate font-mono text-xs",
							children: row.destination
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "capitalize",
							children: row.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(row.at).toLocaleDateString("en-US") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "space-x-2 p-3",
							children: [
								row.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn px-3",
									onClick: () => void act(row.id, "approve"),
									children: "Approve"
								}) : null,
								row.status === "pending" || row.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-ghost",
									onClick: () => void act(row.id, "reject"),
									children: "Reject"
								}) : null,
								row.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn px-3",
									onClick: () => void act(row.id, "complete"),
									children: "Complete"
								}) : null
							]
						})
					]
				}, row.id)) })]
			})
		})
	] });
}
function Address() {
	const [address, setAddress] = (0, import_react.useState)("");
	const [qr, setQr] = (0, import_react.useState)("");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	function load() {
		adminFetch("deposit-address").then((data) => {
			setAddress(data.address);
			setQr(data.qr);
			setHistory(data.history);
		}).catch((caught) => setError(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Deposit Ethereum address"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[#6b7280]",
				children: "Users see this address on their Deposit page unless a user has a custom override."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 grid gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					adminFetch("deposit-address", {
						method: "PUT",
						body: JSON.stringify({ address })
					}).then(load).catch((caught) => setError(errMsg(caught)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field font-mono",
						value: address,
						onChange: (event) => setAddress(event.target.value),
						placeholder: "0x…"
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-red-700",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn w-fit",
						type: "submit",
						children: "Save address"
					})
				]
			}),
			qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 w-40 rounded-2xl bg-white p-3",
				dangerouslySetInnerHTML: { __html: qr }
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-bold",
				children: "Change history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 text-sm",
				children: history.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-1 font-mono",
					children: row.address
				}, row.id))
			})
		]
	});
}
function Artworks() {
	const { data, load } = useLoad("artworks");
	async function act(id, action) {
		await adminFetch("artworks", {
			method: "POST",
			body: JSON.stringify({
				id,
				action
			})
		});
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-2xl font-bold",
		children: "Artworks"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 divide-y rounded-2xl bg-white",
		children: data?.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				row.title,
				" · ",
				row.artist,
				row.hidden ? " · hidden" : "",
				row.removed ? " · removed" : ""
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "space-x-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void act(row.id, row.hidden ? "unhide" : "hide"),
					children: row.hidden ? "Unhide" : "Hide"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void act(row.id, "remove"),
					children: "Remove"
				})]
			})]
		}, row.id))
	})] });
}
function Transactions() {
	const [kind, setKind] = (0, import_react.useState)("");
	const { data } = useLoad(`transactions?kind=${kind}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Transactions"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: "field max-w-xs",
				value: kind,
				onChange: (event) => setKind(event.target.value),
				children: [
					"",
					"deposit",
					"withdrawal",
					"mint_fee",
					"purchase",
					"sale",
					"royalty",
					"adjustment"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: item,
					children: item || "All"
				}, item))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "btn",
				href: `/api/admin/transactions/export?kind=${kind}`,
				children: "Export CSV"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 divide-y rounded-2xl bg-white text-sm",
			children: data?.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-3",
				children: [
					row.kind,
					" · ",
					formatEth(row.price),
					" · ",
					row.buyer || row.seller || ""
				]
			}, row.id))
		})
	] });
}
function Settings() {
	const [form, setForm] = (0, import_react.useState)({
		mintFee: "0.2",
		minWithdrawal: "0.05",
		platformFeePct: "2.5",
		autoApproveUnder: "0",
		autoApproveEnabled: false,
		supportEmail: "",
		announcement: "",
		withdrawalWarnEth: "5"
	});
	const [error, setError] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		adminFetch("settings").then((data) => {
			const row = data.settings;
			setForm({
				mintFee: row.mint_fee,
				minWithdrawal: row.min_withdrawal,
				platformFeePct: String(row.platform_fee_bps / 100),
				autoApproveUnder: row.auto_approve_under,
				autoApproveEnabled: row.auto_approve_enabled,
				supportEmail: row.support_email,
				announcement: row.announcement,
				withdrawalWarnEth: row.withdrawal_warn_eth
			});
		}).catch((caught) => setError(errMsg(caught)));
	}, []);
	function save(event) {
		event.preventDefault();
		setSaved(false);
		setError("");
		adminFetch("settings", {
			method: "PUT",
			body: JSON.stringify(form)
		}).then(() => setSaved(true)).catch((caught) => setError(errMsg(caught)));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-lg gap-3",
		onSubmit: save,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Minting fee (ETH)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.mintFee,
					onChange: (event) => setForm({
						...form,
						mintFee: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Minimum withdrawal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.minWithdrawal,
					onChange: (event) => setForm({
						...form,
						minWithdrawal: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Platform fee %", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.platformFeePct,
					onChange: (event) => setForm({
						...form,
						platformFeePct: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Auto-approve under (ETH)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.autoApproveUnder,
					onChange: (event) => setForm({
						...form,
						autoApproveUnder: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.autoApproveEnabled,
					onChange: (event) => setForm({
						...form,
						autoApproveEnabled: event.target.checked
					})
				}), " Auto-approve enabled"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Withdrawal warning above (ETH)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.withdrawalWarnEth,
					onChange: (event) => setForm({
						...form,
						withdrawalWarnEth: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Support email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.supportEmail,
					onChange: (event) => setForm({
						...form,
						supportEmail: event.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "label",
				children: ["Announcement", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: form.announcement,
					onChange: (event) => setForm({
						...form,
						announcement: event.target.value
					})
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-red-700",
				children: error
			}) : null,
			saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#2563eb]",
				children: "Settings saved."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn w-fit",
				type: "submit",
				children: "Save settings"
			})
		]
	});
}
function Admins() {
	const { data, error, load } = useLoad("admins");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		password: "",
		role: "support"
	});
	const [note, setNote] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Admin accounts"
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-red-700",
			children: error
		}) : null,
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-red-700",
			children: note
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 divide-y rounded-2xl bg-white text-sm",
			children: data?.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					row.name,
					" · ",
					row.email,
					" · ",
					row.role === "super" ? "Super admin" : "Support"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => void adminFetch(`admins/${encodeURIComponent(row.id)}`, { method: "DELETE" }).then(() => {
						setNote("");
						load();
					}).catch((caught) => setNote(errMsg(caught))),
					children: "Remove"
				})]
			}, row.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid max-w-md gap-2",
			onSubmit: (event) => {
				event.preventDefault();
				adminFetch("admins", {
					method: "POST",
					body: JSON.stringify(form)
				}).then(() => {
					setNote("");
					setForm({
						name: "",
						email: "",
						password: "",
						role: "support"
					});
					load();
				}).catch((caught) => setNote(errMsg(caught)));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Name",
					value: form.name,
					onChange: (event) => setForm({
						...form,
						name: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Email",
					value: form.email,
					onChange: (event) => setForm({
						...form,
						email: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Temporary password",
					type: "password",
					value: form.password,
					onChange: (event) => setForm({
						...form,
						password: event.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "field",
					value: form.role,
					onChange: (event) => setForm({
						...form,
						role: event.target.value
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "support",
						children: "Support"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "super",
						children: "Super admin"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn w-fit",
					type: "submit",
					children: "Add admin"
				})
			]
		})
	] });
}
function Audit() {
	const { data } = useLoad("audit-log");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Audit log"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-[#6b7280]",
			children: "This record cannot be edited or deleted."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 divide-y rounded-2xl bg-white text-sm",
			children: data?.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: row.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[#6b7280]",
						children: [
							row.actor_id,
							" · ",
							row.ip || "no IP",
							" · ",
							new Date(row.at).toLocaleString("en-US")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [row.detail, row.old_value ? ` · ${row.old_value} → ${row.new_value}` : ""] })
				]
			}, row.id))
		})
	] });
}
//#endregion
export { AdminLayout as component };
