import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary

const UserProfile = ({ currentUser, onSearchHistoryClick }) => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Load search history from local storage
      const historyKey = `searchHistory-${currentUser.uid}`;
      const history = JSON.parse(localStorage.getItem(historyKey)) || [];
      setSearchHistory(history);
    }
  }, [currentUser]);

  return (
    <div>
      <h2>You're signed in as</h2>

      {/* UserProfile component */}
      {currentUser && (
        <>
          <img
            src={currentUser.photoURL}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
          <div>
            <h2>{currentUser.displayName || 'User'}</h2>
            <p>Email: {currentUser.email}</p>
            <div>
              <h3>Search History</h3>
              <ul>
                {searchHistory.length > 0 ? (
                  searchHistory.map((item, index) => (
                    <li key={index} onClick={() => onSearchHistoryClick(item)}>
                      {item}
                    </li>
                  ))
                ) : (
                  <p>No search history.</p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}

      {!currentUser && <p>Please log in to view your profile.</p>}
    </div>
  );
};

export default UserProfile;
