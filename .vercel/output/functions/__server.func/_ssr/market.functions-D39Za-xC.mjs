import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-D0T8XjwZ.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market.functions-D39Za-xC.js
function text(value, max) {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, max);
}
function posAmount(value, label) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n) || n <= 0 || n > 1e6) throw new Error(`${label} is not a valid amount.`);
	return n.toFixed(6);
}
function intId(value) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isInteger(n) || n <= 0 || n > 1e9) throw new Error("That record was not found.");
	return n;
}
function assertData(data, kind) {
	if (!{
		image: /^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=\s]+$/i,
		video: /^data:video\/(mp4|webm);base64,[a-z0-9+/=\s]+$/i,
		audio: /^data:audio\/(mpeg|mp3|wav|ogg|webm);base64,[a-z0-9+/=\s]+$/i
	}[kind].test(data)) throw new Error("That file type is not allowed.");
	if (data.length > 17e5) throw new Error("File is too large. Keep it under about 1 MB.");
}
var getHome = createServerFn({ method: "GET" }).handler(createSsrRpc("ae4a8ec054cbd0ecd5cf7fa52cd8908ae7664d47dedabf1a130d0fe106de5f39"));
var getCatalog = createServerFn({ method: "GET" }).validator((input) => {
	const src = input ?? {};
	const kind = src.kind === "fixed" || src.kind === "auction" ? src.kind : "";
	const sort = src.sort === "price_asc" || src.sort === "price_desc" || src.sort === "ending" ? src.sort : "newest";
	const min = text(src.min, 20);
	const max = text(src.max, 20);
	if (min && !Number.isFinite(Number(min))) throw new Error("Minimum price is not valid.");
	if (max && !Number.isFinite(Number(max))) throw new Error("Maximum price is not valid.");
	return {
		q: text(src.q, 80),
		category: text(src.category, 40),
		artist: text(src.artist, 80),
		kind,
		sort,
		min: min ? Number(min) : null,
		max: max ? Number(max) : null
	};
}).handler(createSsrRpc("7cb14b52a8e0c242dd1b1d3a6a7a892d3fb192cbb937d28ee11aaf2e3e0931ae"));
var getArtwork = createServerFn({ method: "GET" }).validator((input) => intId(input)).handler(createSsrRpc("3e12606da1bae9870641b3562ad4728f1d5e17da11840cb74b232fb51ad257b0"));
var getArtist = createServerFn({ method: "GET" }).validator((input) => text(input, 40).toLowerCase()).handler(createSsrRpc("9a3cc47f59973770f873ede7b156348286035d2fc2c2cb2a223789802bed9dd8"));
var getActivity = createServerFn({ method: "GET" }).handler(createSsrRpc("db4ae6d39eb1501245ec751fe6a81bd54d04b1b9a1ffda76d4413ea281ca3422"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e9d8cfea6297f7170a5aaeccfe282a2ab1e7a074f2d807f2f36b6702f1334f60"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("b692f91edd540f170070111f4bf5bff76968eaea4398433c192598c5a8d8c26f"));
var updateMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const username = text(src.username, 24).toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username must be 3–24 letters, numbers, or underscores.");
	const displayName = text(src.displayName, 80);
	if (displayName.length < 1) throw new Error("Name is required.");
	const avatar = typeof src.avatar === "string" ? src.avatar : "";
	if (avatar) assertData(avatar, "image");
	const site = text(src.siteUrl, 200);
	if (site && !/^https:\/\/[^\s]+$/i.test(site)) throw new Error("Site must be an https link.");
	const handle = text(src.xHandle, 40).replace(/^@/, "");
	if (handle && !/^[A-Za-z0-9_]{1,40}$/.test(handle)) throw new Error("That X handle is not valid.");
	const wallet = text(src.wallet, 80);
	if (wallet && !/^0x[a-fA-F0-9]{40}$/.test(wallet)) throw new Error("That is not an Ethereum address.");
	const phone = text(src.phone, 20);
	const digits = phone.replace(/\D/g, "");
	if (phone && (digits.length < 10 || digits.length > 11)) throw new Error("Enter a 10-digit US phone number.");
	const region = text(src.region, 2).toUpperCase();
	if (region && !/^[A-Z]{2}$/.test(region)) throw new Error("Choose a US state.");
	const postal = text(src.postalCode, 10);
	if (postal && !/^\d{5}(-\d{4})?$/.test(postal)) throw new Error("Enter a 5-digit ZIP code.");
	return {
		username,
		displayName,
		bio: text(src.bio, 600),
		city: text(src.city, 80),
		phone,
		region,
		postalCode: postal,
		siteUrl: site,
		xHandle: handle,
		avatar,
		clearAvatar: src.clearAvatar === true,
		wallet
	};
}).handler(createSsrRpc("1d6d86ff86e2dbc1348ef0314afe674b237453a8e602261e61388bcb26136d0b"));
var toggleFavorite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("e2e8428f8387e47ae1a158f3ad5be084a63e0d0868c6d463961cbe0e6c7a5154"));
var mintWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const title = text(src.title, 80);
	if (title.length < 1) throw new Error("Give the work a title.");
	const description = text(src.description, 2e3);
	const category = text(src.category, 40);
	if (!category) throw new Error("Pick a category.");
	const royalty = Number(src.royaltyPct);
	if (!Number.isFinite(royalty) || royalty < 0 || royalty > 10) throw new Error("Royalty must be between 0 and 10%.");
	const mediaKind = src.mediaKind === "video" || src.mediaKind === "audio" ? src.mediaKind : "image";
	const imageData = typeof src.imageData === "string" ? src.imageData : "";
	assertData(imageData, "image");
	const mediaData = typeof src.mediaData === "string" && src.mediaData ? src.mediaData : null;
	if (mediaKind !== "image") {
		if (!mediaData) throw new Error("Add the video or audio file.");
		assertData(mediaData, mediaKind);
	}
	const listKind = src.listKind === "fixed" || src.listKind === "auction" ? src.listKind : "none";
	const price = listKind === "none" ? null : posAmount(src.price, "Price");
	const hours = Number(src.endsInHours ?? 24);
	if (listKind === "auction" && (!Number.isFinite(hours) || hours < 1 || hours > 336)) throw new Error("Auctions run from 1 to 336 hours.");
	return {
		title,
		description,
		category,
		royaltyBps: Math.round(royalty * 100),
		mediaKind,
		imageData,
		mediaData: mediaKind === "image" ? null : mediaData,
		listKind,
		price,
		hours: listKind === "auction" ? Math.round(hours) : null
	};
}).handler(createSsrRpc("061e28896f030a55c6366f1de014f12db2ac9413e31a6d3543ddab6599b5a46e"));
var listWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const kind = src.kind === "auction" ? "auction" : "fixed";
	const hours = Number(src.endsInHours ?? 24);
	if (kind === "auction" && (!Number.isFinite(hours) || hours < 1 || hours > 336)) throw new Error("Auctions run from 1 to 336 hours.");
	return {
		artworkId: intId(src.artworkId),
		kind,
		price: posAmount(src.price, "Price"),
		hours: Math.round(hours)
	};
}).handler(createSsrRpc("afba91369f21ff181a4e3273dfd19b743903bd3c57c1efe6a7fc4f5951f1e5d0"));
var buyListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("8921579bed4b158008145af61d7ef4187564f07e79e3765a8cf5c1dbe0572071"));
var placeBid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	return {
		listingId: intId(src.listingId),
		amount: posAmount(src.amount, "Bid")
	};
}).handler(createSsrRpc("90adb195c97d20e2b738b064d375672952be407fee63cf8b10388df5195db0f7"));
var makeOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	return {
		artworkId: intId(src.artworkId),
		amount: posAmount(src.amount, "Offer")
	};
}).handler(createSsrRpc("21d794f47730e4f3a5a8d314deb04735837b81c7d5fcbd2e1bd59b87617412b1"));
var withdrawOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("5ebd0523330cf07d1888762b5dfd6319588f0b21cbea94fbaf74e73d9744dd45"));
var acceptOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("e9a156f78d6db0debfcbe7baf819faa7126cb91a85189211ed4249af352334b4"));
var rejectOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("008eb50db9c4be6edc6a3c1246a6b008c29e9d5030c9b005ed2d52c6497883e6"));
var cancelMyListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("6737ea3418e25ec0cf6941983bbe7242b0b05e07dd513ad42acb0aee8c825346"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a257b0578733cd4af80c05e81105e53df57c9576e0af6ac4db26df74817ff6f7"));
var searchStudios = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => text(input, 40)).handler(createSsrRpc("3dea1ba68c5cfe5778cce461113c1b72a7a5d5358a07d81a6daa224476e43a06"));
var registerDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => posAmount(input, "Deposit")).handler(createSsrRpc("c5a84f0287e89fd63c37cf430fe633181ea7779d9e99ee6bb7f240a37f62fd70"));
var getDeposits = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("dce0439c090542fc6943139f86515966d4fdd91216b761c4ccdc4d7beccb3e6b"));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const destination = text(src.destination, 80);
	if (!/^0x[a-fA-F0-9]{40}$/.test(destination)) throw new Error("Enter a valid Ethereum address.");
	const confirmEmail = text(src.confirmEmail, 200).toLowerCase();
	return {
		amount: posAmount(src.amount, "Withdrawal"),
		destination,
		confirmEmail
	};
}).handler(createSsrRpc("b6e7e02ba66f4d3aa4b577ec364388d654a2b26c5ec16af824d3775fe53f5d42"));
var getWithdrawals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3f27edea00258b3f677e4712d0916c976a1f48e7e9c3a94064d07ae7c014de50"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("82fa1cfc7f470b282ce3dc88ddce4b8038217da395ed9c6c66276efacaa1d095"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("01bfa81b667606bbebc32357ef6926d69821dee4320fa5047e8666f1c66dc26b"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => text(input, 80)).handler(createSsrRpc("0133856b202e5db78e4a97bec6b4296c69ffb1b17edb4bc339aae9f9162d7a26"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const username = text(src.username, 24).toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username is not valid.");
	const displayName = text(src.displayName, 80);
	if (!displayName) throw new Error("Name is required.");
	const role = src.role === "admin" || src.role === "catalog" || src.role === "user" ? src.role : "user";
	const status = src.status === "suspended" || src.status === "banned" || src.status === "deleted" || src.status === "active" ? src.status : "active";
	const email = text(src.email, 200);
	const avatar = text(src.avatarUrl, 4e5);
	if (avatar.startsWith("data:")) assertData(avatar, "image");
	return {
		userId: text(src.userId, 120),
		username,
		displayName,
		bio: text(src.bio, 600),
		city: text(src.city, 80),
		email,
		avatar,
		wallet: text(src.wallet, 80),
		siteUrl: text(src.siteUrl, 200),
		xHandle: text(src.xHandle, 40).replace(/^@/, ""),
		role,
		status
	};
}).handler(createSsrRpc("54a3eeda593532857eeeffb8a7c92dd7f15726a5203e288714dbe623b9e1061c"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const reason = text(src.reason, 240);
	if (reason.length < 3) throw new Error("A reason is required.");
	const n = Number(src.balance);
	if (!Number.isFinite(n) || n < 0 || n > 1e6) throw new Error("Balance is not valid.");
	return {
		userId: text(src.userId, 120),
		balance: n.toFixed(6),
		reason
	};
}).handler(createSsrRpc("677e48a6c6a71be9266ae9a70b8dee0dace33bea8d739e4f596275281012b9aa"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const password = typeof src.password === "string" ? src.password : "";
	if (password.length < 8 || password.length > 72) throw new Error("Password must be 8–72 characters.");
	return {
		userId: text(src.userId, 120),
		password
	};
}).handler(createSsrRpc("ea661934dab77a6aaa7d87521d85cf2955510513def52f43d258211f97943267"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1fdf96c243d4441cad639837ea2a58da4cd52548117ad7904f0c84d12d000df5"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const action = src.action === "hide" || src.action === "remove" || src.action === "restore" || src.action === "feature" ? src.action : null;
	if (!action) throw new Error("Unknown action.");
	return {
		artworkId: intId(src.artworkId),
		action,
		featured: src.featured === true
	};
}).handler(createSsrRpc("5ffd786ea725c95ca1e030fc9d3939468a80fa53571de272ac898c26e50a5fcb"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7786f781ed50e08d9b81e5fbf8fb2bdf6a0da37afe1e8ba64b5b2af30b75f521"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("03b5f5aa65280abbb765af48297c4062e7e1df2a237a5048042f112f16627aa7"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const feeBps = Number(src.platformFeePct) * 100;
	const mintFee = Number(src.mintFee);
	const minW = Number(src.minWithdrawal);
	const conf = Number(src.confirmations);
	const auto = Number(src.autoApproveUnder);
	const hot = Number(src.hotWallet);
	const alert = Number(src.hotAlert);
	const network = Number(src.networkFee);
	const title = text(src.featuredTitle, 60);
	const galleryName = text(src.galleryName, 60);
	const tagline = text(src.tagline, 160);
	if (![
		feeBps,
		mintFee,
		minW,
		conf,
		auto,
		hot,
		alert,
		network
	].every((n) => Number.isFinite(n))) throw new Error("Settings contain an invalid number.");
	if (feeBps < 0 || feeBps > 2e3) throw new Error("Platform fee must be between 0 and 20%.");
	if (mintFee < 0 || mintFee > 10) throw new Error("Mint fee looks wrong.");
	if (conf < 1 || conf > 64) throw new Error("Confirmations must be 1–64.");
	if (!title) throw new Error("Name the featured collection.");
	if (galleryName.length < 2) throw new Error("Name the gallery.");
	return {
		feeBps: Math.round(feeBps),
		mintFee: mintFee.toFixed(6),
		minW: minW.toFixed(6),
		conf: Math.round(conf),
		auto: auto.toFixed(6),
		hot: hot.toFixed(6),
		alert: alert.toFixed(6),
		network: network.toFixed(6),
		title,
		galleryName,
		tagline
	};
}).handler(createSsrRpc("17c7640d4a16ab7343279032c12888e3a23f6829f06872e8b3aad8ed88737c22"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const name = text(input, 40);
	if (name.length < 2) throw new Error("Category name is too short.");
	return name;
}).handler(createSsrRpc("fba86b414fec579c5946b5620d6214d7453dccd30ac0c1268b394c1f32055e8c"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("47fd3b41dba1518ab331393a5558f32a7c067f4d118a3ecebc6a3ddae9197fd0"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bd16b8e6bc29ea6625462a2661d69926695c395a984245fc40469821f85cdd4b"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const decision = src.decision === "approve" || src.decision === "reject" ? src.decision : null;
	if (!decision) throw new Error("Choose approve or reject.");
	const txHashIn = text(src.txHash, 80);
	if (txHashIn && !/^0x[a-fA-F0-9]{64}$/.test(txHashIn)) throw new Error("Transaction hash must be 0x and 64 hex characters.");
	return {
		id: intId(src.id),
		decision,
		reason: text(src.reason, 240),
		txHash: txHashIn
	};
}).handler(createSsrRpc("e40e58f23ed60af2e2f4373f0f9f5179446e882278f5064c07849e663c895133"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("265a16da582d23e04c4c7c3d4024c252f020218e94873b5a0ebdfefb99995e14"));
var getCollection = createServerFn({ method: "GET" }).validator((input) => text(input, 60).toLowerCase()).handler(createSsrRpc("9bf5737d8c43dfdd8624a1080e62c1d63164ff039f78bd86594ae4cfaf4acb8e"));
var getWorkOffers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(createSsrRpc("e1c86aa2309ba6313132a7d61f38610fdaf14e3e6d4cc12a35fd8d52efdce6a6"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d60c783cc459731164e035a7e298ba5e67e202fcffaae5550d3dda79e4433ea0"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const name = text(src.name, 60);
	if (name.length < 2) throw new Error("Name the collection.");
	const ids = Array.isArray(src.artworkIds) ? src.artworkIds.map((id) => intId(id)).slice(0, 24) : [];
	return {
		name,
		blurb: text(src.blurb, 280),
		artworkIds: [...new Set(ids)]
	};
}).handler(createSsrRpc("3ae36125d2e30512a1c51a66d2ddaaefb78b79a3491a09d6620fd6d788072e6b"));
var submitContact = createServerFn({ method: "POST" }).validator((input) => {
	const src = input ?? {};
	const name = text(src.name, 80);
	const email = text(src.email, 200);
	const topic = text(src.topic, 40);
	const message = text(src.message, 2e3);
	if (name.length < 2) throw new Error("Enter your name.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
	if (![
		"Account",
		"Buying",
		"Selling",
		"Deposits",
		"Other"
	].includes(topic)) throw new Error("Choose a topic.");
	if (message.length < 10) throw new Error("Please write at least a short message.");
	return {
		name,
		email,
		topic,
		message
	};
}).handler(createSsrRpc("fcf395896484559c964641aa73e059f72911f550f58de5369dba6c4a3d282790"));
//#endregion
export { submitContact as C, withdrawOffer as E, searchStudios as S, updateMe as T, mintWork as _, getArtist as a, rejectOffer as b, getCollection as c, getHome as d, getMe as f, makeOffer as g, listWork as h, getActivity as i, getDashboard as l, getWorkOffers as m, buyListing as n, getArtwork as o, getWithdrawals as p, cancelMyListing as r, getCatalog as s, acceptOffer as t, getDeposits as u, placeBid as v, toggleFavorite as w, requestWithdrawal as x, registerDeposit as y };
