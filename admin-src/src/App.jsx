import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Giras from './pages/Giras';
import Porta from './pages/Porta';
import ListaSenhas from './pages/ListaSenhas';

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gira"
          element={
            <ProtectedRoute>
              <Giras />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gira/:id/senhas"
          element={
            <ProtectedRoute>
              <ListaSenhas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/porta"
          element={
            <ProtectedRoute>
              <Porta />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
