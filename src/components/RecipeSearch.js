import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Track the selected recipe
  const navigate = useNavigate();

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
        alert("Food is unavailable.");
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
    const updatedHistory = [term, ...searchHistory.filter(t => t !== term)];
    const historyKey = 'searchHistory';
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const clearSearchHistory = () => {
    const historyKey = 'searchHistory';
    localStorage.setItem(historyKey, JSON.stringify([]));
    setSearchHistory([]);
  };

  const handleViewRecipeClick = (recipeId) => {
    setSelectedRecipe(recipes.find(recipe => recipe.idMeal === recipeId));
  };

  return (
    <div className="recipe-search-container">
      {/* Include UserProfile component */}
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
          {recipes.map(recipe => (
            <div key={recipe.idMeal}>
              <h3>{recipe.strMeal}</h3>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <button onClick={() => handleViewRecipeClick(recipe.idMeal)}>View Recipe</button>
            </div>
          ))}
        </div>
        <button onClick={clearSearchHistory}>Clear History</button>
      </div>
      {/* Display the selected recipe details */}
      {selectedRecipe && (
  <div className="selected-recipe-details">
    <h2>{selectedRecipe.strMeal}</h2>
    <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} />
    {/* Display ingredients here */}
    <ul>
      {Array.from({ length: 20 }, (_, i) => i + 1).map((index) => {
        const ingredient = selectedRecipe[`strIngredient${index}`];
        const measure = selectedRecipe[`strMeasure${index}`];
        return ingredient && <li key={index}>{`${measure} ${ingredient}`}</li>;
      })}
    </ul>
    {/* Display instructions */}
    <div>
      <h3>Instructions</h3>
      <p>{selectedRecipe.strInstructions}</p>
    </div>
  </div>
)}

    </div>
  );
};

export default RecipeSearch;
