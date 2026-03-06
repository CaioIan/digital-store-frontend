import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'

/**
 * Configuração global do TanStack Query (React Query).
 * Define comportamentos globais para busca de dados e cache.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita refetch desnecessário ao trocar de aba
      retry: 1 // Tenta novamente apenas 1 vez em caso de falha
    }
  }
})

// Ponto de entrada do DOM do navegador. 
// Monta o React no elemento com ID 'root'.
// biome-ignore lint/style/noNonNullAssertion: ignore
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
