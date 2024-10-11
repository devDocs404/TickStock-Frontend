import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => (
  <motion.button
    className={`p-2 rounded-full ${
      isDark ? "bg-gray-700" : "bg-gray-200"
    } flex items-center justify-center`}
    onClick={toggleTheme}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      initial={false}
      // animate={{ x: isDark ? 22 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {isDark ? (
        <Moon className="text-yellow-300" size={20} />
      ) : (
        <Sun className="text-yellow-500" size={20} />
      )}
    </motion.div>
  </motion.button>
);

export { ThemeToggle };
