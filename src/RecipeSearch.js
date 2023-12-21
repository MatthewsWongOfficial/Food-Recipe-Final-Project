import React from 'app';

function RecipeSearch({ searchTerm, performSearch }) {
    
    return (
      <div className="recipe-search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for recipes..."
          />
          <button type="submit">Search</button>
        </form>
  
        <div className="recipe-results">
          <div className="dish-list">
            {foodItems.map((item, index) => (
              <div key={index}>
                <img src={item.image} alt={item.name} />
                <button onClick={() => viewRecipe(item.id)}>View Recipe</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default RecipeSearch;
  