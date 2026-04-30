import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JsErrors from './pages/JsErrors';
import ServerErrors from './pages/ServerErrors';
import ApiMonitor from './pages/ApiMonitor';
import LogQuery from './pages/LogQuery';
import FeedbackList from './pages/FeedbackList';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/js-errors"
          element={
            <PrivateRoute>
              <JsErrors />
            </PrivateRoute>
          }
        />
        <Route
          path="/server-errors"
          element={
            <PrivateRoute>
              <ServerErrors />
            </PrivateRoute>
          }
        />
        <Route
          path="/api-monitor"
          element={
            <PrivateRoute>
              <ApiMonitor />
            </PrivateRoute>
          }
        />
        <Route
          path="/log-query"
          element={
            <PrivateRoute>
              <LogQuery />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <FeedbackList />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
