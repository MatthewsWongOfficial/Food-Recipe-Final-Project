import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const FoodCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the list of categories when the component mounts
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch dishes when a category is selected or when the search query changes
    if (selectedCategory || searchQuery) {
      fetchDishes();
    }
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDishes = async () => {
    try {
      let url;
      if (selectedCategory) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory.strCategory}`;
      } else if (searchQuery) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setDishes(data.meals);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear the search query when a category is selected
  };

  const handleDishClick = (mealName) => {
    navigate(`/recipe-search/${mealName}`); // Use navigate to change the route
  };

  return (
    <div>
      <nav>
        {categories.map((category) => (
          <button key={category.idCategory} onClick={() => handleCategoryClick(category)}>
            {category.strCategory}
          </button>
        ))}
      </nav>
      <div>
        {/* Search input and button */}
      </div>
      {selectedCategory && (
        <div>
          <h2>Dishes in {selectedCategory.strCategory}</h2>
          <div className="dish-list">
            {dishes.map((dish) => (
              <div key={dish.idMeal} onClick={() => handleDishClick(dish.strMeal)}>
                <Link to={`/recipe-search/${dish.strMeal}`}>
                  <img src={dish.strMealThumb} alt={dish.strMeal} />
                  <p>{dish.strMeal}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodCategories;
