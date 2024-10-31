import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import {
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../input';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  onChange?: () => void;
  convertToString?: boolean;
}

function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '',
  type = 'text',
  disabled,

  convertToString,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={fieldState.error ? 'text-red-600' : ''}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              onChange={
                convertToString
                  ? e => field.onChange(e.target.value.toString())
                  : undefined
              }
            />
          </FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}

export default FormInput;
