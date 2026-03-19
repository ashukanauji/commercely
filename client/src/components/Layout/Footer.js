import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Commercely</h3>
          <p>
            A responsive full-stack shopping experience with product discovery,
            secure sign-in, cart management, and order tracking.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <div className="footer-links">
            <Link to="/products">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/policy">Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
