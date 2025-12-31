import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductViewPage from "@/pages/ProductViewPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function MainRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductViewPage/>} />
                <Route path="*" element={<h1> Erro 404 Página não encontrada</h1>} />
            </Routes>
        </BrowserRouter>
    )
}