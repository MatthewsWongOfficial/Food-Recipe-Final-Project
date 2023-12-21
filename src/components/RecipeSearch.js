// RecipeSearch.js
import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';

const RecipeSearch = ({ searchTerm, performSearch }) => {
  const [searchTermLocal, setSearchTermLocal] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTermLocal}`);
        const data = await response.json();
        setRecipes(data.meals);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    if (searchTermLocal) {
      fetchRecipes();
    }
  }, [searchTermLocal]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchTermLocal);
  };

  const handleViewRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="recipe-search-container">
      <UserProfile performSearch={performSearch} />
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTermLocal}
            onChange={(e) => setSearchTermLocal(e.target.value)}
            placeholder="Search for recipes"
          />
          <button type="submit">Search</button>
        </form>
        <div className="recipe-results">
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
