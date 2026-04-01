/**
 * Passkey configuration helper
 *
 * Extracts passkey configuration from the request URL or the ORIGIN
 * environment variable. When running behind a reverse proxy (e.g. Docker
 * with Traefik/Nginx), request.url reflects the internal container URL
 * (http://localhost:4321) rather than the public URL. The ORIGIN env var
 * (also used by Astro's `site` config) provides the correct public URL
 * so that WebAuthn rpId and origin match what the browser sees.
 */

export interface PasskeyConfig {
	rpName: string;
	rpId: string;
	origin: string;
}

/**
 * Get passkey configuration from the ORIGIN env var or request URL
 *
 * @param url The request URL (fallback when ORIGIN is not set)
 * @param siteName Optional site name for rpName (defaults to hostname)
 */
export function getPasskeyConfig(url: URL, siteName?: string): PasskeyConfig {
	// Prefer ORIGIN env var for reverse proxy / Docker deployments
	const origin = process.env.ORIGIN;
	const resolvedUrl = origin ? new URL(origin) : url;

	return {
		rpName: siteName || resolvedUrl.hostname,
		rpId: resolvedUrl.hostname,
		origin: resolvedUrl.origin,
	};
}
