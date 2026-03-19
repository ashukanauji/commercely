import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import OrderStatusBadge from "../../components/shop/OrderStatusBadge";
import { formatCurrency, formatDate } from "../../utils/format";
import api from "../../utils/api";

const ORDER_STATUSES = ["processing", "confirmed", "shipped", "delivered", "cancelled"];

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await api.get("/api/v1/order/admin/orders");
    setOrders(data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/api/v1/order/admin/orders/${id}/status`, { status });
      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <Layout title="Manage orders | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <div className="dashboard-content order-list">
          <h1>Orders</h1>
          {orders.map((order) => (
            <article className="card-panel" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p>{order.user?.name} • {order.user?.email} • {formatDate(order.createdAt)}</p>
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
              <div className="summary-row top-gap">
                <span>Update status</span>
                <select className="input-control compact-input" value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default OrdersAdmin;
