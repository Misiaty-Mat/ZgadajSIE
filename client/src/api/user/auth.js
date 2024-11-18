import {API_URL} from "../../util/constants"
import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export const checkToken = async () => {
    const response = await fetch(`${API_URL}/user/login`);
    return await response.json();
}

export const apiLogin = async (credentials) => {
    return axios.post(`${API_URL}/user/login`, credentials, {headers: headers})
};

export const apiRegister = async (credentials) => {
    return axios.post(`${API_URL}/user/register`, credentials, {headers: headers})
};