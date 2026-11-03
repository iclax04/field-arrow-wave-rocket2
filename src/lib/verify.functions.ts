import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export const verificationStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { emailFor } = await import("./verify.server");
    return emailFor(context.userId);
  });

export const sendEmailCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { issueCode } = await import("./verify.server");
    return issueCode(context.userId);
  });

export const confirmEmailCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const code = String((input as { code?: string } | null)?.code ?? "").replace(/\D/g, "");
    if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
    return { code };
  })
  .handler(async ({ context, data }) => {
    const { checkCode } = await import("./verify.server");
    return checkCode(context.userId, data.code);
  });
