import { useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "./Dashboard/Components/SearchBar";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { BarChart2, Wallet, User, LayoutDashboard } from "lucide-react";
import { Sidebar } from "../components/SideBar";

const Template = ({
  setIsDark,
  isDark,
}: {
  setIsDark: (value: boolean) => void;
  isDark: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<number | null>(0);
  const [activeChildItem, setActiveChildItem] = useState<number | null>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    const refreshApi = async () => {
      try {
        const response = await fetch("/api/refresh", { method: "POST" });
        if (response.ok) {
          const { token } = await response.json();
          document.cookie = `refreshToken=${token}; path=/`; // Set cookie
          // Call another API with the new token
          const apiResponse = await fetch("/api/your-api-endpoint", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Handle the response from the second API
          if (!apiResponse.ok) {
            throw new Error("Failed to fetch data from the API");
          }
          // Process the data as needed
        }
      } catch (err) {
        console.error("Error refreshing token or calling API:", err);
      }
    };

    refreshApi();
  }, []);

  const menuItems = useMemo(
    () => [
      { icon: LayoutDashboard, label: "Dashboard", url: "/" },
      {
        icon: Wallet,
        label: "Portfolio",
        url: "/portfolio/stocks",
        children: [
          { icon: BarChart2, label: "Stocks", url: "/portfolio/stocks" },
          { icon: Wallet, label: "Baskets", url: "/portfolio/baskets" },
        ],
      },
      { icon: BarChart2, label: "Profit and Loss", url: "/p&l" },
      { icon: User, label: "Account", url: "/account" },
    ],
    []
  );

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const firstPart = pathParts[1];
    const foundItem = menuItems.find(
      (item) => firstPart === item.url.split("/")[1]
    );
    const selectedIndex = foundItem ? menuItems.indexOf(foundItem) : null;
    setActiveItem(selectedIndex);
    const checkChildUrlPath = (item) => {
      if (item.children && item.children.length > 0) {
        const childPath = item.children.find(
          (child) => child.url === location.pathname
        );
        if (childPath) {
          setActiveChildItem(item.children.indexOf(childPath));
        }
      }
    };

    menuItems.forEach(checkChildUrlPath);
  }, [location, menuItems]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey) {
        if (event.key == "b" || event.key === "B") {
          event.preventDefault();
          setIsOpen((prevState) => !prevState);
        } else if (event.key == "p" || event.key === "P") {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div
      // className="flex "
      className={`flex h-[100vh] m-w-[100vw] overflow-y-auto ${
        isDark ? "bg-gray-800" : "bg-[#FBFBFB]"
      }`}
    >
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        menuItems={menuItems}
        activeChildItem={activeChildItem}
        setActiveChildItem={setActiveChildItem}
      />

      <div
        className={`m-h-[100vh] w-[100%] overflow-hidden
          ${isDark ? "bg-[#140c15]" : "bg-[#ede8fc]"}`}
      >
        <div
          className={`flex w-full flex-col  overflow-hidden
             ${isOpen ? "w-[calc(100vw-278px)]" : "w-full "}
          ${isDark ? "bg-[#140c15]" : "bg-[#ede8fc]"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={` flex ${
              isOpen ? "justify-between" : "justify-end"
            } w-full p-[20px] ${isDark ? " bg-[#140c15]" : "bg-[#ede8fc]"}`}
          >
            <div className=" w-full ">
              <h1
                className={`text-3xl font-bold h-[100%] flex items-center ${
                  isDark ? "text-white " : "text-[#27293B]"
                }`}
              >
                My Portfolio
              </h1>
            </div>
            <div className=" w-full">
              <SearchBar isDark={isDark} inputRef={searchInputRef} />
            </div>
          </motion.div>
        </div>
        <div
          className={`w-[98%] h-[90%] m-auto shadow-2xl rounded-lg ${
            isDark ? "bg-gray-800" : "bg-[#F9F9F9]"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Template;
