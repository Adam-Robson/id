import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AccessLevel } from "@/types/access-level";

const getAccessLevel = vi.hoisted(() => vi.fn());
const getDownloadUrl = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth", () => ({ getAccessLevel }));
vi.mock("@/lib/r2", () => ({ getDownloadUrl }));

const { GET } = await import("@/app/api/download/route");

const SIGNED = "https://bucket.r2.example/seemsreal/01.mp3?X-Amz-Signature=abc";

function request(query = "?key=seemsreal%2F01.mp3") {
  return new NextRequest(`http://localhost:3000/api/download${query}`);
}

const as = (level: AccessLevel) => getAccessLevel.mockResolvedValue(level);

describe("GET /api/download", () => {
  beforeEach(() => {
    getAccessLevel.mockReset();
    getDownloadUrl.mockReset();
    getDownloadUrl.mockResolvedValue(SIGNED);
  });

  it("refuses a signed-out visitor", async () => {
    as("guest");
    expect((await GET(request())).status).toBe(403);
  });

  it("refuses a member — downloads are admin-only", async () => {
    as("member");
    expect((await GET(request())).status).toBe(403);
  });

  it("never signs anything below admin", async () => {
    for (const level of ["guest", "member"] as AccessLevel[]) {
      as(level);
      await GET(request());
    }
    expect(getDownloadUrl).not.toHaveBeenCalled();
  });

  it("redirects an admin to the signed URL", async () => {
    as("admin");
    const res = await GET(request());
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(SIGNED);
  });

  it("keeps the signed redirect out of shared caches", async () => {
    as("admin");
    const res = await GET(request());
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("rejects a request with no key", async () => {
    as("admin");
    expect((await GET(request(""))).status).toBe(400);
  });

  it("404s when the key is refused by the signer", async () => {
    as("admin");
    getDownloadUrl.mockResolvedValue(null);
    const res = await GET(request("?key=contacts%2Fleak.json"));
    expect(res.status).toBe(404);
  });

  it("does not leak internals when signing throws", async () => {
    as("admin");
    getDownloadUrl.mockRejectedValue(new Error("R2 credentials rejected"));
    const res = await GET(request());
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("credentials");
  });
});
