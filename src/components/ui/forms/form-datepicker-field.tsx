import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Control, FieldValues, Path } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Calendar } from '../calendar'

interface FormFieldCalendarProps<T extends FieldValues> {
  label: string
  name: Path<T>
  disabledAt?: (date: Date) => boolean
  placeholder?: string
  required?: boolean
  control: Control<T>
}

const FormFieldCalendar = <T extends FieldValues>({
  control,
  placeholder,
  name,
  label,
  required,
}: FormFieldCalendarProps<T>) => {
  return (
    <FormItem className={`flex flex-col gap-1 `}>
      <FormLabel htmlFor={name} className="block text-sm font-medium">
        {label}
        {required && <span className="text-error align-top">*</span>}
      </FormLabel>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className="flex flex-col">
            <Popover modal onOpenChange={() => field.onBlur()}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={
                      'flex h-12 w-full rounded-md bg-transparent px-3 py-1 text-sm font-[400] border-[1px] border-bordercolor placeholder:text-placeholder placeholder:font-normal file:text-sm file:font-medium focus:border-[1px] focus:border-[#1551B2] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none '
                    }
                  >
                    {field.value ? (
                      format(field.value, 'MM/dd/yyyy')
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={date =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {fieldState.error && (
              <p className="text-error text-xs">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />
    </FormItem>
  )
}

export default FormFieldCalendar
