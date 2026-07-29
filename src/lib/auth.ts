import { currentUser } from "@clerk/nextjs/server";
import type { AccessLevel } from "@/types/access-level";

export async function getAccessLevel(): Promise<AccessLevel> {
  const user = await currentUser();
  if (!user) return "guest";
  return user.publicMetadata?.role === "admin" ? "admin" : "member";
}
