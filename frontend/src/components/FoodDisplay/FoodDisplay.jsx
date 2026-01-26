import React, { useContext, useState, useMemo } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, setCategory }) => {
  const { food_list, selectedShop, getCategoryName } = useContext(StoreContext);
  const [localCategory, setLocalCategory] = useState("All");

  const activeCategory = setCategory ? category : localCategory;
  const handleCategoryChange = setCategory ? setCategory : setLocalCategory;

  const shopFoods = useMemo(() => {
    return food_list.filter((item) => item.shopId === selectedShop);
  }, [food_list, selectedShop]);

  const categories = useMemo(() => {
    const uniqueCategories = new Map();
    shopFoods.forEach((item) => {
      const catId = item.category;
      if (catId && !uniqueCategories.has(catId)) {
        const catName = getCategoryName(catId);
        uniqueCategories.set(catId, catName);
      }
    });
    return Array.from(uniqueCategories.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ id, name }));
  }, [shopFoods, getCategoryName]);

  const filteredFoods = useMemo(() => {
    if (activeCategory === "All") {
      return shopFoods;
    }
    return shopFoods.filter((item) => item.category === activeCategory);
  }, [shopFoods, activeCategory]);

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2 className="food-display-title">Top Dishes Near You</h2>
        <p className="food-display-subtitle">Handpicked selections from your favorite shop</p>
      </div>

      {categories.length > 0 && (
        <div className="categories-wrapper">
          <div className="food-categories">
            <button
              className={`category-btn ${activeCategory === "All" ? "active" : ""}`}
              onClick={() => handleCategoryChange("All")}
            >
              <span className="category-icon">🎯</span>
              <span className="category-label">All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span className="category-label">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="food-display-list">
        {filteredFoods && filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="no-items">No items available in this category</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
