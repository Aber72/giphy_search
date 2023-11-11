// components/Dropdown.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdAccountBox, MdLockOutline } from 'react-icons/md';
import { auth } from '../../firebase'; // Update the path accordingly
import { User } from 'firebase/auth'; // Import User type from firebase/auth
import { useRouter } from 'next/router';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Explicitly define the type
   const router=useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dropdown">
      {user && (
        <div className="profile bg-black p-2 rounded-full hover:bg-gray-700" onClick={toggleDropdown}>
          <span><MdAccountBox className="bg-gray-100 m-2" /></span>
        </div>
      )}
      {isOpen && user && (
        <div className="dropdown-content">
          <Link href="/favorite">⭐Favorites</Link>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
