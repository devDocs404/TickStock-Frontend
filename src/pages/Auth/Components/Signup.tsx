import { AnimatedText } from "./AnimatedText";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const schema2 = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "Enter correct First Name." }),
  lastName: z.string().min(1, { message: "Enter correct Last Name." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Enter correct Phone Number." })
    .max(10, { message: "Enter correct Phone Number." }),
});

// Password validation rules for real-time UI feedback
const passwordRules2 = [
  { label: "At least 6 characters", regex: /^.{6,}$/ },
  { label: "Contains at least one number", regex: /[0-9]/ },
  {
    label: "Contains at least one special character",
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];
type PasswordRule = {
  regex: RegExp;
  valid: boolean;
  label: string;
};

const SignupForm = ({ onToggle }: { onToggle: () => void }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordValidations, setPasswordValidations] = useState<
    PasswordRule[]
  >(passwordRules2.map((rule) => ({ ...rule, valid: false })));
  const [isFormValid, setIsFormValid] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password") {
      handlePasswordValidation(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      handlePasswordValidation(data.password);
    }
  };

  // Validate password dynamically for each rule
  const handlePasswordValidation = (password: string) => {
    const updatedValidations = passwordRules2.map((rule) => ({
      ...rule,
      valid: rule.regex.test(password),
    }));
    setPasswordValidations(updatedValidations);
    validateForm(data.password, data.confirmPassword);
  };

  const validateForm = useCallback(
    (password: string, confirmPassword: string) => {
      const allRulesSatisfied = passwordValidations.every((rule) => rule.valid);
      const passwordsMatch = password === confirmPassword;
      setIsFormValid(allRulesSatisfied && passwordsMatch);
    },
    [passwordValidations]
  );

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      schema2.parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...finalPayload } = data;
      console.log(finalPayload, "kjalsfkjasljdlf");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc: { [key: string]: string }, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {}
        );
        setErrors(fieldErrors);
      }
    }
  };

  // Effect to update password validation when password or confirmPassword changes
  useEffect(() => {
    validateForm(data.password, data.confirmPassword);
  }, [data.password, data.confirmPassword, validateForm]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <AnimatedText>
        <h2 className="text-2xl font-bold mb-2">Join StockFolio</h2>
        <p className="text-gray-600 mb-6">
          Create an account to start tracking your investments
        </p>
      </AnimatedText>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatedText delay={0.1}>
          <div className="flex space-x-4">
            <div className="w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm pt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm pt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <input
            type="number"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm pt-1">{errors.phoneNumber}</p>
          )}
        </AnimatedText>

        <AnimatedText delay={0.2}>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm pt-1">{errors.email}</p>
          )}
        </AnimatedText>

        <AnimatedText delay={0.3}>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </AnimatedText>

        <AnimatedText delay={0.4}>
          <input
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password rules display */}
          <div className="mt-2 space-y-1">
            {passwordValidations.map((rule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className={`inline-block h-4 w-4 rounded-full ${
                    rule.valid ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <p
                  className={`text-sm ${
                    rule.valid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {rule.label}
                </p>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <span
                className={`inline-block h-4 w-4 rounded-full ${
                  isFormValid && data.confirmPassword === data.password
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></span>
              <p
                className={`text-sm ${
                  isFormValid && data.confirmPassword === data.password
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Password Match
              </p>
            </div>
          </div>
        </AnimatedText>

        <AnimatedText delay={0.5}>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full p-3 rounded-md transition-colors duration-300 transform ${
              isFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Sign up
          </button>
        </AnimatedText>
      </form>

      <AnimatedText delay={0.6}>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={onToggle}
            className="text-blue-600 hover:underline font-medium"
          >
            Log in here
          </button>
        </p>
      </AnimatedText>
    </motion.div>
  );
};

export default SignupForm;
