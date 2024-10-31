import { Search } from 'lucide-react';

const SearchBar = ({
  toggleTheme,
  inputRef,
}: {
  toggleTheme: string;
  inputRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="relative flex justify-end w-full items-center">
    <Search
      className={`relative left-[30px] top-[1px] ${
        toggleTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
      }`}
    />
    <input
      ref={inputRef}
      type="text"
      placeholder="Search..."
      className={`w-[100%] md:w-[50%] pl-10 pr-4 py-2 border rounded-lg ${
        toggleTheme === 'dark'
          ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
          : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'
      } focus:outline-none transition-all duration-300`}
    />
  </div>
);

export { SearchBar };
