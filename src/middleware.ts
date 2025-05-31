import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'authToken';
const SECRET_KEY = new TextEncoder().encode('Defaultsecret1@');

/**
 * Middleware que gestiona la autenticación y autorización mediante JWT.
 * Valida el token, roles y acceso a rutas públicas o protegidas.
 * 
 * @param req - La solicitud entrante de tipo NextRequest.
 * @returns Una respuesta que permite o redirige la navegación.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;
  const cookies = parseCookies(req.headers.get('cookie'));
  const token = cookies[AUTH_COOKIE_NAME];

  // Permitir acceso libre a /login, /register, /auth/login, /access-denied y /home
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Si no hay token y no está intentando acceder a una ruta pública, redirigir a login
  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const roles = Array.isArray(payload.roles)
      ? payload.roles
      : typeof payload.roles === 'string'
      ? [payload.roles]
      : [];

    // Validar roles
    if (!roles.includes('admin') && !roles.includes('user')) {
      return redirectToLogin(req);
    }

    // Redirigir '/' y rutas no conocidas a /home
    if (pathname === '/' || !isKnownPath(pathname)) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Fallo en la verificación del token:', error);
    return redirectToLogin(req);
  }
}

/**
 * Verifica si una ruta es pública y no requiere autenticación.
 * 
 * @param pathname - Ruta a verificar.
 * @returns `true` si es una ruta pública, `false` en caso contrario.
 */
function isPublicRoute(pathname: string): boolean {
  return (
    ['/login', '/register', '/auth/login', '/access-denied', '/home'].includes(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2|ttf)$/) !== null
  );
}

/**
 * Verifica si una ruta es conocida y permitida dentro de la aplicación.
 * 
 * @param pathname - Ruta a validar.
 * @returns `true` si es una ruta válida, `false` si no lo es.
 */
function isKnownPath(pathname: string): boolean {
  const allowedPaths = [
    '/home',
    '/Games/space',
    '/Games/residuals',
    '/Games/labyrinth',
    '/Games/platafforms',
    '/Games/pacman'
  ];
  return allowedPaths.includes(pathname);
}

/**
 * Redirige al usuario a la ruta de inicio de sesión.
 * 
 * @param req - La solicitud original de tipo NextRequest.
 * @returns Un objeto NextResponse que redirige a '/login'.
 */
function redirectToLogin(req: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/login', req.url));
}

/**
 * Parsea la cabecera 'cookie' de la solicitud y retorna un objeto con claves y valores.
 * 
 * @param cookieHeader - Cadena con la cabecera 'cookie', o `null` si no existe.
 * @returns Un objeto con los nombres y valores de las cookies.
 */
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      if (name) cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
}
