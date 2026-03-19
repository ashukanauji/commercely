import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/v1/auth/register", formData);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Create your account | Commercely">
      <section className="auth-section">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Create account</span>
          <h1>Get started with Commercely</h1>
          <div className="auth-grid">
            <input className="input-control" name="name" placeholder="Full name" onChange={handleChange} required />
            <input className="input-control" name="email" type="email" placeholder="Email address" onChange={handleChange} required />
            <input className="input-control" name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input className="input-control" name="phone" placeholder="Phone number" onChange={handleChange} required />
            <textarea className="input-control full-span" name="address" placeholder="Shipping address" rows="3" onChange={handleChange} required />
            <input className="input-control full-span" name="answer" placeholder="Security answer: favorite sport?" onChange={handleChange} required />
          </div>
          <button className="primary-btn full-width" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Register;
