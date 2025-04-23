import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {

  const keys = Object.keys(localStorage);
  const tokenKey = keys.find((key) =>
    key.endsWith(".idToken")
  );
  if (tokenKey) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default PublicRoutes;
