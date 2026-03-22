import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/auth/client/register`, {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        password: formData.password
      });

      if (response.data && response.data.token) {
        localStorage.setItem("nts_token", response.data.token);
        localStorage.setItem("nts_user", JSON.stringify(response.data.client || response.data));
        window.dispatchEvent(new Event("auth_change"));
        navigate("/client-dashboard"); // Redirect home upon successful registration
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Create Account</h2>
        <p>Join Namma Tech Solutions</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Mobile No</label>
            <input
              type="number"
              name="number"
              placeholder="Enter mobile number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;