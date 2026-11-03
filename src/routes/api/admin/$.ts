import { createFileRoute } from "@tanstack/react-router";
import { handleAdmin } from "@/lib/admin.server";

export const Route = createFileRoute("/api/admin/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAdmin(request),
      POST: ({ request }) => handleAdmin(request),
      PUT: ({ request }) => handleAdmin(request),
      DELETE: ({ request }) => handleAdmin(request),
    },
  },
});
