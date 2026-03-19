import { FiLogOut, FiShoppingBag, FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashboardPath = auth?.user?.role === 1 ? "/dashboard/admin" : "/dashboard/user";

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link to="/" className="brand-mark">
          <span className="brand-badge">C</span>
          <div>
            <strong>Commercely</strong>
            <small>Shop smarter every day</small>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/cart" className="cart-link">
            <FiShoppingCart /> Cart <span className="cart-count">{cart.length}</span>
          </NavLink>
        </nav>

        <div className="nav-actions">
          {auth?.user ? (
            <>
              <Link to={dashboardPath} className="nav-pill secondary-pill">
                <FiUser /> {auth.user.name.split(" ")[0]}
              </Link>
              <button type="button" className="nav-pill" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-pill secondary-pill">
                Sign in
              </Link>
              <Link to="/register" className="nav-pill">
                <FiShoppingBag /> Start shopping
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
