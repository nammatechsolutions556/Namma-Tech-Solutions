import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("nts_theme") || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem("nts_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("nts_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore parse errors
        }
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen to custom login/logout events and standard storage events
    window.addEventListener("auth_change", checkUser);

    return () => {
      window.removeEventListener("auth_change", checkUser);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("nts_user");
    localStorage.removeItem("nts_token");
    setUser(null);
    closeProfile();
    window.dispatchEvent(new Event("auth_change"));
  };

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Namma Tech Solutions" className="logo" />
        </Link>
        <Link to="/" className="logo brand-text">
          Namma Tech Solutions
        </Link>

        <div className="nav-right">
          {/* Desktop Menu */}
          <div className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/about" className="nav-item">About</Link>
            <Link to="/services" className="nav-item">Services</Link>
            <Link to="/projects" className="nav-item">Projects</Link>
            <Link to="/internships" className="nav-item">Internships</Link>
            <Link to="/portfolio" className="nav-item">Portfolio</Link>
            <Link to="/contact" className="nav-item">Contact</Link>
          </div>

          {/* Auth actions */}
          <div className="nav-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {!user && (
              <>
                <Link to="/login" className="login-btn">Login</Link>
              </>
            )}
            {user && (
              <>
                <Link to="/client-dashboard" className="nav-item dashboard-btn desktop-only">Dashboard</Link>
                <button
                  type="button"
                  className="logout-btn desktop-only"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/projects" onClick={closeMenu}>Projects</Link>
          <Link to="/internships" onClick={closeMenu}>Internships</Link>
          <Link to="/portfolio" onClick={closeMenu}>Portfolio</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          
          <div className="mobile-menu-divider"></div>

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/client-dashboard" onClick={closeMenu}>Dashboard</Link>
              <button 
                className="mobile-logout-btn" 
                onClick={() => { handleLogout(); closeMenu(); }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;