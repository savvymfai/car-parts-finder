import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => (
  <header style={{ backgroundColor: "#1e1b26", padding: "1rem" }}>
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href="/">
        <a style={{ color: "#fff", textDecoration: "none", fontSize: "1.2rem" }}>
          Home
        </a>
      </Link>
      <Link href="/search">
        <a style={{ color: "#fff", textDecoration: "none", fontSize: "1.2rem" }}>
          Search
        </a>
      </Link>
      <Link href="/login">
        <a style={{ color: "#fff", textDecoration: "none", fontSize: "1.2rem" }}>
          Login
        </a>
      </Link>
    </nav>
  </header>
);

export default Header;
