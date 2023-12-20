import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth';

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Load search history for the user
        loadSearchHistory(user.uid);
      }
    });

    return unsubscribe; // Clean up the subscription
  }, []);

  const fetchRecipes = async (searchTerm) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();
    if (data.meals) {
      setRecipes(data.meals);
    } else {
      setRecipes([]);
    }
  };

  const fetchIngredients = async (recipeId) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      // Extract and set the ingredients with their respective images
      const mealIngredients = [];
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          mealIngredients.push({
            name: meal[`strIngredient${i}`],
            image: `https://www.themealdb.com/images/ingredients/${meal[`strIngredient${i}`]}.png`,
          });
        }
      }
      setIngredients(mealIngredients);
    } else {
      setIngredients([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchRecipes(searchTerm);
    setSelectedRecipe(null); // Clear selected recipe when performing a new search
    setIngredients([]); // Clear ingredients when performing a new search
    if (currentUser) {
      saveSearchHistory(currentUser.uid, searchTerm);
    }
  };

  const saveSearchHistory = (userId, searchTerm) => {
    const historyKey = `searchHistory-${userId}`;
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    history.push(searchTerm);
    localStorage.setItem(historyKey, JSON.stringify(history));
  };

  const loadSearchHistory = (userId) => {
    const historyKey = `searchHistory-${userId}`;
    // Load and handle search history if needed
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    fetchIngredients(recipe.idMeal);
  };

  return (
    <div>
      {currentUser && (
        <div style={{ textAlign: 'right' }}>
          <span>{currentUser.displayName}</span>
          <img src={currentUser.photoURL} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
        </div>
      )}
      <form onSubmit={handleSearch}>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for recipes" />
        <button type="submit">Search</button>
      </form>
      <div>
        {selectedRecipe ? (
          <div>
            <h2>{selectedRecipe.strMeal}</h2>
            <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} style={{ width: '200px', height: '200px' }} />
            {/* Display recipe details here */}
            <p>Category: {selectedRecipe.strCategory}</p>
            <p>Area: {selectedRecipe.strArea}</p>
            <p>Instructions: {selectedRecipe.strInstructions}</p>
            {/* Display ingredients and their images */}
            <h3>Ingredients:</h3>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} <img src={ingredient.image} alt={ingredient.name} style={{ width: '30px', height: '30px' }} />
                </li>
              ))}
            </ul>
            {/* Add more details as needed */}
            <button onClick={() => setSelectedRecipe(null)}>Back to Search</button>
          </div>
        ) : recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.idMeal}>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100px', height: '100px' }} />
                <p>{recipe.strMeal}</p>
                <button onClick={() => handleViewRecipe(recipe)}>View Recipe</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes found. Try a different search!</p>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
