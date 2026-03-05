import { LogOut, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useLogoutMutation } from '@/features/auth/queries/useLogoutMutation'

export const UserProfileMenu = () => {
  const { user, logout } = useAuth()
  const { mutateAsync: performLogout, isPending: isLoggingOut } =
    useLogoutMutation()
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleOpenLogoutModal = () => {
    setIsMenuOpen(false) // Fecha o dropdown ao abrir o modal
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = async () => {
    try {
      await performLogout()
      logout()
      setIsLogoutModalOpen(false)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <>
      <div
        className="relative flex items-center gap-2 cursor-pointer"
        ref={menuRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {/* User Icon + Greeting */}
        <User size={22} className="text-primary" />
        <span className="text-sm font-medium text-dark-gray-2 whitespace-nowrap">
          Olá {user?.firstname}
        </span>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-light-gray-3 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 bg-[#FAFAFC]">
              <p className="text-sm font-bold text-dark-gray truncate">
                {user?.firstname} {user?.surname}
              </p>
              <p className="text-xs text-dark-gray-3 truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            <div className="border-t border-light-gray-3" />

            <div className="p-1">
              <button
                type="button"
                onClick={handleOpenLogoutModal}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#C92071] rounded-md hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sair da Conta</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja sair de sua conta? Você precisará
              fazer login novamente para acessar seus pedidos e carrinho.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-dark-gray hover:bg-light-gray-3 rounded-md transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:brightness-90 rounded-md transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50"
            >
              {isLoggingOut ? 'Saindo...' : 'Sim, sair agora'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
