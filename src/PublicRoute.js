import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return !isLoggedIn ? <Outlet /> : <Navigate to="/admin/index" replace />;
};

export default PublicRoute;
