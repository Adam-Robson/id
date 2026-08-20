import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AccessLevel } from "@/types/access-level";

const getAccessLevel = vi.hoisted(() => vi.fn());
const getStreamUrl = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth", () => ({ getAccessLevel }));
vi.mock("@/lib/r2", () => ({ getStreamUrl }));

const { GET } = await import("@/app/api/stream/route");

const SIGNED = "https://bucket.r2.example/seemsreal/01.mp3?X-Amz-Signature=abc";

function request(query = "?key=seemsreal%2F01.mp3") {
  return new NextRequest(`http://localhost:3000/api/stream${query}`);
}

const as = (level: AccessLevel) => getAccessLevel.mockResolvedValue(level);

describe("GET /api/stream", () => {
  beforeEach(() => {
    getAccessLevel.mockReset();
    getStreamUrl.mockReset();
    getStreamUrl.mockResolvedValue(SIGNED);
  });

  it("refuses a signed-out visitor", async () => {
    as("guest");
    const res = await GET(request());
    expect(res.status).toBe(401);
  });

  it("never signs anything for a guest", async () => {
    as("guest");
    await GET(request());
    expect(getStreamUrl).not.toHaveBeenCalled();
  });

  it("redirects a member to the signed URL", async () => {
    as("member");
    const res = await GET(request());
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(SIGNED);
  });

  it("lets an admin stream too", async () => {
    as("admin");
    const res = await GET(request());
    expect(res.status).toBe(302);
  });

  it("keeps the signed redirect out of shared caches", async () => {
    as("member");
    const res = await GET(request());
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("rejects a request with no key", async () => {
    as("member");
    const res = await GET(request(""));
    expect(res.status).toBe(400);
  });

  it("404s when the key is refused by the signer", async () => {
    // What `getStreamUrl` returns for a non-audio key such as contacts/x.json.
    as("member");
    getStreamUrl.mockResolvedValue(null);
    const res = await GET(request("?key=contacts%2Fleak.json"));
    expect(res.status).toBe(404);
  });

  it("does not leak internals when signing throws", async () => {
    as("member");
    getStreamUrl.mockRejectedValue(new Error("R2 credentials rejected"));
    const res = await GET(request());
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("credentials");
  });
});
