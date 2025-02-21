import React, { useState, useEffect } from 'react';
import UpLoadForm from './components/ImageUpload/UploadForm';
import './App.css';
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setUser(auth.user);
    } else {
      setUser(null);
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleSignIn = () => {
    auth.signinRedirect(); // Trigger redirect for sign-in
  };

  const handleSignOut = () => {
    auth.removeUser(); // Remove user after sign out
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header with aligned buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>Image Recognizer App</h1>

        {!user ? (
          <button
            onClick={handleSignIn}
            style={{
              backgroundColor: "#2d3748", // Sidebar color
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4a5568")} // Hover effect
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2d3748")}
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: "#2d3748", // Sidebar color
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4a5568")} // Hover effect
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2d3748")}
          >
            Sign Out
          </button>
        )}
      </div>

      {/* Conditional rendering based on auth */}
      {!user ? (
        <div className="login-form" style={{ textAlign: "center", }}>
          <p style={{ marginLeft: "250px" }}>Sign in to access your history</p>
          <UpLoadForm />
        </div>
      ) : (
        <div className="main-container" style={{ textAlign: "center" }}>
          <p style={{ marginLeft: "250px" }}>Welcome, {user.profile?.email || user.profile?.name}!</p>
          <UpLoadForm />
        </div>
      )}
    </div>
  );
}

export default App;
