import { NextRequest } from 'next/server';
import { renderSvg } from '@/shared/handler';

/**
 * `/{text}` — text lives in the path, options via short query aliases
 * (`fs`, `w`, `h`, `c1`, `c2`, `bg`, `fw`, `font`) or legacy `?word=`.
 *
 * Static segments (`/health`, `/favicon.ico`, …) and `/` take precedence over
 * this dynamic segment, so those literal words keep their own handlers.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ text: string }> }
) {
  const { text } = await params;
  return renderSvg(req.nextUrl.searchParams, text);
}
