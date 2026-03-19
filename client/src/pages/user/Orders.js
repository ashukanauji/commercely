import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import OrderStatusBadge from "../../components/shop/OrderStatusBadge";
import { formatCurrency, formatDate } from "../../utils/format";
import api from "../../utils/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get("/api/v1/order/my-orders");
      setOrders(data.orders);
    };

    fetchOrders();
  }, []);

  return (
    <Layout title="My orders | Commercely">
      <section className="container section-block dashboard-layout">
        <UserMenu />
        <div className="dashboard-content">
          <h1>Order history</h1>
          {!orders.length ? (
            <div className="empty-state card-panel">You have not placed any orders yet.</div>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <article className="card-panel" key={order._id}>
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-header-right">
                      <OrderStatusBadge status={order.status} />
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </div>
                  <div className="order-items-stack">
                    {order.items.map((item) => (
                      <div className="summary-row" key={`${order._id}-${item.product}`}>
                        <span>{item.name} × {item.quantity}</span>
                        <strong>{formatCurrency(item.price * item.quantity)}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
