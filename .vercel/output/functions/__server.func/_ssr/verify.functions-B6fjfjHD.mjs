import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-D0T8XjwZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify.functions-B6fjfjHD.js
var verificationStatus_createServerFn_handler = createServerRpc({
	id: "55c609af19025af594f7bf16d5c1ba2ad422e25663f56d452c4ae663ebfb72f1",
	name: "verificationStatus",
	filename: "src/lib/verify.functions.ts"
}, (opts) => verificationStatus.__executeServer(opts));
var verificationStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(verificationStatus_createServerFn_handler, async ({ context }) => {
	const { emailFor } = await import("./verify.server-B1MUGE5U.mjs");
	return emailFor(context.userId);
});
var sendEmailCode_createServerFn_handler = createServerRpc({
	id: "22730ff56fb6d7ac2732a51263c551973e16229d15a1dd7e0d4566f086c233a9",
	name: "sendEmailCode",
	filename: "src/lib/verify.functions.ts"
}, (opts) => sendEmailCode.__executeServer(opts));
var sendEmailCode = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(sendEmailCode_createServerFn_handler, async ({ context }) => {
	const { issueCode } = await import("./verify.server-B1MUGE5U.mjs");
	return issueCode(context.userId);
});
var confirmEmailCode_createServerFn_handler = createServerRpc({
	id: "f8798a4713116af8559b1255fea940269818c78c5f3bb34dccb151c5f6f44555",
	name: "confirmEmailCode",
	filename: "src/lib/verify.functions.ts"
}, (opts) => confirmEmailCode.__executeServer(opts));
var confirmEmailCode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const code = String(input?.code ?? "").replace(/\D/g, "");
	if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
	return { code };
}).handler(confirmEmailCode_createServerFn_handler, async ({ context, data }) => {
	const { checkCode } = await import("./verify.server-B1MUGE5U.mjs");
	return checkCode(context.userId, data.code);
});
//#endregion
export { confirmEmailCode_createServerFn_handler, sendEmailCode_createServerFn_handler, verificationStatus_createServerFn_handler };
