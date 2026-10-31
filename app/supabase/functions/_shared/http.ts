const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

export const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
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

export function handleOptions(req: Request): Response | null {
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
