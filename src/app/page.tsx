import { Icon } from "@/components/icon";
import Navigation from "@/components/navigation";
import ThemeToggle from "@/components/theme-toggle";
import Image from "next/image"
export default function Home() {
  return (
    <div className="page-wrapper">
      <div className="page-bg" />
      <main className="plate">
        <ThemeToggle />
        <div className="logo-container">
        <Image 
          src="/logo_.svg"
          alt="le fog logo" 
          height="800"
          width="800"
          className="logo"
        />
        </div>
        <Navigation />
      </main>
    </div>
  );
}
