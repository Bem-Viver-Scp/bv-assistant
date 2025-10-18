import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './Route';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PrivateLayout from '../layouts/PrivateLayout';

const AppRouter = () => {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/" element={<Login />} />

      {/* Privadas (com Layout) */}
      <Route
        element={
          <PrivateRoute
            element={<PrivateLayout />}
            allowedRoles={['master', 'admin', 'coordinator']}
          />
        }
      >
        {/* Filhas renderizadas dentro do <Outlet /> do PrivateLayout */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRouter;
