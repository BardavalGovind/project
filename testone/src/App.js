import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from "./firebase";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
      
      if (user) {
        console.log("User details:", {
          email: user.email,
          displayName: user.displayName,
          uid: user.uid
        });
        setUser(user);
        try {
          const token = await user.getIdToken();
          setIdToken(token);
          localStorage.setItem("idToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          console.log("Token set successfully");
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        setUser(null);
        setIdToken(null);
        localStorage.removeItem("idToken");
        localStorage.removeItem("user");
        console.log("User logged out, state cleared");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful:", result.user.email);
      console.log("Login result user:", result.user);
      
      setUser(result.user);
      const token = await result.user.getIdToken();
      setIdToken(token);
      localStorage.setItem("idToken", token);
      localStorage.setItem("user", JSON.stringify(result.user));
    } catch (error) {
      console.error("Login error details:", {       code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      
      // Show specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
        alert("Login cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("Popup was blocked. Please allow popups for this site.");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized. Please check Firebase settings.");
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Attempting logout...");
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Debug logging
  useEffect(() => {
    console.log("=== DEBUG INFO ===");
    console.log("Current user state:", user ? user.email : "No user");
    console.log("Current token state:", idToken ? "Token exists" : "No token");
    console.log("Admin email check:", user?.email === "bardavalgovind2005@gmail.com");
    console.log("User email:", user?.email);
    console.log("Expected admin email: bardavalgovind2005@gmail.com");
    console.log("===================");
  }, [user, idToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-xl font-bold">E-Commerce</h1>
          <div>
            {user ? (
              <>
                <span className="mr-4">{user.displayName} ({user.email})</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
              </>
            ) : (
              <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-1 rounded">Sign in with Google</button>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home idToken={idToken} user={user} />} />
          <Route
            path="/admin"
            element={
              user && user.email === "bardavalgovind2005@gmail.com"
                ? <AdminDashboard idToken={idToken} user={user} />
                : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;