import { API_URL, HEADERS } from "../../util/constants";
import axios from "axios";

export const checkToken = async () => {
  const response = await fetch(`${API_URL}/user/login`);
  return await response.json();
};

export const apiLogin = async (credentials) => {
  return axios.post(`${API_URL}/user/login`, credentials, { headers: HEADERS });
};

export const apiRegister = async (credentials) => {
  return axios.post(`${API_URL}/user/register`, credentials, {
    headers: HEADERS,
  });
};
