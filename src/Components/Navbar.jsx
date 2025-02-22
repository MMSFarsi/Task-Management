import React from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../Firebase/firebase.js";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      await axios.post("https://task-manager-server-side-delta.vercel.app/users", {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="navbar sticky top-0 z-50 bg-white shadow-md rounded-full px-6 py-4">
      <div className="navbar-start">
        <h2 className="text-2xl font-bold text-black">TaskManager</h2>
      </div>

      <div className="navbar-center hidden lg:flex">
        {user && <h2 className="text-lg font-semibold text-gray-700">Welcome, {user.displayName}</h2>}
      </div>

      <div className="navbar-end">
        {!user ? (
          <button onClick={handleLogin}
            className="bg-black text-white cursor-pointer font-semibold px-5 py-3 rounded-full " >
            Sign in with Google
          </button>
        ) : (
          <button onClick={handleLogout} className="bg-red-600 text-white font-semibold cursor-pointer  px-5 py-3 rounded-full" >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
