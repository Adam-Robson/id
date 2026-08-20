import { type NextRequest, NextResponse } from "next/server";
import { getAccessLevel } from "@/lib/auth";
import { getDownloadUrl } from "@/lib/r2";

export async function GET(req: NextRequest) {
  const accessLevel = await getAccessLevel();
  if (accessLevel !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  let url: string | null;
  try {
    url = await getDownloadUrl(key);
  } catch (error) {
    console.error("Failed to sign download URL", error);
    return NextResponse.json(
      { error: "Failed to sign download URL" },
      { status: 500 },
    );
  }

  if (!url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // The Location header carries a signed credential — keep it out of any
  // shared cache, same as the streaming route.
  const res = NextResponse.redirect(url, 302);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
