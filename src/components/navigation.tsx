import Link from "next/link";

export default function Navigation() {
  return (
    <>
    <nav className="nav">
      <Link href="/about" className="navlink">About</Link>
      <Link href="/work" className="navlink">Work</Link>
      <Link href="/contact" className="navlink">Contact</Link>
    </nav>
    </>
  )
}
