import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface FilterOption {
  label: string
  value: string
}

interface FilterGroupProps {
  title: string
  inputType: 'checkbox' | 'radio'
  options: FilterOption[]
}

export function FilterGroup({ title, inputType, options }: FilterGroupProps) {
  return (
    <div className="mb-8">
      <h3 className="text-dark-gray-2 font-bold text-base mb-4">{title}</h3>

      <div className="space-y-3">
        {inputType === 'checkbox' ? (
          options.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox id={opt.value} />
              <Label
                htmlFor={opt.value}
                className="text-dark-gray-2 cursor-pointer"
              >
                {opt.label}
              </Label>
            </div>
          ))
        ) : (
          <RadioGroup defaultValue={options[0]?.value}>
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={opt.value} />
                <Label
                  htmlFor={opt.value}
                  className="text-dark-gray-2 cursor-pointer"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  )
}
