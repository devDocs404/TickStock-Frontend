import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import CustomSelect from '../custom-select';

interface OptionType {
  label: string | undefined;
  value: string | undefined;
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: OptionType[];
  placeholder?: string;
  setSearchTerm: (value: string) => void;
}

export default function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  setSearchTerm,
}: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOption = options.find(
          option => option.value === field.value,
        );

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <CustomSelect
                options={options}
                value={selectedOption}
                onChange={option => field.onChange(option ? option.value : '')}
                setSearchTerm={setSearchTerm}
                placeholder={placeholder}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
