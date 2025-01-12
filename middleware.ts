import { type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'

const handleI18nRouting = createIntlMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
})

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  await supabase.auth.getUser()

  response.headers.set('x-current-path', request.nextUrl.pathname)

  // Add CORS headers only for CSS files
  if (request.nextUrl.pathname.endsWith('.css')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  // Handle OPTIONS method for preflight requests for CSS files
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.endsWith('.css')) {
    return new Response(null, { status: 204, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
    '/login',
    '/register',
    '/',
    '/(fr|en)/:path*',
    '/((?!_next|_vercel|api|copilot|auth|.*\\..*).*)',
  ],
}
