import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch and set search history from localStorage
    const historyKey = 'searchHistory'; // Adjust key as necessary
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    setSearchHistory(history);
  }, []);

  const performSearch = async (term) => {
    if (!term || term.length < 3) return; // Prevent empty or too short search terms

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
      const data = await response.json();

      if (!data.meals) {
        alert("Food is unavailable."); // Alert if no meals are found
        return;
      }

      setRecipes(data.meals);
      setSearchTerm(term);
      storeSearchHistory(term);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const storeSearchHistory = (term) => {
    if (!term || term.length < 3) return; // Duplicate check for safety

    const updatedHistory = [term, ...searchHistory.filter(t => t !== term)]; // Add new term at the top, remove duplicates
    const historyKey = 'searchHistory'; // Adjust key as necessary
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const clearSearchHistory = () => {
    const historyKey = 'searchHistory'; // Adjust key as necessary
    localStorage.setItem(historyKey, JSON.stringify([]));
    setSearchHistory([]);
  };

  const handleViewRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
  <div className="recipe-search-container">
    <UserProfile performSearch={performSearch} searchHistory={searchHistory} />
    <div className="search-results">
      <form onSubmit={(e) => { e.preventDefault(); performSearch(searchTerm); }}>
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
          <div key={recipe.idMeal} className="recipe-item">
            <h3>{recipe.strMeal}</h3>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            <button onClick={() => handleViewRecipeClick(recipe.idMeal)}>View Recipe</button>
          </div>
        ))}
        {!recipes && (
          <div>No recipes found. Try a different search.</div>
        )}
      </div>
      <button onClick={() => clearSearchHistory()} className="clear-history-button">
        Clear History
      </button>
    </div>
  </div>
);

};

export default RecipeSearch;
