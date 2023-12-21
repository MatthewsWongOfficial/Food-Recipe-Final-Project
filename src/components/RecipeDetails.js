import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                const data = await response.json();
                setRecipe(data.meals[0]); // Assuming the response has a 'meals' array with one meal
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
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

            <h3>Ingredients</h3>
            <ul>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(i => (
                    const ingredient = recipe[`strIngredient${i}`];
                    const measure = recipe[`strMeasure${i}`];
                    if (ingredient) {
                        return <li key={i}>{`${measure} ${ingredient}`}</li>;
                    }
                ))}
            </ul>

            <h3>Instructions</h3>
            <p>{recipe.strInstructions}</p>
        </div>
    );
}

export default RecipeDetails;
