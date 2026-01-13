import { hasPagePermission } from '@/lib/permissions';
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

const privateRoutes = [
  '/teacher'
]

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
  const access_token = request.cookies.get('accessToken');
  const redirectUrl = request.cookies.get('redirectUrl')
  const currentPath = request.nextUrl.pathname
  
  // console.log('Middleware check:', { 
  //   hasUser: !!user, 
  //   hasToken: !!access_token, 
  //   currentPath,
  //   isPublic: isPublicRoute(currentPath)
  // })

  // If user not logged in and visiting non-public route
  if ((!user || !access_token) && !isPublicRoute(currentPath)) {
    if (isValidRoute(currentPath)) {
      const response = NextResponse.redirect(new URL('/authentication/login', request.url))
      // Save valid redirect url
      response.cookies.set('redirectUrl', currentPath, { path: '/' })
      return response
    }
    // Invalid route → redirect to login
    console.log('not login, redirect to /authentication/login')
    return NextResponse.redirect(new URL('/authentication/login', request.url))
  }
  else if (user && access_token && currentPath === '/') {
    // If logged in and trying to visit home page, redirect to dashboard
    console.log('logged in and /, redirecting to /learning')
    return NextResponse.redirect(new URL('/learning', request.url))
  } 
  else if (user && access_token && currentPath.startsWith('/authentication')) {
    // If logged in and trying to visit authentication pages
    console.log("logged in and auth page")
    if (redirectUrl && redirectUrl.value !== '/') {
      const response = NextResponse.redirect(new URL(redirectUrl.value, request.url))
      response.cookies.delete('redirectUrl')
      return response
    } else {
      return NextResponse.redirect(new URL('/learning', request.url))
    }
  }
  else if(user && access_token && privateRoutes.includes(currentPath)){
    console.log('new validation')
    if(hasPagePermission(currentPath, 'R', user)) return NextResponse.next()
      else return NextResponse.redirect(new URL('/learning', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|assets|images).*)',
  ],
}