import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Welcome to Car Parts Finder</h1>
    <Link href="/search">
      <button style={{ backgroundColor: 'blue', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}>Start Searching For Car Parts</button>
    </Link>
  </div>
);

export default HomePage;