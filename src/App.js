import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import RecipeSearch from './components/RecipeSearch';
import UserProfile from './components/UserProfile';
import NavBar from './components/NavBar';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar handleLogout={handleLogout} />
        <div className="content">
          {currentUser ? (
            <>
              <span>Welcome, {currentUser.displayName || 'User'}</span>
              <Routes>
                <Route
                  path="/"
                  element={<RecipeSearch currentUser={currentUser} />}
                />
                <Route
                  path="/profile"
                  element={<UserProfile currentUser={currentUser} />}
                />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<RecipeSearch />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;