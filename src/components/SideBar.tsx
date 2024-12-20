import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "@/Store/GlobalSore";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  url: string;
  children?: Item[];
}
type Item = {
  label: string;
  url: string;
  children?: Array<{ label: string; url: string }>;
};

interface SidebarProps {
  activeItem: number | null;
  setActiveItem: (item: number | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDark: boolean;
  toggleTheme: () => void;
  menuItems: MenuItem[];
  activeChildItem: number | null;
  setActiveChildItem: (item: number | null) => void;
}

const Sidebar = ({
  activeItem = 0,
  setActiveItem = () => {},
  isOpen,
  setIsOpen,
  menuItems,
  activeChildItem,
  setActiveChildItem,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { toggleTheme, setField } = useGlobalStore();

  return (
    <motion.aside
      initial={{ width: isOpen ? 300 : 64 }}
      animate={{ width: isOpen ? 300 : 64 }}
      transition={{ duration: 0.1 }}
      className={`${
        toggleTheme === "dark"
          ? "bg-black-900"
          : // : "bg-[linear-gradient(to_top,_#EDE8FC_0%,_white_100%)]"
            "bg-[rgb(40,100,246)]"
      }  flex flex-col rounded-r-2xl h-[97%] absolute z-50
			${isOpen ? "left-0" : "left-[-300px]"}
			min-[800px]:relative
			min-[800px]:left-0 overflow-hidden
			shadow-lg
			z-[105]
			transition-all duration-100 ease
			`}
    >
      <div
        className={`p-4 flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <div
            className={`w-10 h-10 ${
              toggleTheme === "dark" ? "bg-blue-400" : "bg-blue-600"
            } rounded-full mr-3 flex-shrink-0 border-2 border-white`}
          ></div>
          <h1 className={`text-xl font-bold whitespace-nowrap text-white`}>
            Hi! Shaik
          </h1>
        </motion.div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-full ${
            toggleTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
          } transition-colors duration-200 bg-white`}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <ChevronLeft
              size={24}
              // className={isDark ? "text-white" : "text-gray-800"}
            />
          ) : (
            <ChevronRight
              size={24}
              // className={isDark ? "text-white" : "text-gray-800"}
            />
          )}
        </button>
      </div>
      <nav className={`flex-grow m-4 ${isOpen ? "h-[84vh]" : "h-[79vh]"}`}>
        {menuItems.map((item, index) => (
          <>
            {/* </> */}
            <div key={item.label}>
              <motion.a
                className={`flex items-center ${
                  isOpen && "justify-between"
                } cursor-pointer ${
                  isOpen ? "py-2 px-4 my-3" : "py-2 my-3"
                } rounded-lg transition-colors duration-200 ${
                  activeItem === index
                    ? toggleTheme === "dark"
                      ? "bg-white font-bold text-blue-900"
                      : "bg-[#7091E6] font-bold text-[#030303]"
                    : toggleTheme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-white hover:bg-white hover:text-black"
                } ${isOpen ? "" : "justify-center"}`}
                onClick={() => {
                  setActiveItem(index);
                  navigate(item.url);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center">
                  <item.icon
                    className={isOpen ? "mr-3" : ""}
                    width={"24px"}
                    height={"24px"}
                  />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {Array.isArray(item.children) && item.children.length > 0 ? (
                  activeItem === index ? (
                    <ChevronUp className="ml-2" />
                  ) : (
                    <ChevronDown className="ml-2" />
                  )
                ) : null}
              </motion.a>
            </div>
            {Array.isArray(item.children) &&
              item.children.length > 0 &&
              activeItem === index &&
              isOpen && (
                <div className="flex flex-col">
                  {item?.children?.map((child, childIndex) => (
                    <AnimatePresence>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        key={child.label}
                        className={` mt-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer  ${
                          activeChildItem === childIndex
                            ? toggleTheme === "dark"
                              ? "bg-gray-400 text-blue-200"
                              : "text-[#030303] font-semibold bg-blue-100"
                            : toggleTheme === "dark"
                            ? "text-gray-300 hover:bg-grey-700"
                            : "text-white font-normal hover:text-black  hover:bg-blue-50"
                        } ${isOpen ? "text-left" : "justify-center"} pl-8 mt-0`}
                        onClick={() => {
                          navigate(child.url);
                          setActiveChildItem(childIndex);
                        }}
                      >
                        {child.label}
                      </motion.button>
                    </AnimatePresence>
                  ))}
                </div>
              )}
          </>
        ))}
      </nav>
      <div
        className={`p-4 ${
          isOpen
            ? "flex justify-between items-center"
            : "flex flex-col items-center space-y-4"
        }`}
      >
        <div onClick={() => setField("manualTheme", true)}>
          <ThemeToggle />
        </div>
        <motion.button
          className={`flex items-center p-2 rounded-lg ${
            toggleTheme === "dark"
              ? "text-red-400 hover:bg-gray-700"
              : "text-red-600 hover:bg-red-50"
          } transition-colors duration-200 ${isOpen ? "" : "justify-center"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            localStorage.removeItem("persist:root");
            localStorage.clear();
            window.location.reload();
          }}
        >
          <LogOut className={isOpen ? "mr-3" : ""} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export { Sidebar };
