import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DashboardOverviewPage from './pages/DashboardOverview';
import InventoryPage from './pages/InventoryNew';
import SalesPage from './pages/Sales';
import ExpensesPage from './pages/Expenses';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { useAuth } from './context/AuthContext';

function ProtectedLayout() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-textMuted">
        Loading your workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverviewPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
