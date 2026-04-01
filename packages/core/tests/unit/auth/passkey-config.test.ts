import { describe, it, expect, afterEach } from "vitest";

import { getPasskeyConfig } from "../../../src/auth/passkey-config.js";

describe("passkey-config", () => {
	describe("getPasskeyConfig()", () => {
		it("extracts rpId from localhost URL", () => {
			const url = new URL("http://localhost:4321/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("localhost");
		});

		it("extracts rpId from production URL", () => {
			const url = new URL("https://example.com/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("example.com");
		});

		it("extracts rpId from subdomain URL", () => {
			const url = new URL("https://admin.example.com/dashboard");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("admin.example.com");
		});

		it("returns correct origin for http", () => {
			const url = new URL("http://localhost:4321/admin");
			const config = getPasskeyConfig(url);

			expect(config.origin).toBe("http://localhost:4321");
		});

		it("returns correct origin for https", () => {
			const url = new URL("https://example.com/admin");
			const config = getPasskeyConfig(url);

			expect(config.origin).toBe("https://example.com");
		});

		it("handles port numbers correctly", () => {
			const url = new URL("http://localhost:3000/setup");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("localhost");
			expect(config.origin).toBe("http://localhost:3000");
		});

		it("handles https with non-standard port", () => {
			const url = new URL("https://staging.example.com:8443/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("staging.example.com");
			expect(config.origin).toBe("https://staging.example.com:8443");
		});

		it("uses hostname as rpName by default", () => {
			const url = new URL("https://example.com/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpName).toBe("example.com");
		});

		it("uses provided siteName for rpName", () => {
			const url = new URL("https://example.com/admin");
			const config = getPasskeyConfig(url, "My Cool Site");

			expect(config.rpName).toBe("My Cool Site");
			expect(config.rpId).toBe("example.com");
		});

		it("ignores path and query params for origin", () => {
			const url = new URL("https://example.com:443/admin/setup?foo=bar#section");
			const config = getPasskeyConfig(url);

			// Standard https port 443 is omitted from origin
			expect(config.origin).toBe("https://example.com");
			expect(config.rpId).toBe("example.com");
		});
	});

	describe("ORIGIN env var override", () => {
		afterEach(() => {
			delete process.env.ORIGIN;
		});

		it("uses ORIGIN env var over request URL when set", () => {
			process.env.ORIGIN = "https://cms.example.com";
			const url = new URL("http://localhost:4321/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("cms.example.com");
			expect(config.origin).toBe("https://cms.example.com");
		});

		it("uses ORIGIN env var for rpName when no siteName provided", () => {
			process.env.ORIGIN = "https://cms.example.com";
			const url = new URL("http://localhost:4321/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpName).toBe("cms.example.com");
		});

		it("uses siteName for rpName even with ORIGIN env var", () => {
			process.env.ORIGIN = "https://cms.example.com";
			const url = new URL("http://localhost:4321/admin");
			const config = getPasskeyConfig(url, "My Site");

			expect(config.rpName).toBe("My Site");
			expect(config.rpId).toBe("cms.example.com");
		});

		it("falls back to request URL when ORIGIN is not set", () => {
			const url = new URL("http://localhost:4321/admin");
			const config = getPasskeyConfig(url);

			expect(config.rpId).toBe("localhost");
			expect(config.origin).toBe("http://localhost:4321");
		});
	});
});
