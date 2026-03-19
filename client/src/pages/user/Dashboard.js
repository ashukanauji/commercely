import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout title="My dashboard | Commercely">
      <section className="container section-block dashboard-layout">
        <UserMenu />
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="mini-card">
              <strong>{auth?.user?.name}</strong>
              <span>Signed in customer</span>
            </div>
            <div className="mini-card">
              <strong>{auth?.user?.email}</strong>
              <span>Email address</span>
            </div>
            <div className="mini-card">
              <strong>{auth?.user?.phone}</strong>
              <span>Contact phone</span>
            </div>
          </div>
          <div className="card-panel top-gap">
            <h2>Welcome back</h2>
            <p>Track your orders, manage your profile, and continue shopping from one place.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
