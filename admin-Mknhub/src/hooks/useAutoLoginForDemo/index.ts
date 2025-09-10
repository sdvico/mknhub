import { useCallback, useEffect, useState } from "react";
import { authProvider } from "../../authProvider";

/**
 * This hook is used to automatically login the user.
 * We use this hook to skip the login page and demonstrate the application more quickly.
 */
export const useAutoLoginForDemo = () => {
  const [isLoading, setIsLoading] = useState(false); // Đặt false để không loading

  const login = useCallback(async () => {
    try {
      await authProvider.login({
        email: "demo@refine.dev",
        password: "demodemo",
      });
    } catch (_error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tắt auto login, để user tự login
    setIsLoading(false);
  }, [login]);

  return { loading: isLoading };
};

/**
 *  Enable auto login feature.
 *  This is used to skip the login page and demonstrate the application more quickly.
 */
export const enableAutoLogin = () => {
  localStorage.setItem("auto_login", "true");
};

/**
 *  Disable auto login feature.
 *  This is used to skip the login page and demonstrate the application more quickly.
 */
export const disableAutoLogin = () => {
  localStorage.setItem("auto_login", "false");
};
