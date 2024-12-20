import { Control, FieldValues, Path } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { ReactSelect } from '../react-select'

interface Option {
  label: string
  value: string
}

interface FormReactSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  options: Option[]
  placeholder?: string
  setSearchTerm: (value: string) => void
  searchText: string
  required?: boolean
  isFetching?: boolean
  icon?: React.ReactNode
}

export function FormReactSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = 'Select an option',
  setSearchTerm,
  searchText,
  required = false,
  isFetching = false,
  icon,
}: FormReactSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={fieldState.error ? 'text-red-600' : ''}>
            {label}
            {required && <span className="text-red-600">*</span>}
          </FormLabel>
          <FormControl>
            <ReactSelect
              label={label}
              options={options}
              value={field.value}
              setValue={field.onChange}
              setSearchText={setSearchTerm}
              searchText={searchText}
              placeholder={placeholder}
              isFetching={isFetching}
              icon={icon}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
