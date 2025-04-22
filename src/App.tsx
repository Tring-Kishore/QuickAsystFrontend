import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import SignIn from './layout/auth/SignIn';
import Dashboard from './layout/dashboard/Dashboard';
import Tickets from './Pages/tickets/Tickets';
import Content from './Pages/content/Content';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<PublicRoutes />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Content />} />
            <Route path="tickets" element={<Tickets />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;