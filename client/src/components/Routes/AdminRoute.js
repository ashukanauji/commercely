import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../Spinner";
import { useAuth } from "../../context/auth";

export default function AdminRoute() {
  const { auth, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <Spinner message="Checking admin access..." path="/login" />;
  }

  if (!auth?.token) {
    return <Navigate to="/login" state={location.pathname} replace />;
  }

  if (auth?.user?.role !== 1) {
    return <Navigate to="/dashboard/user" replace />;
  }

  return <Outlet />;
}
