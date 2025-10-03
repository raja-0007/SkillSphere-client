import { NextResponse } from 'next/server'

// Define your app routes (static + dynamic patterns)
const routes = [
  '/',
  '/teacher',
  '/cart',
  '/profile',
  '/learning',
  '/wishlist',
  '/coursesDetails/[...Ids]', // dynamic course details
  '/success/[...Ids]',        // dynamic success page
];

const publicRoutes = [
  '/',
  '/authentication/[type]',
  '/search-results',
  '/course-overview/[id]',
];

function isPublicRoute(pathname) {
  return publicRoutes.some(route => {
    if (route.includes('[')) {
      // Convert dynamic segments [id] -> [^/]+
      const regex = new RegExp('^' + route.replace(/\[.+?\]/g, '[^/]+') + '$');
      return regex.test(pathname);
    }
    return route === pathname;
  });
}

function isValidRoute(pathname) {
  return routes.some(route => {
    if (route.includes('[')) {
      // Convert dynamic segments [id] -> [^/]+
      const regex = new RegExp('^' + route.replace(/\[.+?\]/g, '[^/]+') + '$')
      return regex.test(pathname)
    }
    return route === pathname
  })
}

export function middleware(request) {
  const cookie = request.cookies.get('user')
  const user = cookie ? JSON.parse(cookie.value) : null
  const redirectUrl = request.cookies.get('redirectUrl')
  const currentPath = request.nextUrl.pathname

  // If user not logged in and visiting non-public route
  console.log('MIDDLEWARE>>>',  currentPath, request.url )
  if (!user && !isPublicRoute(currentPath)) {
    if (isValidRoute(currentPath)) {
      const response = NextResponse.redirect(new URL('/', request.url))
      // Save valid redirect url
      response.cookies.set('redirectUrl', currentPath, { path: '/' })
      return response
    }
    // Invalid route → just redirect to home (no cookie saved)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If logged in and trying to visit public routes (login/signup)
  // if (user && publicRoutes.includes(currentPath)) {
  //   if (redirectUrl && redirectUrl.value !== '/') {
  //     return NextResponse.redirect(new URL(redirectUrl.value, request.url))
  //   } else {
  //     return NextResponse.redirect(new URL('/dashboard', request.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|assets|images).*)',
  ],
}
