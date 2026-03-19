import { useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import api from "../../utils/api";

const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put("/api/v1/auth/profile", formData);
      const updatedAuth = { ...auth, user: data.user };
      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
      toast.success(data.message);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Layout title="Profile | Commercely">
      <section className="container section-block dashboard-layout">
        <UserMenu />
        <form className="dashboard-content card-panel form-panel" onSubmit={handleSubmit}>
          <h1>Update profile</h1>
          <input className="input-control" value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} />
          <input className="input-control" value={formData.email} disabled />
          <input className="input-control" value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} />
          <textarea className="input-control" rows="4" value={formData.address} onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))} />
          <input className="input-control" type="password" placeholder="New password (optional)" value={formData.password} onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))} />
          <button className="primary-btn" type="submit">Save changes</button>
        </form>
      </section>
    </Layout>
  );
};

export default Profile;
