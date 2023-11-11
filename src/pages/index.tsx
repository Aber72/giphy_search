import React from 'react';
import Head from 'next/head';
import GifSearch from '../app/Components/GifSearch';
import '../app/globals.css';
import Login from './login';
const Home: React.FC = () => {
  return (
    <div>
      

      <main>
     
        <Login />
      </main>

      {/* Additional page content */}
    </div>
  );
};

export default Home;
