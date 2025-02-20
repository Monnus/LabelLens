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
    <div className="App">
      <h1>Image Recognizer App</h1> <button className='btn' styles={{align  :"right"}} onClick={handleSignIn}>Sign In</button>
      {!user ? (
        <div className="login-form">

          <p>Sign in to access your history</p>
          <UpLoadForm />
        </div>
      ) : (
        <div className="main-container">
          <p>Welcome, {user.profile?.email || user.profile?.name}!</p>
          <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
          <UpLoadForm />

          {/* Display the ImageUpload form */}
        </div>
      )}
    </div>
  );
}

export default App;
