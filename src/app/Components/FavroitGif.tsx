import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, collection, getDocs, where, query, db } from '../../firebase';

interface Favorite {
  gifId: string;
  gifUrl: string;
  // Add other properties as needed
}

const Favorites: React.FC = () => {
  const [userFavorites, setUserFavorites] = useState<Favorite[]>([]);

  const fetchUserFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const favorites = await getUserFavorites(user.uid);
        setUserFavorites(favorites);
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
    try {
      const favoritesCollection = collection(db, 'favorites');
      const userFavoritesQuery = query(favoritesCollection, where('userId', '==', userId));
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
      const favorites: Favorite[] = userFavoritesSnapshot.docs.map((doc) => doc.data() as Favorite);
      return favorites;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  };

  // Fetch user favorites when the component mounts
  useEffect(() => {
    fetchUserFavorites();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold ">Favorites ⭐</h1>
        <Link href="/search" className='p-4 rounded-lg shadow-lg bg-black text-white'>Home</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userFavorites.map((favorite) => (
          <div key={favorite.gifId} className="rounded overflow-hidden shadow-lg">
            <img
              src={favorite.gifUrl}
              alt={`Favorite ${favorite.gifId}`}
              className="w-full h-35 object-cover"
            />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
