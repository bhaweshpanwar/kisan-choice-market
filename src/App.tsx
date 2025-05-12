import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Layout
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Pages
import Index from './pages/Index';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import OffersPage from './pages/OffersPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SelectRolePage from './pages/SelectRolePage';
import FarmerFormPage from './pages/FarmerFormPage';
import InfoPage from './pages/InfoPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Dashboard Pages
// import DashboardHome from './pages/dashboard/Index';
// import InventoryPage from './pages/dashboard/InventoryPage';

// Dashboard Pages / Components
// We'll create these placeholder components now
import DashboardOverview from './pages/dashboard/DashboardOverview.jsx'; // Renamed from Index
import FarmerInventoryPage from './pages/dashboard/FarmerInventoryPage.jsx'; // Example: Create this
import FarmerOrdersPage from './pages/dashboard/FarmerOrdersPage.jsx'; // Example: Create this
import FarmerAnalyticsPage from './pages/dashboard/FarmerAnalyticsPage.jsx'; // Example: Create this
import FarmerSettingsPage from './pages/dashboard/FarmerSettingsPage.jsx'; // Example: Create this
import FarmerNegotiationsPage from './pages/dashboard/FarmerNegotiationsPage.jsx'; // Example
import FarmerBlockedUsersPage from './pages/dashboard/FarmerBlockedUsersPage.jsx'; // Example
import FarmerUploadProductPage from './pages/dashboard/FarmerUploadProductPage.jsx'; // Example
import FarmerCurrentProductsPage from './pages/dashboard/FarmerCurrentProductsPage.jsx'; // Example
import FarmerEditProductPage from './pages/dashboard/FarmerEditProductPage.jsx';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/site-information' element={<InfoPage />} />
              <Route path='/forgot-password' element={<ForgotPasswordPage />} />
              <Route
                path='/reset-password/:token'
                element={<ResetPasswordPage />}
              />
              {/* Protected routes for regular users */}
              <Route
                path='/'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/products/category/:category'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/products/:productId'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/cart'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/orders'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/settings'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/offers'
                element={
                  <ProtectedRoute requiredRole='consumer'>
                    <OffersPage />
                  </ProtectedRoute>
                }
              />

              {/* Role selection routes */}
              <Route
                path='/select-role'
                element={
                  <ProtectedRoute>
                    <SelectRolePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/farmer-form'
                element={
                  <ProtectedRoute>
                    <FarmerFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Farmer Dashboard Routes */}
              <Route
                path='/dashboard/farmer'
                element={
                  <ProtectedRoute requiredRole='farmer'>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Child routes render inside DashboardLayout's <Outlet /> */}
                <Route index element={<DashboardOverview />} />{' '}
                {/* Default view */}
                {/* Map sidebar links to these routes */}
                <Route path='insights' element={<FarmerAnalyticsPage />} />
                <Route
                  path='negotiations'
                  element={<FarmerNegotiationsPage />}
                />
                <Route
                  path='blocked-users'
                  element={<FarmerBlockedUsersPage />}
                />
                <Route
                  path='upload-product'
                  element={<FarmerUploadProductPage />}
                />
                {/* Nested routes for current products */}
                <Route path='current-products'>
                  <Route index element={<FarmerCurrentProductsPage />} />{' '}
                  {/* List view */}
                  <Route
                    path='edit/:productId'
                    element={<FarmerEditProductPage />}
                  />{' '}
                  {/* Edit view */}
                  {/* You could add a 'view/:productId' or 'new' route here too */}
                </Route>
                <Route path='orders' element={<FarmerOrdersPage />} />
                <Route path='settings' element={<FarmerSettingsPage />} />
                {/* Add other dashboard routes here */}
                {/* Example: <Route path='inventory' element={<FarmerInventoryPage />} /> */}
              </Route>

              {/* Catch-all route */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
