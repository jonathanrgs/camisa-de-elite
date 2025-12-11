import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { CartProvider } from './hooks/useCart';
import {
  HomePage,
  CatalogPage,
  ProductPage,
  CartPage,
  CheckoutPage,
  OrderPage
} from './pages';

export function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/produto/:slug" element={<ProductPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pedido/:token" element={<OrderPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
