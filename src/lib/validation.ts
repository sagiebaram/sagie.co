import { NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';

type Handler<T> = (req: Request, body: T) => Promise<Response>;

type RateEntry = { count: number; firstHit: number }
const rateStore = new Map<string, RateEntry>()
const RATE_LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() ?? 'unknown'
}

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateStore.get(ip)
  if (!entry || now - entry.firstHit > WINDOW_MS) {
    rateStore.set(ip, { count: 1, firstHit: now })
    return { limited: false, retryAfter: 0 }
  }
  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.firstHit)) / 1000)
    return { limited: true, retryAfter }
  }
  entry.count++
  return { limited: false, retryAfter: 0 }
}

export function withValidation<S extends ZodSchema>(
  schema: S,
  handler: Handler<z.infer<S>>
) {
  return async (req: Request): Promise<Response> => {
    const ip = getIP(req)
    const { limited, retryAfter } = isRateLimited(ip)
    if (limited) {
      return NextResponse.json(
        { error: "You've submitted several times recently. Please wait a few minutes before trying again." },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    // Honeypot check — bots fill hidden field
    const body = raw as Record<string, unknown>;
    const honeypot = body._trap;
    const loadTime = Number(body._t ?? 0);
    const elapsed = Date.now() - loadTime;

    if (honeypot) {
      return Response.json({ ok: true }, { status: 200 });
    }

    if (elapsed < 3000) {
      return Response.json({ ok: true }, { status: 200 });
    }

    const result = schema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.') || '_';
        fieldErrors[path] = [...(fieldErrors[path] ?? []), issue.message];
      }
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors },
        { status: 422 }
      );
    }

    return handler(req, result.data);
  };
}
