import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import SignupForm from "./Components/Signup";
import LoginForm from "./Components/LoginForm";
import { AnimatedText } from "./Components/AnimatedText";
import Background from "./Components/Background";
import FeatureCard from "./Components/FeatureCard";
import StockTicker from "./Components/StockTicker";
import { Toaster } from "sonner";
import Loading from "@/components/Global/Loading";

const Logo = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute top-4 left-4 z-20 text-2xl font-bold"
  >
    <span className="text-blue-600">Stock</span>
    <span className="text-gray-800">Folio</span>
  </motion.div>
);

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loadingState, setLoadingState] = useState(false);

  const toggleForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };
  const featureCardsData = [
    {
      icon: TrendingUp,
      title: "Track Performance",
      description:
        "Monitor your investments in real-time with advanced charting tools.",
    },
    {
      icon: DollarSign,
      title: "Manage Portfolios",
      description:
        "Create and manage multiple portfolios to diversify your investments.",
    },
    {
      icon: BarChart2,
      title: "Analyze Trends",
      description:
        "Get insights on market trends and make informed investment decisions.",
    },
  ];

  return (
    <>
      {loadingState && <Loading />}

      <div className="flex h-screen">
        <Toaster richColors />
        <Logo />
        <div className="w-1/2 flex items-center justify-center bg-gray-50 p-12 relative z-10">
          <div className="w-full h-[648px] max-w-md">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <LoginForm
                  key="login"
                  onToggle={toggleForm}
                  setLoadingState={setLoadingState}
                />
              ) : (
                <SignupForm
                  key="signup"
                  onToggle={toggleForm}
                  setLoadingState={setLoadingState}
                />
              )}
            </AnimatePresence>
            <AnimatedText delay={0.5}>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Why choose StockFolio?
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>✓ Real-time stock tracking</li>
                  <li>✓ Advanced portfolio analytics</li>
                  <li>✓ Personalized investment insights</li>
                  <li>✓ Secure and user-friendly platform</li>
                </ul>
              </div>
            </AnimatedText>
          </div>
        </div>
        <div className="w-1/2 bg-blue-900 flex flex-col justify-center p-12 relative overflow-hidden">
          <Background />
          <div className="relative z-10 w-full max-w-lg">
            <AnimatedText>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to StockFolio
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Your personal stock portfolio tracker and analyzer
              </p>
            </AnimatedText>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {featureCardsData.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
            <StockTicker />
          </div>
        </div>
      </div>
    </>
  );
}
