import { CreditCard } from 'lucide-react'
import ProfileLayout from '@/components/ProfileLayout'

export default function MyPaymentMethodsPage() {
  return (
    <ProfileLayout>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-gray-3">
        <h1 className="text-[15px] font-bold text-dark-gray-2">
          Métodos de Pagamento
        </h1>
      </div>

      <div className="bg-[#FFF5D1] text-[#997300] p-4 rounded-md mb-6 text-sm flex gap-3">
        <span>⚠️</span>
        <p>
          <strong>Aviso:</strong> Esta tela é apenas para demonstração visual. O
          gerenciamento real de métodos de pagamento não está implementado neste
          ambiente.
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-dark-gray-3 text-sm">
          Aqui você pode gerenciar os cartões salvos e outras formas de
          pagamento vinculadas à sua conta.
        </p>

        {/* Demo Card */}
        <div className="flex items-center justify-between border border-light-gray-3 rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-light-gray-3 rounded flex items-center justify-center">
              <CreditCard size={20} className="text-dark-gray-2" />
            </div>
            <div>
              <p className="text-sm font-bold text-dark-gray-2">
                Mastercard terminado em 4321
              </p>
              <p className="text-xs text-dark-gray-3">Expira em 12/28</p>
            </div>
          </div>
          <button
            type="button"
            className="text-sm text-primary underline hover:text-tertiary transition-colors"
          >
            Excluir
          </button>
        </div>

        <button
          type="button"
          className="h-10 px-6 bg-primary text-white text-sm font-semibold rounded-md hover:brightness-90 transition-all cursor-pointer"
        >
          Adicionar novo cartão
        </button>
      </div>
    </ProfileLayout>
  )
}
