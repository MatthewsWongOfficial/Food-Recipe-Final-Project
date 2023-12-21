import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import RecipeSearch from './components/RecipeSearch';
import UserProfile from './components/UserProfile';
import FoodCategories from './components/FoodCategories';
import ViewRecipe from './components/ViewRecipe'; // Import ViewRecipe component
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  
    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, [currentUser]); // Include currentUser in the dependency array
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const performSearch = (query) => {
    setSearchTerm(query);
  };

  return (
    <Router>
      <nav>
        {currentUser ? (
          <>
            <img src={currentUser.photoURL || 'default-profile.png'} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
            <span>Welcome, {currentUser.displayName || 'User'}</span>
            {/* <button onClick={handleLogout}>Log Out</button> */}
            <Link to="/categories" onClick={handleLogout}>Log Out</Link>
            {/* Removed Profile Link */}
            <Link to="/categories">Categories</Link>
            <Link to="/">Recipe Search</Link>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<RecipeSearch searchTerm={searchTerm} performSearch={performSearch} />} />
        <Route path="/recipe/:id" element={<ViewRecipe />} /> {/* Route for viewing individual recipes */}
        <Route path="/signin" element={!currentUser ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!currentUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/profile" element={<UserProfile currentUser={currentUser} />} />
        <Route path="/categories" element={currentUser ? <FoodCategories /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;