import ProfileLayout from '@/components/ProfileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

/* ─── Info Row ─── */

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-2 py-0.5">
      <span className="text-sm font-medium text-[#8F8F8F] shrink-0">
        {label}:
      </span>
      <span className="text-sm font-semibold text-[#474747]">
        {value || '—'}
      </span>
    </div>
  )
}

/* ─── Address Form ─── */

interface AddressFormData {
  address: string
  neighborhood: string
  city: string
  state: string
  cep: string
  complement: string
}

function AddressEditForm({
  initialData,
  onSave,
  onCancel
}: {
  initialData: AddressFormData
  onSave: (data: AddressFormData) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState<AddressFormData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm(initialData)
  }, [initialData])

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (
      !form.address
      || !form.neighborhood
      || !form.city
      || !form.state
      || !form.cep
    ) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    try {
      setIsSaving(true)
      await onSave(form)
    } catch {
      setError('Erro ao salvar endereço. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const fields: {
    key: keyof AddressFormData
    label: string
    required: boolean
  }[] = [
    { key: 'address', label: 'Endereço', required: true },
    { key: 'neighborhood', label: 'Bairro', required: true },
    { key: 'city', label: 'Cidade', required: true },
    { key: 'state', label: 'Estado', required: true },
    { key: 'cep', label: 'CEP', required: true },
    { key: 'complement', label: 'Complemento', required: false }
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F4F3FF] border border-[#E0DEFF] rounded-lg p-5 mt-4 space-y-4 animate-pulse-form"
    >
      <p className="text-xs text-dark-gray-3 mb-1">
        ✏️ Editando endereço de entrega
      </p>
      {fields.map(({ key, label, required }) => (
        <div key={key} className="flex flex-col gap-1">
          <label
            htmlFor={`addr-${key}`}
            className="text-xs font-medium text-dark-gray-2"
          >
            {label} {required && <span className="text-primary">*</span>}
          </label>
          <input
            id={`addr-${key}`}
            type="text"
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="h-10 rounded-md bg-white border border-light-gray-2 px-3 text-sm text-dark-gray-2 placeholder:text-light-gray outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            placeholder={label}
          />
        </div>
      ))}

      {error && <p className="text-xs text-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 px-6 bg-primary text-white text-sm font-semibold rounded-md hover:brightness-90 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="h-10 px-6 bg-white border border-light-gray-2 text-dark-gray-2 text-sm font-medium rounded-md hover:bg-light-gray-3 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

/* ─── Page ─── */

export default function MyInfoPage() {
  const { user, setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const { data } = await api.get('/user/profile')
        setUser(data)
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err)
        setFetchError('Não foi possível carregar seu perfil.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveAddress = async (addressData: AddressFormData) => {
    const { data } = await api.put('/user/address', addressData)
    if (data.user) {
      setUser(data.user)
    }
    setIsEditing(false)
  }

  return (
    <ProfileLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-gray-3">
        <h1 className="text-base font-bold text-dark-gray-2">
          Minhas Informações
        </h1>
        {!isEditing && !isLoading && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary underline hover:text-tertiary transition-colors cursor-pointer"
          >
            Editar
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="h-4 bg-light-gray-3 rounded w-16" />
              <div className="h-4 bg-light-gray-3 rounded w-40" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && fetchError && (
        <div className="py-12 text-center">
          <p className="text-error font-medium mb-4">{fetchError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-sm text-primary underline hover:text-tertiary transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Content */}
      {!isLoading && !fetchError && user && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 pt-2">
          {/* Informações Pessoais */}
          <div>
            <h2 className="text-[15px] font-bold text-dark-gray-2 mb-4">
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              <InfoRow
                label="Nome"
                value={`${user.firstname} ${user.surname}`}
              />
              <InfoRow label="CPF" value={user.cpf} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Celular" value={user.phone} />
            </div>
          </div>

          {/* Divisor mobile (apenas visível em telas pequenas) */}
          <div className="h-px bg-light-gray-3 lg:hidden" />

          {/* Informações de Entrega */}
          <div>
            <h2 className="text-[15px] font-bold text-dark-gray-2 mb-4">
              Informações de Entrega
            </h2>

            {isEditing ? (
              <AddressEditForm
                initialData={{
                  address: user.address || '',
                  neighborhood: user.neighborhood || '',
                  city: user.city || '',
                  state: user.state || '',
                  cep: user.cep || '',
                  complement: user.complement || ''
                }}
                onSave={handleSaveAddress}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                <InfoRow label="Endereço" value={user.address} />
                <InfoRow label="Bairro" value={user.neighborhood} />
                <InfoRow
                  label="Cidade"
                  value={
                    user.city
                      ? `${user.city}${user.state ? `, ${user.state}` : ''}`
                      : undefined
                  }
                />
                <InfoRow label="CEP" value={user.cep} />
                {user.complement && (
                  <InfoRow label="Complemento" value={user.complement} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ProfileLayout>
  )
}
