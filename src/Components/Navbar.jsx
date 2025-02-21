import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../Firebase/firebase.js"
const Navbar = () => {
  const [user, setUser] = useState(null);
  

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      await axios.post("http://localhost:5000/users", {
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
    setTasks([]);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="#">Item 1</a>
            </li>
            <li>
              <a href="#">Parent</a>
              <ul className="p-2">
                <li>
                  <a href="#">Submenu 1</a>
                </li>
                <li>
                  <a href="#">Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="#">Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a href="#">Submenu 1</a>
                </li>
                <li>
                  <a href="#">Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a href="#">Item 3</a>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        {!user ? (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Welcome, {user.displayName}</h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
