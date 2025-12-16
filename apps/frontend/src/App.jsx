import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { CartProvider } from './hooks/useCart';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import {
  HomePage,
  CatalogPage,
  ProductPage,
  CartPage,
  CheckoutPage,
  OrderPage,
  TermsPage,
  PrivacyPage,
  AboutPage
} from './pages';

// Auth pages
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';

// Account pages
import { AccountLayout } from './pages/Account/AccountLayout';
import { ProfilePage } from './pages/Account/ProfilePage';
import { OrdersPage } from './pages/Account/OrdersPage';
import { ReviewsPage } from './pages/Account/ReviewsPage';

// Admin pages
import { AdminLayout } from './pages/Admin/AdminLayout';
import { DashboardPage } from './pages/Admin/DashboardPage';
import { ProductsAdminPage } from './pages/Admin/ProductsAdminPage';
import { OrdersAdminPage } from './pages/Admin/OrdersAdminPage';
import { ReviewsAdminPage } from './pages/Admin/ReviewsAdminPage';
import { UsersAdminPage } from './pages/Admin/UsersAdminPage';
import { ShippingAdminPage } from './pages/Admin/ShippingAdminPage';
import { MediaManagerPage } from './pages/Admin/MediaManager';
import CouponsAdminPage from './pages/Admin/CouponsAdminPage';

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas com Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/produto/:slug" element={<ProductPage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedido/:token" element={<OrderPage />} />
              <Route path="/termos" element={<TermsPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              
              {/* Auth - apenas para não logados */}
              <Route path="/login" element={
                <GuestRoute><LoginPage /></GuestRoute>
              } />
              <Route path="/cadastro" element={
                <GuestRoute><RegisterPage /></GuestRoute>
              } />
              
              {/* Área do usuário - requer login */}
              <Route path="/minha-conta" element={
                <ProtectedRoute><AccountLayout /></ProtectedRoute>
              }>
                <Route index element={<ProfilePage />} />
                <Route path="pedidos" element={<OrdersPage />} />
                <Route path="avaliacoes" element={<ReviewsPage />} />
              </Route>
            </Route>
            
            {/* Admin - layout próprio, requer admin */}
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="produtos" element={<ProductsAdminPage />} />
              <Route path="midia" element={<MediaManagerPage />} />
              <Route path="pedidos" element={<OrdersAdminPage />} />
              <Route path="cupons" element={<CouponsAdminPage />} />
              <Route path="avaliacoes" element={<ReviewsAdminPage />} />
              <Route path="usuarios" element={<UsersAdminPage />} />
              <Route path="frete" element={<ShippingAdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
