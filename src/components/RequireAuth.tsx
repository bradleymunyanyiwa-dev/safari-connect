import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  roles?: AppRole[];
  requirePaid?: boolean; // for clients
};

export const RequireAuth = ({ children, roles, requirePaid }: Props) => {
  const { user, role, hasPaid, guideStatus, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-foreground-dim">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  if (requirePaid && role === "client" && !hasPaid) {
    return <Navigate to="/pay" replace />;
  }
  if (role === "guide" && guideStatus !== "approved" && location.pathname !== "/guide-pending" && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/guide-pending" replace />;
  }
  return <>{children}</>;
};
