import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="hero-section">
      <div className="hero-background"></div>
      <div className="hero-container">
        <div className="hero-text">
          <h1>Fresh & Organic Groceries</h1>
          <p>Quality produce delivered to your door. Shop fresh, eat healthy.</p>
          <button className="hero-button">Browse Products</button>
        </div>
        <div className="hero-accent"></div>
      </div>
    </div>
  );
};

export default Header;
