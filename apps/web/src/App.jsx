// ===============================
// FIXED MAIN APPLICATION COMPONENT (App.jsx)
// ===============================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SolutionsPage from './pages/solutionspage';
import SolutionDetailPage from './pages/SolutionDetailPage';
import DownloadsPage from './pages/DownloadsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminApp from './admin/AdminApp';

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="solutions/:slug" element={<SolutionDetailPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="sitemap" element={<SitemapPage />} />
        </Route>

        {/* Login page without layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes - FIXED: Now properly inside Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminApp />
            </ProtectedRoute>
          } 
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;