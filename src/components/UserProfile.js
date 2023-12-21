import React from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary

const UserProfile = ({ performSearch, searchHistory = [] }) => {
  // The default value [] ensures searchHistory is always an array

  const handleHistoryItemClick = (item) => {
    performSearch(item);
  };

  return (
    <div>
      <h1>User Profile</h1>
      {auth.currentUser ? (
        <div>
          <h2>{auth.currentUser.displayName || 'User'}</h2>
          <div>
            <h3>Search History</h3>
            <ul>
              {searchHistory.length > 0 ? (
                searchHistory.map((item, index) => (
                  <li key={index}>
                    <button onClick={() => handleHistoryItemClick(item)}>{item}</button>
                  </li>
                ))
              ) : (
                <p>No search history.</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default UserProfile;
