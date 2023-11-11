/* @jsxImportSource react */
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

import { auth, addDoc, collection, db } from '../../firebase'; // Update the path accordingly

interface Gif {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

const GifSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = '9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7';
  const handleFavorite = async (gif: Gif) => {
    try {
      // Get the currently logged-in user
      const user = auth.currentUser;

      if (user) {
        // Define the data to be stored in Firestore
        const favoriteData = {
          userId: user.uid,
          gifId: gif.id,
          gifUrl: gif.images.fixed_height.url,
          timestamp: new Date(),
        };

        // Add the favorite to the 'favorites' collection in Firestore
        const docRef = await addDoc(collection(db, 'favorites'), favoriteData);
        console.log('Favorite GIF stored with ID:', docRef.id);

        // Show success notification
        toast.success('GIF favorited successfully!', {
          position: 'top-right',
          autoClose: 3000, // Close the notification after 3000 milliseconds (3 seconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.warn('User not logged in. Unable to favorite GIF.');
      }
    } catch (error) {
      console.error('Error favoriting GIF:', error);
      // Show error notification
      toast.error('Error favoriting GIF. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${apiKey}&limit=10`
        );
        setGifs(response.data.data);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch GIFs when the query changes
    if (query.trim() !== '') {
      fetchGifs();
    } else {
      // Clear the GIFs when the query is empty
      setGifs([]);
    }
  }, [query, apiKey]);

  return (
    <>
      <Navbar onSearch={setQuery} loading={loading} />

      <div className="relative h-screen">
        <div className="flex flex-col items-center h-full p-4 bg-white">
          <ToastContainer />
          {loading && (
            <img
              src="/images/loader.gif" // Replace with the path to your loading GIF
              alt="Loading"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10"

            />
          )}
          <div className="flex flex-wrap mt-4 ">
            {gifs.map((gif) => (
              <div key={gif.id} className="m-2 rounded shadow-lg">
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  style={{ maxWidth: '350px', maxHeight: '350px' }}
                />
                <button onClick={() => handleFavorite(gif)} className='p-2 shadow-lg rounded-full'>❤️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GifSearch;
