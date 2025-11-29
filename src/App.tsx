import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner/LoadingSpinner";
import PageTransition from "./components/common/PageTransition/PageTransition";
import "./App.css";

// Lazy loading для страниц
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const ColorMatchPage = lazy(
  () => import("./pages/ColorMatchPage/ColorMatchPage")
);
const CatalogPage = lazy(() => import("./pages/CatalogPage/CatalogPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage/ContactsPage"));
const ProductDetails = lazy(
  () => import("./components/catalog/ProductDetails/ProductDetails")
);
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));
const AdminProductFormPage = lazy(
  () => import("./pages/AdminProductFormPage/AdminProductFormPage")
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/color-match" element={<ColorMatchPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/admin/products/new"
            element={<AdminProductFormPage />}
          />
          <Route
            path="/admin/products/:id/edit"
            element={<AdminProductFormPage />}
          />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
