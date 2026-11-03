import { Navigate } from "@tanstack/react-router";
import { useMarket } from "./provider";

export function RequireVerified() {
  const { me } = useMarket();
  if (!me || me.emailVerified !== false) return null;
  return <Navigate to="/verify-email" search={{ email: me.email ?? "", code: "" }} replace />;
}
