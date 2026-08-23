import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, admin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="min-h-[50vh] bg-[#fffaf1] p-12 text-center text-slate-500">
        Checking your session...
      </div>
    );
  if (!user)
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
