import { createContext, useEffect, useState } from "react";
import { apiLogin, apiRegister, checkToken } from "../api/user/user";
import { TOKEN_NAME } from "../util/constants";
import { toast } from "react-toastify";
import { handleError } from "../api/utils";

export const AuthContext = createContext();

const getToken = () => localStorage.getItem(TOKEN_NAME);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isLoggedIn = localStorage.getItem(TOKEN_NAME) !== null && user !== null;

  const login = (credentials) => {
    apiLogin(credentials)
      .then((userData) => {
        localStorage.setItem(TOKEN_NAME, userData.data.token);
        setUser(userData.data.user);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const register = (credentials) => {
    apiRegister(credentials)
      .then((userData) => {
        localStorage.setItem(TOKEN_NAME, userData.data.token);
        setUser(userData.data.user);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_NAME);
    setUser(null);
  };

  const setUsername = (username) => {
    setUser((prev) => ({
      ...prev,
      name: username,
    }));
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      if (getToken()) {
        checkToken()
          .then((response) => {
            if (response.status !== 200) throw new Error("Not authenticated");
            setUser(response.data.user);
          })
          .catch(() => {
            toast.error("Sesja wygasła. Zaloguj się jeszcze raz");
            logout();
          });
      }
    };

    checkUserAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, register, logout, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
