import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalItems: number
  limit: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalItems,
  limit,
  onPageChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / limit) || 1

  if (totalPages <= 1) return null

  let start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center rounded text-dark-gray-2 border border-light-gray-2 hover:bg-light-gray-3 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={20} />
      </button>

      {start > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="w-10 h-10 flex items-center justify-center rounded font-medium text-dark-gray-2 hover:bg-light-gray-3 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-dark-gray-3">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded font-medium transition-colors ${
            currentPage === p
              ? 'bg-primary text-white pointer-events-none'
              : 'text-dark-gray-2 hover:bg-light-gray-3 cursor-pointer'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-dark-gray-3">...</span>}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 flex items-center justify-center rounded font-medium text-dark-gray-2 hover:bg-light-gray-3 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded text-dark-gray-2 border border-light-gray-2 hover:bg-light-gray-3 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
