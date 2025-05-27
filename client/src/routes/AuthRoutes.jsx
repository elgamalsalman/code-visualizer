import { Navigate, Outlet } from "react-router-dom";

import useUser from "src/hooks/useUser";

import Loading from "src/pages/Loading/Loading";

const AuthRoute = () => {
  const [user, _, loading] = useUser();
  if (loading) return <Loading />;
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

const AnonymousRoute = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const [user, _, loading] = useUser();
  if (loading) return <Loading />;
  return user ? <Navigate to="/projects/test" replace /> : <Outlet />;
};

const GeneralRoute = () => {
  return <Outlet />;
};

export { AuthRoute, AnonymousRoute, GeneralRoute };
