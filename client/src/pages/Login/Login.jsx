import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const { url } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/api/auth/client/login`, formData);

      if (response.data && response.data.token) {
        localStorage.setItem("nts_token", response.data.token);
        localStorage.setItem("nts_user", JSON.stringify(response.data.client || response.data));
        window.dispatchEvent(new Event("auth_change"));
        navigate("/client-dashboard"); // Redirect to dashboard instead of home
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Login</h2>
        <p>Welcome back to Namma Tech Solutions</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;