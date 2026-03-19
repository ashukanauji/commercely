import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { formatCurrency, formatDate } from "../../utils/format";
import api from "../../utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/api/v1/auth/users");
    setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      const { data } = await api.put(`/api/v1/auth/users/${id}/role`, { role: Number(role) });
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <Layout title="Manage users | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <div className="dashboard-content card-panel">
          <h1>Users</h1>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Spend</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.metrics?.orders || 0}</td>
                  <td>{formatCurrency(user.metrics?.spent || 0)}</td>
                  <td>
                    <select className="input-control compact-input" value={user.role} onChange={(event) => updateRole(user._id, event.target.value)}>
                      <option value={0}>Customer</option>
                      <option value={1}>Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Users;
