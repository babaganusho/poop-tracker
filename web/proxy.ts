import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/env";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getSession() only decodes the cookie locally — no network call.
  // getUser() always hits Supabase over the network to verify the token,
  // which was happening on every single request regardless of whether the
  // token was anywhere near expiring. Only pay for that round-trip when
  // the token is actually close to expiry; otherwise let it pass through.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiresAt = session?.expires_at ?? 0;

  if (session && expiresAt - nowInSeconds > 60) {
    return response;
  }

  // Refreshes the auth token if it's expired. Route-level pages still do
  // their own getUser() check; this just keeps cookies in sync.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
