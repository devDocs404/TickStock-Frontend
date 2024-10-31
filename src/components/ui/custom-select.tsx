import Select, { StylesConfig, GroupBase } from "react-select";
import { useGlobalStore } from "@/Store/GlobalSore";

interface OptionType {
  label: string | undefined;
  value: string | undefined;
}

interface CustomSelectProps {
  options: OptionType[];
  value?: OptionType | null; // Updated here
  onChange?: (value: OptionType | undefined) => void;
  label?: string;
  placeholder?: string;
  setSearchTerm: (value: string) => void;
}

export default function CustomSelect(props: CustomSelectProps) {
  const { label, setSearchTerm, placeholder, options, value, onChange } = props;
  const { toggleTheme } = useGlobalStore();
  const isDarkTheme = toggleTheme === "dark";

  const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    control: (styles) => ({
      ...styles,
      borderRadius: "0.5rem",
      borderColor: isDarkTheme ? "#4b5563" : "#d1d5db",
      backgroundColor: isDarkTheme ? "#1f2937" : "white",
      color: isDarkTheme ? "#f3f4f6" : "#111827",
      boxShadow: "none",
      padding: "0.5rem",
      transition:
        "border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease",
      "&:hover": {
        borderColor: "#6366f1",
      },
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#6366f1"
        : isFocused
        ? isDarkTheme
          ? "#374151"
          : "#e0e7ff"
        : isDarkTheme
        ? "#1f2937"
        : "white",
      color: isSelected ? "white" : isDarkTheme ? "#f3f4f6" : "#111827",
      cursor: "pointer",
      transition: "background-color 0.2s ease, color 0.2s ease",
      "&:hover": {
        backgroundColor: isSelected
          ? "#6366f1"
          : isDarkTheme
          ? "#374151"
          : "#e0e7ff",
      },
    }),
    menu: (styles) => ({
      ...styles,
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: isDarkTheme
        ? "0 4px 12px rgba(0, 0, 0, 0.6)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${isDarkTheme ? "#4b5563" : "#d1d5db"}`,
      backgroundColor: isDarkTheme ? "#1f2937" : "white",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: isDarkTheme ? "#9ca3af" : "#6b7280",
      transition: "color 0.2s ease",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: isDarkTheme ? "#f3f4f6" : "#111827",
      transition: "color 0.2s ease",
    }),
    input: (styles) => ({
      ...styles,
      color: isDarkTheme ? "#f3f4f6" : "#111827",
      transition: "color 0.2s ease",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: isDarkTheme ? "#9ca3af" : "#9ca3af",
      transition: "color 0.2s ease",
      "&:hover": {
        color: "#6366f1",
      },
    }),
  };

  return (
    <>
      {label && <label htmlFor="select-custom">{label}</label>}
      <Select
        id="select-custom"
        styles={customStyles}
        placeholder={placeholder}
        options={options}
        value={value} // This can now be OptionType | null
        onChange={(option) => {
          onChange?.(option || undefined); // Pass undefined instead of null
        }}
        onInputChange={(value) => {
          setSearchTerm(value);
        }}
      />
    </>
  );
}
