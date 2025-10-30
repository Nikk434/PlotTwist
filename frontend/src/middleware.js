import { NextResponse } from 'next/server';

export async function middleware(request) {
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');
  console.log("Enter the middleware");
  // console.log("AT ==",accessToken);
  // console.log("RT ==",refreshToken);  
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login') || 
                     request.nextUrl.pathname.startsWith('/auth/register') ||
                     request.nextUrl.pathname.startsWith('/unauth');

  
  // If no tokens and not on auth page, redirect to login
  if (!accessToken && !refreshToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/unauth', request.url));
  }
  
  // If has tokens and on auth page, redirect to dashboard/home
  if ((accessToken || refreshToken) && isAuthPage) {
    console.log("log statement");
    return NextResponse.redirect(new URL('/home', request.url));
    
  }
  
  // If only refresh token exists, try to refresh
  // if (!accessToken && refreshToken && !isAuthPage) {
  //   try {
  //     const response = await fetch(`https://plottwist-x4aw.onrender.com/auth/refresh`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({ refresh_token: refreshToken.value }),
  //     });
      
  //     if (!response.ok) {
  //       // Refresh failed, redirect to login
  //       return NextResponse.redirect(new URL('/unauth', request.url));
  //     }
      
  //     // Get new tokens from response
  //     const data = await response.json();
  //     const res = NextResponse.next();
      
  //     // Set new access token
  //     res.cookies.set('access_token', data.access_token, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'lax',
  //       maxAge: 60 * 15, // 15 minutes
  //     });
      
  //     return res;
  //   } catch (error) {
  //     return NextResponse.redirect(new URL('/unauth', request.url));
  //   }
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};