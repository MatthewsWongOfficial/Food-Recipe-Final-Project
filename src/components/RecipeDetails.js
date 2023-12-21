import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          setRecipe(meal);
          extractIngredients(meal);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    const extractIngredients = (meal) => {
      const mealIngredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredientName = meal[`strIngredient${i}`];
        if (ingredientName) {
          const ingredient = {
            name: ingredientName,
            measure: meal[`strMeasure${i}`],
            image: `https://www.themealdb.com/images/ingredients/${ingredientName}.png`
          };
          mealIngredients.push(ingredient);
        }
      }
      setIngredients(mealIngredients);
    };

    fetchRecipeDetails();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />

      <div>
        <h3>Ingredients</h3>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.measure} {ingredient.name}
              <img src={ingredient.image} alt={ingredient.name} style={{ width: '50px', height: '50px' }} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Instructions</h3>
        <p>{recipe.strInstructions}</p>
      </div>
    </div>
  );
}

export default RecipeDetails;
