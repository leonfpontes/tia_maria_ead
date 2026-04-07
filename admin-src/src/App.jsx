import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Giras from './pages/Giras';
import Mediuns from './pages/Mediuns';
import Porta from './pages/Porta';
import ListaSenhas from './pages/ListaSenhas';
import FinanceiroConfig from './pages/FinanceiroConfig';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
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
          path="/mediums"
          element={
            <ProtectedRoute>
              <Mediuns />
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
        <Route
          path="/financeiro/config"
          element={
            <ProtectedRoute>
              <FinanceiroConfig />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </LocalizationProvider>
  );
}
