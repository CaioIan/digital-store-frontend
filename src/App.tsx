import { CartProvider } from './contexts/CartContext'
import { MainRouter } from './routers/MainRouter'

export default function App() {
  return (
    <CartProvider>
      <MainRouter />
    </CartProvider>
  )
}
