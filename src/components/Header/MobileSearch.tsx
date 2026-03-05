import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface MobileSearchProps {
  onSearchComplete: () => void
}

export function MobileSearch({ onSearchComplete }: MobileSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?filter=${encodeURIComponent(searchTerm)}`)
      onSearchComplete()
    }
  }

  return (
    <div className="lg:hidden px-4 pb-3">
      <form className="relative" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 px-4 pr-12 rounded-lg bg-light-gray-3 text-sm text-dark-gray-2 placeholder:text-light-gray-2 outline-none"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-gray"
          aria-label="Buscar"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  )
}
