//#region node_modules/.nitro/vite/services/ssr/assets/admin-client-B0sXbIcE.js
async function adminFetch(path, init) {
	const response = await fetch(`/api/admin/${path}`, {
		credentials: "include",
		...init,
		headers: {
			...init?.body ? { "content-type": "application/json" } : {},
			...init?.headers || {}
		}
	});
	if ((response.headers.get("content-type") || "").includes("text/csv")) return await response.text();
	const data = await response.json().catch(() => ({}));
	if (!response.ok || data.error) {
		if (data.status === 401 || response.status === 401) window.location.replace("/admin/login");
		if (data.status === 403 && data.error?.toLowerCase().includes("password")) window.location.replace("/admin/password");
		throw new Error(data.error || "Request failed.");
	}
	return data;
}
//#endregion
export { adminFetch as t };
