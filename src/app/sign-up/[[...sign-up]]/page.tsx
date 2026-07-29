import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { sharedOgImage } from "@/app/components/shared-metadata";
import SiteHeader from "@/app/components/site-header";
import "@/app/components/interior-pages.css";

export const metadata: Metadata = {
  title: "Create Account",
  openGraph: {
    type: "website",
    title: "Create Account | LE FOG",
    description: "Create an account to stream the LE FOG catalog.",
    images: sharedOgImage,
  },
};

export default function SignUpPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main" style={{ alignItems: "center" }}>
        <SignUp />
      </main>
    </div>
  );
}
