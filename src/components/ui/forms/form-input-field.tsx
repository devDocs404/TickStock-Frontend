import { Control, Controller, FieldValues, Path } from 'react-hook-form'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '../input'

interface FormInputProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  placeholder?: string
  type?: string
  disabled?: boolean
  onChange?: () => void
  convertToString?: boolean
  required?: boolean
  icon?: React.ReactNode
}

function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '',
  type = 'text',
  disabled,
  convertToString,
  required = false,
  icon,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={fieldState.error ? 'text-red-600' : ''}>
            {label}
            {required && <span className="text-red-600">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {icon && icon}
              <Input
                {...field}
                placeholder={placeholder}
                className={icon ? 'pl-8' : 'pl-2'}
                type={type}
                disabled={disabled}
                value={field.value === 0 ? '' : field.value}
                onChange={e => {
                  if (type === 'number') {
                    const value =
                      e.target.value === '' ? null : Number(e.target.value)
                    field.onChange(value)
                  } else if (convertToString) {
                    field.onChange(e.target.value.toString())
                  } else {
                    field.onChange(e.target.value)
                  }
                }}
              />
            </div>
          </FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}

export default FormInput
