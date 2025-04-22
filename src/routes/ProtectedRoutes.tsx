import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};
export default ProtectedRoutes;