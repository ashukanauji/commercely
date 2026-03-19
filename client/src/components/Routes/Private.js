import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../Spinner";
import { useAuth } from "../../context/auth";

export default function PrivateRoute() {
  const { auth, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <Spinner message="Checking your session..." path="/login" />;
  }

  if (!auth?.token) {
    return <Navigate to="/login" state={location.pathname} replace />;
  }

  return <Outlet />;
}
