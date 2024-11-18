import {useContext} from "react";
import {AuthContext} from "../contexts/user-context";

export const useAuth = () => {
    return useContext(AuthContext);
};