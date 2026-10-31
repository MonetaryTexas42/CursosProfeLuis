import { HttpError } from "./http.ts";

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrador",
  "alumno",
  "ecoems",
  "profesor",
  "profesora",
  "root",
  "soporte",
  "sistema",
  "staff",
  "tutor",
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{6}$/i;

export function asString(
  value: unknown,
  field: string,
  minLength = 1,
  maxLength = 400,
): string {
  if (typeof value !== "string") {
    throw new HttpError(400, `${field} debe ser texto`);
  }

  const normalized = value.trim();
  if (normalized.length < minLength || normalized.length > maxLength) {
    throw new HttpError(
      400,
      `${field} debe tener entre ${minLength} y ${maxLength} caracteres`,
    );
  }

  return normalized;
}

export function optionalString(
  value: unknown,
  field: string,
  maxLength = 400,
): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return asString(value, field, 1, maxLength);
}

export function asUuid(value: unknown, field: string): string {
  const normalized = asString(value, field, 1, 64);
  if (!UUID_PATTERN.test(normalized)) {
    throw new HttpError(400, `${field} no es un UUID válido`);
  }

  return normalized;
}

export function asBoolean(
  value: unknown,
  field: string,
  defaultValue = false,
): boolean {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value !== "boolean") {
    throw new HttpError(400, `${field} debe ser booleano`);
  }

  return value;
}

export function asEmail(value: unknown, field = "email"): string {
  const email = asString(value, field, 5, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, `${field} no es un correo válido`);
  }

  return email;
}

export function asDate(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") return null;

  const date = asString(value, field, 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new HttpError(400, `${field} debe tener formato YYYY-MM-DD`);
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpError(400, `${field} no es una fecha válida`);
  }

  return date;
}

export function normalizeUsername(value: unknown): string {
  const username = asString(value, "username", 3, 32).toLowerCase();

  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) {
    throw new HttpError(
      400,
      "El usuario debe iniciar con letra o número y usar solo a-z, 0-9, punto, guion o guion bajo",
    );
  }

  if (RESERVED_USERNAMES.has(username)) {
    throw new HttpError(400, "Ese nombre de usuario está reservado");
  }

  return username;
}

export function studentEmail(username: string): string {
  const configuredDomain =
    Deno.env.get("STUDENT_EMAIL_DOMAIN")?.trim().toLowerCase() ||
    "alumnos.ecoems.mx";

  if (!/^[a-z0-9.-]+$/.test(configuredDomain)) {
    throw new HttpError(500, "STUDENT_EMAIL_DOMAIN no es válido");
  }

  return `${username}@${configuredDomain}`;
}

export function randomPassword(length = 14): string {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function asMetadata(value: unknown): Record<string, unknown> {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "metadata debe ser un objeto JSON");
  }

  return value as Record<string, unknown>;
}
