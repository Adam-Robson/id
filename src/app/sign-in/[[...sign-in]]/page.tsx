import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { sharedOgImage } from "@/app/components/shared-metadata";
import SiteHeader from "@/app/components/site-header";
import "@/app/components/interior-pages.css";

export const metadata: Metadata = {
  title: "Sign In",
  openGraph: {
    type: "website",
    title: "Sign In | LE FOG",
    description: "Sign in to stream the LE FOG catalog.",
    images: sharedOgImage,
  },
};

export default function SignInPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main" style={{ alignItems: "center" }}>
        <SignIn />
      </main>
    </div>
  );
}
