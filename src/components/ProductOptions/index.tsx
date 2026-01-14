import { useState } from 'react'

interface ProductOptionsProps {
  options: string[] // Ex: ["38", "39"] ou ["#FF0000", "#00FF00"]
  radius?: string // Ex: "4px" (CSS value)
  shape?: 'square' | 'circle'
  type?: 'text' | 'color'
  onSelect?: (value: string) => void // Callback quando uma opção é selecionada
}

export function ProductOptions({
  options,
  radius = '0px',
  shape = 'square',
  type = 'text',
  onSelect
}: ProductOptionsProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    setSelected(option)
    if (onSelect) {
      onSelect(option)
    }
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          style={{
            borderRadius: shape === 'circle' ? '50%' : radius,
            backgroundColor:
              type === 'color'
                ? option
                : selected === option
                  ? '#C92071'
                  : 'transparent'
          }}
          className={`
            flex items-center justify-center border cursor-pointer transition-all
            ${shape === 'circle' ? 'w-[31px] h-[31px]' : 'w-[46px] h-[46px]'}
            ${
              selected === option
                ? 'border-2 border-primary'
                : 'border border-light-gray-2'
            }
            ${
              type === 'text'
                ? selected === option
                  ? 'text-sm font-bold text-white'
                  : 'text-sm font-bold text-dark-gray-2'
                : ''
            }
            hover:border-primary/50
          `}
          aria-label={
            type === 'color'
              ? `Selecionar cor ${option}`
              : `Selecionar tamanho ${option}`
          }
          aria-pressed={selected === option}
        >
          {type === 'text' && option}
        </button>
      ))}
    </div>
  )
}
