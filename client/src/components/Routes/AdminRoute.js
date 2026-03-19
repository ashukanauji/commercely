import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/admin-auth`,
          {
            headers: {
              Authorization: auth?.token, // send the token here
            },
          }
        );

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
    }
  }, [auth?.token]);

  // If admin access is confirmed, render the route; else redirect using Spinner to home "/"
  return ok ? <Outlet /> : <Spinner path="/" />;
}
