import {createContext, useEffect, useState} from "react";
import {apiLogin, apiRegister, checkToken} from "../api/user/auth";
import {TOKEN_NAME} from "../util/constants";
import {toast} from "react-toastify";


export const AuthContext = createContext();

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const getToken = () => localStorage.getItem(TOKEN_NAME);

    const isLoggedIn = () => localStorage.getItem(TOKEN_NAME) !== null && user !== null;

    const login = (credentials) => {
        apiLogin(credentials)
            .then(userData => {
                localStorage.setItem(TOKEN_NAME, userData.data.token);
                setUser(userData.data.user)
            })
            .catch(error => {
                if (error.status === 401) {
                    toast.error("Wrong credentials!");
                } else {
                    toast.error(error.message);
                }
            });
    };

    const register = (credentials) => {
        apiRegister(credentials)
            .then(() => {
                login(credentials)
            })
            .catch(error => {
                error.response.data.forEach(err => toast.error(err.description));
            });
    }

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
                const response = checkToken()

                if (!response.ok) throw new Error('Not authenticated');
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.log('No user is authenticated:', error);
                logout();
            }
        };

        checkUserAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, isLoggedIn, login, register, logout, getToken}}>
            {children}
        </AuthContext.Provider>
    )
}