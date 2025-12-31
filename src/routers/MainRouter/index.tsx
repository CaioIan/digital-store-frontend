import HomePage from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
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
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}