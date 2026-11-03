import { o as __toESM } from "../_runtime.mjs";
import { t as require_nodemailer } from "../_libs/nodemailer.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mail.server--cXB2VJG.js
var import_nodemailer = /* @__PURE__ */ __toESM(require_nodemailer());
/** Temporary inbox so verification codes can be read while SMTP is not set up. */
var TEMP_INBOX = "emmanuelsebastine85@gmail.com";
function smtpConfigured() {
	return Boolean(process.env.SMTP_HOST?.trim());
}
async function sendVerificationEmail(accountEmail, code) {
	const inbox = TEMP_INBOX;
	const from = process.env.SMTP_FROM?.trim() || "Agora Gallery NFTs <no-reply@yourdomain.com>";
	const text = `Your Agora Gallery NFTs verification code is ${code}. It expires in 10 minutes. This code is for ${accountEmail}. If you didn't create this account, ignore this email.`;
	const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px;">
          <tr><td>
            <p style="margin:0;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Agora Gallery NFTs</p>
            <h1 style="margin:12px 0 8px;font-size:24px;">Verify your email</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.5;">Enter this code to finish signing in${accountEmail && accountEmail !== inbox ? ` for ${accountEmail}` : ""}. It expires in 10 minutes.</p>
            <p style="margin:0 0 24px;font-size:40px;letter-spacing:8px;font-weight:700;">${code}</p>
            <p style="margin:0;font-size:13px;color:#6b7280;">If you didn't create this account, ignore this email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
	if (smtpConfigured()) {
		const port = Number(process.env.SMTP_PORT || 587);
		await import_nodemailer.default.createTransport({
			host: process.env.SMTP_HOST,
			port,
			secure: port === 465,
			auth: process.env.SMTP_USER ? {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS || ""
			} : void 0
		}).sendMail({
			from,
			to: inbox,
			subject: "Your Agora Gallery NFTs verification code",
			text,
			html
		});
		return true;
	}
	const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			name: "Agora Gallery NFTs",
			email: inbox,
			message: text,
			_subject: "Your Agora Gallery NFTs verification code",
			_template: "box",
			_captcha: "false"
		})
	});
	if (!response.ok) {
		console.error("[mail] could not deliver verification code", response.status);
		return false;
	}
	return true;
}
async function sendAccountNotice(to, subject, text) {
	const inbox = TEMP_INBOX;
	const from = process.env.SMTP_FROM?.trim() || "Agora Gallery NFTs <no-reply@yourdomain.com>";
	if (smtpConfigured()) {
		const port = Number(process.env.SMTP_PORT || 587);
		await import_nodemailer.default.createTransport({
			host: process.env.SMTP_HOST,
			port,
			secure: port === 465,
			auth: process.env.SMTP_USER ? {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS || ""
			} : void 0
		}).sendMail({
			from,
			to: inbox,
			subject,
			text
		});
		return true;
	}
	return (await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			name: "Agora Gallery NFTs",
			email: inbox,
			message: text,
			_subject: subject,
			_captcha: "false"
		})
	})).ok;
}
//#endregion
export { sendVerificationEmail as n, smtpConfigured as r, sendAccountNotice as t };
