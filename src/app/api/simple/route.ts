import { NextRequest } from 'next/server';
import template from 'art-template'
import svgTemplate from '@/shared/template/simple.art';
import { merge } from '@/shared/util';
import prepare from '@/shared/prepare';
import { DEFAULT_OPTIONS } from '@/shared/constants';

export async function GET(req: NextRequest) {

  try {
    const mergedOptions = merge(
      DEFAULT_OPTIONS,
      Object.fromEntries(req.nextUrl.searchParams)
    )

    const realOptions = await prepare(mergedOptions)

    const view = template.render(
      svgTemplate,
      realOptions
    )

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