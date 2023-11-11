import React from 'react';
import Head from 'next/head';
import GifSearch from '../app/Components/GifSearch';
import { withAuth } from '../app/withAuth';

import '../app/globals.css';

const Search: React.FC = () => {
  return (
    <div>
      

      <main>
        
        <GifSearch/>
      </main>

      {/* Additional page content */}
    </div>
  );
};

export default withAuth(Search);
