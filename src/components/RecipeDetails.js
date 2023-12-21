import React, { useState, useEffect } from 'react';

const RecipeDetails = ({ match }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const { recipeId } = match.params;

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchRecipe();
  }, [match]);

  return (
    <div className="container mt-3">
      {recipe && (
        <div>
          <h2>{recipe.strMeal}</h2>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="img-fluid" />
          <div className="mt-3">
            <h3>Ingredients:</h3>
            <ul className="list-group list-group-flush">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((index) => {
                const ingredient = recipe[`strIngredient${index}`];
                const measure = recipe[`strMeasure${index}`];
                return ingredient && (
                  <li key={index} className="list-group-item">{`${measure} ${ingredient}`}</li>
                );
              })}
            </ul>
            <h3 className="mt-3">Instructions:</h3>
            <p>{recipe.strInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
