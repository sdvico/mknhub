// utils/axiosInstance.ts
import axios from "axios";
import { TOKEN_KEY } from "./authProvider";
import { IS_DEV_MODE } from "./config";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  // Thêm headers mặc định
  if (config.headers) {
    config.headers["accept"] = "application/json";
    config.headers["x-custom-lang"] = "en";

    // Nếu là FormData thì KHÔNG set Content-Type để axios tự set boundary
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    if (isFormData) {
      // đảm bảo không có Content-Type cũ dính lại
      delete (config.headers as any)["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // X-API-Key mặc định nếu chưa có
    if (!config.headers["x-api-key"]) {
      config.headers["x-api-key"] = IS_DEV_MODE ? "1" : "446655440001";
    }
  }

  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
    console.log("Request with token:", token.substring(0, 20) + "...");
  } else {
    console.log("Request without token");
  }

  console.log("API Request:", config.method?.toUpperCase(), config.url);

  return config;
});

// // Response interceptor để handle errors
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("API Response:", response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.log(
//       "API Error:",
//       error.response?.status,
//       error.config?.url,
//       error.response?.data
//     );

//     if (error.response?.status === 401) {
//       // Token hết hạn hoặc không hợp lệ
//       localStorage.removeItem(TOKEN_KEY);
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

export { axiosInstance };
