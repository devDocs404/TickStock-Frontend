import { motion } from "framer-motion";

interface FeatureCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Type with className and size props
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 flex items-start space-x-4"
  >
    <div className="bg-blue-500 rounded-full p-3">
      <Icon className="text-white" size={24} />{" "}
      {/* Passing className and size */}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-200">{description}</p>
    </div>
  </motion.div>
);

export default FeatureCard;
