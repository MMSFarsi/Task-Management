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
    <div className="navbar sticky top-0 z-50 bg-white shadow-md px-6 py-4">
      <div className="navbar-start">
        <h2 className="text-2xl font-bold text-blue-600">TaskManager</h2>
      </div>

      <div className="navbar-center hidden lg:flex">
        {user && <h2 className="text-lg font-semibold text-gray-700">Welcome, {user.displayName}</h2>}
      </div>

      <div className="navbar-end">
        {!user ? (
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition duration-200"
          >
            Sign in with Google
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
