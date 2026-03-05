import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function DesktopSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?filter=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <form className="flex-1 max-w-[560px] relative" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Procurar produto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-[60px] px-6 pr-14 rounded-lg bg-light-gray-3 text-base text-dark-gray-2 placeholder:text-light-gray-2 outline-none"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-light-gray"
        aria-label="Buscar"
      >
        <Search size={20} />
      </button>
    </form>
  )
}
