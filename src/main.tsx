import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { createRoutes } from "./Routes/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [isDark, setIsDark] = useState(false);

  const routes = createRoutes(isDark, setIsDark);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
