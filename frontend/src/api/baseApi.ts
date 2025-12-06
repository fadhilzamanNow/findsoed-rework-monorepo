import axios, { AxiosError } from "axios";

export type CustomErrorResponse = {
  status: number;
  message: string;
};

export type CustomSuccessResponse = {
  status: number;
  message: string;
  data: any[];
};

const basePath = axios.create({
  // @ts-expect-error Variabel didefine dari bundler
  baseURL: BACKEND_URL,
  timeout: 10000,
});

basePath.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("authToken")}`;

  return config;
});

basePath.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw error.response.data;
    }
  }
);

export type ErrorFindSoed = {
  success: boolean;
  message: string;
  data: Array<any>;
};

export default basePath;
