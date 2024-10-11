import { useAuthStore } from "@/Store/AuthStore";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes = ({
  children,
}: ProtectedRoutesProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  useEffect(() => {
    if (accessToken === "" || !accessToken) {
      navigate("/login", { replace: true });
      toast.warning("Session expired.");
    }
  }, [accessToken, navigate, children]);

  if (accessToken === "") {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;

// import { useAuthStore } from "@/Store/AuthStore";
// import { ReactNode, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// interface ProtectedRoutesProps {
//   children: ReactNode;
// }

// const ProtectedRoutes = ({
//   children,
// }: ProtectedRoutesProps): JSX.Element | null => {
//   return <>{children}</>;
// };

// export default ProtectedRoutes;
