import { motion } from "framer-motion";

const MetricCard = ({
  title,
  value,
  color,
  icon: Icon,
  isDark,
}: {
  title: string;
  value: React.ReactNode;
  color: string;
  icon: React.ElementType;
  isDark: boolean;
}) => (
  <motion.div
    className={`p-4  rounded-lg shadow-sm ${
      isDark ? "bg-[#212121]" : "bg-[#F4F5FB]"
    }
    `}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      // type: "spring",
      stiffness: 300,
      damping: 10,
    }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between mb-2">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        // transition={{ delay: 0.2, duration: 0.3 }}
        transition={{
          delay: 0.3,
          duration: 0.3,
          type: "spring",
          stiffness: 500,
          damping: 15,
        }}
        className={`text-sm font-semibold ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.3,
          type: "spring",
          stiffness: 500,
          damping: 15,
        }}
      >
        <Icon className={`${color} w-5 h-5`} />
      </motion.div>
    </div>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
      className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
    >
      {value}
    </motion.p>
  </motion.div>
);

export { MetricCard };
