import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { user } = useCurrentUserState();

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold ${className}`}
      onClick={() => {
        if (window.history.length > 1) router.history.back();
        else void router.navigate({ to: user ? "/dashboard" : "/" });
      }}
    >
      <ArrowLeft size={18} aria-hidden />
      Back
    </button>
  );
}
