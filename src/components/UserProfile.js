import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary

const UserProfile = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      // Load search history from local storage
      const historyKey = `searchHistory-${auth.currentUser.uid}`;
      const history = JSON.parse(localStorage.getItem(historyKey)) || [];
      setSearchHistory(history);
    }
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {auth.currentUser ? (
        <div>
          <h2>{auth.currentUser.displayName || 'User'}</h2>
          <p>Email: {auth.currentUser.email}</p>
          <h3>Search History</h3>

          <ul>
            {searchHistory.length > 0 ? (
              searchHistory.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <p>No search history.</p>
            )}
          </ul>
          
        </div>
      ) 
      
      : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default UserProfile;
