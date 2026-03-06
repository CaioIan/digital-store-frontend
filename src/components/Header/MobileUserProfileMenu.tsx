import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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

interface MobileUserProfileMenuProps {
  onCloseMobileMenu: () => void
}

export const MobileUserProfileMenu = ({
  onCloseMobileMenu
}: MobileUserProfileMenuProps) => {
  const { user, logout } = useAuth()
  const { mutateAsync: performLogout, isPending: isLoggingOut } =
    useLogoutMutation()
  const navigate = useNavigate()

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = async () => {
    try {
      await performLogout()
      logout()
      setIsLogoutModalOpen(false)
      onCloseMobileMenu()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="px-4 py-3 bg-[#FAFAFC] rounded-lg border border-light-gray-3">
          <p className="text-sm font-bold text-dark-gray truncate">
            {user?.firstname} {user?.surname}
          </p>
          <p className="text-xs text-dark-gray-3 truncate mt-0.5">
            {user?.email}
          </p>
        </div>

        <div className="space-y-1">
          <NavLink
            to="/minhas-informacoes"
            className={({ isActive }) =>
              `block py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-dark-gray-2'
              }`
            }
            onClick={onCloseMobileMenu}
          >
            Minhas Informações
          </NavLink>
          <NavLink
            to="/metodos-pagamento"
            className={({ isActive }) =>
              `block py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-dark-gray-2'
              }`
            }
            onClick={onCloseMobileMenu}
          >
            Métodos de Pagamento
          </NavLink>
        </div>

        <div className="border-t border-light-gray-3 pt-3">
          <button
            type="button"
            onClick={handleOpenLogoutModal}
            className="w-full flex items-center gap-3 py-2 text-sm font-bold text-[#C92071] transition-colors"
          >
            <LogOut size={16} />
            Sair da Conta
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-title-medium-bold">
              Sair da Conta
            </DialogTitle>
            <DialogDescription className="text-body-medium">
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
