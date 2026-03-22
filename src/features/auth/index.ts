/**
 * Barrel file do módulo de Autenticação.
 * Centraliza todas as exportações da feature: API, componentes, contexto, páginas, queries e schemas.
 */

// API
export * from './api/userService'

// Componentes
export * from './components/LoginLoadingScreen'
export * from './components/ProtectedRoute'

// Contexto global de autenticação
export * from './contexts/AuthContext'

// Páginas (default exports re-exportados como named exports)
export { default as LoginPage } from './pages/LoginPage'
export { default as RegisterFormPage } from './pages/RegisterFormPage'
export { default as RegisterPage } from './pages/RegisterPage'
export { default as VerifyEmailPage } from './pages/VerifyEmailPage'

// React Query Mutations
export * from './queries/useLoginMutation'
export * from './queries/useLogoutMutation'
export * from './queries/useRegisterMutation'

// Schemas de validação Zod
export * from './utils/loginSchema'
export * from './utils/registerSchema'
