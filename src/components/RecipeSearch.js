import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import { Link } from 'react-router-dom';

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const historyKey = 'searchHistory';
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    setSearchHistory(history);
  }, []);

  const performSearch = async (term) => {
    if (!term || term.length < 3) return;

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
      const data = await response.json();
      if (!data.meals) {
        alert('Food is unavailable.');
        return;
      }
      setRecipes(data.meals);
      storeSearchHistory(term);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const storeSearchHistory = (term) => {
    if (!term || term.length < 3) return;
    const updatedHistory = [term, ...searchHistory.filter((t) => t !== term)];
    const historyKey = 'searchHistory';
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const clearSearchHistory = () => {
    const historyKey = 'searchHistory';
    localStorage.setItem(historyKey, JSON.stringify([]));
    setSearchHistory([]);
  };

  const handleViewRecipeClick = async (recipeId) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleSearchHistoryClick = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Left Panel: Search History */}
        <div className="col-md-3 bg-light min-vh-100">
          <h5 className="mt-4 mb-3">Search History</h5>
          <div className="list-group">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleSearchHistoryClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
          <button onClick={clearSearchHistory} className="btn btn-danger mt-3">
            Clear History
          </button>
        </div>

        {/* Right Panel: Recipe Details */}
        <div className="col-md-9">
          {/* Search Bar */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search for recipes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => performSearch(searchTerm)}
            >
              Search
            </button>
          </div>

          {/* Recipes List */}
          <div className="row">
            {recipes.map((recipe) => (
              <div key={recipe.idMeal} className="col-md-4">
                <div className="card mb-3">
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{recipe.strMeal}</h5>
                    <Link
                      to={`/recipe/${recipe.idMeal}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Recipe Details */}
          {selectedRecipe && (
            <div className="mt-4">
              <h2>{selectedRecipe.strMeal}</h2>
              <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} className="img-fluid" />
              <div className="mt-3">
                <h3>Ingredients:</h3>
                <ul className="list-group list-group-flush">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((index) => {
                    const ingredient = selectedRecipe[`strIngredient${index}`];
                    const measure = selectedRecipe[`strMeasure${index}`];
                    return ingredient && (
                      <li key={index} className="list-group-item">{`${measure} ${ingredient}`}</li>
                    );
                  })}
                </ul>
                <h3 className="mt-3">Instructions:</h3>
                <p>{selectedRecipe.strInstructions}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearch;
