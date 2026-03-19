import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Spinner = ({ path = "/login", message = "Redirecting..." }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(path, { state: { from: location.pathname } });
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname, navigate, path]);

  return (
    <div className="center-state page-shell">
      <div className="loader" />
      <p>{message}</p>
    </div>
  );
};

export default Spinner;
