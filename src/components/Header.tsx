import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => (
  <header>
    <nav>
      <Link href="/">Home</Link>
      <Link href="/search">Search</Link>
      <Link href="/login">Login</Link>
    </nav>
  </header>
);

export default Header;
