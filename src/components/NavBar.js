// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="top-div">
      <Link to="/" className="nav-button" activeClassName="active-button">
        Recipe Search
      </Link>
      <Link to="/profile" className="nav-button" activeClassName="active-button">
        Profile
      </Link>
    </div>
  );
};

export default NavBar;
