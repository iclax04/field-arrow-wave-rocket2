import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-D0T8XjwZ.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify.functions-2_Z_w9Pd.js
var verificationStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("55c609af19025af594f7bf16d5c1ba2ad422e25663f56d452c4ae663ebfb72f1"));
var sendEmailCode = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("22730ff56fb6d7ac2732a51263c551973e16229d15a1dd7e0d4566f086c233a9"));
var confirmEmailCode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const code = String(input?.code ?? "").replace(/\D/g, "");
	if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
	return { code };
}).handler(createSsrRpc("f8798a4713116af8559b1255fea940269818c78c5f3bb34dccb151c5f6f44555"));
//#endregion
export { sendEmailCode as n, verificationStatus as r, confirmEmailCode as t };
