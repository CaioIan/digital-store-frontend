import ProfileLayout from '@/components/ProfileLayout'

export default function MyProfilePage() {
  return (
    <ProfileLayout>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-gray-3">
        <h1 className="text-[15px] font-bold text-dark-gray-2">Meu Perfil</h1>
      </div>

      <div className="bg-[#FFF5D1] text-[#997300] p-4 rounded-md mb-6 text-sm flex gap-3">
        <span>⚠️</span>
        <p>
          <strong>Aviso:</strong> Esta tela é apenas para demonstração visual.
          As funcionalidades de edição neste painel não estão disponíveis.
        </p>
      </div>

      <div className="text-dark-gray-3 text-sm">
        Bem-vindo ao seu painel!
        {/* Adicionar conteúdo da dashboard do perfil aqui futuramente */}
      </div>
    </ProfileLayout>
  )
}
