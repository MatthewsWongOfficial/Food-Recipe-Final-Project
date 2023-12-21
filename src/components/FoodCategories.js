import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

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
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-nav">
          {categories.map((category) => (
            <button 
              key={category.idCategory} 
              className="nav-item nav-link btn btn-link" 
              onClick={() => handleCategoryClick(category)}
            >
              {category.strCategory}
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-3">
        {/* Include your search input and button here, styled with Bootstrap */}
      </div>

      {selectedCategory && (
        <div className="mt-4">
          <h2>Dishes in {selectedCategory.strCategory}</h2>
          <div className="row">
            {dishes.map((dish) => (
              <div key={dish.idMeal} className="col-md-4 mb-3" onClick={() => handleDishClick(dish.strMeal)}>
                <div className="card">
                  <img src={dish.strMealThumb} alt={dish.strMeal} className="card-img-top" />
                  <div className="card-body">
                    <p className="card-text">{dish.strMeal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodCategories;
