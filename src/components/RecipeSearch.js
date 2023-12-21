// RecipeSearch.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const RecipeSearch = ({ performSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!searchTerm) return;
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        setRecipes(data.meals);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [searchTerm]);

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleViewRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Function to handle search from history
  const handleSearchHistoryItem = (item) => {
    setSearchTerm(item);
    performSearch(item); // Optional, if you need to store this action somewhere
  };

  return (
    <div className="recipe-search-container">
      <div className="search-history">
        <UserProfile performSearch={handleSearchHistoryItem} />
      </div>
      <div className="search-results">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for recipes"
          />
          <button type="submit">Search</button>
        </form>
        <div className="recipes">
          {recipes && recipes.map(recipe => (
            <div key={recipe.idMeal}>
              <h3>{recipe.strMeal}</h3>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <button onClick={() => handleViewRecipeClick(recipe.idMeal)}>View Recipe</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearch;
