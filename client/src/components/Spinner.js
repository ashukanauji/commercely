import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [loading, setLoading] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading((prev) => prev - 1);
    }, 1000);

    if (loading === 0) {
      // Ensure path starts with '/' to avoid '//' issues
      const targetPath = path.startsWith("/") ? path : `/${path}`;
      navigate(targetPath, {
        state: { from: location.pathname },
      });
    }

    return () => clearInterval(interval);
  }, [loading, navigate, location, path]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h1 className="text-center">Redirecting in {loading} seconds</h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
