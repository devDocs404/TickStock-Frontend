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
import { React, RupeeSignSvgrepoCom } from "@/components/svg/index";

const Logo = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute top-4 left-4 z-20 text-2xl font-bold"
  >
    <span className="text-blue-600">Stock</span>
    <span>Folio</span>
  </motion.div>
);

export default function AuthenticationPage({
  setIsDark,
  isDark,
}: {
  setIsDark: (value: boolean) => void;
  isDark: boolean;
}) {
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

      {/* <React  style={{width: "1000px", height: "1000px", color: "green"}} /> */}

      <div className="flex h-screen">
        <Toaster richColors />
        <Logo />
        <div
          className={`w-full md:w-1/2 flex items-center justify-center p-12 relative z-10 ${
            isLogin && "flex justify-center items-center"
          }`}
        >
          <div
            className={`w-full h-[774px] max-w-md ${
              isLogin && "flex justify-center items-center w-full"
            }`}
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <LoginForm
                  key="login"
                  onToggle={toggleForm}
                  setLoadingState={setLoadingState}
                  setIsDark={setIsDark}
                  isDark={isDark}
                />
              ) : (
                <SignupForm
                  key="signup"
                  onToggle={toggleForm}
                  setLoadingState={setLoadingState}
                  setIsDark={setIsDark}
                  isDark={isDark}
                />
              )}
            </AnimatePresence>
            {/* <AnimatedText delay={0.5}>
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold  mb-4">
                  Why choose StockFolio?
                </h3>
                <ul className="space-y-2 w-2/3">
                  {[
                    "Visualize your portfolio",
                    "Set your reminders",
                    "Leverage your portfolio",
                    "Secure and user-friendly platform",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-600">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedText> */}
          </div>
        </div>
        <div className="hidden w-1/2 md:flex flex-col justify-center items-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black-900">
            <Background isDark={isDark} />
          </div>
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
