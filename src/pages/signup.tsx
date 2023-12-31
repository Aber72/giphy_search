import Image from 'next/image';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdAccountBox, MdLockOutline } from 'react-icons/md';
import { signUpWithEmailAndPassword } from '../firebase'; 
import '../app/globals.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    // Perform form validation
    if (!name || !email || !password) {
      setNotification('All fields are required.');
      return;
    }

    try {
      // Call the signUpWithEmailAndPassword function
      await signUpWithEmailAndPassword(email, password);

      // If successful, redirect to the login page and show success notification
      setNotification('Signup successful! Redirecting to login page.');
      setTimeout(() => {
        router.push('/login'); // Redirect to login page
      }, 3000); // Redirect after 3 seconds
    } catch (error: any) {
      // Handle error, you can show an error message to the user
      if (error.code === 'auth/weak-password') {
        setNotification('Password should be at least 6 characters.');
      }else if (error.code === 'auth/email-already-in-use') {
        setNotification('Email is already in use. Please use a different email.');
      }else {
        setNotification(`Error during signup: ${error.message}`);
      }
      console.error('Error during signup:', error);
    }
  };

  return (
    // started signup page.
    // header  for signup page
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-2/3 max-w-xl">
        <div className="w-18 p-5">
          <div className="py-10">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-black mb-2">Sign In to Account</h2>
              <div className="border-2 w-10 border-black inline-block mb-2"></div>
            </div>

            {/*paragraph tag start */}


            <form onSubmit={handleSignUp}>
              <div className="flex flex-col items-center">
                <p className="text-grey-400 my-3 items-center">Enter Your Details</p>

                {/* paragraph tag ends  */}

                {/* textbox for Name starts*/}

                <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
                  <MdAccountBox className="bg-gray-100 m-2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="bg-gray-100 outline-none text-black"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/*textbox for Name ends*/}

                {/* textbox for  Email Start*/}

                <div className="bg-gray-100 w-64 p-2 flex items-center">
                  <FaRegEnvelope className="bg-gray-100 m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-gray-100 outline-none text-black"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* textbox for Name ends*/}

                {/* textbox for Password starts*/}

                <div className="bg-gray-100 w-64 p-2 flex items-center mt-3">
                  <MdLockOutline className="bg-gray-100 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="bg-gray-100 outline-none text-black"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* textbox for Password end */ }

                {/* sign in Button starts*/}

                <button
                  type="submit"
                  className="border-2 text-black border-black rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white mt-3"
                >
                  Sign In
                </button>
              </div>

              {/* sign in Button end */}

            </form>

            {/* signup page end */}

            {notification && (
              <div className={`notification ${notification ? 'show' : ''}`}>
                {notification}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


