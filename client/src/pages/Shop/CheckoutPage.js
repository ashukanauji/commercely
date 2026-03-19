import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { formatCurrency } from "../../utils/format";
import api from "../../utils/api";

const CheckoutPage = () => {
  const { cart, setCart } = useCart();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState(auth?.user?.address || "");
  const [contactPhone, setContactPhone] = useState(auth?.user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("mock");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0),
    [cart]
  );

  const placeOrder = async () => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/api/v1/order/checkout", {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.cartQuantity,
        })),
        shippingAddress,
        contactPhone,
        paymentMethod,
      });

      if (shippingAddress !== auth?.user?.address || contactPhone !== auth?.user?.phone) {
        const updatedAuth = {
          ...auth,
          user: {
            ...auth.user,
            address: shippingAddress,
            phone: contactPhone,
          },
        };
        setAuth(updatedAuth);
        localStorage.setItem("auth", JSON.stringify(updatedAuth));
      }

      toast.success(data.message);
      setCart([]);
      navigate("/dashboard/user/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Checkout | Commercely">
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Checkout</span>
            <h1>Confirm your order</h1>
          </div>
        </div>
        <div className="cart-grid">
          <div className="card-panel form-panel">
            <label>
              Shipping address
              <textarea
                className="input-control"
                rows="4"
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
              />
            </label>
            <label>
              Contact phone
              <input
                className="input-control"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
              />
            </label>
            <label>
              Payment method
              <select
                className="input-control"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option value="mock">Mock card payment</option>
                <option value="cod">Cash on delivery</option>
              </select>
            </label>
            <div className="notice-box">
              Mock payment mode simulates a successful online charge and creates an order transaction ID.
            </div>
          </div>

          <aside className="card-panel sticky-panel">
            <h2>Order total</h2>
            {cart.map((item) => (
              <div key={item._id} className="summary-row">
                <span>
                  {item.name} × {item.cartQuantity}
                </span>
                <strong>{formatCurrency(item.price * item.cartQuantity)}</strong>
              </div>
            ))}
            <hr />
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{subtotal >= 200 ? "Free" : formatCurrency(15)}</strong>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <strong>{formatCurrency(subtotal * 0.08)}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>
                {formatCurrency(subtotal + (subtotal >= 200 ? 0 : 15) + subtotal * 0.08)}
              </strong>
            </div>
            <button type="button" className="primary-btn full-width" onClick={placeOrder} disabled={submitting}>
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
