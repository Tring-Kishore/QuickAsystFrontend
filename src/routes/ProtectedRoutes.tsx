import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  
  const keys = Object.keys(localStorage);
  const tokenKey = keys.find((key) =>
    key.endsWith(".idToken")
  );
  
  if (tokenKey) {
    return <Outlet />; 
  }
  return <Navigate to="/signin" replace />;
};

export default ProtectedRoutes;
