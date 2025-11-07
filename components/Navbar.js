"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navStyle = {
    display: "flex",
    background: "#333",
    padding: "1rem 2rem",
  };

  const getLinkStyle = (path) => ({
    color: pathname === path ? "#1e90ff" : "white",
    textDecoration: "none",
    marginRight: "1.5rem",
    fontWeight: pathname === path ? "bold" : "normal",
    fontSize: "1.1rem",
  });

  return (
    <nav style={navStyle}>
      <Link href="/" style={getLinkStyle("/")}>
        Home
      </Link>
      <Link href="/challenges" style={getLinkStyle("/challenges")}>
        Challenges
      </Link>
      <Link href="/online" style={getLinkStyle("/online")}>
        Online Seasons
      </Link>
    </nav>
  );
}
