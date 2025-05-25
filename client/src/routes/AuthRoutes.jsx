import { Navigate, Outlet } from "react-router-dom";
import useUser from "src/hooks/useUser";

export const AuthRoute = () => {
  const [user, _] = useUser();
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export const AnonymousRoute = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const [user, _] = useUser();
  console.log(user);
  return user ? <Navigate to="/" replace /> : <Outlet />;
};
