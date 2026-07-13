import Image from "next/image";
import Navigation from "@/app/components/navigation";
import ThemeToggle from "@/app/components/theme-toggle";

type Props = {
  variant: "home" | "interior";
};

export default function SiteHeader({ variant }: Props) {
  return (
    <header className="site-header">
      {variant === "home" ? (
        <>
          <a href="/" className="brand-stamp" aria-label="LE FOG — home">
            <Image src="/images/logo.svg" alt="" width={52} height={52} />
          </a>
          <Navigation />
        </>
      ) : (
        <a href="/" className="back-link">
          ← LE FOG
        </a>
      )}
      <ThemeToggle />
    </header>
  );
}
