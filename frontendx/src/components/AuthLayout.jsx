import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AuthLayout = () => {
  const { user, isloading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isloading && !user) {
      toast.warning("Please sign in to create a quiz.", {
        toastId: "create-quiz-auth",
      });
    }
  }, [isloading, user]);

  if (isloading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
