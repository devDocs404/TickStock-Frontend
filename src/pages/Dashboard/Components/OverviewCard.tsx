import { motion } from "framer-motion";

const OverviewSection = () => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-sm h-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-600">Sensex</h3>
        <p className="text-2xl font-bold text-blue-600">38,564.88</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-600">Nifty</h3>
        <p className="text-2xl font-bold text-blue-600">11,474.45</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-600">Market</h3>
        <p className="text-2xl font-bold text-green-500">+1.2%</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-600">Max Loss</h3>
        <p className="text-2xl font-bold text-red-500">-2.5%</p>
      </div>
    </div>
  </motion.div>
);

export { OverviewSection };
