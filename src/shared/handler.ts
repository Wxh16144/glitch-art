import ejs from 'ejs';
import templateStr from '@/shared/template/simple.ejs';
import { parseQuery } from './params';
import prepare from './prepare';
import { RequestError } from './validator';
import { CACHE_CONTROL, ERROR_CACHE_CONTROL } from './constants';

// Compile once at module scope; render per request.
const render = ejs.compile(templateStr);

const errorResponse = (status: number, message: string) =>
  new Response(`[Server Error]`, {
    status,
    headers: {
      'Content-Type': 'text/plain',
      'X-Error': message,
      'Cache-Control': ERROR_CACHE_CONTROL,
    },
  });

/**
 * Shared SVG pipeline for the `/{text}` route:
 * parse (aliases + validation) → prepare (font fetch/cache + smart layout)
 * → render. Returns a fully-typed Response with caching headers.
 */
export const renderSvg = async (searchParams: URLSearchParams, pathText?: string): Promise<Response> => {
  try {
    const { options, warnings } = parseQuery(searchParams, pathText);
    const realOptions = await prepare(options);
    const view = render(realOptions);

    const headers: Record<string, string> = {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': CACHE_CONTROL,
    };
    if (warnings.length > 0) {
      headers['X-Warning'] = warnings.join('; ');
    }

    return new Response(view, { status: 200, headers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Error';
    return errorResponse(error instanceof RequestError ? 400 : 500, message);
  }
};
