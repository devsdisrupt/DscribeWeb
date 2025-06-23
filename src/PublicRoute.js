import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return !isLoggedIn ? <Outlet /> : <Navigate to="/admin/ProcessFiles" replace />;
};

export default PublicRoute;
