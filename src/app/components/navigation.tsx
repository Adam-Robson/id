"use client";

import { ApproximateEqualsIcon, RadioIcon } from "@phosphor-icons/react";
import Navlink from "@/app/components/navlink";
import "@/app/components/navigation.css";

export default function Navigation() {
  return (
    <nav className="site-nav nav">
      <ul className="nav-list">
        <li className="nav-li">
          <Navlink
            href="/about"
            className="nav-link nav-about"
            value="About"
            icon={ApproximateEqualsIcon}
          />
        </li>
        <li className="nav-li">
          <Navlink
            href="/contact"
            className="nav-link nav-contact"
            value="Contact"
            icon={RadioIcon}
          />
        </li>
      </ul>
    </nav>
  );
}
