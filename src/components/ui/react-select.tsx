import { Check, ChevronDown } from 'lucide-react'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  label: string
  options: Option[]
  value: string
  setValue: (value: string) => void
  setSearchText: (value: string) => void
  searchText: string
  placeholder?: string
  isFetching?: boolean
  icon?: React.ReactNode
}

// export function ReactSelect({
// 	options,
// 	value,
// 	setValue,
// 	setSearchText,
// 	searchText,
// 	placeholder = 'Select an option',
// 	isFetching = false,
// 	icon,
// }: SelectProps) {
// 	const [open, setOpen] = useState<boolean>(false);
// 	const [selectedOption, setSelectedOption] = useState<Option | null>(
// 		options.find(option => option.value === value) || null
// 	);

// 	const filteredOptions = options.filter(option =>
// 		option?.label?.toLowerCase()?.includes(searchText?.toLowerCase() || '')
// 	);

// 	// Update selected option when the value changes
// 	useEffect(() => {
// 		const matchedOption = options.find(option => option.value === value);
// 		if (matchedOption) {
// 			setSelectedOption(matchedOption);
// 		}
// 	}, [value, options]);

// 	return (
// 		<div className="space-y-2">
// 			<Popover open={open} onOpenChange={setOpen}>
// 				<PopoverTrigger asChild>
// 					<Button
// 						id="select"
// 						variant="outline"
// 						role="combobox"
// 						aria-expanded={open}
// 						className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20 relative"
// 					>
// 						{icon && icon}
// 						<span
// 							className={cn(
// 								'truncate',
// 								!value && 'text-muted-foreground relative',
// 								icon ? 'pl-8' : 'pl-2'
// 							)}
// 						>
// 							{selectedOption?.label || placeholder}
// 						</span>
// 						<ChevronDown
// 							size={16}
// 							strokeWidth={2}
// 							className="shrink-0 text-muted-foreground/80"
// 							aria-hidden="true"
// 						/>
// 					</Button>
// 				</PopoverTrigger>
// 				<PopoverContent
// 					className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
// 					align="start"
// 				>
// 					<Command>
// 						<CommandInput
// 							placeholder="Search option..."
// 							value={searchText} // Bind search text to input
// 							onValueChange={setSearchText} // Update search text on change
// 						/>
// 						<CommandList>
// 							<CommandEmpty>
// 								{isFetching ? 'Loading...' : 'No option found.'}
// 							</CommandEmpty>
// 							<CommandGroup>
// 								{filteredOptions.map(option => (
// 									<CommandItem
// 										key={option.value}
// 										value={option.value}
// 										onSelect={currentValue => {
// 											const selected = options.find(
// 												opt => opt.value === currentValue
// 											);
// 											setValue(currentValue === value ? '' : currentValue);
// 											setSelectedOption(selected || null); // Persist selected option
// 											setOpen(false);
// 											setSearchText(''); // Clear search text on selection
// 										}}
// 									>
// 										{option.label}
// 										{value === option.value && (
// 											<Check size={16} strokeWidth={2} className="ml-auto" />
// 										)}
// 									</CommandItem>
// 								))}
// 							</CommandGroup>
// 						</CommandList>
// 					</Command>
// 				</PopoverContent>
// 			</Popover>
// 		</div>
// 	);
// }

export function ReactSelect({
  options,
  value,
  setValue,
  setSearchText,
  searchText,
  placeholder = 'Select an option',
  isFetching = false,
  icon,
}: SelectProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find(option => option.value === value) || null,
  )

  const filteredOptions = options.filter(option =>
    option?.label?.toLowerCase()?.includes(searchText?.toLowerCase() || ''),
  )

  useEffect(() => {
    const matchedOption = options.find(option => option.value === value)
    if (matchedOption) {
      setSelectedOption(matchedOption)
    }
  }, [value, options])

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="select"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20 relative"
          >
            {icon && icon}
            <span
              className={cn(
                'truncate',
                !value && 'text-muted-foreground relative',
                icon ? 'pl-8' : 'pl-2',
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search option..."
              value={searchText} // Bind search text to input
              onValueChange={setSearchText} // Update search text on change
            />
            <CommandList>
              {/* Prioritize "Loading..." over "No options found." */}
              {isFetching ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : filteredOptions.length === 0 ? (
                <CommandEmpty>No options found.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={currentValue => {
                      const selected = options.find(
                        opt => opt.value === currentValue,
                      )
                      setValue(currentValue === value ? '' : currentValue)
                      setSelectedOption(selected || null) // Persist selected option
                      setOpen(false)
                      setSearchText('') // Clear search text on selection
                    }}
                  >
                    {option.label}
                    {value === option.value && (
                      <Check size={16} strokeWidth={2} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
