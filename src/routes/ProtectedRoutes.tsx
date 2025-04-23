import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  
  const keys = Object.keys(localStorage);
  const tokenKey = keys.find((key) =>
    key.endsWith(".idToken")
  );
  if (tokenKey) {
    const tokenValue = localStorage.getItem(tokenKey);
    console.log('Access Token Key:', tokenKey);
    console.log('Access Token Value:', tokenValue);
  }
  
  if (tokenKey) {
    return <Outlet />; 
  }
  return <Navigate to="/signin" replace />;
};

export default ProtectedRoutes;
