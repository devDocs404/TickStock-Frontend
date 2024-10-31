import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';
import { useGlobalStore } from '@/Store/GlobalSore';

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const { toggleTheme, setField } = useGlobalStore();

  return (
    <motion.button
      className={`p-2 rounded-full ${
        toggleTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      } flex items-center justify-center`}
      onClick={() => {
        const theme = toggleTheme === 'dark' ? 'light' : 'dark';
        setTheme(theme);
        setField('toggleTheme', theme);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        // animate={{ x: isDark ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {toggleTheme === 'dark' ? (
          <Moon className="text-yellow-300" size={25} />
        ) : (
          <Sun className="text-yellow-500" size={25} />
        )}
      </motion.div>
    </motion.button>
  );
};

export { ThemeToggle };
