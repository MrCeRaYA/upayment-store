import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "components";

import CreateProductPage from "pages/createProduct";
import ProductPage from "pages/product";
import MainPage from "pages/main";
import NotFoundPage from "pages/404";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/createProduct" element={<CreateProductPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
