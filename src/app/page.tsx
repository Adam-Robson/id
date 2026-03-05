import { Icon } from "@/components/icon";
import Image from "next/image"
export default function Home() {
  return (
    <div className="page-wrapper">
      <div className="page-bg" />
      <main className="plate">
        <div className="logo-container">
        <Image 
          src="/logodk.svg" 
          alt="le fog logo" 
          height="700"
          width="500"
        />
        </div>
        <hr className="divider" />
        <div className="nav-container">
          <a href="/about" className="nav-link">About</a>
          <a href="#work" className="nav-link">Work</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        
      </main>
    </div>
  );
}
