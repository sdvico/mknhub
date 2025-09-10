import type { AuthProvider } from "@refinedev/core";
import { IS_DEV_MODE } from "./config";

export const TOKEN_KEY = "refine-auth";
// const API_URL = "https://hub.quanlythuysan.vn";
const API_URL = IS_DEV_MODE
  ? "http://localhost:3002"
  : "https://hub.quanlythuysan.vn";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    console.log("Login attempt:", { username, password });

    try {
      const response = await fetch(`${API_URL}/api/auth/login-admin`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-custom-lang": "en",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Login error:", errorData);
        return {
          success: false,
          error: {
            message: errorData.message || "Login failed",
            name: "LoginError",
          },
        };
      }

      const data = await response.json();
      console.log("Login success data:", data);

      // Lưu token vào localStorage (giả sử API trả về accessToken)
      if (data.accessToken || data.token) {
        const token = data.accessToken || data.token;
        localStorage.setItem(TOKEN_KEY, token);
        console.log("Token saved:", token);
        // enableAutoLogin();
        return {
          success: true,
          redirectTo: "/",
        };
      } else {
        console.log("No token in response");
        return {
          success: false,
          error: {
            message: "No access token received",
            name: "LoginError",
          },
        };
      }
    } catch (error) {
      console.log("Login network error:", error);
      return {
        success: false,
        error: {
          message: "Network error occurred",
          name: "NetworkError",
        },
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      await authProvider.login({ email, password });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    }
  },
  updatePassword: async (params) => {
    return {
      success: true,
    };
  },
  forgotPassword: async () => {
    return {
      success: true,
    };
  },
  logout: async () => {
    console.log("Logging out...");
    // disableAutoLogin();
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.log("Auth error:", error);
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    console.log("Checking auth, token:", token);

    if (token) {
      console.log("User is authenticated");
      return {
        authenticated: true,
      };
    }

    console.log("User is not authenticated, redirecting to login");
    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    try {
      // Gọi API để lấy thông tin user từ token
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "x-custom-lang": "en",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User identity:", userData);
        return {
          id: userData.id,
          name: userData.username,
          avatar: userData.photo?.url || "https://i.pravatar.cc/150",
          phone: userData.phone,
        };
      }
    } catch (error) {
      console.error("Failed to get user identity:", error);
    }

    // Fallback nếu không lấy được thông tin user
    return {
      id: 1,
      name: "User",
      avatar: "https://i.pravatar.cc/150",
    };
  },
};
