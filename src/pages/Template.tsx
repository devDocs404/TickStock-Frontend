import { useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "./Dashboard/Components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import {
  BarChart2,
  Wallet,
  User,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Sidebar } from "../components/SideBar";
import { useGlobalStore } from "@/Store/GlobalSore";
import { Toaster } from "sonner";

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
  const { toggleTheme } = useGlobalStore();

  // useEffect(() => {
  //   const refreshApi = async () => {
  //     try {
  //       const response = await fetch("/api/refresh", { method: "POST" });
  //       if (response.ok) {
  //         const { token } = await response.json();
  //         document.cookie = `refreshToken=${token}; path=/`; // Set cookie
  //         // Call another API with the new token
  //         const apiResponse = await fetch("/api/your-api-endpoint", {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         // Handle the response from the second API
  //         if (!apiResponse.ok) {
  //           throw new Error("Failed to fetch data from the API");
  //         }
  //         // Process the data as needed
  //       }
  //     } catch (err) {
  //       console.error("Error refreshing token or calling API:", err);
  //     }
  //   };

  //   refreshApi();
  // }, []);

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
    const checkChildUrlPath = (item: { children: { url: string }[] }) => {
      if (item.children && item.children.length > 0) {
        const childPath = item.children.find(
          (child) => child.url === location.pathname
        );
        if (childPath) {
          setActiveChildItem(item.children.indexOf(childPath));
        }
      }
    };

    menuItems.forEach((item) => {
      if (item.children) {
        checkChildUrlPath(item);
      }
    });
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
  useEffect(() => {
    console.log(activeItem, "lkjasljfjasldjf");
  }, [activeItem]);
  return (
    <>
      <Toaster richColors />
      <div
        className={`flex h-[100vh] m-w-[100vw] overflow-y-auto items-center justify-center  ${
          toggleTheme === "dark" ? "bg-black-900" : "bg-[rgb(40,100,246,0.1)]"
        }`}
      >
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 min-[800px]:hidden
						transition-all duration-300 ease-in-out"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
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
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full ${
              toggleTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            } transition-all duration-300 ease-in-out bg-white absolute top-10
					hidden max-md:block min-[800px]:hidden
					${isOpen ? "left-[310px]" : "left-[20px]"}
					z-[100]`}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        )}
        <div className="w-full m-auto ">
          <div
            className={`w-[98%] h-[97vh] m-auto shadow-2xl rounded-lg ${
              toggleTheme === "dark" ? "bg-[#0F0F0F]" : "bg-white"
            }`}
          >
            <Outlet />
          </div>
          <div
            className={`h-full w-[100%] overflow-hidden
         `}
          >
            {/* <div
							className={`flex w-full flex-col  overflow-hidden
             ${isOpen ? 'w-[calc(100vw-278px)]' : 'w-full '}
          `}
						>
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className={` flex ${
									isOpen ? 'justify-between' : 'justify-end'
								} w-full p-[20px] `}
							>
								<div className=" w-full ">
									<h1
										className={`text-3xl font-bold h-[100%] flex items-center`}
									>
										{menuItems[activeItem ?? 0]?.label}
									</h1>
								</div>
								<div className=" w-full">
									<SearchBar
										toggleTheme={toggleTheme}
										inputRef={searchInputRef}
									/>
								</div>
							</motion.div>
						</div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Template;
