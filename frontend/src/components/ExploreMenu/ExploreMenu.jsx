import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../context/StoreContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { shops, selectedShop, setSelectedShop } = useContext(StoreContext);

  const handleShopChange = (shopId) => {
    setSelectedShop(shopId);
    setCategory("All");
  };["restaurant", "butchers", "Grocery store" , "Other Shops"]

  const getShopTypeBadge = (type) => {
    const typeMap = {
      restaurant: "🍽️ Restaurant",
      butchers: "🥩 Butchers",
      'Grocery store': "Grocery store",
      "Other Shops": "Other Shops",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-header">
        <div className="explore-menu-title-section">
          <h1 className="explore-menu-title">Explore Our Shops</h1>
          <p className="explore-menu-subtitle">
            Choose from a diverse selection of restaurants and food stores. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
          </p>
        </div>
      </div>

      <div className="explore-menu-list">
        {shops && shops.length > 0 ? (
          shops.map((shop) => {
            const isActive = selectedShop === shop._id;
            return (
              <div
                onClick={() => handleShopChange(shop._id)}
                key={shop._id}
                className={`shop-card ${isActive ? "active-shop" : ""}`}
              >
                <div className="shop-card-image-wrapper">
                  {shop.image && (
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/images/${shop.image}`}
                      alt={shop.name}
                      className="shop-card-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=" + shop.name;
                      }}
                    />
                  )}
                  {!shop.image && (
                    <div className="shop-card-image-placeholder">
                      {shop.type === "restaurant" ? "🍽️" : "🥩"}
                    </div>
                  )}
                  <div className="shop-card-overlay"></div>
                </div>

                <div className="shop-card-content">
                  <div className="shop-card-header">
                    <h3 className="shop-card-name">{shop.name}</h3>
                    <span className="shop-type-badge">{getShopTypeBadge(shop.type)}</span>
                  </div>

                  {shop.description && (
                    <p className="shop-card-description">{shop.description}</p>
                  )}

                  <div className="shop-card-meta">
                    {shop.phone && (
                      <div className="shop-meta-item">
                        <span className="meta-icon">📞</span>
                        <span className="meta-text">{shop.phone}</span>
                      </div>
                    )}
                    {shop.address && (
                      <div className="shop-meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-text">{shop.address}</span>
                      </div>
                    )}
                  </div>

                  
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-shops">No shops available</p>
        )}
      </div>
    </div>
  );
};

export default ExploreMenu;
