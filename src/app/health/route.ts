/**
 * `/health` — liveness/health check. Static segment, so it takes precedence
 * over the dynamic `/{text}` route.
 */
export async function GET() {
  return Response.json({ status: 'ok' });
}
