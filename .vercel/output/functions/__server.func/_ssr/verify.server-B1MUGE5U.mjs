import { i as getSql } from "./db-DWDn8PPZ.mjs";
import { n as sendVerificationEmail, r as smtpConfigured } from "./mail.server--cXB2VJG.mjs";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/verify.server-B1MUGE5U.js
function hashCode(code, salt) {
	return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}
function matches(code, salt, expected) {
	const actual = hashCode(code, salt);
	const a = Buffer.from(actual);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}
async function emailFor(userId) {
	const row = (await (await getSql()).query(`select "email", "emailVerified" as verified from "user" where "id" = $1`, [userId]))[0];
	if (!row?.email) throw new Error("Account not found.");
	return {
		email: row.email.toLowerCase(),
		verified: Boolean(row.verified)
	};
}
async function issueCode(userId) {
	const sql = await getSql();
	const { email, verified } = await emailFor(userId);
	if (verified) return {
		ok: true,
		already: true,
		sent: true,
		devCode: null
	};
	const recent = await sql.query(`select created_at from email_codes where email = $1 order by created_at desc limit 1`, [email]);
	if (recent[0] && Date.now() - new Date(recent[0].created_at).getTime() < 6e4) throw new Error("Wait 60 seconds before requesting another code.");
	const code = String(randomInt(0, 1e6)).padStart(6, "0");
	const salt = randomBytes(16).toString("hex");
	await sql.query(`update email_codes set used = true where email = $1 and used = false`, [email]);
	await sql.query(`insert into email_codes (email, code_hash, salt, expires_at) values ($1, $2, $3, now() + interval '10 minutes')`, [
		email,
		hashCode(code, salt),
		salt
	]);
	const sent = await sendVerificationEmail(email, code);
	return {
		ok: true,
		already: false,
		sent,
		devCode: sent || smtpConfigured() ? null : code
	};
}
async function checkCode(userId, code) {
	const sql = await getSql();
	const { email } = await emailFor(userId);
	const row = (await sql.query(`select id, code_hash, salt, attempts, locked, (expires_at < now()) as expired
     from email_codes where email = $1 and used = false order by created_at desc limit 1`, [email]))[0];
	if (!row) throw new Error("Request a new code.");
	if (row.locked) throw new Error("This code is locked. Request a new code.");
	if (row.expired) throw new Error("This code has expired. Request a new code.");
	if (!matches(code, row.salt, row.code_hash)) {
		const attempts = Number(row.attempts) + 1;
		await sql.query(`update email_codes set attempts = $2, locked = $3 where id = $1`, [
			row.id,
			attempts,
			attempts >= 5
		]);
		if (attempts >= 5) throw new Error("Too many attempts. Request a new code.");
		throw new Error(`That code is not correct. ${5 - attempts} attempts left.`);
	}
	await sql.query(`update email_codes set used = true where id = $1`, [row.id]);
	await sql.query(`update "user" set "emailVerified" = true, "updatedAt" = now() where "id" = $1`, [userId]);
	return { ok: true };
}
//#endregion
export { checkCode, emailFor, issueCode };
