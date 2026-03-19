import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { formatCurrency } from "../../utils/format";
import api from "../../utils/api";

const AdminDashboard = () => {
  const { auth } = useAuth();
  const [summary, setSummary] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      const { data } = await api.get("/api/v1/order/admin/summary");
      setSummary(data.summary);
    };

    fetchSummary();
  }, []);

  return (
    <Layout title="Admin dashboard | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <div className="dashboard-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin overview</span>
              <h1>Welcome back, {auth?.user?.name}</h1>
            </div>
          </div>
          <div className="stats-grid">
            <div className="mini-card"><strong>{summary.users}</strong><span>Registered users</span></div>
            <div className="mini-card"><strong>{summary.products}</strong><span>Products in catalog</span></div>
            <div className="mini-card"><strong>{summary.orders}</strong><span>Total orders</span></div>
            <div className="mini-card"><strong>{formatCurrency(summary.revenue)}</strong><span>Total revenue</span></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
