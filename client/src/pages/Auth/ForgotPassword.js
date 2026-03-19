import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    answer: "",
    newPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/v1/auth/forgot-password", formData);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <Layout title="Reset password | Commercely">
      <section className="auth-section">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Account recovery</span>
          <h1>Reset your password</h1>
          <input className="input-control" placeholder="Email address" type="email" onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} required />
          <input className="input-control" placeholder="Security answer" onChange={(event) => setFormData((prev) => ({ ...prev, answer: event.target.value }))} required />
          <input className="input-control" placeholder="New password" type="password" onChange={(event) => setFormData((prev) => ({ ...prev, newPassword: event.target.value }))} required />
          <button className="primary-btn full-width" type="submit">Reset password</button>
        </form>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
