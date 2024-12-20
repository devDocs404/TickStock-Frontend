// import { useNavigate } from 'react-router-dom';
// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { toast } from 'sonner';
// import { useAuthStore } from '../Store/AuthStore';
// interface Payload {
// 	params?: object;
// 	data?: object;
// }
// interface HeaderStructure {
// 	url: string;
// 	payload?: Payload;
// 	type: 'get' | 'post' | 'put' | 'delete' | 'patch';
// }
// interface ResponseWithStatus<T> {
// 	data: T;
// 	status: number;
// }
// const useResponseHandler = () => {
// 	const { refreshToken, accessToken } = useAuthStore();
// 	const navigate = useNavigate();
// 	// const baseURL = "https://www.api.tickstock.muzakkir.dev/";
// 	const baseURL = ' http://127.0.0.1:8787';
// 	const axiosInstance: AxiosInstance = axios.create({
// 		baseURL,
// 		withCredentials: true,
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Accept: 'application/json',
// 			'X-Requested-With': 'XMLHttpRequest',
// 			// Remove the CORS headers from here as they should be handled by the server
// 		},
// 	});
// 	axiosInstance.interceptors.request.use(
// 		config => {
// 			if (config.headers) {
// 				delete config.headers['Content-Security-Policy'];
// 			}
// 			return config;
// 		},
// 		error => {
// 			return Promise.reject(error);
// 		}
// 	);
// 	axiosInstance.interceptors.response.use(
// 		response => response,
// 		async error => {
// 			const originalRequest = error.config;
// 			console.log(error, 'originalRequest');
// 			if (
// 				axios.isAxiosError(error) &&
// 				error.response?.status === 401 &&
// 				!originalRequest._retry
// 			) {
// 				originalRequest._retry = true;
// 				if (refreshToken) {
// 					try {
// 						const refreshResponse = await axios.post(
// 							`${baseURL}auth/refresh-token`,
// 							{ refreshToken }
// 						);
// 						const newAccessToken = refreshResponse.data.accessToken;
// 						// setField("accessToken", newAccessToken);
// 						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// 						return axiosInstance(originalRequest);
// 					} catch (refreshError) {
// 						console.error('Token refresh failed:', refreshError);
// 						handleAuthError();
// 						throw refreshError;
// 					}
// 				} else {
// 					handleAuthError();
// 					throw error;
// 				}
// 			}
// 			throw error;
// 		}
// 	);
// 	const handleAuthError = () => {
// 		navigate('/login');
// 		toast.warning('Session expired. Please log in again.');
// 	};
// 	const handleLayer = async (
// 		url: string,
// 		payload: Payload = {},
// 		type: HeaderStructure['type']
// 	): Promise<AxiosResponse> => {
// 		const requestOptions: AxiosRequestConfig = {
// 			method: type,
// 			url,
// 			params: payload.params,
// 			data: payload.data,
// 			headers:
// 				accessToken ?
// 					{
// 						Authorization: `Bearer ${accessToken}`,
// 						'X-Content-Type-Options': 'nosniff',
// 						'X-Frame-Options': 'DENY',
// 						'X-XSS-Protection': '1; mode=block',
// 					}
// 				:	{},
// 		};
// 		return axiosInstance(requestOptions);
// 	};
// 	const handleResponse = async <T,>({
// 		url,
// 		type,
// 		payload = {},
// 	}: HeaderStructure): Promise<ResponseWithStatus<T>> => {
// 		try {
// 			console.log('handle response');
// 			const response = await handleLayer(url, payload, type);
// 			return {
// 				data: response.data,
// 				status: response.status,
// 			};
// 		} catch (error) {
// 			if (axios.isAxiosError(error)) {
// 				toast.error(error.response?.data?.message || 'An error occurred');
// 				throw {
// 					message: error.response?.data?.message || 'An error occurred',
// 					status: error.response?.status,
// 				};
// 			} else {
// 				toast.error('An unexpected error occurred');
// 				throw {
// 					message: 'An unexpected error occurred',
// 					status: 500,
// 				};
// 			}
// 		}
// 	};
// 	return { handleResponse };
// };
// export { useResponseHandler };
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuthStore } from '../Store/AuthStore'

interface Payload {
  params?: object
  data?: object
}

interface HeaderStructure {
  url: string
  payload?: Payload
  type: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

interface ResponseWithStatus<T> {
  data: T
  status: number
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const useResponseHandler = () => {
  const { refreshToken, accessToken, setField } = useAuthStore()
  const navigate = useNavigate()
  // const baseURL = 'http://127.0.0.1:8787';
  const baseURL = 'http://127.0.0.1:8787'

  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token))
    refreshSubscribers = []
  }

  const addSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback)
  }

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true
          try {
            const refreshResponse = await axios.post(
              `${baseURL}/auth/refresh-token`,
              {
                refreshToken,
              },
            )
            const newAccessToken = refreshResponse.data.accessToken

            setField('accessToken', newAccessToken)
            onTokenRefreshed(newAccessToken)
            isRefreshing = false
          } catch (refreshError) {
            isRefreshing = false
            handleAuthError()
            throw refreshError
          }
        }

        return new Promise(resolve => {
          addSubscriber(token => {
            originalRequest._retry = true
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      return Promise.reject(error)
    },
  )

  const handleAuthError = () => {
    navigate('/login')
    toast.warning('Session expired. Please log in again.')
  }

  const handleLayer = async (
    url: string,
    payload: Payload = {},
    type: HeaderStructure['type'],
  ): Promise<AxiosResponse> => {
    const requestOptions: AxiosRequestConfig = {
      method: type,
      url,
      params: payload.params,
      data: payload.data,
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    }

    return axiosInstance(requestOptions)
  }

  const handleResponse = async <T,>({
    url,
    type,
    payload = {},
  }: HeaderStructure): Promise<ResponseWithStatus<T>> => {
    try {
      const response = await handleLayer(url, payload, type)
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'An error occurred')
        throw {
          message: error.response?.data?.message || 'An error occurred',
          status: error.response?.status,
        }
      } else {
        toast.error('An unexpected error occurred')
        throw {
          message: 'An unexpected error occurred',
          status: 500,
        }
      }
    }
  }

  return { handleResponse }
}

export { useResponseHandler }
