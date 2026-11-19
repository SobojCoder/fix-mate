import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/* ImgBB hard limit */
const MAX_SIZE = 32 * 1024 * 1024;

/**
 * Proxies profile-photo uploads to ImgBB so the API key never reaches the
 * browser. Requires a signed-in session.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const key = process.env.IMGBB_API_KEY;
  if (!key) {
    return Response.json(
      { error: "Image uploads are not configured (IMGBB_API_KEY missing)." },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const candidate = form.get("image");
    if (candidate instanceof File) file = candidate;
  } catch {
    /* fall through to the 400 below */
  }

  if (!file) {
    return Response.json({ error: "No image provided." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "Image is too large (max 32MB)." },
      { status: 413 },
    );
  }

  try {
    const outbound = new FormData();
    outbound.append("image", file);

    const upstream = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
      { method: "POST", body: outbound },
    );

    const payload = (await upstream.json()) as {
      success?: boolean;
      data?: { url?: string };
      error?: { message?: string };
    };

    if (!upstream.ok || !payload.success || !payload.data?.url) {
      return Response.json(
        { error: payload.error?.message || "ImgBB upload failed." },
        { status: 502 },
      );
    }

    return Response.json({ url: payload.data.url });
  } catch {
    return Response.json(
      { error: "Could not reach the image host." },
      { status: 502 },
    );
  }
}
