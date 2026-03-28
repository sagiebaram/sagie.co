import { NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';

type Handler<T> = (req: Request, body: T) => Promise<Response>;

export function withValidation<S extends ZodSchema>(
  schema: S,
  handler: Handler<z.infer<S>>
) {
  return async (req: Request): Promise<Response> => {
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
