import React from 'react';

const Footer: React.FC = () => (
  <footer style={{backgroundColor: 'black', color: 'white', padding: '20px'}}>
    <p style={{textAlign: 'center', margin: '0'}}>&copy; {new Date().getFullYear()} Car Parts Finder</p>
  </footer>
);

export default Footer;