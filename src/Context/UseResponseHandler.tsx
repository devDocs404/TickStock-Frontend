import { useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
// import Cookies from "js-cookie"; // Import js-cookie for handling cookies
import { useAuthStore } from "../Store/AuthStore";

interface Payload {
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

interface HeaderStructure {
  url: string;
  payload: Payload;
  type: "get" | "post" | "put" | "delete"; // Specify valid HTTP methods
}

const useResponseHandler = () => {
  const { setField, refreshToken, accessToken } = useAuthStore(); // You can still use the store to update user info if needed
  const navigate = useNavigate();
  const baseURL = "http://127.0.0.1:2021/api/";

  // Create an axios instance with withCredentials set to true
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Ensure credentials are included in requests
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (refreshToken) {
          try {
            // Attempt to refresh the token
            const refreshResponse = await axios.post(
              `${baseURL}auth/refresh-token`,
              { refreshToken }
            );
            const newAccessToken = refreshResponse.data.accessToken;

            // Store the new access token in cookies
            // Cookies.set("accessToken", newAccessToken, {
            //   secure: true,
            //   sameSite: "strict",
            // });

            // Update original request's Authorization header with the new access token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request with the new token
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            setField("user", []); // Clear user data in store
            // Cookies.remove("accessToken"); // Clear cookies on error
            // Cookies.remove("refreshToken");
            // navigate("/login"); // Redirect to login page
            toast.warning("Session expired.");
            return Promise.reject(refreshError);
          }
        } else {
          navigate("/login");
          toast.warning("Session expired.");
        }
      }
      return Promise.reject(error);
    }
  );

  const handleLayer = async (
    url: string,
    payload: Payload,
    type: "get" | "post" | "put" | "delete"
  ): Promise<AxiosResponse> => {
    // Get accessToken from cookies

    const requestOptions: AxiosRequestConfig = {
      method: type.toUpperCase(),
      url,
      params: payload.params,
      data: payload.data,
      headers: { Authorization: `Bearer ${accessToken}` }, // Set token dynamically here
    };

    const response = await axiosInstance(requestOptions);
    return response;
  };

  const handleResponse = async ({ url, type, payload }: HeaderStructure) => {
    const response = await handleLayer(url, payload, type);
    return response.data;
  };

  return { handleResponse };
};

export { useResponseHandler };

// import { useNavigate } from "react-router-dom";
// import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import { toast } from "sonner";
// import { useAuthStore } from "../Store/AuthStore";

// interface Payload {
//   params?: Record<string, unknown>;
//   data?: Record<string, unknown>;
// }

// interface HeaderStructure {
//   url: string;
//   payload: Payload;
//   type: "get" | "post" | "put" | "delete"; // Specify valid HTTP methods
// }

// const useResponseHandler = () => {
//   const { refreshToken, accessToken, setField } = useAuthStore();
//   const navigate = useNavigate();
//   const baseURL = "http://127.0.0.1:2021/api/";
//   // Create an axios instance with withCredentials set to true
//   const axiosInstance = axios.create({
//     baseURL,
//     withCredentials: true, // Added to include credentials in requests
//     headers: {
//       "Content-Type": "application/json",
//       // Authorization will be set dynamically in requests
//     },
//   });

//   // Add a response interceptor
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
//       if (axios.isAxiosError(error) && error.response?.status === 401) {
//         if (refreshToken.length > 0) {
//           try {
//             // Attempt to refresh the token
//             const refreshResponse = await axios.post(
//               `${baseURL}auth//refresh-token`,
//               {
//                 refreshToken: refreshToken,
//               }
//             );
//             const newToken = refreshResponse.data.token;
//             setField("accessToken", newToken); // Store token in memory
//             originalRequest.headers.Authorization = `Bearer ${newToken}`; // Set new token here
//             return axiosInstance(originalRequest); // Retry the original request
//           } catch (refreshError) {
//             console.error("Token refresh failed:", refreshError);
//             setField("user", []);
//             setField("refreshToken", ""); // Clear token in memory
//             navigate("/login");
//             toast.warning("Session expired.");
//             return Promise.reject(refreshError);
//           }
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   const handleLayer = async (
//     url: string,
//     payload: Payload,
//     type: "get" | "post" | "put" | "delete"
//   ): Promise<AxiosResponse> => {
//     const requestOptions: AxiosRequestConfig = {
//       method: type.toUpperCase(),
//       url,
//       params: payload.params,
//       data: payload.data,
//       headers: { Authorization: `Bearer ${accessToken}` }, // Set token dynamically here
//       withCredentials: true, // Ensure credentials are included in the request
//     };

//     const response = await axiosInstance(requestOptions);
//     return response;
//   };

//   const handleResponse = async ({ url, type, payload }: HeaderStructure) => {
//     const response = await handleLayer(url, payload, type);
//     return response.data;
//   };

//   return { handleResponse };
// };

// export { useResponseHandler };
