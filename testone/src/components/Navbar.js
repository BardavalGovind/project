import React from "react";

const Navbar = ({ user, onLogin, onLogout }) => (
  <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
    <h1 className="text-xl font-bold">E-Commerce</h1>
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="text-sm">
            {user.displayName} ({user.email})
          </span>
          <button
            onClick={onLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={onLogin}
          className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition"
        >
          Sign in with Google
        </button>
      )}
    </div>
  </nav>
);

export default Navbar;
