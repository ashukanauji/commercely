import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import api from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/v1/auth/login", credentials);
      const nextAuth = { user: data.user, token: data.token };
      setAuth({ ...auth, ...nextAuth });
      localStorage.setItem("auth", JSON.stringify(nextAuth));
      toast.success(data.message);
      navigate(location.state || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Sign in | Commercely">
      <section className="auth-section">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Welcome back</span>
          <h1>Sign in to continue shopping</h1>
          <input
            className="input-control"
            type="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            className="input-control"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button className="primary-btn full-width" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <div className="auth-links-row">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/register">Create account</Link>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Login;
