import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldComponentProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormFieldTextArea = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  className,
  onChange,
}: FormFieldComponentProps<T>): JSX.Element => (
  <FormItem className="flex flex-col gap-1">
    <FormLabel htmlFor={name} className="block text-sm font-medium">
      {label}
      {required && <span className="text-error align-top">*</span>}
    </FormLabel>
    <FormControl className="flex items-center">
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Textarea
              {...field}
              id={name}
              onChange={e => {
                field.onChange(e);
                if (onChange) {
                  onChange(e);
                }
              }}
              placeholder={placeholder}
              className={`bg-white ${className ?? ''}`}
            />
            {fieldState.error && (
              <p className="text-error text-xs">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </FormControl>
  </FormItem>
);

export default FormFieldTextArea;
