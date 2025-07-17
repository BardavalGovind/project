import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from "./firebase";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setIdToken(token);
        localStorage.setItem("idToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.displayName}!`);
      } else {
        setUser(null);
        setIdToken(null);
        localStorage.removeItem("idToken");
        localStorage.removeItem("user");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      const token = await result.user.getIdToken();
      setIdToken(token);
      localStorage.setItem("idToken", token);
      localStorage.setItem("user", JSON.stringify(result.user));
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Home idToken={idToken} user={user} />} />
        <Route
          path="/admin"
          element={
            user?.email === "bardavalgovind2005@gmail.com"
              ? <AdminDashboard idToken={idToken} user={user} />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
