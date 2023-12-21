import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp'; // Import SignUp component
import RecipeSearch from './components/RecipeSearch';
import UserProfile from './components/UserProfile';
import FoodCategories from './components/FoodCategories';
import ViewRecipe from './components/ViewRecipe'; // Import ViewRecipe component
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dropdown from 'react-bootstrap/Dropdown';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Reset the current user to null after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const performSearch = (query) => {
    setSearchTerm(query);
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Recipe App
          </Link>
          {currentUser ? (
            <div className="navbar-collapse">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">
                    Categories
                  </Link>
                </li>
              </ul>
              <Dropdown>
                <Dropdown.Toggle variant="dark">
                  <img
                    src={currentUser.photoURL || 'default-profile.png'}
                    alt="Profile"
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                  &nbsp;{currentUser.displayName || 'User'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : null}
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={currentUser ? <RecipeSearch searchTerm={searchTerm} performSearch={performSearch} /> : <Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/recipe/:id" element={<ViewRecipe />} />
          <Route path="/profile" element={currentUser ? <UserProfile currentUser={currentUser} /> : <Navigate to="/signin" />} />
          <Route path="/categories" element={currentUser ? <FoodCategories /> : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
