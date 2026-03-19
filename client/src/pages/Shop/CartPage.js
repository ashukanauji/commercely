import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { formatCurrency } from "../../utils/format";

const CartPage = () => {
  const { cart, setCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.cartQuantity || 1),
    0
  );

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item._id !== id));
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  return (
    <Layout title="Your cart | Commercely">
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cart</span>
            <h1>Review your shopping bag</h1>
          </div>
        </div>

        {!cart.length ? (
          <div className="empty-state card-panel">
            <p>Your cart is empty.</p>
            <Link to="/products" className="primary-btn">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="card-panel">
              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`}
                    alt={item.name}
                    className="cart-image"
                  />
                  <div className="cart-item-content">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description.slice(0, 90)}...</p>
                    </div>
                    <strong>{formatCurrency(item.price)}</strong>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}>
                        -
                      </button>
                      <span>{item.cartQuantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}>
                        +
                      </button>
                      <button
                        className="link-button danger-text"
                        onClick={() => updateQuantity(item._id, 0)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card-panel sticky-panel">
              <h2>Order summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>{subtotal >= 200 ? "Free" : formatCurrency(15)}</strong>
              </div>
              <div className="summary-row">
                <span>Estimated tax</span>
                <strong>{formatCurrency(subtotal * 0.08)}</strong>
              </div>
              <hr />
              <div className="summary-row total-row">
                <span>Total</span>
                <strong>
                  {formatCurrency(subtotal + (subtotal >= 200 ? 0 : 15) + subtotal * 0.08)}
                </strong>
              </div>
              <button
                type="button"
                className="primary-btn full-width"
                onClick={() => navigate(auth?.token ? "/checkout" : "/login", { state: "/checkout" })}
              >
                {auth?.token ? "Proceed to checkout" : "Sign in to checkout"}
              </button>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CartPage;
