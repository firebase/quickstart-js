import React, { useEffect, useState, useContext } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { AuthContext } from '@/lib/firebase';
import { Link } from 'react-router-dom';
import { handleAuthStateChange } from '@/lib/MovieService';
import { FaSearch } from 'react-icons/fa';
import firebaseLogo from '@/assets/firebase_logo.svg';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const auth = useContext(AuthContext);


  useEffect(() => {
    const unsubscribe = handleAuthStateChange(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src={firebaseLogo} alt="Firebase Logo" width={30} height={30} className="mr-2" />
            <span className=" text-white text-lg font-bold hidden md:block">FriendlyMovies</span>
          </Link>
          <Link to="/vectorsearch" className="text-gray-200 hover:text-white">
            Vector Search
          </Link>
        </div>
        <Link to="/advancedsearch" className="flex items-center text-gray-200 hover:text-white mx-auto">
          <FaSearch className="mr-2" />
          Advanced Search
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <Link to="/myprofile" className="text-yellow-500 hover:text-yellow-400">
              My Profile
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-200 mr-4">Hello, {user.displayName}</span>
              <button onClick={handleSignOut} className="text-gray-200 hover:text-white">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={handleSignIn} className="text-gray-200 hover:text-white">
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
