import React from 'react';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';
import { Checkbox } from '../checkbox';

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  label: string;
  className?: string;
  labelClassName?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps<FieldValues>> = ({
  control,
  name,
  label,
  className,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center text-sm font-[500] align-middle space-x-3 space-y-0 p-2">
          <FormControl>
            <Checkbox
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              className={className ? className : 'rounded-md w-5 h-5'}
            />
          </FormControl>
          <div className="space-y-1 leading-none align-middle">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
