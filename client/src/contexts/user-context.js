import { createContext, useEffect, useState } from "react";
import { apiLogin, apiRegister, checkToken } from "../api/user/auth";
import { TOKEN_NAME } from "../util/constants";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getToken = () => localStorage.getItem(TOKEN_NAME);

  const isLoggedIn = () =>
    localStorage.getItem(TOKEN_NAME) !== null && user !== null;

  const handleAuthResponseError = (resError) => {
    if (resError.status === 401) {
      toast.error("Autentykacja nie powiodła się. Spróbuj jeszcze raz!");
    } else if (resError.status === 500) {
      toast.error(resError.message);
    } else if (resError.response.data.errors) {
      resError.response.data.errors.forEach((err) =>
        toast.error(err.description)
      );
    }
  };

  const login = (credentials) => {
    apiLogin(credentials)
      .then((userData) => {
        localStorage.setItem(TOKEN_NAME, userData.data.token);
        setUser(userData.data.user);
      })
      .catch((error) => {
        handleAuthResponseError(error);
      });
  };

  const register = (credentials) => {
    apiRegister(credentials)
      .then((userData) => {
        localStorage.setItem(TOKEN_NAME, userData.data.token);
        setUser(userData.data.user);
      })
      .catch((error) => {
        handleAuthResponseError(error);
      });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_NAME);
    setUser(null);
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      try {
        const response = checkToken();

        if (!response.ok) throw new Error("Not authenticated");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.log("No user is authenticated:", error);
        logout();
      }
    };

    checkUserAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, register, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
