import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const {url, setToken, setUserId } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const validatePhoneNumber = (phone) => {
    const algerian = /^(\+213|00213|0)[5-7][0-9]{8}$/;
    return algerian.test(phone.replace(/\s/g, ""));
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (currentState === "Sign Up") {
      if (data.phone && !validatePhoneNumber(data.phone)) {
        toast.error("Please enter a valid Algerian phone number");
        setIsLoading(false);
        return;
      }
      if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
    }

    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        const loginToken = response.data.token;
        setToken(loginToken);
        localStorage.setItem("token", loginToken);

        try {
          const profileResponse = await axios.get(url + "/api/user/profile", {
            headers: { token: loginToken },
          });
          if (profileResponse.data.success && profileResponse.data.user._id) {
            setUserId(profileResponse.data.user._id);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }

        toast.success(currentState === "Login" ? "Login Successfully" : "Account Created Successfully");
        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-popup-overlay">
      <div className="login-popup-wrapper">
        <button
          className="login-popup-close"
          onClick={() => setShowLogin(false)}
          aria-label="Close"
        >
          ✕
        </button>

        <form onSubmit={onLogin} className="login-popup-form">
          {/* Header */}
          <div className="login-popup-header">
            <h1>{currentState === "Login" ? "Welcome Back" : "Create Account"}</h1>
            <p className="login-popup-subtitle">
              {currentState === "Login"
                ? "Sign in to your account to continue shopping"
                : "Join us for fresh groceries delivered to your door"}
            </p>
          </div>

          {/* Account Type Selection */}
          {currentState === "Sign Up" && (
            <div className="account-type-section">
              <label className="section-label">I want to</label>
              <div className="account-type-buttons">
                <button
                  type="button"
                  className={`account-type-btn ${data.role === "user" ? "active" : ""}`}
                  onClick={() => setData((prev) => ({ ...prev, role: "user" }))}
                >
                  <span className="btn-icon">🛒</span>
                  <span className="btn-label">Buy Groceries</span>
                </button>
                <button
                  type="button"
                  className={`account-type-btn ${data.role === "Livreur" ? "active" : ""}`}
                  onClick={() => setData((prev) => ({ ...prev, role: "Livreur" }))}
                >
                  <span className="btn-icon">🚴</span>
                  <span className="btn-label">Deliver Groceries</span>
                </button>

                <button
                  type="button"
                  className={`account-type-btn ${data.role === "wholesaler" ? "active" : ""}`}
                  onClick={() => setData((prev) => ({ ...prev, role: "wholesaler" }))}
                >
                  <span className="btn-icon">📦</span>
                  <span className="btn-label">wholesaler</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Inputs */}
          <div className="login-form-fields">
            {currentState === "Sign Up" && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    onChange={onChangeHandler}
                    value={data.phone}
                    type="tel"
                    placeholder="+213 xxx xxx xxx"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-agreement">
            <input
              type="checkbox"
              id="terms"
              required
            />
            <label htmlFor="terms">
              I agree to the <span className="link">terms of use</span> & <span className="link">privacy policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {currentState === "Login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              currentState === "Login" ? "Sign In" : "Create Account"
            )}
          </button>

          {/* Toggle Between Login/Sign Up */}
          <div className="login-toggle">
            {currentState === "Login" ? (
              <>
                <p>Don't have an account? </p>
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => setCurrentState("Sign Up")}
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                <p>Already have an account? </p>
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => setCurrentState("Login")}
                >
                  Sign in here
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
