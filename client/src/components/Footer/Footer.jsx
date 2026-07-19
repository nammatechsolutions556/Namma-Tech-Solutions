import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Namma Tech Solutions. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
