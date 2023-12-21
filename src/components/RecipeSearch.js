import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Route, Routes } from 'react-router-dom';
import UserProfile from './UserProfile';

const RecipeCard = ({ recipe, onViewRecipe }) => (
  <div className="recipe-card">
    <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
    <p>{recipe.strMeal}</p>
    <button onClick={() => onViewRecipe(recipe)}>View Recipe</button>
  </div>
);

const RecipeSearch = ({ currentUser, onSearchHistoryClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  // const [currentUser, setCurrentUser] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // Fetch random recipes when the component mounts
  useEffect(() => {
    const fetchRandomRecipes = async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data.meals) {
        setRecipes(data.meals);
      }
    };

    fetchRandomRecipes();
  }, []);

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
    setSelectedRecipe(null);
    setIngredients([]);
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

  // ini wkt click history yaaa
  const handleSearchHistoryClick = (searchTerm) => {
    setSearchTerm(searchTerm);
    fetchRecipes(searchTerm);
    setSelectedRecipe(null);
    setIngredients([]);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    fetchIngredients(recipe.idMeal);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      {/* {currentUser && (
        <div style={{ textAlign: 'right' }}>
          <span>{`Welcome, ${currentUser.displayName || 'User'}`}</span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )} */}

      <form onSubmit={handleSearch}>
        <div className="button-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for recipes"
          />
          <button type="submit">Search</button>
        </div>
      </form>

      <div className="recipe-cards-container">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} onViewRecipe={handleViewRecipe} />
        ))}
      </div>
      
      {/* <div> */}
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
        ) : null}
    </div>
  );
};

const RecipeSearchWrapper = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="content">
      <Routes>
        <Route
          path="/"
          element={<RecipeSearch currentUser={currentUser} />}
        />
        <Route
          path="/profile"
          element={<UserProfile currentUser={currentUser} onSearchHistoryClick={handleSearchHistoryClick} />}
        />
      </Routes>
    </div>
  );
};

export default RecipeSearchWrapper;