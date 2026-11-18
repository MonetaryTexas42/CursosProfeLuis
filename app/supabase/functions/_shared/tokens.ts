// Tokens de vinculación de alumnos (SEC-02).
//
// El token se entrega en claro una sola vez (enlace para la familia) y en la
// base solo queda su hash SHA-256. 32 bytes aleatorios dan 256 bits de entropía:
// adivinarlo por fuerza bruta no es viable, así que el canje no necesita
// límite de intentos por token.

export const LINK_TOKEN_TTL_HOURS = 72;

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

/** Genera un token de 32 bytes en base64url (43 caracteres). */
export function generateLinkToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

/** Comprueba el formato antes de calcular el hash. */
export function isLinkTokenFormat(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

/** Hash SHA-256 en hexadecimal, que es lo único que se guarda. */
export async function hashLinkToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Fecha de expiración a partir de ahora. */
export function linkTokenExpiry(now = new Date()): string {
  return new Date(now.getTime() + LINK_TOKEN_TTL_HOURS * 60 * 60 * 1000)
    .toISOString();
}
