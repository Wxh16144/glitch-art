import { NextRequest } from 'next/server';
import ejs from 'ejs'
import svgTemplate from '@/shared/template/simple.ejs';
import { merge } from '@/shared/util';
import prepare from '@/shared/prepare';
import { DEFAULT_OPTIONS } from '@/shared/constants';

// Compile once at module scope, render per-request
const render = ejs.compile(svgTemplate);

export async function GET(req: NextRequest) {

  try {
    const mergedOptions = merge(
      DEFAULT_OPTIONS,
      Object.fromEntries(req.nextUrl.searchParams)
    )

    const realOptions = await prepare(mergedOptions)

    const view = render(realOptions)

    return new Response(view, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    })
  }
  catch (error: any) {
    return new Response(
      `[Server Error]`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'X-Error': error?.message ?? 'Unknown Error',
        },
      })
  }
}