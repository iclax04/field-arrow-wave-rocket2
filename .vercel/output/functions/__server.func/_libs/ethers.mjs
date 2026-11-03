import { r as __exportAll } from "../_runtime.mjs";
import { t as keccak_256 } from "./noble__hashes.mjs";
//#region node_modules/ethers/lib.esm/_version.js
/**
*  The current version of Ethers.
*/
var version = "6.17.0";
//#endregion
//#region node_modules/ethers/lib.esm/utils/properties.js
/**
*  Property helper functions.
*
*  @_subsection api/utils:Properties  [about-properties]
*/
function checkType(value, type, name) {
	const types = type.split("|").map((t) => t.trim());
	for (let i = 0; i < types.length; i++) switch (type) {
		case "any": return;
		case "bigint":
		case "boolean":
		case "number":
		case "string": if (typeof value === type) return;
	}
	const error = /* @__PURE__ */ new Error(`invalid value for type ${type}`);
	error.code = "INVALID_ARGUMENT";
	error.argument = `value.${name}`;
	error.value = value;
	throw error;
}
/**
*  Assigns the %%values%% to %%target%% as read-only values.
*
*  It %%types%% is specified, the values are checked.
*/
function defineProperties(target, values, types) {
	for (let key in values) {
		let value = values[key];
		const type = types ? types[key] : null;
		if (type) checkType(value, type, key);
		Object.defineProperty(target, key, {
			enumerable: true,
			value,
			writable: false
		});
	}
}
//#endregion
//#region node_modules/ethers/lib.esm/utils/errors.js
/**
*  All errors in ethers include properties to ensure they are both
*  human-readable (i.e. ``.message``) and machine-readable (i.e. ``.code``).
*
*  The [[isError]] function can be used to check the error ``code`` and
*  provide a type guard for the properties present on that error interface.
*
*  @_section: api/utils/errors:Errors  [about-errors]
*/
function stringify(value, seen) {
	if (value == null) return "null";
	if (seen == null) seen = /* @__PURE__ */ new Set();
	if (typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
	}
	if (Array.isArray(value)) return "[ " + value.map((v) => stringify(v, seen)).join(", ") + " ]";
	if (value instanceof Uint8Array) {
		const HEX = "0123456789abcdef";
		let result = "0x";
		for (let i = 0; i < value.length; i++) {
			result += HEX[value[i] >> 4];
			result += HEX[value[i] & 15];
		}
		return result;
	}
	if (typeof value === "object" && typeof value.toJSON === "function") return stringify(value.toJSON(), seen);
	switch (typeof value) {
		case "boolean":
		case "number":
		case "symbol": return value.toString();
		case "bigint": return BigInt(value).toString();
		case "string": return JSON.stringify(value);
		case "object": {
			const keys = Object.keys(value);
			keys.sort();
			return "{ " + keys.map((k) => `${stringify(k, seen)}: ${stringify(value[k], seen)}`).join(", ") + " }";
		}
	}
	return `[ COULD NOT SERIALIZE ]`;
}
/**
*  Returns a new Error configured to the format ethers emits errors, with
*  the %%message%%, [[api:ErrorCode]] %%code%% and additional properties
*  for the corresponding EthersError.
*
*  Each error in ethers includes the version of ethers, a
*  machine-readable [[ErrorCode]], and depending on %%code%%, additional
*  required properties. The error message will also include the %%message%%,
*  ethers version, %%code%% and all additional properties, serialized.
*/
function makeError(message, code, info) {
	let shortMessage = message;
	{
		const details = [];
		if (info) {
			if ("message" in info || "code" in info || "name" in info) throw new Error(`value will overwrite populated values: ${stringify(info)}`);
			for (const key in info) {
				if (key === "shortMessage") continue;
				const value = info[key];
				details.push(key + "=" + stringify(value));
			}
		}
		details.push(`code=${code}`);
		details.push(`version=${version}`);
		if (details.length) message += " (" + details.join(", ") + ")";
	}
	let error;
	switch (code) {
		case "INVALID_ARGUMENT":
			error = new TypeError(message);
			break;
		case "NUMERIC_FAULT":
		case "BUFFER_OVERRUN":
			error = new RangeError(message);
			break;
		default: error = new Error(message);
	}
	defineProperties(error, { code });
	if (info) Object.assign(error, info);
	if (error.shortMessage == null) defineProperties(error, { shortMessage });
	return error;
}
/**
*  Throws an EthersError with %%message%%, %%code%% and additional error
*  %%info%% when %%check%% is falsish..
*
*  @see [[api:makeError]]
*/
function assert(check, message, code, info) {
	if (!check) throw makeError(message, code, info);
}
/**
*  A simple helper to simply ensuring provided arguments match expected
*  constraints, throwing if not.
*
*  In TypeScript environments, the %%check%% has been asserted true, so
*  any further code does not need additional compile-time checks.
*/
function assertArgument(check, message, name, value) {
	assert(check, message, "INVALID_ARGUMENT", {
		argument: name,
		value
	});
}
[
	"NFD",
	"NFC",
	"NFKD",
	"NFKC"
].reduce((accum, form) => {
	try {
		/* c8 ignore start */
		if ("test".normalize(form) !== "test") throw new Error("bad");
		/* c8 ignore stop */
		if (form === "NFD") {
			/* c8 ignore start */
			if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw new Error("broken");
		}
		accum.push(form);
	} catch (error) {}
	return accum;
}, []);
//#endregion
//#region node_modules/ethers/lib.esm/utils/data.js
/**
*  Some data helpers.
*
*
*  @_subsection api/utils:Data Helpers  [about-data]
*/
function _getBytes(value, name, copy) {
	if (value instanceof Uint8Array) {
		if (copy) return new Uint8Array(value);
		return value;
	}
	if (typeof value === "string" && value.length % 2 === 0 && value.match(/^0x[0-9a-f]*$/i)) {
		const result = new Uint8Array((value.length - 2) / 2);
		let offset = 2;
		for (let i = 0; i < result.length; i++) {
			result[i] = parseInt(value.substring(offset, offset + 2), 16);
			offset += 2;
		}
		return result;
	}
	assertArgument(false, "invalid BytesLike value", name || "value", value);
}
/**
*  Get a typed Uint8Array for %%value%%. If already a Uint8Array
*  the original %%value%% is returned; if a copy is required use
*  [[getBytesCopy]].
*
*  @see: getBytesCopy
*/
function getBytes(value, name) {
	return _getBytes(value, name, false);
}
var HexCharacters = "0123456789abcdef";
/**
*  Returns a [[DataHexString]] representation of %%data%%.
*/
function hexlify(data) {
	const bytes = getBytes(data);
	let result = "0x";
	for (let i = 0; i < bytes.length; i++) {
		const v = bytes[i];
		result += HexCharacters[(v & 240) >> 4] + HexCharacters[v & 15];
	}
	return result;
}
//#endregion
//#region node_modules/ethers/lib.esm/crypto/keccak.js
/**
*  Cryptographic hashing functions
*
*  @_subsection: api/crypto:Hash Functions [about-crypto-hashing]
*/
var locked = false;
var _keccak256 = function(data) {
	return keccak_256(data);
};
var __keccak256 = _keccak256;
/**
*  Compute the cryptographic KECCAK256 hash of %%data%%.
*
*  The %%data%% **must** be a data representation, to compute the
*  hash of UTF-8 data use the [[id]] function.
*
*  @returns DataHexstring
*  @example:
*    keccak256("0x")
*    //_result:
*
*    keccak256("0x1337")
*    //_result:
*
*    keccak256(new Uint8Array([ 0x13, 0x37 ]))
*    //_result:
*
*    // Strings are assumed to be DataHexString, otherwise it will
*    // throw. To hash UTF-8 data, see the note above.
*    keccak256("Hello World")
*    //_error:
*/
function keccak256(_data) {
	const data = getBytes(_data, "data");
	return hexlify(__keccak256(data));
}
keccak256._ = _keccak256;
keccak256.lock = function() {
	locked = true;
};
keccak256.register = function(func) {
	if (locked) throw new TypeError("keccak256 is locked");
	__keccak256 = func;
};
Object.freeze(keccak256);
//#endregion
//#region node_modules/ethers/lib.esm/address/address.js
var BN_0 = BigInt(0);
var BN_36 = BigInt(36);
function getChecksumAddress(address) {
	address = address.toLowerCase();
	const chars = address.substring(2).split("");
	const expanded = /* @__PURE__ */ new Uint8Array(40);
	for (let i = 0; i < 40; i++) expanded[i] = chars[i].charCodeAt(0);
	const hashed = getBytes(keccak256(expanded));
	for (let i = 0; i < 40; i += 2) {
		if (hashed[i >> 1] >> 4 >= 8) chars[i] = chars[i].toUpperCase();
		if ((hashed[i >> 1] & 15) >= 8) chars[i + 1] = chars[i + 1].toUpperCase();
	}
	return "0x" + chars.join("");
}
var ibanLookup = {};
for (let i = 0; i < 10; i++) ibanLookup[String(i)] = String(i);
for (let i = 0; i < 26; i++) ibanLookup[String.fromCharCode(65 + i)] = String(10 + i);
var safeDigits = 15;
function ibanChecksum(address) {
	address = address.toUpperCase();
	address = address.substring(4) + address.substring(0, 2) + "00";
	let expanded = address.split("").map((c) => {
		return ibanLookup[c];
	}).join("");
	while (expanded.length >= safeDigits) {
		let block = expanded.substring(0, safeDigits);
		expanded = parseInt(block, 10) % 97 + expanded.substring(block.length);
	}
	let checksum = String(98 - parseInt(expanded, 10) % 97);
	while (checksum.length < 2) checksum = "0" + checksum;
	return checksum;
}
var Base36 = (function() {
	const result = {};
	for (let i = 0; i < 36; i++) {
		const key = "0123456789abcdefghijklmnopqrstuvwxyz"[i];
		result[key] = BigInt(i);
	}
	return result;
})();
function fromBase36(value) {
	value = value.toLowerCase();
	let result = BN_0;
	for (let i = 0; i < value.length; i++) result = result * BN_36 + Base36[value[i]];
	return result;
}
/**
*  Returns a normalized and checksumed address for %%address%%.
*  This accepts non-checksum addresses, checksum addresses and
*  [[getIcapAddress]] formats.
*
*  The checksum in Ethereum uses the capitalization (upper-case
*  vs lower-case) of the characters within an address to encode
*  its checksum, which offers, on average, a checksum of 15-bits.
*
*  If %%address%% contains both upper-case and lower-case, it is
*  assumed to already be a checksum address and its checksum is
*  validated, and if the address fails its expected checksum an
*  error is thrown.
*
*  If you wish the checksum of %%address%% to be ignore, it should
*  be converted to lower-case (i.e. ``.toLowercase()``) before
*  being passed in. This should be a very rare situation though,
*  that you wish to bypass the safegaurds in place to protect
*  against an address that has been incorrectly copied from another
*  source.
*
*  @example:
*    // Adds the checksum (via upper-casing specific letters)
*    getAddress("0x8ba1f109551bd432803012645ac136ddd64dba72")
*    //_result:
*
*    // Converts ICAP address and adds checksum
*    getAddress("XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36");
*    //_result:
*
*    // Throws an error if an address contains mixed case,
*    // but the checksum fails
*    getAddress("0x8Ba1f109551bD432803012645Ac136ddd64DBA72")
*    //_error:
*/
function getAddress(address) {
	assertArgument(typeof address === "string", "invalid address", "address", address);
	if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
		if (!address.startsWith("0x")) address = "0x" + address;
		const result = getChecksumAddress(address);
		assertArgument(!address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) || result === address, "bad address checksum", "address", address);
		return result;
	}
	if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
		assertArgument(address.substring(2, 4) === ibanChecksum(address), "bad icap checksum", "address", address);
		let result = fromBase36(address.substring(4)).toString(16);
		while (result.length < 40) result = "0" + result;
		return getChecksumAddress("0x" + result);
	}
	assertArgument(false, "invalid address", "address", address);
}
//#endregion
//#region node_modules/ethers/lib.esm/index.js
var lib_esm_exports = /* @__PURE__ */ __exportAll({
	EtherSymbol: () => "Ξ",
	MessagePrefix: () => MessagePrefix,
	ZeroAddress: () => ZeroAddress,
	ZeroHash: () => ZeroHash,
	defaultPath: () => defaultPath,
	getAddress: () => getAddress,
	version: () => version
});
//#endregion
export { lib_esm_exports as t };
