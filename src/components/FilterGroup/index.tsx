import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface FilterOption {
  label: string
  value: string
}

interface FilterGroupProps {
  title: string
  inputType: 'checkbox' | 'radio'
  options: FilterOption[]
  onChange?: (value: string, checked?: boolean) => void
}

export function FilterGroup({
  title,
  inputType,
  options,
  onChange
}: FilterGroupProps) {
  return (
    <div className="mb-6 md:mb-8">
      <h3 className="text-dark-gray-2 font-semibold text-sm md:text-base mb-3 md:mb-4">
        {title}
      </h3>

      <div className="space-y-1">
        {inputType === 'checkbox' ? (
          options.map((opt) => (
            <label
              key={opt.value}
              htmlFor={`${title}-${opt.value}`}
              className="flex items-center space-x-3 cursor-pointer min-h-10 md:min-h-0 py-0.5"
            >
              <Checkbox
                id={`${title}-${opt.value}`}
                onCheckedChange={(checked) => onChange?.(opt.value, !!checked)}
              />
              <span className="text-dark-gray-2 text-sm md:text-base">
                {opt.label}
              </span>
            </label>
          ))
        ) : (
          <RadioGroup
            onValueChange={(val) => onChange?.(val)}
            defaultValue={options[0]?.value}
          >
            {options.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`${title}-${opt.value}`}
                className="flex items-center space-x-3 cursor-pointer min-h-10 md:min-h-0 py-0.5"
              >
                <RadioGroupItem
                  value={opt.value}
                  id={`${title}-${opt.value}`}
                />
                <span className="text-dark-gray-2 text-sm md:text-base">
                  {opt.label}
                </span>
              </label>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  )
}
