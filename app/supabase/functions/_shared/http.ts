// SEC-05: cada entorno declara su origen exacto en ALLOWED_ORIGIN.
// Ejemplo: ALLOWED_ORIGIN=https://monetarytexas42.github.io
// Se admite una lista separada por comas, pero la respuesta CORS usa el
// primero: configura un solo origen por entorno. `*` queda reservado para
// pruebas locales explícitas y no debe usarse en staging ni producción.
const allowedOrigins = (Deno.env.get("ALLOWED_ORIGIN") ?? "")
  .split(",")
  .map((value) => value.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const responseOrigin = allowedOrigins[0] ?? "*";

export const corsHeaders = {
  "Access-Control-Allow-Origin": responseOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function errorResponse(status: number, message: string, details?: unknown): Response {
  return jsonResponse({ error: message, details }, status);
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function handleError(error: unknown): Response {
  if (error instanceof HttpError) {
    return errorResponse(error.status, error.message, error.details);
  }

  console.error(
    "edge_function_error",
    error instanceof Error ? error.message : "error desconocido",
  );
  return errorResponse(500, "Error interno");
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  let value: unknown;
  try {
    value = await req.json();
  } catch {
    throw new HttpError(400, "El cuerpo debe ser JSON válido");
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new HttpError(400, "El cuerpo debe ser un objeto JSON");
  }

  return value as Record<string, unknown>;
}

function isAllowedOrigin(origin: string): boolean {
  const candidate = origin.replace(/\/+$/, "");
  return allowedOrigins.some((allowed) => allowed === "*" || allowed === candidate);
}

/**
 * SEC-05: rechaza cualquier petición de navegador cuyo Origin no esté en la
 * lista del entorno. Las peticiones sin `Origin` (health checks, scripts de
 * prueba servidor a servidor) siguen funcionando: CORS solo protege a los
 * navegadores, y esos clientes no pueden suplantar el origen de uno.
 */
export function assertAllowedOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");

  if (!origin) return null;

  if (allowedOrigins.length === 0 || !isAllowedOrigin(origin)) {
    console.warn("cors_origin_rejected", origin.slice(0, 200));
    return errorResponse(403, "Origen no permitido");
  }

  return null;
}

export function handleOptions(req: Request): Response | null {
  // Se valida antes del preflight y antes del POST: las nueve funciones llaman
  // a este helper como primera instrucción.
  const denied = assertAllowedOrigin(req);
  if (denied) return denied;

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse(405, "Método no permitido");
  }

  return null;
}

export function requestContext(req: Request): {
  ip: string | null;
  userAgent: string | null;
} {
  const ip = parseIp(req.headers.get("x-forwarded-for"));
  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;
  return { ip, userAgent };
}

function parseIp(value: string | null): string | null {
  if (!value) return null;

  const candidate = value.split(",")[0]?.trim();
  if (!candidate) return null;

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(candidate)) {
    return candidate;
  }

  if (/^[0-9a-fA-F:.]{3,64}$/.test(candidate) && candidate.includes(":")) {
    return candidate;
  }

  return null;
}
