import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => (
  <div>
    <h1>Welcome to Car Parts Finder</h1>
    <Link href="/search">
      <button>Start Searching For Car Parts</button>
    </Link>
  </div>
);

export default HomePage;
