import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebase'; // Adjust the path as necessary
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import RecipeSearch from './components/RecipeSearch';
import UserProfile from './components/UserProfile'; // You'll need to create this component

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Handle successful logout
    } catch (error) {
      // Handle logout errors
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <nav>
        {currentUser ? (
          <>
            <span>Welcome, {currentUser.displayName || 'User'}</span>
            <img src={currentUser.photoURL || 'default-profile.png'} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
            <button onClick={handleLogout}>Log Out</button>
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
        <Link to="/">Recipe Search</Link>
      </nav>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<RecipeSearch />} />
        <Route path="/profile" element={<UserProfile />} /> {/* Profile and search history */}
      </Routes>
    </Router>
  );
}

export default App;
