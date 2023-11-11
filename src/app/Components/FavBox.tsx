import React, { useState, useEffect } from 'react';
import { MdClear } from 'react-icons/md';
import { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  auth,
  collection,
  getDocs,
  where,
  query,
  db,
  deleteDoc,
  doc,
} from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Favorite {
  id: string;
  gifId: string;
  gifTitle: string;
  gifUrl: string;
  gifUsername: string;
}

const Favorites: React.FC<{ userFavorites: Favorite[] }> = ({ userFavorites }) => {
  const [favorites, setFavorites] = useState<Favorite[]>(userFavorites);

  const fetchUserFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const favorites = await getUserFavorites(user.uid);
        setFavorites(favorites);
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
      const favorites: Favorite[] = userFavoritesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Favorite));
      return favorites;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
      toast.success('Removed From Favourite!', {
        position: 'top-right',
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold  text-black">Favorites ⭐</h1>
        {/* Removed Link import since it's not used */}
        <a href="/search" className="p-4 rounded-lg shadow-lg bg-black text-white hover:bg-gray-700">
          Home
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="rounded overflow-hidden shadow-lg relative">
            <img src={favorite.gifUrl} alt={`Favorite ${favorite.gifId}`} className="w-full h-35 object-cover" />
            <button onClick={() => handleRemoveFavorite(favorite.id)} className="absolute down-2 right-2 px-2 py-1">
              <MdClear className="bg-gray-100 m-2 w-8 h-8 hover:bg-slate-400 text-red-700" />
            </button>
            <p className="text-black p-2">{favorite.gifTitle}</p>
            <p className="text-black p-2">@{favorite.gifUsername}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
) => {
  try {
    const user: User | null = await new Promise((res) => {
      onAuthStateChanged(auth, (user) => {
        res(user);
      });
    });

    if (!user || !user.uid) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const favoritesCollection = collection(db, 'favorites');
    const userFavoritesQuery = query(favoritesCollection, where('userId', '==', user.uid));
    const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
    const userFavorites = userFavoritesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Favorite));

    return {
      props: {
        userFavorites,
      },
    };
  } catch (error) {
    console.error('Error fetching user favorites:', error);

    return {
      props: {
        userFavorites: [],
      },
    };
  }
};

export default Favorites;
